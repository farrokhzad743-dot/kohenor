const fallbackContent = {
  ashayer: {
    title: 'عشایر؛ سرمایه ملّی',
    excerpt: 'جامعه عشایری ایران یکی از ارزشمندترین بخش‌های اجتماعی، فرهنگی و اقتصادی کشور است؛ جامعه‌ای که در تولید، حفظ میراث فرهنگی و ارتباط پایدار با سرزمین نقش مهمی دارد.',
    body: 'جامعه عشایری ایران یکی از ارزشمندترین بخش‌های اجتماعی، فرهنگی و اقتصادی کشور است؛ جامعه‌ای که در طول تاریخ، پیوندی عمیق و ناگسستنی با سرزمین، طبیعت، تولید و فرهنگ ایرانی داشته و بخش مهمی از هویت تاریخی و اجتماعی ایران را شکل داده است.'
  },
  cooperative: {
    title: 'چگونگی تعاونی',
    excerpt: 'تعاونی، سازوکاری برای مشارکت افراد دارای نیازها و اهداف مشترک است؛ تعاونی عشایری نیز با سازمان‌دهی ظرفیت اعضا، تأمین نیازها، ارائه خدمات و تقویت تولید و بازار به جامعه عشایری کمک می‌کند.',
    body: 'تعاونی یکی از مهم‌ترین شیوه‌های سازمان‌دهی اقتصادی و اجتماعی بر پایه مشارکت افراد است. در ساختار تعاونی، اشخاصی که دارای نیازها، منافع یا اهداف مشترک هستند، با گردهم آمدن و مشارکت در سرمایه و تصمیم‌گیری، تلاش می‌کنند بخشی از نیازهای اقتصادی و اجتماعی خود را به صورت جمعی تأمین کنند.'
  }
};

let news = [
  {
    date: '۱۴۰۴',
    title: 'تداوم خدمات آبرسانی و پشتیبانی از عشایر شهرستان کهگیلویه',
    excerpt: 'خدمات آبرسانی سیار و توزیع اقلام مورد نیاز عشایر شهرستان کهگیلویه در سال ۱۴۰۴ به صورت مستمر توسط شرکت تعاونی عشایری کوه نور دهدشت انجام شده است.',
    body: 'خدمات آبرسانی سیار با تانکر به عشایر شهرستان کهگیلویه توسط شرکت تعاونی عشایری کوه نور دهدشت به صورت مستمر صورت می پذیرد. آقای پروره مدیرعامل تعاونی عشایری کوه نور دهدشت در همین راستا بیان کردند که طی سال 1404 قریب به 1500 سرویس 12000 لیتری آب شرب با تانکر سیار تحویل عشایر شهرستان کهگیلویه گردیده است. وی افزود سال 1404 خدماتی اعم از توزیع آرد، علوفه دامی، توزیع نفت سفید، توزیع سیلندر گاز مایع و...... به صورت مستمر در اختیار عشایر تحت پوشش و سهامدار شرکت تعاونی قرار گرفته است.',
    images: [
      'https://ibb.co/xKWHYsJr','https://ibb.co/QFVJcQVQ','https://ibb.co/Rp2sWYQK','https://ibb.co/ycZD71PH','https://ibb.co/fV3Kdp6c','https://ibb.co/Zz5hgxk6','https://ibb.co/Y7rBLBWM'
    ]
  },
  {
    date: '۲۹/۱۲/۱۴۰۳',
    title: 'برگزاری مجمع عمومی عادی سالیانه شرکت',
    excerpt: 'جلسه مجمع عمومی عادی سالیانه شرکت تعاونی عشایری کوه نور دهدشت با حضور اکثریت اعضاء برگزار و صورت‌های مالی سال ۱۴۰۳ تصویب شد.',
    body: 'جلسه مجمع عمومی عادی سالیانه سال مالی منتهی به 1403/12/29 شرکت تعاونی عشایری کوه نور دهدشت با حضور اکثریت اعضاء برگزار گردید. در این جلسه صورتهای مالی سال 1403 به تصویب اعضاء مجمع رسید.',
    images: [
      'https://ibb.co/XrpwsJ9b','https://ibb.co/jZ11bjH6','https://ibb.co/WvZ3zLCH','https://ibb.co/kVxXv4ZL','https://ibb.co/Zpz2hFkS','https://ibb.co/Q7NrB892'
    ]
  },
  {
    date: '۲۱/۹/۱۴۰۴',
    title: 'توزیع نفت سفید به عشایر محترم حوزه',
    excerpt: 'توزیع نفت سفید به عشایر محترم حوزه در محوطه شرکت تعاونی عشایری کوه نور دهدشت انجام شد.',
    body: 'توزیع نفت سفید به عشایر محترم حوزه در محوطهٔ شرکت.',
    images: ['https://ibb.co/S7r9KY64','https://ibb.co/KcRShWN5']
  },
  {
    date: '۲۱/۱۰/۱۴۰۰',
    title: 'برگزاری مجمع عمومی فوق‌العاده شرکت',
    excerpt: 'جلسه مجمع عمومی بطور فوق العاده شرکت تعاونی عشایری کوه نور دهدشت برگزار و اساسنامه جدید شرکت به تصویب اعضاء رسید.',
    body: 'جلسه مجمع عمومی بطور فوق العاده شرکت تعاونی عشایری کوه نور دهدشت در تاریخ 1400/10/21 رأس ساعت 16 در محل شرکت واقع در دهدشت با حضور اکثریت اعضاء برگزار گردید. در این جلسه اساسنامه جدید شرکت با 70 ماده و 51 تبصره و 135 بند به تصویب اعضاء مجمع رسیده است.',
    images: [
      'https://ibb.co/CshY940f','https://ibb.co/0jY0Tb1w','https://ibb.co/mwP9bFG','https://ibb.co/ym0yVZRP','https://ibb.co/7xMBt8Qk','https://ibb.co/gLQ3PjL5','https://ibb.co/TDjQS272','https://ibb.co/0yqTRHvK','https://ibb.co/24yPXMN','https://ibb.co/Kct64y74','https://ibb.co/TDh9XPyV'
    ]
  }
];

