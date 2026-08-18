(() => {
  "use strict";

  /*
   * =========================================================
   * KOHENOR ADMIN PANEL
   * نسخه مدیریت مستقیم سایت
   * =========================================================
   */

  const OWNER_EMAIL = "farrokhzad743@gmail.com";
  const BUCKET = "site-media";

  const $ = (id) => document.getElementById(id);

  /*
   * ---------------------------------------------------------
   * SUPABASE
   * ---------------------------------------------------------
   */

  const config =
    window.SITE_CONFIG ||
    window.siteConfig ||
    {};

  const SUPABASE_URL =
    config.supabaseUrl ||
    config.SUPABASE_URL ||
    config.url ||
    "";

  const SUPABASE_KEY =
    config.supabaseAnonKey ||
    config.supabaseAnon ||
    config.SUPABASE_ANON_KEY ||
    config.anonKey ||
    "";

  let client =
    window.supabaseClient ||
    null;

  if (!client && window.supabase && SUPABASE_URL && SUPABASE_KEY) {
    client = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );
  }

  if (!client) {
    document.body.innerHTML = `
      <div style="
        padding:40px;
        font-family:Tahoma,sans-serif;
        direction:rtl;
        text-align:center;
      ">
        <h2>خطا در اتصال به Supabase</h2>
        <p>
          فایل config.js پیدا نشد یا تنظیمات Supabase کامل نیست.
        </p>
      </div>
    `;
    return;
  }


  /*
   * ---------------------------------------------------------
   * STATE
   * ---------------------------------------------------------
   */

  let S = {
    news: [],
    buttons: [],
    docs: [],
    content: {}
  };

  let pendingDeletes = {
    news: new Set(),
    buttons: new Set(),
    docs: new Set()
  };


  /*
   * ---------------------------------------------------------
   * HELPERS
   * ---------------------------------------------------------
   */

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function setLoginMsg(message, type = "") {
    const el = $("loginMsg");

    if (!el) return;

    el.textContent = message || "";
    el.className = "status";

    if (type) {
      el.classList.add(type);
    }
  }

  function setSaveMsg(message, type = "") {
    const el = $("saveMsg");

    if (!el) return;

    el.textContent = message || "";
    el.className = "status";

    if (type) {
      el.classList.add(type);
    }
  }

  function isOwner(user) {
    return String(user?.email || "")
      .trim()
      .toLowerCase() === OWNER_EMAIL.toLowerCase();
  }

  function hideLogin() {
    $("panelView")?.classList.add("hidden");
    $("loginView")?.classList.remove("hidden");
  }

  function showPanel() {
    $("loginView")?.classList.add("hidden");
    $("panelView")?.classList.remove("hidden");
  }

  function todayFa() {
    return new Intl.DateTimeFormat(
      "fa-IR",
      {
        year: "numeric",
        month: "long",
        day: "numeric"
      }
    ).format(new Date());
  }

  function normalizeUrl(value) {
    return String(value || "").trim();
  }

  function getContent(key, fallback = "") {
    return S.content[key]?.value ?? fallback;
  }

  function fileNameSafe(name) {
    return String(name || "file")
      .replace(/[^\w\u0600-\u06FF.\- ]+/g, "-")
      .replace(/\s+/g, "-")
      .slice(0, 120);
  }


  /*
   * ---------------------------------------------------------
   * LOGIN
   * ---------------------------------------------------------
   *
   * عمداً session قبلی را برای این صفحه نگه نمی‌داریم.
   * بنابراین ورود پنل همیشه با ایمیل + کد انجام می‌شود.
   */

  async function forceFreshLogin() {
    try {
      await client.auth.signOut({
        scope: "local"
      });
    } catch (_) {}

    hideLogin();

    $("otpBox")?.classList.add("hidden");

    if ($("emailInput")) {
      $("emailInput").value = OWNER_EMAIL;
    }

    if ($("otpInput")) {
      $("otpInput").value = "";
    }

    setLoginMsg("");
  }


  async function sendOtp() {

    const email =
      $("emailInput")?.value
        .trim()
        .toLowerCase();

    if (email !== OWNER_EMAIL.toLowerCase()) {

      setLoginMsg(
        "این ایمیل اجازه ورود به پنل مدیریت را ندارد.",
        "error"
      );

      return;
    }

    const button = $("sendOtp");

    if (button) {
      button.disabled = true;
      button.textContent = "در حال ارسال...";
    }

    setLoginMsg("در حال ارسال کد ورود...");

    try {

      const { error } =
        await client.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: false
          }
        });

      if (error) {
        setLoginMsg(
          error.message ||
          "ارسال کد ورود ناموفق بود.",
          "error"
        );

        return;
      }

      $("otpBox")?.classList.remove("hidden");
      $("resendOtp")?.classList.remove("hidden");

      setLoginMsg(
        "کد ورود به ایمیل مالک ارسال شد.",
        "ok"
      );

      $("otpInput")?.focus();

    } catch (error) {

      console.error(error);

      setLoginMsg(
        "خطا در اتصال به سرویس ورود.",
        "error"
      );

    } finally {

      if (button) {
        button.disabled = false;
        button.textContent = "ارسال کد ورود";
      }

    }
  }


  async function verifyOtp() {

    const email =
      $("emailInput")?.value
        .trim()
        .toLowerCase();

    const token =
      $("otpInput")?.value
        .trim();

    if (email !== OWNER_EMAIL.toLowerCase()) {

      setLoginMsg(
        "این ایمیل اجازه ورود به پنل مدیریت را ندارد.",
        "error"
      );

      return;
    }

    if (!token) {

      setLoginMsg(
        "کد ورود را وارد کنید.",
        "error"
      );

      return;
    }

    const button = $("verifyOtp");

    if (button) {
      button.disabled = true;
      button.textContent = "در حال بررسی...";
    }

    try {

      const {
        data,
        error
      } = await client.auth.verifyOtp({
        email,
        token,
        type: "email"
      });

      if (error) {

        setLoginMsg(
          error.message ||
          "کد ورود صحیح نیست یا منقضی شده است.",
          "error"
        );

        return;
      }

      if (!isOwner(data?.user)) {

        await client.auth.signOut({
          scope: "local"
        });

        setLoginMsg(
          "این حساب مالک نیست.",
          "error"
        );

        return;
      }

      showPanel();

      await load();

      setSaveMsg(
        "✓ ورود مالک با موفقیت انجام شد.",
        "ok"
      );

    } catch (error) {

      console.error(error);

      setLoginMsg(
        "خطا هنگام بررسی کد ورود.",
        "error"
      );

    } finally {

      if (button) {
        button.disabled = false;
        button.textContent = "ورود به پنل مدیریت";
      }

    }
  }


  function changeEmail() {

    $("otpBox")?.classList.add("hidden");

    if ($("otpInput")) {
      $("otpInput").value = "";
    }

    setLoginMsg("");

    $("emailInput")?.focus();
  }


  async function logout() {

    try {

      await client.auth.signOut({
        scope: "local"
      });

    } catch (_) {}

    hideLogin();

    $("otpBox")?.classList.add("hidden");

    if ($("otpInput")) {
      $("otpInput").value = "";
    }

    setLoginMsg(
      "از پنل مدیریت خارج شدید.",
      "ok"
    );
  }


  /*
   * ---------------------------------------------------------
   * STORAGE
   * ---------------------------------------------------------
   */

  async function uploadFile(file, folder) {

    if (!file) {
      return null;
    }

    const safe =
      fileNameSafe(file.name);

    const path =
      `${folder}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}-${safe}`;

    const {
      error
    } = await client.storage
      .from(BUCKET)
      .upload(
        path,
        file,
        {
          cacheControl: "3600",
          upsert: false
        }
      );

    if (error) {
      throw error;
    }

    const {
      data
    } = client.storage
      .from(BUCKET)
      .getPublicUrl(path);

    if (!data?.publicUrl) {
      throw new Error(
        "آدرس عمومی فایل ساخته نشد."
      );
    }

    return data.publicUrl;
  }


  /*
   * ---------------------------------------------------------
   * LOAD EVERYTHING
   * ---------------------------------------------------------
   */

  async function load() {

    setSaveMsg(
      "در حال دریافت اطلاعات سایت..."
    );

    const [
      contentResult,
      newsResult,
      docsResult,
      buttonsResult
    ] = await Promise.all([

      client
        .from("site_content")
        .select("*"),

      client
        .from("news")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false
          }
        ),

      client
        .from("documents")
        .select("*")
        .order(
          "created_at",
          {
            ascending: true
          }
        ),

      client
        .from("site_buttons")
        .select("*")
        .order(
          "sort_order",
          {
            ascending: true
          }
        )

    ]);


    const error =
      contentResult.error ||
      newsResult.error ||
      docsResult.error ||
      buttonsResult.error;

    if (error) {

      console.error(error);

      setSaveMsg(
        "خطا در دریافت اطلاعات: " +
        error.message,
        "error"
      );

      return;
    }


    S.content = {};

    (contentResult.data || [])
      .forEach(row => {

        S.content[row.key] = row;

      });


    S.news =
      newsResult.data || [];

    S.docs =
      docsResult.data || [];

    S.buttons =
      buttonsResult.data || [];


    renderHeader();
    renderNews();
    renderButtons();
    renderContent();
    renderDocs();
    renderAbout();
    renderFooter();


    setSaveMsg("");
  }


  /*
   * ---------------------------------------------------------
   * HEADER
   * ---------------------------------------------------------
   */

  function renderHeader() {

    $("siteTitle").value =
      getContent(
        "site_title",
        getContent(
          "cooperative:title",
          "شرکت تعاونی عشایری کوه نور کهگیلویه"
        )
      );

    $("siteDate").value =
      todayFa();


    renderLogo(
      "rightLogoPreview",
      getContent("logo_right", "")
    );

    renderLogo(
      "leftLogoPreview",
      getContent("logo_left", "")
    );
  }


  function renderLogo(id, url) {

    const box = $(id);

    if (!box) return;

    if (!url) {

      box.innerHTML =
        `<span class="empty-preview">
          لوگویی انتخاب نشده است
        </span>`;

      return;
    }

    box.innerHTML =
      `<img src="${esc(url)}" alt="">`;
  }


  /*
   * ---------------------------------------------------------
   * NEWS
   * ---------------------------------------------------------
   */

  function renderNews() {

    const list =
      $("newsList");

    if (!list) return;

    if (!S.news.length) {

      list.innerHTML =
        `<p style="color:#687386">
          هنوز خبری ثبت نشده است.
        </p>`;

      return;
    }


    list.innerHTML =
      S.news.map(
        (n, index) => {

          const image =
            normalizeNewsImage(n);

          return `

            <article
              class="item"
              data-news-item="${esc(n.id)}"
            >

              <div class="item-head">

                <div>
                  <div class="item-title">
                    خبر ${index + 1}
                  </div>

                  <div class="item-sub">
                    تاریخ: ${esc(
                      n.date ||
                      formatDate(n.created_at)
                    )}
                  </div>
                </div>

                <button
                  class="delete-x"
                  type="button"
                  data-delete-news="${esc(n.id)}"
                  title="حذف خبر"
                >
                  ×
                </button>

              </div>


              ${
                image
                  ? `
                    <img
                      class="image-preview"
                      src="${esc(image)}"
                      alt=""
                    >
                  `
                  : ""
              }


              <div class="file-picker">

                <strong>
                  تغییر تصویر خبر
                </strong>

                <span>
                  تصویر را مستقیم از گوشی یا کامپیوتر انتخاب کن.
                </span>

                <input
                  type="file"
                  accept="image/*"
                  data-news-file="${esc(n.id)}"
                >

                <div
                  class="selected-file"
                  id="news-file-name-${esc(n.id)}"
                ></div>

              </div>


              <div class="grid">

                <div class="field grid-full">

                  <label>
                    عنوان خبر
                  </label>

                  <input
                    data-news-id="${esc(n.id)}"
                    data-news-key="title"
                    value="${esc(n.title)}"
                  >

                </div>


                <div class="field grid-full">

                  <label>
                    خلاصه خبر
                  </label>

                  <textarea
                    data-news-id="${esc(n.id)}"
                    data-news-key="excerpt"
                  >${esc(
                    n.excerpt ||
                    n.text ||
                    ""
                  )}</textarea>

                </div>


                <div class="field grid-full">

                  <label>
                    متن کامل خبر
                  </label>

                  <textarea
                    data-news-id="${esc(n.id)}"
                    data-news-key="content"
                  >${esc(
                    n.content ||
                    n.body ||
                    ""
                  )}</textarea>

                </div>

              </div>

            </article>

          `;

        }
      ).join("");
  }


  function normalizeNewsImage(n) {

    if (n.image_url) {
      return n.image_url;
    }

    if (Array.isArray(n.images)) {
      return n.images[0] || "";
    }

    if (typeof n.images === "string") {

      try {

        const parsed =
          JSON.parse(n.images);

        if (Array.isArray(parsed)) {
          return parsed[0] || "";
        }

      } catch (_) {}

      return n.images.split(/\r?\n/)[0] || "";
    }

    return "";
  }


  function formatDate(value) {

    if (!value) return "";

    try {

      return new Intl.DateTimeFormat(
        "fa-IR",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        }
      ).format(
        new Date(value)
      );

    } catch (_) {

      return "";

    }
  }


  function syncNewsFields() {

    document
      .querySelectorAll("[data-news-id]")
      .forEach(input => {

        const id =
          String(input.dataset.newsId);

        const key =
          input.dataset.newsKey;

        const item =
          S.news.find(
            x => String(x.id) === id
          );

        if (item) {
          item[key] = input.value;
        }

      });
  }


  /*
   * ---------------------------------------------------------
   * BUTTONS
   * ---------------------------------------------------------
   */

  function renderButtons() {

    const list =
      $("buttonsList");

    if (!list) return;

    if (!S.buttons.length) {

      list.innerHTML =
        `<p style="color:#687386">
          هنوز باتنی ثبت نشده است.
        </p>`;

      return;
    }


    list.innerHTML =
      S.buttons.map(
        (b, index) => {

          return `

            <div
              class="site-button-item"
              data-button-item="${esc(b.id)}"
            >

              <div class="item-head">

                <div>
                  <div class="item-title">
                    باتن ${index + 1}
                  </div>

                  <div class="item-sub">
                    دکمه صفحه اصلی
                  </div>
                </div>

                <button
                  class="delete-x"
                  type="button"
                  data-delete-button="${esc(b.id)}"
                  title="حذف باتن"
                >
                  ×
                </button>

              </div>


              <div class="field">

                <label>
                  متن باتن
                </label>

                <input
                  data-button-id="${esc(b.id)}"
                  data-button-key="label"
                  value="${esc(
                    b.label ||
                    b.title ||
                    ""
                  )}"
                >

              </div>


              <div class="field">

                <label>
                  مقصد باتن
                </label>

                <select
                  data-button-target="${esc(b.id)}"
                >

                  <option
                    value="ashayer"
                    ${
                      targetOf(b) === "ashayer"
                        ? "selected"
                        : ""
                    }
                  >
                    عشایر؛ سرمایه ملّی
                  </option>

                  <option
                    value="cooperative"
                    ${
                      targetOf(b) === "cooperative"
                        ? "selected"
                        : ""
                    }
                  >
                    چگونگی تعاونی
                  </option>

                  <option
                    value="documents"
                    ${
                      targetOf(b) === "documents"
                        ? "selected"
                        : ""
                    }
                  >
                    اسناد و مدارک
                  </option>

                  <option
                    value="about"
                    ${
                      targetOf(b) === "about"
                        ? "selected"
                        : ""
                    }
                  >
                    درباره ما
                  </option>

                </select>

              </div>

            </div>

          `;

        }
      ).join("");
  }


  function targetOf(b) {

    return (
      b.target ||
      b.target_value ||
      b.section_slug ||
      "ashayer"
    );

  }


  function syncButtons() {

    document
      .querySelectorAll("[data-button-id]")
      .forEach(input => {

        const id =
          String(input.dataset.buttonId);

        const item =
          S.buttons.find(
            x => String(x.id) === id
          );

        if (item) {

          item[
            input.dataset.buttonKey
          ] = input.value;

        }

      });


    document
      .querySelectorAll("[data-button-target]")
      .forEach(select => {

        const id =
          String(select.dataset.buttonTarget);

        const item =
          S.buttons.find(
            x => String(x.id) === id
          );

        if (item) {

          item.target =
            select.value;

          if ("target_value" in item) {
            item.target_value =
              select.value;
          }

          if ("section_slug" in item) {
            item.section_slug =
              select.value;
          }

        }

      });
  }


  /*
   * ---------------------------------------------------------
   * CONTENT
   * ---------------------------------------------------------
   */

  function renderContent() {

    $("ashayerTitle").value =
      getContent(
        "ashayer_title",
        "عشایر؛ سرمایه ملّی"
      );

    $("ashayerExcerpt").value =
      getContent(
        "ashayer_excerpt",
        ""
      );

    $("ashayerBody").value =
      getContent(
        "ashayer_body",
        ""
      );


    $("coopTitle").value =
      getContent(
        "cooperative_title",
        "چگونگی تعاونی"
      );

    $("coopExcerpt").value =
      getContent(
        "cooperative_excerpt",
        ""
      );

    $("coopBody").value =
      getContent(
        "cooperative_body",
        ""
      );

  }


  /*
   * ---------------------------------------------------------
   * DOCUMENTS
   * ---------------------------------------------------------
   */

  function renderDocs() {

    const list =
      $("docsList");

    if (!list) return;

    if (!S.docs.length) {

      list.innerHTML =
        `<p style="color:#687386">
          هنوز سندی ثبت نشده است.
        </p>`;

      return;
    }


    list.innerHTML =
      S.docs.map(
        (d, index) => {

          return `

            <article
              class="item"
              data-doc-item="${esc(d.id)}"
            >

              <div class="item-head">

                <div>

                  <div class="item-title">
                    سند ${index + 1}
                  </div>

                  <div class="item-sub">
                    فایل فعلی:
                    ${
                      d.file_url
                        ? "ثبت شده"
                        : "ندارد"
                    }
                  </div>

                </div>

                <button
                  class="delete-x"
                  type="button"
                  data-delete-doc="${esc(d.id)}"
                  title="حذف سند"
                >
                  ×
                </button>

              </div>


              <div class="field">

                <label>
                  عنوان سند
                </label>

                <input
                  data-doc-id="${esc(d.id)}"
                  data-doc-key="title"
                  value="${esc(d.title)}"
                >

              </div>


              <div class="file-picker">

                <strong>
                  انتخاب فایل سند
                </strong>

                <span>
                  PDF، تصویر یا هر فایل مورد نیاز را مستقیم انتخاب کن.
                </span>

                <input
                  type="file"
                  accept=".pdf,image/*,.doc,.docx,.xls,.xlsx"
                  data-doc-file="${esc(d.id)}"
                >

                <div
                  class="selected-file"
                  id="doc-file-name-${esc(d.id)}"
                ></div>

              </div>

            </article>

          `;

        }
      ).join("");
  }


  function syncDocs() {

    document
      .querySelectorAll("[data-doc-id]")
      .forEach(input => {

        const id =
          String(input.dataset.docId);

        const item =
          S.docs.find(
            x => String(x.id) === id
          );

        if (item) {
          item[
            input.dataset.docKey
          ] = input.value;
        }

      });
  }


  /*
   * ---------------------------------------------------------
   * ABOUT / FOOTER
   * ---------------------------------------------------------
   */

  function renderAbout() {

    $("aboutTitle").value =
      getContent(
        "about_title",
        "درباره ما"
      );

    $("aboutBody").value =
      getContent(
        "about_body",
        ""
      );

    $("supervisionLabel").value =
      getContent(
        "supervision_label",
        "تحت نظارت"
      );

    $("supervisionName").value =
      getContent(
        "supervision_name",
        "سازمان امور عشایر ایران"
      );
  }


  function renderFooter() {

    $("footerTitle").value =
      getContent(
        "footer_title",
        "شرکت تعاونی عشایری کوه نور کهگیلویه"
      );

    $("footerSubtitle").value =
      getContent(
        "footer_subtitle",
        "پایگاه اطلاع‌رسانی و معرفی شرکت"
      );

    $("footerNote").value =
      getContent(
        "footer_note",
        "© تمامی حقوق این وب‌سایت محفوظ است."
      );

  }


  /*
   * ---------------------------------------------------------
   * CONTENT SAVE HELPERS
   * ---------------------------------------------------------
   */

  function contentValue(key) {

    const map = {

      site_title:
        $("siteTitle").value,

      logo_right:
        S.content.logo_right?.value || "",

      logo_left:
        S.content.logo_left?.value || "",

      ashayer_title:
        $("ashayerTitle").value,

      ashayer_excerpt:
        $("ashayerExcerpt").value,

      ashayer_body:
        $("ashayerBody").value,

      cooperative_title:
        $("coopTitle").value,

      cooperative_excerpt:
        $("coopExcerpt").value,

      cooperative_body:
        $("coopBody").value,

      about_title:
        $("aboutTitle").value,

      about_body:
        $("aboutBody").value,

      supervision_label:
        $("supervisionLabel").value,

      supervision_name:
        $("supervisionName").value,

      footer_title:
        $("footerTitle").value,

      footer_subtitle:
        $("footerSubtitle").value,

      footer_note:
        $("footerNote").value

    };

    return map[key] ?? "";
  }


  async function upsertContent(
    key,
    value
  ) {

    const existing =
      S.content[key];

    if (existing?.id) {

      return client
        .from("site_content")
        .update({
          value
        })
        .eq(
          "id",
          existing.id
        );

    }

    return client
      .from("site_content")
      .insert({
        key,
        value
      });
  }


  /*
   * ---------------------------------------------------------
   * SAVE EVERYTHING
   * ---------------------------------------------------------
   */

  async function save() {

    syncNewsFields();
    syncButtons();
    syncDocs();


    const saveButton =
      $("saveAll");

    saveButton?.classList.add("saving");

    if (saveButton) {
      saveButton.textContent =
        "در حال ذخیره همه تغییرات...";
    }

    setSaveMsg(
      "در حال ذخیره..."
    );


    try {

      /*
       * -----------------------------------------------------
       * UPLOAD HEADER LOGOS
       * -----------------------------------------------------
       */

      const rightFile =
        $("rightLogoFile")?.files?.[0];

      const leftFile =
        $("leftLogoFile")?.files?.[0];


      if (rightFile) {

        const url =
          await uploadFile(
            rightFile,
            "logos"
          );

        S.content.logo_right = {
          ...(S.content.logo_right || {}),
          value: url
        };

      }


      if (leftFile) {

        const url =
          await uploadFile(
            leftFile,
            "logos"
          );

        S.content.logo_left = {
          ...(S.content.logo_left || {}),
          value: url
        };

      }


      /*
       * -----------------------------------------------------
       * CONTENT
       * -----------------------------------------------------
       */

      const contentKeys = [

        "site_title",

        "logo_right",
        "logo_left",

        "ashayer_title",
        "ashayer_excerpt",
        "ashayer_body",

        "cooperative_title",
        "cooperative_excerpt",
        "cooperative_body",

        "about_title",
        "about_body",

        "supervision_label",
        "supervision_name",

        "footer_title",
        "footer_subtitle",
        "footer_note"

      ];


      for (const key of contentKeys) {

        const result =
          await upsertContent(
            key,
            contentValue(key)
          );

        if (result.error) {
          throw result.error;
        }

      }


      /*
       * -----------------------------------------------------
       * NEWS
       * -----------------------------------------------------
       */

      for (const n of S.news) {

        if (
          pendingDeletes.news.has(
            String(n.id)
          )
        ) {
          continue;
        }


        let imageUrl =
          normalizeNewsImage(n);


        const file =
          document.querySelector(
            `[data-news-file="${CSS.escape(String(n.id))}"]`
          )?.files?.[0];


        if (file) {

          imageUrl =
            await uploadFile(
              file,
              "news"
            );

        }


        const payload = {

          title:
            n.title || "",

          excerpt:
            n.excerpt ||
            n.text ||
            "",

          content:
            n.content ||
            n.body ||
            "",

          image_url:
            imageUrl || ""

        };


        /*
         * بعضی نسخه‌های قدیمی سایت فیلد text
         * را هم استفاده می‌کنند.
         */

        if (
          Object.prototype.hasOwnProperty.call(
            n,
            "text"
          )
        ) {
          payload.text =
            payload.excerpt;
        }


        if (
          Object.prototype.hasOwnProperty.call(
            n,
            "body"
          )
        ) {
          payload.body =
            payload.content;
        }


        let result;


        if (
          String(n.id).startsWith("new-")
        ) {

          result =
            await client
              .from("news")
              .insert(payload);

        } else {

          result =
            await client
              .from("news")
              .update(payload)
              .eq(
                "id",
                n.id
              );

        }


        if (result.error) {
          throw result.error;
        }

      }


      /*
       * DELETE NEWS
       */

      for (
        const id of pendingDeletes.news
      ) {

        if (
          String(id).startsWith("new-")
        ) {
          continue;
        }

        const result =
          await client
            .from("news")
            .delete()
            .eq("id", id);

        if (result.error) {
          throw result.error;
        }

      }


      /*
       * -----------------------------------------------------
       * BUTTONS
       * -----------------------------------------------------
       */

      for (
        let i = 0;
        i < S.buttons.length;
        i++
      ) {

        const b =
          S.buttons[i];

        if (
          pendingDeletes.buttons.has(
            String(b.id)
          )
        ) {
          continue;
        }


        const target =
          b.target ||
          b.target_value ||
          b.section_slug ||
          "ashayer";


        /*
         * ساخت payload بر اساس ساختار فعلی
         * و در عین حال حفظ فیلدهای موجود.
         */

        const payload = {

          label:
            b.label ||
            b.title ||
            "",

          target,

          sort_order:
            i

        };


        /*
         * اگر جدول نسخه جدید این فیلدها را داشته باشد
         * مقدارشان نیز تنظیم می‌شود.
         */

        if (
          Object.prototype.hasOwnProperty.call(
            b,
            "section_slug"
          )
        ) {
          payload.section_slug =
            target;
        }

        if (
          Object.prototype.hasOwnProperty.call(
            b,
            "target_value"
          )
        ) {
          payload.target_value =
            target;
        }

        if (
          Object.prototype.hasOwnProperty.call(
            b,
            "target_type"
          )
        ) {
          payload.target_type =
            "content";
        }

        if (
          Object.prototype.hasOwnProperty.call(
            b,
            "enabled"
          )
        ) {
          payload.enabled = true;
        }


        let result;


        if (
          String(b.id).startsWith("new-")
        ) {

          result =
            await client
              .from("site_buttons")
              .insert(payload);

        } else {

          result =
            await client
              .from("site_buttons")
              .update(payload)
              .eq(
                "id",
                b.id
              );

        }


        if (result.error) {
          throw result.error;
        }

      }


      /*
       * DELETE BUTTONS
       */

      for (
        const id of pendingDeletes.buttons
      ) {

        if (
          String(id).startsWith("new-")
        ) {
          continue;
        }

        const result =
          await client
            .from("site_buttons")
            .delete()
            .eq("id", id);

        if (result.error) {
          throw result.error;
        }

      }


      /*
       * -----------------------------------------------------
       * DOCUMENTS
       * -----------------------------------------------------
       */

      for (const d of S.docs) {

        if (
          pendingDeletes.docs.has(
            String(d.id)
          )
        ) {
          continue;
        }


        let fileUrl =
          d.file_url ||
          d.url ||
          "";


        const file =
          document.querySelector(
            `[data-doc-file="${CSS.escape(String(d.id))}"]`
          )?.files?.[0];


        if (file) {

          fileUrl =
            await uploadFile(
              file,
              "documents"
            );

        }


        const payload = {

          title:
            d.title ||
            "سند جدید",

          file_url:
            fileUrl

        };


        /*
         * اگر نسخه‌ای از جدول url داشته باشد،
         * آن را هم هماهنگ می‌کنیم.
         */

        if (
          Object.prototype.hasOwnProperty.call(
            d,
            "url"
          )
        ) {
          payload.url =
            fileUrl;
        }


        let result;


        if (
          String(d.id).startsWith("new-")
        ) {

          result =
            await client
              .from("documents")
              .insert(payload);

        } else {

          result =
            await client
              .from("documents")
              .update(payload)
              .eq(
                "id",
                d.id
              );

        }


        if (result.error) {
          throw result.error;
        }

      }


      /*
       * DELETE DOCUMENTS
       */

      for (
        const id of pendingDeletes.docs
      ) {

        if (
          String(id).startsWith("new-")
        ) {
          continue;
        }

        const result =
          await client
            .from("documents")
            .delete()
            .eq("id", id);

        if (result.error) {
          throw result.error;
        }

      }


      /*
       * RESET
       */

      pendingDeletes = {
        news: new Set(),
        buttons: new Set(),
        docs: new Set()
      };


      if ($("rightLogoFile")) {
        $("rightLogoFile").value = "";
      }

      if ($("leftLogoFile")) {
        $("leftLogoFile").value = "";
      }


      setSaveMsg(
        "✓ همه تغییرات با موفقیت ذخیره شد.",
        "ok"
      );


      await load();


    } catch (error) {

      console.error(error);

      setSaveMsg(
        "خطا هنگام ذخیره: " +
        (error?.message || error),
        "error"
      );

    } finally {

      saveButton?.classList.remove("saving");

      if (saveButton) {
        saveButton.textContent =
          "✓ تأیید و ذخیره همه تغییرات";
      }

    }

  }


  /*
   * ---------------------------------------------------------
   * ADD
   * ---------------------------------------------------------
   */

  function addNews() {

    S.news.unshift({

      id:
        "new-" +
        Date.now(),

      title:
        "خبر جدید",

      excerpt:
        "",

      content:
        "",

      image_url:
        "",

      _new:
        true

    });

    renderNews();

    window.scrollTo({
      top:
        document.body.scrollHeight,
      behavior:
        "smooth"
    });

  }


  function addButton() {

    S.buttons.push({

      id:
        "new-" +
        Date.now(),

      label:
        "باتن جدید",

      target:
        "ashayer",

      sort_order:
        S.buttons.length,

      _new:
        true

    });

    renderButtons();

    window.scrollTo({
      top:
        document.body.scrollHeight,
      behavior:
        "smooth"
    });

  }


  function addDoc() {

    S.docs.push({

      id:
        "new-" +
        Date.now(),

      title:
        "سند جدید",

      file_url:
        "",

      _new:
        true

    });

    renderDocs();

    window.scrollTo({
      top:
        document.body.scrollHeight,
      behavior:
        "smooth"
    });

  }


  /*
   * ---------------------------------------------------------
   * DELETE
   * ---------------------------------------------------------
   */

  function deleteNews(id) {

    const ok =
      confirm(
        "آیا از حذف این خبر مطمئن هستید؟"
      );

    if (!ok) return;


    pendingDeletes.news.add(
      String(id)
    );


    S.news =
      S.news.filter(
        n =>
          String(n.id) !==
          String(id)
      );


    renderNews();

    setSaveMsg(
      "خبر برای حذف علامت‌گذاری شد. برای نهایی شدن، ذخیره را بزن."
    );

  }


  function deleteButton(id) {

    const ok =
      confirm(
        "آیا از حذف این باتن مطمئن هستید؟"
      );

    if (!ok) return;


    pendingDeletes.buttons.add(
      String(id)
    );


    S.buttons =
      S.buttons.filter(
        b =>
          String(b.id) !==
          String(id)
      );


    renderButtons();

    setSaveMsg(
      "باتن برای حذف علامت‌گذاری شد. برای نهایی شدن، ذخیره را بزن."
    );

  }


  function deleteDoc(id) {

    const ok =
      confirm(
        "آیا از حذف این سند مطمئن هستید؟"
      );

    if (!ok) return;


    pendingDeletes.docs.add(
      String(id)
    );


    S.docs =
      S.docs.filter(
        d =>
          String(d.id) !==
          String(id)
      );


    renderDocs();

    setSaveMsg(
      "سند برای حذف علامت‌گذاری شد. برای نهایی شدن، ذخیره را بزن."
    );

  }


  /*
   * ---------------------------------------------------------
   * LOGO DELETE
   * ---------------------------------------------------------
   */

  function removeLogo(key, previewId) {

    const ok =
      confirm(
        "آیا می‌خواهید این لوگو حذف شود؟"
      );

    if (!ok) return;


    if (!S.content[key]) {

      S.content[key] = {
        key,
        value: ""
      };

    } else {

      S.content[key].value = "";

    }


    renderLogo(
      previewId,
      ""
    );

  }


  /*
   * ---------------------------------------------------------
   * EVENTS
   * ---------------------------------------------------------
   */

  $("sendOtp")?.addEventListener(
    "click",
    sendOtp
  );

  $("resendOtp")?.addEventListener(
    "click",
    sendOtp
  );

  $("verifyOtp")?.addEventListener(
    "click",
    verifyOtp
  );

  $("changeEmail")?.addEventListener(
    "click",
    changeEmail
  );

  $("logout")?.addEventListener(
    "click",
    logout
  );

  $("viewSite")?.addEventListener(
    "click",
    () => {
      window.open(
        "/",
        "_blank"
      );
    }
  );

  $("addNews")?.addEventListener(
    "click",
    addNews
  );

  $("addNewsBottom")?.addEventListener(
    "click",
    addNews
  );

  $("addButton")?.addEventListener(
    "click",
    addButton
  );

  $("addButtonBottom")?.addEventListener(
    "click",
    addButton
  );

  $("addDoc")?.addEventListener(
    "click",
    addDoc
  );

  $("addDocBottom")?.addEventListener(
    "click",
    addDoc
  );

  $("saveAll")?.addEventListener(
    "click",
    save
  );


  $("removeRightLogo")?.addEventListener(
    "click",
    () =>
      removeLogo(
        "logo_right",
        "rightLogoPreview"
      )
  );


  $("removeLeftLogo")?.addEventListener(
    "click",
    () =>
      removeLogo(
        "logo_left",
        "leftLogoPreview"
      )
  );


  /*
   * NEWS DELETE
   */

  document.addEventListener(
    "click",
    event => {

      const news =
        event.target.closest(
          "[data-delete-news]"
        );

      if (news) {
        deleteNews(
          news.dataset.deleteNews
        );
        return;
      }


      const button =
        event.target.closest(
          "[data-delete-button]"
        );

      if (button) {
        deleteButton(
          button.dataset.deleteButton
        );
        return;
      }


      const doc =
        event.target.closest(
          "[data-delete-doc]"
        );

      if (doc) {
        deleteDoc(
          doc.dataset.deleteDoc
        );

      }

    }
  );


  /*
   * FILE PREVIEW
   */

  document.addEventListener(
    "change",
    event => {

      const input =
        event.target;


      if (
        input.matches(
          "[data-news-file]"
        )
      ) {

        const file =
          input.files?.[0];

        const id =
          input.dataset.newsFile;

        const label =
          $(
            "news-file-name-" +
            id
          );

        if (label) {

          label.textContent =
            file
              ? "انتخاب شد: " +
                file.name
              : "";

        }

        return;
      }


      if (
        input.matches(
          "[data-doc-file]"
        )
      ) {

        const file =
          input.files?.[0];

        const id =
          input.dataset.docFile;

        const label =
          $(
            "doc-file-name-" +
            id
          );

        if (label) {

          label.textContent =
            file
              ? "انتخاب شد: " +
                file.name
              : "";

        }

        return;
      }


      if (
        input.id ===
        "rightLogoFile"
      ) {

        const file =
          input.files?.[0];

        if (!file) return;

        const reader =
          new FileReader();

        reader.onload =
          () => {

            renderLogo(
              "rightLogoPreview",
              reader.result
            );

          };

        reader.readAsDataURL(file);

        return;
      }


      if (
        input.id ===
        "leftLogoFile"
      ) {

        const file =
          input.files?.[0];

        if (!file) return;

        const reader =
          new FileReader();

        reader.onload =
          () => {

            renderLogo(
              "leftLogoPreview",
              reader.result
            );

          };

        reader.readAsDataURL(file);

      }

    }
  );


  /*
   * ENTER LOGIN
   */

  $("emailInput")?.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Enter"
      ) {

        event.preventDefault();

        sendOtp();

      }

    }
  );


  $("otpInput")?.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Enter"
      ) {

        event.preventDefault();

        verifyOtp();

      }

    }
  );


  /*
   * AUTH STATE
   */

  client.auth.onAuthStateChange(
    (event, session) => {

      if (
        event ===
        "SIGNED_OUT"
      ) {

        hideLogin();

        return;
      }


      if (
        event ===
          "SIGNED_IN" &&
        isOwner(
          session?.user
        )
      ) {

        showPanel();

      }

    }
  );


  /*
   * START
   */

  (async () => {

    /*
     * مهم:
     * session قبلی عمداً پاک می‌شود
     * تا پنل بدون ایمیل و کد باز نشود.
     */

    await forceFreshLogin();

  })();

})();
