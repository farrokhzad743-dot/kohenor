(() => {
  "use strict";

  /* =========================================================
     محتوای ثابت سایت
     ========================================================= */

  const fallbackContent = {
    ashayer: {
      title: "عشایر؛ سرمایه ملّی",
      excerpt:
        "جامعه عشایری ایران یکی از ارزشمندترین بخش‌های اجتماعی، فرهنگی و اقتصادی کشور است؛ جامعه‌ای که در تولید، حفظ میراث فرهنگی و ارتباط پایدار با سرزمین نقش مهمی دارد.",
      body:
        "جامعه عشایری ایران یکی از ارزشمندترین بخش‌های اجتماعی، فرهنگی و اقتصادی کشور است؛ جامعه‌ای که در طول تاریخ، پیوندی عمیق و ناگسستنی با سرزمین، طبیعت، تولید و فرهنگ ایرانی داشته و بخش مهمی از هویت تاریخی و اجتماعی ایران را شکل داده است.\n\nزندگی عشایری بر پایه ارتباط مستقیم و مستمر انسان با طبیعت و بهره‌برداری متعادل از منابع طبیعی شکل گرفته است.\n\nیکی از مهم‌ترین نقش‌های جامعه عشایری، مشارکت در تولید محصولات دامی و تأمین بخشی از نیازهای غذایی کشور است. اهمیت عشایر تنها به حوزه اقتصادی محدود نمی‌شود و فرهنگ، موسیقی، پوشش، صنایع دستی، آداب و رسوم و دانش بومی آنان نیز بخشی از میراث فرهنگی زنده ایران است.\n\nحمایت از عشایر باید به گونه‌ای باشد که ضمن حفظ هویت فرهنگی و اجتماعی آنان، زمینه افزایش توان اقتصادی و ارتقای کیفیت زندگی نیز فراهم شود."
    },

    cooperative: {
      title: "چگونگی تعاونی",
      excerpt:
        "تعاونی، سازوکاری برای مشارکت افراد دارای نیازها و اهداف مشترک است؛ تعاونی عشایری نیز با سازمان‌دهی ظرفیت اعضا، تأمین نیازها، ارائه خدمات و تقویت تولید و بازار به جامعه عشایری کمک می‌کند.",
      body:
        "تعاونی یکی از مهم‌ترین شیوه‌های سازمان‌دهی اقتصادی و اجتماعی بر پایه مشارکت افراد است. در ساختار تعاونی، اشخاصی که دارای نیازها، منافع یا اهداف مشترک هستند، با گردهم آمدن و مشارکت در سرمایه و تصمیم‌گیری، تلاش می‌کنند بخشی از نیازهای اقتصادی و اجتماعی خود را به صورت جمعی تأمین کنند.\n\nتعاونی عشایری نوعی تشکل اقتصادی و اجتماعی است که با هدف سامان‌دهی بخشی از فعالیت‌ها و نیازهای جامعه عشایری شکل می‌گیرد.\n\nیکی از کارکردهای مهم تعاونی‌های عشایری کمک به تأمین نیازهای اعضا است. این نیازها می‌تواند شامل نهاده‌های دامی، علوفه، آرد، سوخت، سیلندر گاز مایع و سایر کالاها و خدمات مورد نیاز باشد.\n\nتعاونی همچنین می‌تواند در زمینه عرضه محصولات تولیدی نقش‌آفرین باشد و ارتباط اعضا را با دستگاه‌های اجرایی، بازار و تأمین‌کنندگان کالا تسهیل نماید."
    }
  };


  /* =========================================================
     اخبار جدید
     اخبار قبلی کاملاً حذف شده‌اند
     ========================================================= */

  let news = [

    {
      date: "۱۴۰۴",
      title: "تداوم خدمات آبرسانی و پشتیبانی از عشایر شهرستان کهگیلویه",
      text:
        "خدمات آبرسانی سیار با تانکر و توزیع اقلام مورد نیاز عشایر شهرستان کهگیلویه به صورت مستمر انجام می‌شود.",
      body:
        "خدمات آبرسانی سیار با تانکر به عشایر شهرستان کهگیلویه توسط شرکت تعاونی عشایری کوه نور دهدشت به صورت مستمر صورت می پذیرد.\n\nآقای پروره مدیرعامل تعاونی عشایری کوه نور دهدشت در همین راستا بیان کردند که طی سال 1404 قریب به 1500 سرویس 12000 لیتری آب شرب با تانکر سیار تحویل عشایر شهرستان کهگیلویه گردیده است.\n\nوی افزود سال 1404 خدماتی اعم از توزیع آرد، علوفه دامی، توزیع نفت سفید، توزیع سیلندر گاز مایع و...... به صورت مستمر در اختیار عشایر تحت پوشش و سهامدار شرکت تعاونی قرار گرفته است.",
      images: [
        "https://ibb.co/xKWHYsJr",
        "https://ibb.co/QFVJcQVQ",
        "https://ibb.co/Rp2sWYQK",
        "https://ibb.co/ycZD71PH",
        "https://ibb.co/fV3Kdp6c",
        "https://ibb.co/Zz5hgxk6",
        "https://ibb.co/Y7rBLBWM"
      ]
    },

    {
      date: "۲۹/۱۲/۱۴۰۳",
      title: "برگزاری مجمع عمومی عادی سالیانه شرکت",
      text:
        "جلسه مجمع عمومی عادی سالیانه شرکت تعاونی عشایری کوه نور دهدشت با حضور اکثریت اعضاء برگزار گردید.",
      body:
        "جلسه مجمع عمومی عادی سالیانه سال مالی منتهی به 1403/12/29 شرکت تعاونی عشایری کوه نور دهدشت با حضور اکثریت اعضاء برگزار گردید.\n\nدر این جلسه صورتهای مالی سال 1403 به تصویب اعضاء مجمع رسید.",
      images: [
        "https://ibb.co/XrpwsJ9b",
        "https://ibb.co/jZ11bjH6",
        "https://ibb.co/WvZ3zLCH",
        "https://ibb.co/kVxXv4ZL",
        "https://ibb.co/Zpz2hFkS",
        "https://ibb.co/Q7NrB892"
      ]
    },

    {
      date: "۲۱/۹/۱۴۰۴",
      title: "توزیع نفت سفید به عشایر محترم حوزه",
      text:
        "توزیع نفت سفید به عشایر محترم حوزه در محوطه شرکت انجام شد.",
      body:
        "توزیع نفت سفید به عشایر محترم حوزه در محوطهٔ شرکت انجام شد.",
      images: [
        "https://ibb.co/S7r9KY64",
        "https://ibb.co/KcRShWN5"
      ]
    },

    {
      date: "۲۱/۱۰/۱۴۰۰",
      title: "برگزاری مجمع عمومی فوق‌العاده شرکت",
      text:
        "جلسه مجمع عمومی بطور فوق العاده شرکت تعاونی عشایری کوه نور دهدشت با حضور اکثریت اعضاء برگزار گردید.",
      body:
        "جلسه مجمع عمومی بطور فوق العاده شرکت تعاونی عشایری کوه نور دهدشت در تاریخ 1400/10/21 رأس ساعت 16 در محل شرکت واقع در دهدشت با حضور اکثریت اعضاء برگزار گردید.\n\nدر این جلسه اساسنامه جدید شرکت با 70 ماده و 51 تبصره و 135 بند به تصویب اعضاء مجمع رسیده است.",
      images: [
        "https://ibb.co/CshY940f",
        "https://ibb.co/0jY0Tb1w",
        "https://ibb.co/mwP9bFG",
        "https://ibb.co/ym0yVZRP",
        "https://ibb.co/7xMBt8Qk",
        "https://ibb.co/gLQ3PjL5",
        "https://ibb.co/TDjQS272",
        "https://ibb.co/0yqTRHvK",
        "https://ibb.co/24yPXMN",
        "https://ibb.co/Kct64y74",
        "https://ibb.co/TDh9XPyV"
      ]
    }

  ];


  /* =========================================================
     اسناد
     ========================================================= */

  const docs = [
    {
      title: "استعلام شناسه ملی",
      url: "https://ibb.co/W4nDjgT1"
    },
    {
      title: "ثبت شرکت در دهدشت",
      url: "https://ibb.co/Z6NZyJcy"
    },
    {
      title: "آگهی تأسیس",
      url: "https://ibb.co/d0t1nDCd"
    },
    {
      title: "اساسنامه",
      url: "./asasname.pdf",
      download: true
    }
  ];


  /* =========================================================
     DOM
     ========================================================= */

  const $ = id => document.getElementById(id);

  const track = $("newsTrack");
  const dots = $("newsDots");
  const allNews = $("allNewsList");
  const articleContent = $("articleContent");
  const viewer = $("documentViewer");

  let activeNews = 0;
  let timer = null;

  let content = {
    ashayer: { ...fallbackContent.ashayer },
    cooperative: { ...fallbackContent.cooperative }
  };


  /* =========================================================
     امنیت HTML
     ========================================================= */

  function esc(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      })[char]
    );
  }


  /* =========================================================
     تبدیل متن چندخطی به HTML
     ========================================================= */

  function textToHTML(value) {
    return esc(value)
      .split(/\n+/)
      .filter(Boolean)
      .map(line => `<p>${line}</p>`)
      .join("");
  }


  /* =========================================================
     اخبار
     ========================================================= */

  function renderNews() {

    if (!track) return;

    track.innerHTML = news.map((n, i) => {

      const firstImage = n.images?.[0] || "";

      return `
        <article class="news-card" data-index="${i}">

          <div class="news-cover">

            ${
              firstImage
                ? `
                  <a
                    href="${esc(firstImage)}"
                    target="_blank"
                    rel="noopener"
                    class="news-image-link"
                  >
                    <img
                      src="${esc(firstImage)}"
                      alt="${esc(n.title)}"
                      loading="lazy"
                      onerror="
                        this.style.display='none';
                        this.parentElement.classList.add('image-failed');
                      "
                    >
                  </a>
                `
                : `<span aria-hidden="true">✦</span>`
            }

          </div>

          <div class="news-body">

            <time class="news-date">
              ${esc(n.date)}
            </time>

            <h3>
              ${esc(n.title)}
            </h3>

            <p>
              ${esc(n.text)}
            </p>

          </div>

        </article>
      `;

    }).join("");


    if (dots) {

      dots.innerHTML = news.map((_, i) => `
        <button
          aria-label="نمایش خبر ${i + 1}"
          data-dot="${i}"
          class="${i === 0 ? "active" : ""}"
        ></button>
      `).join("");

    }


    if (allNews) {

      allNews.innerHTML = news.map((n, i) => `
        <button
          class="all-news-item"
          data-index="${i}"
        >
          <div>

            <time>
              ${esc(n.date)}
            </time>

            <h3>
              ${esc(n.title)}
            </h3>

            <p>
              ${esc(n.text)}
            </p>

          </div>

          <span aria-hidden="true">
            ←
          </span>

        </button>
      `).join("");

    }

  }


  /* =========================================================
     مودال
     ========================================================= */

  function openModal(id) {

    const modal = $(id);

    if (!modal) return;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

  }


  function closeModal(id) {

    const modal = $(id);

    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

  }


  /* =========================================================
     نمایش خبر
     بدون «خبر شرکت تعاونی»
     بدون «تاریخ انتشار:»
     ========================================================= */

  function showArticle(index) {

    const n = news[index];

    if (!n || !articleContent) return;


    const gallery = n.images?.length
      ? `
        <div class="article-gallery">

          ${n.images.map((src, j) => `
            <a
              href="${esc(src)}"
              target="_blank"
              rel="noopener"
            >
              <img
                src="${esc(src)}"
                alt="${esc(n.title)} - تصویر ${j + 1}"
                loading="lazy"
                onerror="this.style.display='none'"
              >
            </a>
          `).join("")}

        </div>
      `
      : "";


    articleContent.innerHTML = `

      <h2>
        ${esc(n.title)}
      </h2>

      <div class="article-meta">
        ${esc(n.date)}
      </div>

      ${gallery}

      <div class="article-text">
        ${textToHTML(n.body)}
      </div>

    `;

    openModal("articleModal");

  }


  /* =========================================================
     محتوای عشایر / تعاونی
     ========================================================= */

  function showContent(slug) {

    const c = content[slug];

    if (!c) return;

    const body = $("contentModalBody");

    if (!body) return;


    body.innerHTML = `

      <div class="content-modal-body">

        <h2>
          ${esc(c.title)}
        </h2>

        <div class="article-text">
          ${textToHTML(c.body)}
        </div>

      </div>

    `;

    openModal("contentModal");

  }


  /* =========================================================
     اسناد و مدارک
     ========================================================= */

  function renderDocuments() {

    if (!viewer) return;


    const tabs =
      document.querySelector(".document-buttons") ||
      document.querySelector(".document-tabs");


    if (tabs) {

      tabs.innerHTML = docs.map((d, i) => `
        <button
          type="button"
          class="document-tab ${i === 0 ? "active" : ""}"
          data-doc="${i}"
        >
          ${esc(d.title)}
        </button>
      `).join("");

    }


    function showDocument(index) {

      const d = docs[index];

      if (!d) return;


      if (d.download) {

        viewer.innerHTML = `
          <div
            style="
              padding:30px;
              text-align:center;
            "
          >

            <a
              href="${esc(d.url)}"
              target="_blank"
              rel="noopener"
              download="asasname.pdf"
              style="
                display:inline-block;
                padding:16px 24px;
                border-radius:14px;
                background:#1645b5;
                color:#fff;
                text-decoration:none;
                font-weight:800;
              "
            >
              مشاهده و دانلود اساسنامه
            </a>

          </div>
        `;

      } else {

        viewer.innerHTML = `
          <div
            style="
              padding:20px;
              text-align:center;
            "
          >

            <a
              href="${esc(d.url)}"
              target="_blank"
              rel="noopener"
              style="
                font-weight:800;
                text-decoration:none;
              "
            >
              مشاهده ${esc(d.title)}
            </a>

          </div>
        `;

      }


      if (tabs) {

        tabs
          .querySelectorAll(".document-tab")
          .forEach((button, i) => {

            button.classList.toggle(
              "active",
              i === index
            );

          });

      }

    }


    if (tabs) {

      tabs
        .querySelectorAll(".document-tab")
        .forEach((button, i) => {

          button.onclick = () => {
            showDocument(i);
          };

        });

    }


    showDocument(0);

  }


  /* =========================================================
     اسلایدر اخبار
     ========================================================= */

  function setActiveDot(index) {

    activeNews = index;

    if (!dots) return;

    dots
      .querySelectorAll("button")
      .forEach((button, i) => {

        button.classList.toggle(
          "active",
          i === index
        );

      });

  }


  function goToNews(index) {

    if (!news.length || !track) return;

    index =
      (index + news.length) %
      news.length;

    const card =
      track.querySelector(
        `[data-index="${index}"]`
      );

    if (!card) return;

    activeNews = index;

    track.scrollTo({
      left:
        card.offsetLeft -
        (track.clientWidth -
          card.offsetWidth) / 2,
      behavior: "smooth"
    });

    setActiveDot(index);

  }


  function restartTimer() {

    clearInterval(timer);

    if (news.length > 1) {

      timer = setInterval(() => {

        goToNews(activeNews + 1);

      }, 5000);

    }

  }


  /* =========================================================
     تاریخ خودکار سایت
     ========================================================= */

  function renderIranDate() {

    const el = $("iranDate");

    if (!el) return;

    try {

      el.textContent =
        new Intl.DateTimeFormat(
          "fa-IR-u-ca-persian",
          {
            timeZone: "Asia/Tehran",
            day: "numeric",
            month: "long",
            year: "numeric"
          }
        ).format(new Date());

    } catch (error) {

      el.textContent = "";

    }

  }


  /* =========================================================
     اجرای اولیه
     ========================================================= */

  renderNews();

  renderDocuments();

  if ($("ashayerExcerpt")) {
    $("ashayerExcerpt").textContent =
      content.ashayer.excerpt;
  }

  if ($("cooperativeExcerpt")) {
    $("cooperativeExcerpt").textContent =
      content.cooperative.excerpt;
  }


  /* =========================================================
     منوی اصلی
     ========================================================= */

  document
    .querySelectorAll(".menu-card")
    .forEach(button => {

      button.onclick = () => {

        const target =
          document.getElementById(
            button.dataset.target
          );

        if (target) {

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }

      };

    });


  /* =========================================================
     دکمه‌های مشاهده متن
     ========================================================= */

  document
    .querySelectorAll(".read-more")
    .forEach(button => {

      button.onclick = () => {

        showContent(
          button.dataset.content
        );

      };

    });


  /* =========================================================
     اخبار
     ========================================================= */

  const openNews = $("openNews");

  if (openNews) {

    openNews.onclick = () => {
      openModal("newsModal");
    };

  }


  const nextNews = $("nextNews");

  if (nextNews) {

    nextNews.onclick = () => {

      goToNews(activeNews + 1);

      restartTimer();

    };

  }


  const prevNews = $("prevNews");

  if (prevNews) {

    prevNews.onclick = () => {

      goToNews(activeNews - 1);

      restartTimer();

    };

  }


  if (dots) {

    dots.onclick = event => {

      if (
        event.target.dataset.dot !==
        undefined
      ) {

        goToNews(
          Number(event.target.dataset.dot)
        );

        restartTimer();

      }

    };

  }


  if (track) {

    track.onclick = event => {

      const card =
        event.target.closest(".news-card");

      if (!card) return;

      /*
       * اگر روی لینک عکس کلیک شده،
       * مودال خبر باز نشود.
       */
      if (
        event.target.closest("a")
      ) {
        return;
      }

      showArticle(
        Number(card.dataset.index)
      );

    };


    track.addEventListener(
      "pointerdown",
      () => clearInterval(timer)
    );

    track.addEventListener(
      "pointerup",
      restartTimer
    );

    track.addEventListener(
      "touchend",
      restartTimer,
      { passive: true }
    );


    track.addEventListener(
      "scroll",
      () => {

        const cards = [
          ...track.querySelectorAll(
            ".news-card"
          )
        ];

        if (!cards.length) return;

        const center =
          track.scrollLeft +
          track.clientWidth / 2;

        let best = 0;
        let distance = Infinity;

        cards.forEach((card, i) => {

          const d =
            Math.abs(
              card.offsetLeft +
              card.offsetWidth / 2 -
              center
            );

          if (d < distance) {

            distance = d;
            best = i;

          }

        });

        setActiveDot(best);

      },
      { passive: true }
    );

  }


  /* =========================================================
     همه اخبار
     ========================================================= */

  if (allNews) {

    allNews.onclick = event => {

      const card =
        event.target.closest(
          ".all-news-item"
        );

      if (!card) return;

      showArticle(
        Number(card.dataset.index)
      );

    };

  }


  /* =========================================================
     بستن مودال
     ========================================================= */

  document.addEventListener(
    "click",
    event => {

      const close =
        event.target.closest(
          "[data-close]"
        );

      if (close) {

        closeModal(
          close.dataset.close
        );

      }

    }
  );


  document.addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {

        [
          "newsModal",
          "articleModal",
          "contentModal"
        ].forEach(closeModal);

      }

      if (event.key === "ArrowLeft") {

        goToNews(
          activeNews + 1
        );

      }

      if (event.key === "ArrowRight") {

        goToNews(
          activeNews - 1
        );

      }

    }
  );


  /* =========================================================
     تاریخ
     ========================================================= */

  renderIranDate();

  setInterval(
    renderIranDate,
    60000
  );


  /* =========================================================
     شروع اسلایدر
     ========================================================= */

  restartTimer();

})();
