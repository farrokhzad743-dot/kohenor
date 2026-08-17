(() => {
  'use strict';

  const cfg = window.SITE_CONFIG || {};
  const $ = id => document.getElementById(id);

  let sb = null;
  let currentNews = [];
  let pendingEmail = '';
  let authChangeLock = false;

  function status(el, msg, type = '') {
    if (!el) return;
    el.textContent = msg || '';
    el.className = 'status ' + type;
  }

  function isConfigured() {
    return Boolean(
      cfg.supabaseUrl &&
      cfg.supabaseAnonKey &&
      !String(cfg.supabaseUrl).includes('YOUR_') &&
      !String(cfg.supabaseAnonKey).includes('YOUR_')
    );
  }

  function normalizeEmail(value) {
    return String(value || '').trim().toLowerCase();
  }

  function isOwnerEmail(email) {
    const owners = Array.isArray(cfg.ownerEmails)
      ? cfg.ownerEmails
      : [];

    return owners
      .map(normalizeEmail)
      .includes(normalizeEmail(email));
  }

  async function verifyOwner(email) {
    const normalized = normalizeEmail(email);

    /*
      اول مالک بودن را از config.js بررسی می‌کنیم.
      این جلوی خطای اشتباه owner_access را می‌گیرد.
    */
    if (!isOwnerEmail(normalized)) {
      return false;
    }

    /*
      بررسی نهایی از دیتابیس.
      اگر RPC وجود نداشته باشد، خطای واقعی نمایش داده می‌شود
      و دیگر به‌اشتباه «ایمیل اجازه ورود ندارد» نشان داده نمی‌شود.
    */
    const { data, error } = await sb.rpc('is_approved_owner');

    if (error) {
      console.error('is_approved_owner:', error);

      throw new Error(
        'خطا در بررسی دسترسی مالک: ' +
        (error.message || 'خطای نامشخص')
      );
    }

    return data === true;
  }

  function clearForm() {
    [
      'newsId',
      'newsTitle',
      'newsDate',
      'newsExcerpt',
      'newsBody'
    ].forEach(id => {
      const el = $(id);
      if (el) el.value = '';
    });

    if ($('newsImages')) {
      $('newsImages').value = '';
    }

    if ($('selectedFiles')) {
      $('selectedFiles').innerHTML = '';
    }

    if ($('newsFormTitle')) {
      $('newsFormTitle').textContent = 'افزودن خبر';
    }
  }

  function showLogin(message = '') {
    if ($('panel')) {
      $('panel').classList.add('hidden');
    }

    if ($('loginCard')) {
      $('loginCard').classList.remove('hidden');
    }

    if (message) {
      status($('loginStatus'), message, 'error');
    }
  }

  async function init() {
    if (!isConfigured()) {
      status(
        $('loginStatus'),
        'config.js هنوز تنظیم نشده است.',
        'error'
      );
      return;
    }

    if (
      !window.supabase ||
      !window.supabase.createClient
    ) {
      status(
        $('loginStatus'),
        'کتابخانه Supabase بارگذاری نشده است.',
        'error'
      );
      return;
    }

    sb = window.supabase.createClient(
      cfg.supabaseUrl,
      cfg.supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );

    try {
      const {
        data: { session }
      } = await sb.auth.getSession();

      if (session) {
        await afterLogin(session);
      } else {
        showLogin();
        status(
          $('loginStatus'),
          'ایمیل مالک را وارد کنید و کد ورود را دریافت کنید.'
        );
      }

      sb.auth.onAuthStateChange(
        (_event, nextSession) => {
          setTimeout(async () => {
            if (authChangeLock) return;

            authChangeLock = true;

            try {
              if (nextSession) {
                await afterLogin(nextSession);
              } else {
                showLogin();
              }
            } finally {
              authChangeLock = false;
            }
          }, 0);
        }
      );

    } catch (error) {
      console.error(error);

      status(
        $('loginStatus'),
        'خطا در اتصال به Supabase: ' +
        (error.message || 'خطای نامشخص'),
        'error'
      );
    }
  }

  async function afterLogin(session) {
    const email = normalizeEmail(
      session?.user?.email
    );

    if (!email) {
      await sb.auth.signOut({
        scope: 'local'
      });

      showLogin(
        'ایمیل حساب کاربری قابل شناسایی نیست.'
      );

      return;
    }

    /*
      بررسی اول: مالک بودن ایمیل
    */
    if (!isOwnerEmail(email)) {
      await sb.auth.signOut({
        scope: 'local'
      });

      showLogin(
        'این ایمیل اجازه ورود به پنل مدیریت را ندارد.'
      );

      return;
    }

    let allowed = false;

    try {
      allowed = await verifyOwner(email);

    } catch (error) {
      console.error(error);

      /*
        اینجا دیگر خطای دیتابیس را
        با پیام اشتباه «ایمیل اجازه ورود ندارد»
        جایگزین نمی‌کنیم.
      */
      showLogin(
        error.message ||
        'خطا در بررسی دسترسی مالک.'
      );

      return;
    }

    if (!allowed) {
      await sb.auth.signOut({
        scope: 'local'
      });

      showLogin(
        'دسترسی مالک در پایگاه داده فعال نیست.'
      );

      return;
    }

    if ($('loginCard')) {
      $('loginCard').classList.add('hidden');
    }

    if ($('panel')) {
      $('panel').classList.remove('hidden');
    }

    if ($('who')) {
      $('who').textContent =
        'حساب مالک با موفقیت احراز هویت شد.';
    }

    await Promise.all([
      loadContent(),
      loadNews()
    ]);
  }

  async function loadContent() {
    const { data, error } = await sb
      .from('site_content')
      .select('*')
      .in('slug', [
        'ashayer',
        'cooperative'
      ]);

    if (error) {
      status(
        $('adminStatus'),
        error.message,
        'error'
      );
      return;
    }

    (data || []).forEach(item => {

      if (item.slug === 'ashayer') {

        if ($('ashTitle')) {
          $('ashTitle').value =
            item.title || '';
        }

        if ($('ashExcerpt')) {
          $('ashExcerpt').value =
            item.excerpt || '';
        }

        if ($('ashBody')) {
          $('ashBody').value =
            item.body || '';
        }
      }

      if (item.slug === 'cooperative') {

        if ($('coopTitle')) {
          $('coopTitle').value =
            item.title || '';
        }

        if ($('coopExcerpt')) {
          $('coopExcerpt').value =
            item.excerpt || '';
        }

        if ($('coopBody')) {
          $('coopBody').value =
            item.body || '';
        }
      }
    });
  }

  async function loadNews() {
    const { data, error } = await sb
      .from('news')
      .select('*')
      .order('created_at', {
        ascending: false
      });

    if (error) {
      status(
        $('adminStatus'),
        error.message,
        'error'
      );
      return;
    }

    currentNews = data || [];

    if (!$('newsAdminList')) {
      return;
    }

    $('newsAdminList').innerHTML =
      currentNews.map(news => {

        const images =
          Array.isArray(news.images)
            ? news.images
            : [];

        return `
          <div class="news-admin-item">

            <div>

              <h3>
                ${escapeHtml(news.title)}
              </h3>

              <p>
                ${escapeHtml(news.date)}
                —
                ${escapeHtml(news.excerpt)}
              </p>

              ${
                images.length
                  ? `
                    <div class="thumbs">
                      ${images
                        .slice(0, 5)
                        .map(url => `
                          <img
                            src="${escapeHtml(url)}"
                            alt=""
                          >
                        `)
                        .join('')}
                    </div>
                  `
                  : ''
              }

            </div>

            <div class="admin-actions">

              <button
                class="admin-btn secondary"
                data-edit="${escapeHtml(news.id)}"
                type="button"
              >
                ویرایش
              </button>

              <button
                class="admin-btn danger"
                data-delete="${escapeHtml(news.id)}"
                type="button"
              >
                حذف
              </button>

            </div>

          </div>
        `;

      }).join('') ||

      '<p class="hint">هنوز خبری ثبت نشده است.</p>';
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(
        /[&<>"']/g,
        char => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;'
        }[char])
      );
  }

  async function saveContent(slug) {
    const prefix =
      slug === 'ashayer'
        ? 'ash'
        : 'coop';

    const payload = {
      title: $(prefix + 'Title').value.trim(),
      excerpt: $(prefix + 'Excerpt').value.trim(),
      body: $(prefix + 'Body').value.trim(),
      updated_at:
        new Date().toISOString()
    };

    const { error } = await sb
      .from('site_content')
      .update(payload)
      .eq('slug', slug);

    status(
      $('adminStatus'),
      error
        ? error.message
        : 'متن با موفقیت ذخیره شد.',
      error
        ? 'error'
        : 'ok'
    );
  }

  async function uploadFiles(files) {
    const urls = [];

    const MAX_FILE_SIZE =
      8 * 1024 * 1024;

    const MAX_FILES = 10;

    if (files.length > MAX_FILES) {
      throw new Error(
        `حداکثر ${MAX_FILES} تصویر برای هر خبر مجاز است.`
      );
    }

    for (const file of files) {

      if (!file.type.startsWith('image/')) {
        throw new Error(
          'فقط فایل‌های تصویری مجاز هستند.'
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error(
          `حجم تصویر «${file.name}» بیشتر از ۸ مگابایت است.`
        );
      }

      const safeName =
        file.name
          .toLowerCase()
          .replace(
            /[^a-z0-9._-]/g,
            '-'
          );

      const path =
        `news/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

      const { error } =
        await sb.storage
          .from('site-media')
          .upload(
            path,
            file,
            {
              upsert: false,
              contentType: file.type
            }
          );

      if (error) {
        throw error;
      }

      const { data } =
        sb.storage
          .from('site-media')
          .getPublicUrl(path);

      urls.push(data.publicUrl);
    }

    return urls;
  }

  async function removeStorageFiles(urls) {
    const marker =
      '/storage/v1/object/public/site-media/';

    const paths =
      (Array.isArray(urls)
        ? urls
        : [])
        .map(url => {

          const value =
            String(url || '');

          const index =
            value.indexOf(marker);

          return index >= 0
            ? decodeURIComponent(
                value.slice(
                  index + marker.length
                )
              )
            : null;

        })
        .filter(Boolean);

    if (!paths.length) {
      return;
    }

    const { error } =
      await sb.storage
        .from('site-media')
        .remove(paths);

    if (error) {
      console.warn(
        'Storage cleanup failed:',
        error
      );
    }
  }

  async function saveNews() {
    const id =
      $('newsId').value || null;

    const payload = {
      title:
        $('newsTitle').value.trim(),

      date:
        $('newsDate').value.trim(),

      excerpt:
        $('newsExcerpt').value.trim(),

      body:
        $('newsBody').value.trim()
    };

    if (
      !payload.title ||
      !payload.date ||
      !payload.body
    ) {
      status(
        $('adminStatus'),
        'عنوان، تاریخ و متن کامل خبر الزامی است.',
        'error'
      );

      return;
    }

    try {

      let images = [];

      if (id) {

        const old =
          currentNews.find(
            news =>
              String(news.id) ===
              String(id)
          );

        images =
          Array.isArray(old?.images)
            ? old.images
            : [];
      }

      const files =
        $('newsImages')
          ? [...$('newsImages').files]
          : [];

      if (files.length) {

        const newImages =
          await uploadFiles(files);

        images = [
          ...images,
          ...newImages
        ];
      }

      if (images.length > 10) {
        throw new Error(
          'حداکثر ۱۰ تصویر برای هر خبر مجاز است.'
        );
      }

      payload.images = images;

      const result = id

        ? await sb
            .from('news')
            .update({
              ...payload,
              updated_at:
                new Date().toISOString()
            })
            .eq('id', id)

        : await sb
            .from('news')
            .insert(payload);

      if (result.error) {
        throw result.error;
      }

      status(
        $('adminStatus'),
        'خبر با موفقیت ذخیره شد.',
        'ok'
      );

      clearForm();

      await loadNews();

    } catch (error) {

      console.error(error);

      status(
        $('adminStatus'),
        error.message ||
          'خطا در ذخیره خبر.',
        'error'
      );
    }
  }

  function setOtpMode(enabled) {

    const box =
      $('otpBox');

    const sendButton =
      $('sendLogin');

    const emailInput =
      $('email');

    if (box) {
      box.classList.toggle(
        'hidden',
        !enabled
      );
    }

    if (sendButton) {
      sendButton.textContent =
        enabled
          ? 'ارسال دوباره کد'
          : 'ارسال کد ورود';
    }

    if (emailInput) {
      emailInput.disabled =
        enabled;
    }
  }

  async function sendLogin() {

    if (!isConfigured()) {
      status(
        $('loginStatus'),
        'config.js تنظیم نشده است.',
        'error'
      );
      return;
    }

    const email =
      normalizeEmail(
        $('email').value
      );

    if (!email) {
      status(
        $('loginStatus'),
        'ایمیل را وارد کنید.',
        'error'
      );
      return;
    }

    if (!email.includes('@')) {
      status(
        $('loginStatus'),
        'ایمیل واردشده معتبر نیست.',
        'error'
      );
      return;
    }

    if (!isOwnerEmail(email)) {
      status(
        $('loginStatus'),
        'این ایمیل مالک ثبت‌شده نیست.',
        'error'
      );
      return;
    }

    status(
      $('loginStatus'),
      'در حال ارسال کد ورود...'
    );

    try {

      const { error } =
        await sb.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: false
          }
        });

      if (error) {

        console.error(
          'Supabase email OTP:',
          error
        );

        status(
          $('loginStatus'),
          error.message ||
            'ارسال کد ورود انجام نشد.',
          'error'
        );

        return;
      }

      pendingEmail = email;

      setOtpMode(true);

      $('otpCode').value = '';

      $('otpCode').focus();

      status(
        $('loginStatus'),
        'کد ورود به ایمیل ارسال شد. کد را وارد کنید.',
        'ok'
      );

    } catch (error) {

      console.error(error);

      status(
        $('loginStatus'),
        'خطا در ارسال کد ورود: ' +
        (error.message ||
          'خطای نامشخص'),
        'error'
      );
    }
  }

  async function verifyLogin() {

    const email =
      pendingEmail ||
      normalizeEmail(
        $('email').value
      );

    const token =
      $('otpCode')
        .value
        .trim()
        .replace(/\s+/g, '');

    if (!email) {
      status(
        $('loginStatus'),
        'ابتدا ایمیل را وارد کنید.',
        'error'
      );
      return;
    }

    if (!isOwnerEmail(email)) {
      status(
        $('loginStatus'),
        'این ایمیل مالک ثبت‌شده نیست.',
        'error'
      );
      return;
    }

    if (!/^\d{6,8}$/.test(token)) {
      status(
        $('loginStatus'),
        'کد ورود را صحیح وارد کنید.',
        'error'
      );
      return;
    }

    status(
      $('loginStatus'),
      'در حال بررسی کد ورود...'
    );

    try {

      const { data, error } =
        await sb.auth.verifyOtp({
          email,
          token,
          type: 'email'
        });

      if (error) {

        console.error(
          'Supabase verify OTP:',
          error
        );

        status(
          $('loginStatus'),
          error.message ||
            'کد ورود نادرست یا منقضی شده است.',
          'error'
        );

        return;
      }

      if (!data?.session) {
        status(
          $('loginStatus'),
          'ورود تأیید نشد. دوباره تلاش کنید.',
          'error'
        );

        return;
      }

      await afterLogin(
        data.session
      );

    } catch (error) {

      console.error(error);

      status(
        $('loginStatus'),
        'خطا در بررسی کد ورود: ' +
        (error.message ||
          'خطای نامشخص'),
        'error'
      );
    }
  }

  function changeEmail() {

    pendingEmail = '';

    setOtpMode(false);

    if ($('otpCode')) {
      $('otpCode').value = '';
    }

    if ($('email')) {

      $('email').disabled = false;

      $('email').focus();
    }

    status(
      $('loginStatus'),
      'ایمیل را تغییر دهید و دوباره کد بگیرید.'
    );
  }

  function setupEvents() {

    if ($('sendLogin')) {
      $('sendLogin').onclick =
        sendLogin;
    }

    if ($('verifyLogin')) {
      $('verifyLogin').onclick =
        verifyLogin;
    }

    if ($('changeEmail')) {
      $('changeEmail').onclick =
        changeEmail;
    }

    if ($('otpCode')) {

      $('otpCode').addEventListener(
        'keydown',
        event => {

          if (event.key === 'Enter') {
            verifyLogin();
          }

        }
      );
    }

    if ($('logout')) {

      $('logout').onclick =
        async () => {

          await sb.auth.signOut({
            scope: 'local'
          });

          pendingEmail = '';

          setOtpMode(false);

          showLogin(
            'از پنل مدیریت خارج شدید.'
          );
        };
    }

    if ($('cancelNews')) {
      $('cancelNews').onclick =
        clearForm;
    }

    if ($('saveNews')) {
      $('saveNews').onclick =
        saveNews;
    }

    if ($('newsImages')) {

      $('newsImages').onchange =
        () => {

          if (!$('selectedFiles')) {
            return;
          }

          $('selectedFiles').innerHTML =
            [...$('newsImages').files]
              .map(
                file =>
                  `<span class="hint">${escapeHtml(file.name)}</span>`
              )
              .join(' • ');
        };
    }

    document
      .querySelectorAll(
        '[data-save-content]'
      )
      .forEach(button => {

        button.onclick =
          () =>
            saveContent(
              button.dataset.saveContent
            );
      });

    if ($('newsAdminList')) {

      $('newsAdminList').onclick =
        async event => {

          const edit =
            event.target.closest(
              '[data-edit]'
            );

          const del =
            event.target.closest(
              '[data-delete]'
            );

          if (edit) {

            const news =
              currentNews.find(
                item =>
                  String(item.id) ===
                  String(
                    edit.dataset.edit
                  )
              );

            if (!news) {
              return;
            }

            $('newsId').value =
              news.id;

            $('newsTitle').value =
              news.title || '';

            $('newsDate').value =
              news.date || '';

            $('newsExcerpt').value =
              news.excerpt || '';

            $('newsBody').value =
              news.body || '';

            if ($('newsFormTitle')) {
              $('newsFormTitle').textContent =
                'ویرایش خبر';
            }

            window.scrollTo({
              top:
                document.body.scrollHeight,
              behavior:
                'smooth'
            });
          }

          if (del) {

            if (
              !confirm(
                'این خبر حذف شود؟'
              )
            ) {
              return;
            }

            const item =
              currentNews.find(
                news =>
                  String(news.id) ===
                  String(
                    del.dataset.delete
                  )
              );

            const { error } =
              await sb
                .from('news')
                .delete()
                .eq(
                  'id',
                  del.dataset.delete
                );

            if (!error) {
              await removeStorageFiles(
                item?.images || []
              );
            }

            status(
              $('adminStatus'),
              error
                ? error.message
                : 'خبر حذف شد.',
              error
                ? 'error'
                : 'ok'
            );

            await loadNews();
          }
        };
    }
  }

  setupEvents();
  init();

})();