const docs = [
  { title: 'استعلام شناسه ملی', url: 'https://ibb.co/W4nDjgT1' },
  { title: 'ثبت شرکت در دهدشت', url: 'https://ibb.co/Z6NZyJcy' },
  { title: 'آگهی تأسیس', url: 'https://ibb.co/d0t1nDCd' },
  { title: 'اساسنامه', url: './asasname.pdf' }
];

const track = document.getElementById('newsTrack');
const dots = document.getElementById('newsDots');
const allNews = document.getElementById('allNewsList');
const articleContent = document.getElementById('articleContent');
const viewer = document.getElementById('documentViewer');

let activeNews = 0;
let timer = null;
let content = { ...fallbackContent };

const cfg = window.SITE_CONFIG || {};
const supabaseReady =
  Boolean(cfg.supabaseUrl) &&
  Boolean(cfg.supabaseAnonKey) &&
  window.supabase &&
  typeof window.supabase.createClient === 'function';

const sb = supabaseReady
  ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey)
  : null;

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char]));
}

/* تبدیل ارقام فارسی/عربی به انگلیسی برای مرتب‌سازی تاریخ */
function normalizeDigits(value) {
  return String(value ?? '')
    .replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

/* تاریخ جلالی برای مرتب‌سازی اخبار.
   تاریخ‌های کامل مثل ۱۴۰۳/۱۲/۲۹ دقیق مرتب می‌شوند.
   تاریخ فقط سال مثل ۱۴۰۴ بعد از تمام تاریخ‌های ۱۴۰۳ قرار می‌گیرد. */
function jalaliSortValue(value) {
  const clean = normalizeDigits(value).trim();
  const parts = clean.split(/[\/\-.]/).map(Number).filter(Number.isFinite);
  const year = parts[0] || 0;
  const month = parts[1] || 12;
  const day = parts[2] || 30;
  return year * 10000 + month * 100 + day;
}

function sortNewsByJalaliDate(items) {
  return [...items].sort((a, b) => {
    const dateDiff = jalaliSortValue(b.date) - jalaliSortValue(a.date);
    if (dateDiff !== 0) return dateDiff;

    const createdA = new Date(a.created_at || 0).getTime();
    const createdB = new Date(b.created_at || 0).getTime();
    return createdB - createdA;
  });
}

function renderNews() {
  track.innerHTML = news.map((n, i) => `
    <article class="news-card" data-index="${i}">
      <div class="news-cover">
        ${n.images?.[0]
          ? `<a class="news-image-link" href="${esc(n.images[0])}" target="_blank" rel="noopener">مشاهده تصویر خبر</a>`
          : '<span aria-hidden="true">✦</span>'}
      </div>
      <div class="news-body">
        <time class="news-date">${esc(n.date)}</time>
        <h3>${esc(n.title)}</h3>
        <p>${esc(n.excerpt ?? n.text ?? '')}</p>
      </div>
    </article>
  `).join('');

  dots.innerHTML = news.map((_, i) =>
    `<button aria-label="نمایش خبر ${i + 1}" data-dot="${i}" class="${i === 0 ? 'active' : ''}"></button>`
  ).join('');

  allNews.innerHTML = news.map((n, i) => `
    <button class="all-news-item" data-index="${i}">
      <div>
        <time>${esc(n.date)}</time>
        <h3>${esc(n.title)}</h3>
        <p>${esc(n.excerpt ?? n.text ?? '')}</p>
      </div>
      <span aria-hidden="true">←</span>
    </button>
  `).join('');
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function showArticle(index) {
  const item = news[index];
  if (!item) return;

  const gallery = item.images?.length
    ? `<div class="article-gallery">
        ${item.images.map((src, j) =>
          `<a class="article-image-link" href="${esc(src)}" target="_blank" rel="noopener">تصویر ${j + 1}<span>مشاهده</span></a>`
        ).join('')}
       </div>`
    : '';

  articleContent.innerHTML = `
    <span class="eyebrow">خبر شرکت تعاونی</span>
    <h2>${esc(item.title)}</h2>
    <div class="article-meta">تاریخ انتشار: ${esc(item.date)}</div>
    ${gallery}
    <p>${esc(item.body)}</p>
  `;

  openModal('articleModal');
}

function showContent(slug) {
  const item = content[slug];
  if (!item) return;

  document.getElementById('contentModalBody').innerHTML = `
    <div class="content-modal-body">
      <span class="eyebrow">معرفی</span>
      <h2>${esc(item.title)}</h2>
      <div class="article-meta">متن کامل</div>
      <p>${esc(item.body)}</p>
    </div>
  `;

  openModal('contentModal');
}

function setActiveDot(index) {
  activeNews = index;
  dots.querySelectorAll('button').forEach((button, i) => {
    button.classList.toggle('active', i === index);
  });
}

function goToNews(index) {
  if (!news.length) return;

  index = (index + news.length) % news.length;
  const card = track.querySelector(`[data-index="${index}"]`);
  if (!card) return;

  activeNews = index;

  track.scrollTo({
    left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
    behavior: 'smooth'
  });

  setActiveDot(index);
}

function restartTimer() {
  clearInterval(timer);

  if (news.length > 1) {
    timer = setInterval(() => goToNews(activeNews + 1), 5000);
  }
}

async function loadRemote() {
  if (!sb) return;

  try {
    const contentResult = await sb
      .from('site_content')
      .select('*')
      .in('slug', ['ashayer', 'cooperative']);

    if (!contentResult.error && Array.isArray(contentResult.data)) {
      contentResult.data.forEach(item => {
        content[item.slug] = item;
      });
    }

    document.getElementById('ashayerExcerpt').textContent =
      content.ashayer.excerpt;

    document.getElementById('cooperativeExcerpt').textContent =
      content.cooperative.excerpt;

    const newsResult = await sb
      .from('news')
      .select('*');

    if (!newsResult.error && Array.isArray(newsResult.data) && newsResult.data.length) {
      news = sortNewsByJalaliDate(
        newsResult.data.map(item => ({
          ...item,
          images: Array.isArray(item.images) ? item.images : [],
          text: item.excerpt ?? ''
        }))
      );

      renderNews();
      goToNews(0);
      restartTimer();
    } else if (newsResult.error) {
      console.warn('Supabase news error:', newsResult.error.message);
    }
  } catch (error) {
    console.warn('Remote content unavailable:', error);
  }
}

function renderIranDate() {
  const element = document.getElementById('iranDate');
  if (!element) return;

  try {
    const date = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      timeZone: 'Asia/Tehran',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date());

    /* عمداً فقط تاریخ؛ بدون «امروز» و بدون «تقویم ایران» */
    element.textContent = date;
  } catch (error) {
    element.textContent = '';
  }
}

/* حذف روبان قدیمی، حتی اگر نسخه قبلی HTML هنوز روی مرورگر کش شده باشد */
document.querySelectorAll('.iran-ribbon').forEach(element => element.remove());

renderNews();

document.getElementById('ashayerExcerpt').textContent =
  content.ashayer.excerpt;

document.getElementById('cooperativeExcerpt').textContent =
  content.cooperative.excerpt;

document.querySelectorAll('.menu-card').forEach(button => {
  button.onclick = () =>
    document.getElementById(button.dataset.target)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
});

document.querySelectorAll('.read-more').forEach(button => {
  button.onclick = () => showContent(button.dataset.content);
});

document.getElementById('openNews').onclick = () => openModal('newsModal');

document.getElementById('nextNews').onclick = () => {
  goToNews(activeNews + 1);
  restartTimer();
};

document.getElementById('prevNews').onclick = () => {
  goToNews(activeNews - 1);
  restartTimer();
};

dots.onclick = event => {
  if (event.target.dataset.dot !== undefined) {
    goToNews(Number(event.target.dataset.dot));
    restartTimer();
  }
};

track.onclick = event => {
  const card = event.target.closest('.news-card');
  if (card) showArticle(Number(card.dataset.index));
};

allNews.onclick = event => {
  const item = event.target.closest('.all-news-item');
  if (item) showArticle(Number(item.dataset.index));
};

document.addEventListener('click', event => {
  const close = event.target.closest('[data-close]');
  if (close) closeModal(close.dataset.close);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    ['newsModal', 'articleModal', 'contentModal'].forEach(closeModal);
  }

  if (event.key === 'ArrowLeft') goToNews(activeNews + 1);
  if (event.key === 'ArrowRight') goToNews(activeNews - 1);
});

