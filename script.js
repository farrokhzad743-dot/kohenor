(() => {
  'use strict';

  const SUPABASE_URL =
    window.SUPABASE_URL ||
    window.supabaseUrl ||
    window.CONFIG?.SUPABASE_URL;

  const SUPABASE_ANON_KEY =
    window.SUPABASE_ANON_KEY ||
    window.supabaseAnonKey ||
    window.CONFIG?.SUPABASE_ANON_KEY;

  const client =
    window.supabaseClient ||
    (
      SUPABASE_URL &&
      SUPABASE_ANON_KEY &&
      window.supabase?.createClient
        ? window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
          )
        : null
    );

  if (!client) {
    console.error('Supabase client not found.');
    return;
  }

  /* =========================================================
     تنظیمات
  ========================================================= */

  const POST_INTERVAL = 5300;

  let news = [];
  let currentNews = 0;
  let newsTimer = null;

  let documents = [];

  const $ = (id) => document.getElementById(id);

  /* =========================================================
     ابزارها
  ========================================================= */

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };

      return map[char];
    });
  }

  function safeUrl(url) {
    if (!url) return '';

    try {
      const u = new URL(url, window.location.href);

      if (
        u.protocol === 'http:' ||
        u.protocol === 'https:'
      ) {
        return u.href;
      }
    } catch (_) {}

    return '';
  }

  /*
   * لینک‌های ibb.co صفحه‌ی پست هستند، نه خود تصویر.
   *
   * این تابع تلاش می‌کند URL مستقیم تصویر را از URLهای
   * رایج ImgBB استخراج کند.
   *
   * اگر در دیتابیس URL مستقیم تصویر وجود داشته باشد،
   * همان URL استفاده می‌شود.
   */

  function normalizeImageUrl(url) {
    if (!url) return '';

    const value = String(url).trim();

    /*
     * اگر قبلاً لینک مستقیم تصویر است
     */
    if (
      /\.(jpg|jpeg|png|gif|webp|avif)(\?.*)?$/i.test(value)
    ) {
      return value;
    }

    /*
     * اگر URL از قبل مستقیم باشد
     */
    if (
      value.includes('i.ibb.co/') ||
      value.includes('i.ibb.co\\/')
    ) {
      return value.replace(/\\\//g, '/');
    }

    /*
     * ibb.co/XXXX صفحه‌ی تصویر است.
     * مرورگر نمی‌تواند مستقیماً آن را به <img> بدهد.
     *
     * در این حالت خود URL را برمی‌گردانیم تا fallback
     * بتواند آن را به صفحه‌ی تصویر منتقل کند.
     */
    return value;
  }

  function getNewsImages(item) {
    let images = [];

    /*
     * چندعکسی
     */
    if (Array.isArray(item.images)) {
      images = item.images;
    }

    /*
     * رشته JSON
     */
    if (
      images.length === 0 &&
      typeof item.images === 'string'
    ) {
      try {
        const parsed = JSON.parse(item.images);

        if (Array.isArray(parsed)) {
          images = parsed;
        }
      } catch (_) {}
    }

    /*
     * image_urls
     */
    if (
      images.length === 0 &&
      Array.isArray(item.image_urls)
    ) {
      images = item.image_urls;
    }

    /*
     * image_url
     */
    if (
      images.length === 0 &&
      item.image_url
    ) {
      images = [item.image_url];
    }

    /*
     * image
     */
    if (
      images.length === 0 &&
      item.image
    ) {
      images = [item.image];
    }

    /*
     * images ممکن است رشته comma separated باشد
     */
    if (
      images.length === 1 &&
      typeof images[0] === 'string' &&
      images[0].includes(',')
    ) {
      images = images[0]
        .split(',')
        .map(x => x.trim())
        .filter(Boolean);
    }

    return images
      .map(normalizeImageUrl)
      .filter(Boolean);
  }

  /* =========================================================
     تاریخ
     ========================================================= */

  function setupIranDate() {
    const el = $('iranDate');

    if (!el) return;

    try {
      const now = new Date();

      el.textContent = new Intl.DateTimeFormat(
        'fa-IR-u-ca-persian',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
      ).format(now);
    } catch (_) {
      el.textContent = '';
    }
  }

  /* =========================================================
     متن‌ها
  ========================================================= */

  async function loadContent() {
    const { data, error } = await client
      .from('site_content')
      .select('*');

    if (error) {
      console.error('site_content:', error);
      return;
    }

    const content = {};

    (data || []).forEach(row => {
      content[row.key] = row.value;
    });

    const setText = (id, value) => {
      const el = $(id);

      if (el && value !== undefined && value !== null) {
        el.textContent = value;
      }
    };

    setText(
      'ashayerExcerpt',
      content.ashayer_excerpt
    );

    setText(
      'cooperativeExcerpt',
      content.cooperative_excerpt
    );

    const titleElements = {
      ashayerTitle: content.ashayer_title,
      coopTitle: content.cooperative_title,
      aboutTitle: content.about_title
    };

    Object.entries(titleElements).forEach(([id, value]) => {
      setText(id, value);
    });

    /*
     * اگر عنوان سایت در HTML عنصر مخصوص داشت
     */
    document.querySelectorAll('[data-site-title]')
      .forEach(el => {
        if (content.site_title) {
          el.textContent = content.site_title;
        }
      });

    /*
     * لوگوها
     */
    const rightLogo = document.querySelector(
      '[data-logo-right]'
    );

    const leftLogo = document.querySelector(
      '[data-logo-left]'
    );

    if (rightLogo && content.logo_right) {
      rightLogo.src = content.logo_right;
    }

    if (leftLogo && content.logo_left) {
      leftLogo.src = content.logo_left;
    }
  }

  /* =========================================================
     اخبار
  ========================================================= */

  async function loadNews() {
    const result = await client
      .from('news')
      .select('*')
      .order('created_at', {
        ascending: false
      });

    if (result.error) {
      console.error('news:', result.error);

      const track = $('newsTrack');

      if (track) {
        track.innerHTML =
          '<div class="news-error">خطا در دریافت اخبار</div>';
      }

      return;
    }

    news = result.data || [];

    /*
     * تاریخ مورد نظر کاربر:
     * جدیدترین خبر سمت راست باشد.
     *
     * چون direction سایت RTL است،
     * اولین آیتم DOM در سمت راست قرار می‌گیرد.
     */

    currentNews = 0;

    renderNews();
    startNewsTimer();
  }

  function renderNews() {
    const track = $('newsTrack');
    const dots = $('newsDots');

    if (!track) return;

    if (!news.length) {
      track.innerHTML =
        '<div class="news-empty">خبری ثبت نشده است.</div>';

      if (dots) dots.innerHTML = '';

      return;
    }

    track.innerHTML = news.map((item, index) => {
      const images = getNewsImages(item);
      const firstImage = images[0] || '';

      const title =
        item.title ||
        'خبر شرکت تعاونی عشایری کوه نور';

      const excerpt =
        item.excerpt ||
        '';

      /*
       * تاریخ انتشار:
       * فقط تاریخ نشان داده می‌شود.
       * عبارت «تاریخ انتشار» حذف شده.
       */

      const date =
        item.date ||
        item.publish_date ||
        item.published_at ||
        item.created_at ||
        '';

      const formattedDate =
        formatNewsDate(date);

      return `
        <article
          class="news-card"
          data-news-index="${index}"
        >

          <div class="news-card-image">

            ${
              firstImage
                ? `
                  <img
                    src="${escapeHtml(firstImage)}"
                    alt="${escapeHtml(title)}"
                    loading="${index === 0 ? 'eager' : 'lazy'}"
                    onerror="this.parentElement.classList.add('image-error')"
                  >
                `
                : `
                  <div class="news-no-image">
                    بدون تصویر
                  </div>
                `
            }

          </div>

          <div class="news-card-body">

            ${
              formattedDate
                ? `
                  <div class="news-date">
                    ${escapeHtml(formattedDate)}
                  </div>
                `
                : ''
            }

            <h3>
              ${escapeHtml(title)}
            </h3>

            ${
              excerpt
                ? `
                  <p>
                    ${escapeHtml(excerpt)}
                  </p>
                `
                : ''
            }

            <button
              type="button"
              class="read-news"
              data-open-news="${index}"
            >
              ادامه خبر
            </button>

          </div>

        </article>
      `;
    }).join('');

    /*
     * dots
     */
    if (dots) {
      dots.innerHTML = news.map((_, index) => `
        <button
          type="button"
          class="news-dot ${index === currentNews ? 'active' : ''}"
          data-news-dot="${index}"
          aria-label="خبر ${index + 1}"
        ></button>
      `).join('');
    }

    updateNewsPosition();
  }

  function formatNewsDate(value) {
    if (!value) return '';

    /*
     * اگر تاریخ شمسی دستی است
     */
    if (
      typeof value === 'string' &&
      /^(13|14)\d{2}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(
        value.trim()
      )
    ) {
      return value.trim();
    }

    /*
     * اگر فقط سال وارد شده
     */
    if (
      typeof value === 'string' &&
      /^14\d{2}$/.test(value.trim())
    ) {
      return value.trim();
    }

    /*
     * تبدیل تاریخ ISO
     */
    try {
      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        return String(value);
      }

      return new Intl.DateTimeFormat(
        'fa-IR-u-ca-persian',
        {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
        }
      ).format(date);
    } catch (_) {
      return String(value);
    }
  }

  /* =========================================================
     حرکت اسلایدر اخبار
  ========================================================= */

  function updateNewsPosition() {
    const track = $('newsTrack');

    if (!track) return;

    const cards = track.querySelectorAll(
      '.news-card'
    );

    cards.forEach((card, index) => {
      card.classList.toggle(
        'active',
        index === currentNews
      );
    });

    const dots = document.querySelectorAll(
      '[data-news-dot]'
    );

    dots.forEach((dot, index) => {
      dot.classList.toggle(
        'active',
        index === currentNews
      );
    });

    /*
     * تلاش می‌کنیم از ساختار موجود CSS استفاده کنیم.
     */
    if (cards[currentNews]) {
      cards[currentNews].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }

  function nextNews() {
    if (!news.length) return;

    currentNews =
      (currentNews + 1) % news.length;

    updateNewsPosition();
  }

  function prevNews() {
    if (!news.length) return;

    currentNews =
      (currentNews - 1 + news.length) %
      news.length;

    updateNewsPosition();
  }

  function startNewsTimer() {
    stopNewsTimer();

    if (news.length <= 1) return;

    /*
     * دقیقاً ۵.۳۰ ثانیه
     */
    newsTimer = setInterval(
      nextNews,
      POST_INTERVAL
    );
  }

  function stopNewsTimer() {
    if (newsTimer) {
      clearInterval(newsTimer);
      newsTimer = null;
    }
  }

  /* =========================================================
     باز کردن خبر
  ========================================================= */

  function openNewsArticle(index) {
    const item = news[index];

    if (!item) return;

    const modal = $('articleModal');
    const content = $('articleContent');

    if (!modal || !content) return;

    const images = getNewsImages(item);

    const title =
      item.title ||
      'خبر شرکت تعاونی عشایری کوه نور';

    const body =
      item.content ||
      item.body ||
      item.excerpt ||
      '';

    const date =
      item.date ||
      item.publish_date ||
      item.published_at ||
      item.created_at ||
      '';

    content.innerHTML = `
      <div class="article">

        <div class="article-header">

          ${
            date
              ? `
                <div class="news-date">
                  ${escapeHtml(formatNewsDate(date))}
                </div>
              `
              : ''
          }

          <h2>
            ${escapeHtml(title)}
          </h2>

        </div>

        ${
          images.length
            ? `
              <div class="article-gallery">
                ${images.map((url, i) => `
                  <figure class="article-image">

                    <img
                      src="${escapeHtml(url)}"
                      alt="${escapeHtml(title)} - تصویر ${i + 1}"
                      loading="lazy"
                      onerror="this.parentElement.classList.add('image-error')"
                    >

                  </figure>
                `).join('')}
              </div>
            `
            : ''
        }

        <div class="article-text">
          ${formatText(body)}
        </div>

      </div>
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    document.body.classList.add('modal-open');

    stopNewsTimer();
  }

  function formatText(text) {
    return escapeHtml(text)
      .replace(/\r\n/g, '\n')
      .replace(/\n{2,}/g, '</p><p>')
      .replace(/\n/g, '<br>') ?
      `<p>${escapeHtml(text)
        .replace(/\r\n/g, '\n')
        .replace(/\n{2,}/g, '</p><p>')
        .replace(/\n/g, '<br>')}</p>` :
      '';
  }

  /* =========================================================
     آرشیو همه اخبار
  ========================================================= */

  function openAllNews() {
    const modal = $('newsModal');
    const list = $('allNewsList');

    if (!modal || !list) return;

    list.innerHTML = news.map((item, index) => {
      const date =
        item.date ||
        item.publish_date ||
        item.published_at ||
        item.created_at ||
        '';

      return `
        <button
          type="button"
          class="all-news-item"
          data-open-news="${index}"
        >

          <span class="all-news-date">
            ${escapeHtml(formatNewsDate(date))}
          </span>

          <strong>
            ${escapeHtml(
              item.title ||
              'خبر شرکت تعاونی عشایری کوه نور'
            )}
          </strong>

        </button>
      `;
    }).join('');

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    document.body.classList.add('modal-open');

    stopNewsTimer();
  }

  /* =========================================================
     اسناد
  ========================================================= */

  async function loadDocuments() {
    const result = await client
      .from('documents')
      .select('*')
      .order('created_at', {
        ascending: true
      });

    if (result.error) {
      console.error('documents:', result.error);
      return;
    }

    documents = result.data || [];

    renderDocuments();
  }

  function renderDocuments() {
    const buttons = document.querySelector(
      '.document-buttons'
    );

    const viewer = $('documentViewer');

    if (!buttons || !viewer) return;

    /*
     * اگر دیتابیس سند دارد، دکمه‌ها از دیتابیس ساخته می‌شوند.
     */
    if (documents.length) {
      buttons.innerHTML = documents.map((doc, index) => `
        <button
          class="document-tab ${index === 0 ? 'active' : ''}"
          data-doc="${index}"
          type="button"
        >
          ${escapeHtml(doc.title || `سند ${index + 1}`)}
        </button>
      `).join('');

      showDocument(0);
      return;
    }

    /*
     * اگر دیتابیس خالی بود، HTML فعلی دست‌کاری نمی‌شود.
     */
    const existing =
      buttons.querySelectorAll('.document-tab');

    if (existing.length) {
      showStaticDocument(0);
    }
  }

  function showDocument(index) {
    const doc = documents[index];

    if (!doc) return;

    const viewer = $('documentViewer');

    if (!viewer) return;

    document
      .querySelectorAll('.document-tab')
      .forEach((button, i) => {
        button.classList.toggle(
          'active',
          i === index
        );
      });

    const url =
      safeUrl(
        doc.file_url ||
        doc.url ||
        doc.file ||
        doc.link
      );

    if (!url) {
      viewer.innerHTML =
        '<p>فایل این سند ثبت نشده است.</p>';

      return;
    }

    const title =
      doc.title ||
      'سند';

    /*
     * اگر فایل واقعی PDF باشد:
     * داخل قالب سایت نمایش داده می‌شود.
     *
     * اگر تصویر مستقیم باشد:
     * خود تصویر نمایش داده می‌شود.
     */
    const isPdf =
      /\.pdf(\?.*)?$/i.test(url);

    const isImage =
      /\.(jpg|jpeg|png|gif|webp|avif)(\?.*)?$/i.test(url);

    if (isPdf) {
      viewer.innerHTML = `
        <div class="document-frame">
          <iframe
            src="${escapeHtml(url)}"
            title="${escapeHtml(title)}"
            loading="lazy"
          ></iframe>

          <a
            class="document-download"
            href="${escapeHtml(url)}"
            target="_blank"
            rel="noopener"
          >
            مشاهده / دانلود ${escapeHtml(title)}
          </a>
        </div>
      `;

      return;
    }

    if (isImage) {
      viewer.innerHTML = `
        <div class="document-frame document-image-frame">

          <img
            src="${escapeHtml(url)}"
            alt="${escapeHtml(title)}"
          >

          <a
            class="document-download"
            href="${escapeHtml(url)}"
            target="_blank"
            rel="noopener"
          >
            مشاهده ${escapeHtml(title)}
          </a>

        </div>
      `;

      return;
    }

    /*
     * برای لینک‌های ibb.co:
     * به عنوان تصویر مستقیم قابل استفاده نیستند.
     *
     * لینک را داخل قالب قرار می‌دهیم تا صفحه‌ی تصویر
     * در تب جدید باز شود.
     */
    viewer.innerHTML = `
      <div class="document-frame">

        <div class="document-placeholder">
          <h3>
            ${escapeHtml(title)}
          </h3>

          <a
            class="document-download"
            href="${escapeHtml(url)}"
            target="_blank"
            rel="noopener"
          >
            مشاهده سند
          </a>

        </div>

      </div>
    `;
  }

  function showStaticDocument(index) {
    const viewer = $('documentViewer');

    if (!viewer) return;

    const tabs =
      document.querySelectorAll(
        '.document-tab'
      );

    const tab = tabs[index];

    if (!tab) return;

    tabs.forEach((x, i) => {
      x.classList.toggle(
        'active',
        i === index
      );
    });

    /*
     * این قسمت intentionally خالی است؛
     * چون سندهای قبلی ممکن است در HTML یا script قبلی
     * تعریف شده باشند.
     */
  }

  /* =========================================================
     اسکرول منو
  ========================================================= */

  function setupQuickMenu() {
    document
      .querySelectorAll('[data-target]')
      .forEach(button => {

        button.addEventListener(
          'click',
          () => {

            const target =
              $(button.dataset.target);

            if (!target) return;

            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });

          }
        );

      });
  }

  /* =========================================================
     بستن Modal
  ========================================================= */

  function closeModal(id) {
    const modal = $(id);

    if (!modal) return;

    modal.classList.remove('open');
    modal.setAttribute(
      'aria-hidden',
      'true'
    );

    document.body.classList.remove(
      'modal-open'
    );

    if (
      !document.querySelector(
        '.modal.open'
      )
    ) {
      startNewsTimer();
    }
  }

  /* =========================================================
     رویدادها
  ========================================================= */

  function setupEvents() {

    const next =
      $('nextNews');

    const prev =
      $('prevNews');

    const openNewsButton =
      $('openNews');

    if (next) {
      /*
       * راست = خبر بعدی
       */
      next.addEventListener(
        'click',
        nextNews
      );
    }

    if (prev) {
      /*
       * چپ = خبر قبلی
       */
      prev.addEventListener(
        'click',
        prevNews
      );
    }

    if (openNewsButton) {
      openNewsButton.addEventListener(
        'click',
        openAllNews
      );
    }

    document.addEventListener(
      'click',
      event => {

        const openIndex =
          event.target.closest(
            '[data-open-news]'
          );

        if (openIndex) {
          const index =
            Number(
              openIndex.dataset.openNews
            );

          /*
           * اگر آرشیو باز است ابتدا ببند.
           */
          const archive =
            $('newsModal');

          if (
            archive &&
            archive.classList.contains('open')
          ) {
            closeModal('newsModal');
          }

          openNewsArticle(index);
          return;
        }

        const dot =
          event.target.closest(
            '[data-news-dot]'
          );

        if (dot) {
          currentNews =
            Number(dot.dataset.newsDot);

          updateNewsPosition();
          startNewsTimer();
          return;
        }

        const close =
          event.target.closest(
            '[data-close]'
          );

        if (close) {
          closeModal(
            close.dataset.close
          );

          return;
        }

        const closeButton =
          event.target.closest(
            '.modal-close'
          );

        if (closeButton) {
          const modal =
            closeButton.closest(
              '.modal'
            );

          if (modal) {
            closeModal(modal.id);
          }

          return;
        }

        const documentTab =
          event.target.closest(
            '.document-tab'
          );

        if (documentTab) {
          const index =
            Number(
              documentTab.dataset.doc
            );

          if (documents.length) {
            showDocument(index);
          } else {
            showStaticDocument(index);
          }

          return;
        }
      }
    );

    /*
     * بستن با Escape
     */
    document.addEventListener(
      'keydown',
      event => {

        if (event.key !== 'Escape') {
          return;
        }

        document
          .querySelectorAll(
            '.modal.open'
          )
          .forEach(modal => {
            closeModal(modal.id);
          });

      }
    );

    /*
     * وقتی موس روی اخبار است تایمر متوقف شود.
     */
    const newsArea =
      document.querySelector(
        '.news-section'
      );

    if (newsArea) {

      newsArea.addEventListener(
        'mouseenter',
        stopNewsTimer
      );

      newsArea.addEventListener(
        'mouseleave',
        startNewsTimer
      );
    }
  }

  /* =========================================================
     لینک لوگوی سازمان
  ========================================================= */

  function setupOrganizationLogo() {

    const logos =
      document.querySelectorAll(
        'img[alt*="سازمان امور عشایر"]'
      );

    logos.forEach(img => {

      const parent =
        img.closest('a');

      if (parent) {
        parent.href =
          'https://ashayer.ir/';

        parent.target =
          '_blank';

        parent.rel =
          'noopener noreferrer';

        return;
      }

      const wrapper =
        document.createElement('a');

      wrapper.href =
        'https://ashayer.ir/';

      wrapper.target =
        '_blank';

      wrapper.rel =
        'noopener noreferrer';

      img.parentNode.insertBefore(
        wrapper,
        img
      );

      wrapper.appendChild(img);

    });
  }

  /* =========================================================
     شروع
  ========================================================= */

  async function init() {

    setupIranDate();

    setupEvents();

    setupQuickMenu();

    setupOrganizationLogo();

    await Promise.all([
      loadContent(),
      loadNews(),
      loadDocuments()
    ]);

  }

  init();

})();
