const cfg = window.SITE_CONFIG || {};

const $ = id => document.getElementById(id);

let supabase = null;
let currentNews = [];


/* -----------------------------
   وضعیت پیام
----------------------------- */

function status(el, msg, type = '') {
  if (!el) return;

  el.textContent = msg;
  el.className = 'status ' + type;
}


/* -----------------------------
   بررسی تنظیمات
----------------------------- */

function isConfigured() {

  return !!(
    cfg.supabaseUrl &&
    cfg.supabaseAnonKey &&
    !cfg.supabaseUrl.includes('YOUR_') &&
    !cfg.supabaseAnonKey.includes('YOUR_')
  );

}


/* -----------------------------
   بررسی مالک بودن کاربر
   امنیت اصلی از Supabase RLS می‌آید
----------------------------- */

async function verifyOwner(email) {

  const { data, error } = await supabase
    .from('owner_access')
    .select('email, enabled')
    .eq('email', email.toLowerCase())
    .eq('enabled', true)
    .maybeSingle();

  if (error) {
    console.error(error);
    return false;
  }

  return !!data;

}


/* -----------------------------
   پاک کردن فرم خبر
----------------------------- */

function clearForm() {

  [
    'newsId',
    'newsTitle',
    'newsDate',
    'newsExcerpt',
    'newsBody'
  ].forEach(id => {

    const el = $(id);

    if (el) {
      el.value = '';
    }

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


/* -----------------------------
   شروع برنامه
----------------------------- */

async function init() {

  if (!isConfigured()) {

    status(
      $('loginStatus'),
      'config.js هنوز تنظیم نشده است.',
      'error'
    );

    return;
  }


  supabase = window.supabase.createClient(
    cfg.supabaseUrl,
    cfg.supabaseAnonKey
  );


  const {
    data: { session }
  } = await supabase.auth.getSession();


  if (session) {

    await afterLogin(session);

  } else {

    showLogin();

    status(
      $('loginStatus'),
      'ایمیل مالک را وارد کنید و لینک ورود را دریافت کنید.'
    );

  }


  supabase.auth.onAuthStateChange(
    async (_event, session) => {

      if (session) {

        await afterLogin(session);

      } else {

        showLogin();

      }

    }
  );

}


/* -----------------------------
   بعد از ورود
----------------------------- */

async function afterLogin(session) {

  const email =
    session?.user?.email?.trim().toLowerCase();


  if (!email) {

    await supabase.auth.signOut();

    status(
      $('loginStatus'),
      'ایمیل حساب کاربری قابل شناسایی نیست.',
      'error'
    );

    return;
  }


  const allowed = await verifyOwner(email);


  if (!allowed) {

    await supabase.auth.signOut();

    status(
      $('loginStatus'),
      'این ایمیل اجازه ورود به پنل مدیریت را ندارد.',
      'error'
    );

    return;
  }


  $('loginCard').classList.add('hidden');
  $('panel').classList.remove('hidden');

  $('who').textContent =
    'حساب مالک با موفقیت احراز هویت شد.';


  await loadContent();
  await loadNews();

}


/* -----------------------------
   نمایش صفحه ورود
----------------------------- */

function showLogin() {

  $('panel').classList.add('hidden');
  $('loginCard').classList.remove('hidden');

}


/* -----------------------------
   دریافت محتوای سایت
----------------------------- */

async function loadContent() {

  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .in('slug', ['ashayer', 'cooperative']);


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

      $('ashTitle').value =
        item.title || '';

      $('ashExcerpt').value =
        item.excerpt || '';

      $('ashBody').value =
        item.body || '';

    }


    if (item.slug === 'cooperative') {

      $('coopTitle').value =
        item.title || '';

      $('coopExcerpt').value =
        item.excerpt || '';

      $('coopBody').value =
        item.body || '';

    }

  });

}


/* -----------------------------
   دریافت اخبار
----------------------------- */

async function loadNews() {

  const {
    data,
    error
  } = await supabase
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


  $('newsAdminList').innerHTML =
    currentNews.map(n => {

      const images =
        Array.isArray(n.images)
          ? n.images
          : [];


      return `
        <div class="news-admin-item">

          <div>

            <h3>
              ${escapeHtml(n.title)}
            </h3>

            <p>
              ${escapeHtml(n.date)}
              —
              ${escapeHtml(n.excerpt)}
            </p>

            ${
              images.length
                ? `
                  <div class="thumbs">
                    ${images.slice(0, 5).map(url => `
                      <img
                        src="${escapeHtml(url)}"
                        alt="">
                    `).join('')}
                  </div>
                `
                : ''
            }

          </div>

          <div class="admin-actions">

            <button
              class="admin-btn secondary"
              data-edit="${n.id}"
              type="button">
              ویرایش
            </button>

            <button
              class="admin-btn danger"
              data-delete="${n.id}"
              type="button">
              حذف
            </button>

          </div>

        </div>
      `;

    }).join('') ||
    '<p class="hint">هنوز خبری ثبت نشده است.</p>';

}