track.addEventListener('pointerdown', () => clearInterval(timer));
track.addEventListener('pointerup', restartTimer);
track.addEventListener('touchend', restartTimer, { passive: true });

track.addEventListener('scroll', () => {
  const cards = [...track.querySelectorAll('.news-card')];
  if (!cards.length) return;

  const center = track.scrollLeft + track.clientWidth / 2;
  let best = 0;
  let distance = Infinity;

  cards.forEach((card, index) => {
    const currentDistance =
      Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);

    if (currentDistance < distance) {
      distance = currentDistance;
      best = index;
    }
  });

  setActiveDot(best);
}, { passive: true });

function renderDoc(index = 0) {
  const doc = docs[index];
  if (!doc) return;

  const isLocalPdf = /\.pdf(?:$|[?#])/i.test(doc.url);
  viewer.innerHTML = isLocalPdf
    ? `<iframe src="${esc(doc.url)}" title="${esc(doc.title)}" style="width:100%;min-height:70vh;border:0;border-radius:18px;background:#fff"></iframe>
       <div class="document-caption"><strong>${esc(doc.title)}</strong><br>اساسنامه رسمی شرکت.</div>`
    : `<div class="document-caption"><strong>${esc(doc.title)}</strong><br>برای مشاهده سند روی دکمه زیر بزنید.</div>
       <a href="${esc(doc.url)}" target="_blank" rel="noopener" class="document-open-link">باز کردن سند</a>`;

  document.querySelectorAll('.document-tab').forEach((button, i) => {
    button.classList.toggle('active', i === index);
  });
}

document.querySelectorAll('.document-tab').forEach(button => {
  button.onclick = () => renderDoc(Number(button.dataset.doc));
});

renderDoc();
renderIranDate();
setInterval(renderIranDate, 60000);

loadRemote();
restartTimer();
