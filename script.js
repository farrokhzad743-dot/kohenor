/* =========================================================
   KOHENOR WEBSITE CMS
   script.js
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     CONFIG
  ========================================================= */

  const CONFIG = window.SITE_CONFIG || {};

  const SUPABASE_URL =
    CONFIG.supabaseUrl ||
    CONFIG.SUPABASE_URL ||
    "";

  const SUPABASE_KEY =
    CONFIG.supabaseAnonKey ||
    CONFIG.supabaseAnon ||
    CONFIG.SUPABASE_ANON_KEY ||
    "";

  if (!window.supabase) {
    console.error("Supabase JS library is not loaded.");
    return;
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn(
      "Supabase configuration is missing. CMS content will not load."
    );
    return;
  }

  const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


  /* =========================================================
     HELPERS
  ========================================================= */

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  function normalizeImages(value) {

    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value.filter(Boolean);
    }

    if (typeof value === "string") {

      try {

        const parsed =
          JSON.parse(value);

        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean);
        }

      } catch (_) {}

      return value
        .split(/\r?\n/)
        .map(x => x.trim())
        .filter(Boolean);
    }

    return [];
  }


  function findElement(...selectors) {

    for (const selector of selectors) {

      try {

        const element =
          document.querySelector(selector);

        if (element) {
          return element;
        }

      } catch (_) {}

    }

    return null;
  }


  function setText(selectors, value) {

    const element =
      findElement(...selectors);

    if (!element || value == null) {
      return;
    }

    element.textContent =
      value;
  }


  function setHTML(selectors, value) {

    const element =
      findElement(...selectors);

    if (!element || value == null) {
      return;
    }

    element.innerHTML =
      value;
  }


  /* =========================================================
     CONTENT
  ========================================================= */

  async function loadSiteContent() {

    try {

      const {
        data,
        error
      } = await db
        .from("site_content")
        .select("*")
        .in(
          "slug",
          [
            "ashayer",
            "cooperative"
          ]
        );


      if (error) {
        console.warn(
          "CMS content:",
          error.message
        );

        return;
      }


      for (const item of data || []) {

        if (item.slug === "ashayer") {

          applyAshayerContent(item);

        }


        if (item.slug === "cooperative") {

          applyCooperativeContent(item);

        }

      }

    } catch (error) {

      console.warn(
        "Unable to load CMS content.",
        error
      );
    }
  }


  /* =========================================================
     ASHAYER
  ========================================================= */

  function applyAshayerContent(item) {

    /*
     * چند selector مختلف قرار داده شده تا
     * با ساختار فعلی سایتت کار کند.
     */

    setText(
      [
        "#ashayer-title",
        "#ashayerTitle",
        "[data-content='ashayer-title']",
        "[data-cms='ashayer-title']"
      ],
      item.title
    );


    setText(
      [
        "#ashayer-excerpt",
        "#ashayerExcerpt",
        "[data-content='ashayer-excerpt']",
        "[data-cms='ashayer-excerpt']"
      ],
      item.excerpt
    );


    setText(
      [
        "#ashayer-body",
        "#ashayerBody",
        "[data-content='ashayer-body']",
        "[data-cms='ashayer-body']"
      ],
      item.body
    );


    /*
     * اگر بخش به صورت data attribute ساخته شده باشد.
     */

    document
      .querySelectorAll(
        "[data-cms-section='ashayer']"
      )
      .forEach(section => {

        const title =
          section.querySelector(
            "[data-cms-field='title']"
          );

        const excerpt =
          section.querySelector(
            "[data-cms-field='excerpt']"
          );

        const body =
          section.querySelector(
            "[data-cms-field='body']"
          );


        if (title) {
          title.textContent =
            item.title || "";
        }

        if (excerpt) {
          excerpt.textContent =
            item.excerpt || "";
        }

        if (body) {
          body.textContent =
            item.body || "";
        }

      });
  }


  /* =========================================================
     COOPERATIVE
  ========================================================= */

  function applyCooperativeContent(item) {

    setText(
      [
        "#cooperative-title",
        "#cooperativeTitle",
        "#coop-title",
        "#coopTitle",
        "[data-content='cooperative-title']",
        "[data-cms='cooperative-title']"
      ],
      item.title
    );


    setText(
      [
        "#cooperative-excerpt",
        "#cooperativeExcerpt",
        "#coop-excerpt",
        "#coopExcerpt",
        "[data-content='cooperative-excerpt']",
        "[data-cms='cooperative-excerpt']"
      ],
      item.excerpt
    );


    setText(
      [
        "#cooperative-body",
        "#cooperativeBody",
        "#coop-body",
        "#coopBody",
        "[data-content='cooperative-body']",
        "[data-cms='cooperative-body']"
      ],
      item.body
    );


    document
      .querySelectorAll(
        "[data-cms-section='cooperative']"
      )
      .forEach(section => {

        const title =
          section.querySelector(
            "[data-cms-field='title']"
          );

        const excerpt =
          section.querySelector(
            "[data-cms-field='excerpt']"
          );

        const body =
          section.querySelector(
            "[data-cms-field='body']"
          );


        if (title) {
          title.textContent =
            item.title || "";
        }

        if (excerpt) {
          excerpt.textContent =
            item.excerpt || "";
        }

        if (body) {
          body.textContent =
            item.body || "";
        }

      });
  }


  /* =========================================================
     NEWS
  ========================================================= */

  async function loadNews() {

    try {

      const {
        data,
        error
      } = await db
        .from("news")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false
          }
        );


      if (error) {

        console.warn(
          "CMS news:",
          error.message
        );

        return;
      }


      renderNews(data || []);

    } catch (error) {

      console.warn(
        "Unable to load news.",
        error
      );
    }
  }


  function renderNews(items) {

    /*
     * ابتدا دنبال containerهای رایج اخبار می‌گردیم.
     */

    const container =
      findElement(
        "#news-list",
        "#newsList",
        "#news-container",
        "#newsContainer",
        "[data-cms-news]",
        "[data-news-list]"
      );


    if (!container) {

      /*
       * اگر سایت فعلی container مشخصی ندارد،
       * هیچ چیز را تغییر نمی‌دهیم.
       */

      return;
    }


    if (!items.length) {

      return;
    }


    container.innerHTML =
      items.map(item => {

        const images =
          normalizeImages(
            item.images
          );

        const image =
          images[0] || "";


        return `
          <article
            class="news-item"
            data-news-id="${escapeHTML(item.id)}"
          >

            ${
              image
                ? `
                  <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(item.title)}"
                    loading="lazy"
                  >
                `
                : ""
            }

            <div class="news-content">

              ${
                item.date
                  ? `
                    <time>
                      ${escapeHTML(item.date)}
                    </time>
                  `
                  : ""
              }

              <h3>
                ${escapeHTML(item.title)}
              </h3>

              ${
                item.excerpt || item.text
                  ? `
                    <p>
                      ${escapeHTML(
                        item.excerpt ||
                        item.text ||
                        ""
                      )}
                    </p>
                  `
                  : ""
              }

            </div>

          </article>
        `;

      }).join("");
  }


  /* =========================================================
     DOCUMENTS
  ========================================================= */

  async function loadDocuments() {

    try {

      const {
        data,
        error
      } = await db
        .from("site_documents")
        .select("*")
        .order(
          "sort_order",
          {
            ascending: true
          }
        );


      if (error) {

        console.warn(
          "CMS documents:",
          error.message
        );

        return;
      }


      renderDocuments(data || []);

    } catch (error) {

      console.warn(
        "Unable to load documents.",
        error
      );
    }
  }


  function renderDocuments(items) {

    const container =
      findElement(
        "#documents-list",
        "#documentsList",
        "#documents-container",
        "#documentsContainer",
        "[data-cms-documents]",
        "[data-documents-list]"
      );


    if (!container) {
      return;
    }


    if (!items.length) {
      return;
    }


    container.innerHTML =
      items.map(item => {

        return `
          <a
            class="document-item"
            href="${escapeHTML(item.url)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${escapeHTML(item.title)}
          </a>
        `;

      }).join("");
  }


  /* =========================================================
     BUTTONS
  ========================================================= */

  async function loadButtons() {

    try {

      const {
        data,
        error
      } = await db
        .from("site_buttons")
        .select("*")
        .eq(
          "enabled",
          true
        )
        .order(
          "sort_order",
          {
            ascending: true
          }
        );


      if (error) {

        console.warn(
          "CMS buttons:",
          error.message
        );

        return;
      }


      applyButtons(
        data || []
      );

    } catch (error) {

      console.warn(
        "Unable to load buttons.",
        error
      );
    }
  }


  function applyButtons(items) {

    for (const item of items) {

      const selectors = [

        `[data-cms-button="${CSS.escape(
          item.id
        )}"]`,

        `[data-cms-section-button="${CSS.escape(
          item.section_slug
        )}"]`

      ];


      document
        .querySelectorAll(
          selectors.join(",")
        )
        .forEach(button => {

          button.textContent =
            item.label || button.textContent;


          if (
            item.target_type === "url" &&
            item.target_value
          ) {

            button.href =
              item.target_value;

            button.target =
              "_blank";

            button.rel =
              "noopener noreferrer";

          }

        });
    }
  }


  /* =========================================================
     DATA ATTRIBUTES
  ========================================================= */

  function applyGenericCMSFields() {

    document
      .querySelectorAll(
        "[data-cms-text]"
      )
      .forEach(element => {

        const key =
          element.dataset.cmsText;

        if (!key) return;


        const [table, slug, field] =
          key.split(":");


        if (
          table === "site_content" &&
          slug &&
          field
        ) {

          loadSingleContentField(
            element,
            slug,
            field
          );

        }

      });
  }


  async function loadSingleContentField(
    element,
    slug,
    field
  ) {

    try {

      const {
        data,
        error
      } = await db
        .from("site_content")
        .select(field)
        .eq(
          "slug",
          slug
        )
        .single();


      if (
        error ||
        !data
      ) {
        return;
      }


      element.textContent =
        data[field] || "";

    } catch (_) {}

  }


  /* =========================================================
     NEWS DETAIL
  ========================================================= */

  async function loadNewsDetail() {

    const params =
      new URLSearchParams(
        window.location.search
      );

    const id =
      params.get("news");

    if (!id) {
      return;
    }


    try {

      const {
        data,
        error
      } = await db
        .from("news")
        .select("*")
        .eq(
          "id",
          id
        )
        .single();


      if (error) {

        console.warn(
          "News detail:",
          error.message
        );

        return;
      }


      applyNewsDetail(
        data
      );

    } catch (error) {

      console.warn(
        "Unable to load news detail.",
        error
      );
    }
  }


  function applyNewsDetail(item) {

    setText(
      [
        "#news-detail-title",
        "#newsDetailTitle",
        "[data-news-detail='title']"
      ],
      item.title
    );


    setText(
      [
        "#news-detail-date",
        "#newsDetailDate",
        "[data-news-detail='date']"
      ],
      item.date
    );


    setText(
      [
        "#news-detail-excerpt",
        "#newsDetailExcerpt",
        "[data-news-detail='excerpt']"
      ],
      item.excerpt ||
      item.text
    );


    setText(
      [
        "#news-detail-body",
        "#newsDetailBody",
        "[data-news-detail='body']"
      ],
      item.body ||
      item.text
    );


    const images =
      normalizeImages(
        item.images
      );


    const gallery =
      findElement(
        "#news-gallery",
        "#newsGallery",
        "[data-news-gallery]"
      );


    if (
      gallery &&
      images.length
    ) {

      gallery.innerHTML =
        images.map(
          src =>
            `
              <img
                src="${escapeHTML(src)}"
                alt="${escapeHTML(item.title)}"
                loading="lazy"
              >
            `
        ).join("");
    }
  }


  /* =========================================================
     INITIALIZE
  ========================================================= */

  async function initializeCMS() {

    /*
     * سایت بدون CMS هم باید عادی باز شود.
     * بنابراین هیچ خطای Supabase نباید مانع
     * اجرای بقیه سایت شود.
     */

    try {
      await loadSiteContent();
    } catch (_) {}


    try {
      await loadNews();
    } catch (_) {}


    try {
      await loadDocuments();
    } catch (_) {}


    try {
      await loadButtons();
    } catch (_) {}


    try {
      await loadNewsDetail();
    } catch (_) {}


    try {
      applyGenericCMSFields();
    } catch (_) {}
  }


  /* =========================================================
     START
  ========================================================= */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initializeCMS
    );

  } else {

    initializeCMS();

  }

})();