/* -----------------------------
   جلوگیری از HTML Injection
----------------------------- */

function escapeHtml(value) {

  return String(value ?? '')
    .replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[char]));

}


/* -----------------------------
   ذخیره متن سایت
----------------------------- */

async function saveContent(slug) {

  const prefix =
    slug === 'ashayer'
      ? 'ash'
      : 'coop';


  const payload = {

    title:
      $(prefix + 'Title').value.trim(),

    excerpt:
      $(prefix + 'Excerpt').value.trim(),

    body:
      $(prefix + 'Body').value.trim(),

    updated_at:
      new Date().toISOString()

  };


  const {
    error
  } = await supabase
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


/* -----------------------------
   آپلود تصاویر
----------------------------- */

async function uploadFiles(files) {
  const urls = [];
  const MAX_FILE_SIZE = 8 * 1024 * 1024;
  const MAX_FILES = 10;

  if (files.length > MAX_FILES) {
    throw new Error(`حداکثر ${MAX_FILES} تصویر برای هر خبر مجاز است.`);
  }

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      throw new Error('فقط فایل‌های تصویری مجاز هستند.');
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`حجم تصویر «${file.name}» بیشتر از ۸ مگابایت است.`);
    }

    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, '-');
    const path = `news/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
    const { error } = await supabase.storage.from('site-media').upload(path, file, {
      upsert: false,
      contentType: file.type
    });
    if (error) throw error;

    const { data } = supabase.storage.from('site-media').getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return urls;
}


async function removeStorageFiles(urls) {
  const marker = '/storage/v1/object/public/site-media/';
  const paths = (Array.isArray(urls) ? urls : [])
    .map(url => {
      const value = String(url || '');
      const index = value.indexOf(marker);
      return index >= 0 ? decodeURIComponent(value.slice(index + marker.length)) : null;
    })
    .filter(Boolean);

  if (!paths.length) return;
  const { error } = await supabase.storage.from('site-media').remove(paths);
  if (error) console.warn('Storage cleanup failed:', error);
}


/* -----------------------------
   ذخیره خبر
----------------------------- */

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
          n => String(n.id) === String(id)
        );

      images =
        Array.isArray(old?.images)
          ? old.images
          : [];

    }


    const files =
      [...$('newsImages').files];


    if (files.length) {
      const newImages = await uploadFiles(files);
      images = [...images, ...newImages];
    }

    if (images.length > 10) {
      throw new Error('حداکثر ۱۰ تصویر برای هر خبر مجاز است.');
    }


    payload.images = images;


    let result;


    if (id) {

      result =
        await supabase
          .from('news')
          .update({
            ...payload,
            updated_at:
              new Date().toISOString()
          })
          .eq('id', id);

    } else {

      result =
        await supabase
          .from('news')
          .insert(payload);

    }


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
      error.message || 'خطا در ذخیره خبر.',
      'error'
    );

  }

}


/* -----------------------------
   ارسال لینک ورود
----------------------------- */

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
    $('email').value.trim().toLowerCase();


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

  const {
    error
  } =
    await supabase.auth.signInWithOtp({

      email,

      options: {

        shouldCreateUser: false,

        emailRedirectTo:
          new URL(
            'admin.html',
            window.location.href
          ).href

      }

    });


  if (error) {

    status(
      $('loginStatus'),
      error.message,
      'error'
    );

    return;
  }


  status(
    $('loginStatus'),
    'لینک ورود به ایمیل ارسال شد. لینک را باز کنید.',
    'ok'
  );

}


/* -----------------------------
   رویدادها
----------------------------- */

$('sendLogin').onclick =
  sendLogin;


$('logout').onclick =
  () => supabase.auth.signOut();


$('cancelNews').onclick =
  clearForm;


$('saveNews').onclick =
  saveNews;


$('newsImages').onchange =
  () => {

    $('selectedFiles').innerHTML =
      [...$('newsImages').files]
        .map(file =>
          `<span class="hint">
            ${escapeHtml(file.name)}
          </span>`
        )
        .join(' • ');

  };


document
  .querySelectorAll('[data-save-content]')
  .forEach(button => {

    button.onclick =
      () =>
        saveContent(
          button.dataset.saveContent
        );

  });


$('newsAdminList').onclick =
  async event => {

    const edit =
      event.target.closest('[data-edit]');

    const del =
      event.target.closest('[data-delete]');


    if (edit) {

      const news =
        currentNews.find(
          item =>
            String(item.id) ===
            String(edit.dataset.edit)
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

      $('newsFormTitle').textContent =
        'ویرایش خبر';


      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
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


      const item = currentNews.find(
        n => String(n.id) === String(del.dataset.delete)
      );

      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', del.dataset.delete);

      if (!error) {
        await removeStorageFiles(item?.images || []);
      }

      status(
        $('adminStatus'),
        error ? error.message : 'خبر حذف شد.',
        error ? 'error' : 'ok'
      );

      await loadNews();

    }

  };


/* -----------------------------
   شروع
----------------------------- */

init();
