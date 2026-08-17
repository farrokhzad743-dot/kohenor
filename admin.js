/* =========================================================
   KOHENOR ADMIN CMS
   admin.js
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     SUPABASE
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
    console.error("Supabase JS library not loaded.");
    return;
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Supabase configuration is missing.");
  }

  const client = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


  /* =========================================================
     OWNER
     ========================================================= */

  const OWNER_EMAIL =
    "farrokhzad743@gmail.com";


  /* =========================================================
     DOM
     ========================================================= */

  const $ = (id) => document.getElementById(id);

  const loginCard = $("loginCard");
  const panel = $("panel");

  const emailInput = $("email");
  const otpBox = $("otpBox");
  const otpInput = $("otpCode");

  const sendLoginBtn = $("sendLogin");
  const verifyLoginBtn = $("verifyLogin");
  const changeEmailBtn = $("changeEmail");

  const loginStatus = $("loginStatus");
  const adminStatus = $("adminStatus");

  const logoutBtn = $("logout");
  const previewSiteBtn = $("previewSite");

  const newsId = $("newsId");
  const newsTitle = $("newsTitle");
  const newsDate = $("newsDate");
  const newsExcerpt = $("newsExcerpt");
  const newsBody = $("newsBody");
  const newsImages = $("newsImages");

  const saveNewsBtn = $("saveNews");
  const cancelNewsBtn = $("cancelNews");

  const docTitle = $("docTitle");
  const docUrl = $("docUrl");
  const saveDocBtn = $("saveDoc");
  const cancelDocBtn = $("cancelDoc");

  const buttonSection = $("buttonSection");
  const buttonLabel = $("buttonLabel");
  const buttonTarget = $("buttonTarget");
  const saveButtonBtn = $("saveButton");

  const newsAdminList = $("newsAdminList");
  const docsList = $("docsList");
  const buttonsList = $("buttonsList");

  const previewFrame = $("previewFrame");

  const ashTitle = $("ashTitle");
  const ashExcerpt = $("ashExcerpt");
  const ashBody = $("ashBody");

  const coopTitle = $("coopTitle");
  const coopExcerpt = $("coopExcerpt");
  const coopBody = $("coopBody");


  /* =========================================================
     STATE
     ========================================================= */

  let editingNewsId = null;
  let editingDocumentId = null;
  let editingButtonId = null;

  let currentUser = null;


  /* =========================================================
     STATUS
     ========================================================= */

  function setLoginStatus(message, type = "") {
    if (!loginStatus) return;

    loginStatus.textContent = message;
    loginStatus.className = "status";

    if (type) {
      loginStatus.classList.add(type);
    }
  }

  function setAdminStatus(message, type = "") {
    if (!adminStatus) return;

    adminStatus.textContent = message;
    adminStatus.className = "status";

    if (type) {
      adminStatus.classList.add(type);
    }

    if (message) {
      setTimeout(() => {
        if (adminStatus.textContent === message) {
          adminStatus.textContent = "";
        }
      }, 5000);
    }
  }


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
    if (!value) return [];

    if (Array.isArray(value)) {
      return value.filter(Boolean);
    }

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean);
        }
      } catch (_) {}

      return value
        .split(/\r?\n/)
        .map((x) => x.trim())
        .filter(Boolean);
    }

    return [];
  }


  function refreshPreview() {
    if (!previewFrame) return;

    try {
      previewFrame.contentWindow.location.reload();
    } catch (_) {
      previewFrame.src = "index.html?preview=" + Date.now();
    }
  }


  function requireClient() {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      setLoginStatus(
        "تنظیمات Supabase در config.js کامل نیست.",
        "error"
      );

      return false;
    }

    return true;
  }


  /* =========================================================
     LOGIN UI
     ========================================================= */

  function showLogin() {
    if (loginCard) {
      loginCard.classList.remove("hidden");
    }

    if (panel) {
      panel.classList.add("hidden");
    }
  }


  function showPanel() {
    if (loginCard) {
      loginCard.classList.add("hidden");
    }

    if (panel) {
      panel.classList.remove("hidden");
    }
  }


  /* =========================================================
     SEND OTP
     ========================================================= */

  async function sendOTP() {
    if (!requireClient()) return;

    let email =
      (emailInput?.value || OWNER_EMAIL)
        .trim()
        .toLowerCase();

    if (!email) {
      setLoginStatus(
        "ایمیل مالک را وارد کنید.",
        "error"
      );

      return;
    }

    if (email !== OWNER_EMAIL.toLowerCase()) {
      setLoginStatus(
        "این ایمیل اجازه ورود به پنل مدیریت را ندارد.",
        "error"
      );

      return;
    }

    sendLoginBtn.disabled = true;

    setLoginStatus(
      "در حال ارسال کد ورود..."
    );

    try {
      const { error } =
        await client.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: false
          }
        });

      if (error) {
        console.error(error);

        setLoginStatus(
          error.message ||
          "ارسال کد ورود ناموفق بود.",
          "error"
        );

        return;
      }

      if (emailInput) {
        emailInput.value = email;
      }

      if (otpBox) {
        otpBox.classList.remove("hidden");
      }

      if (sendLoginBtn) {
        sendLoginBtn.textContent =
          "ارسال دوباره کد";
      }

      setLoginStatus(
        "کد ورود به ایمیل مالک ارسال شد.",
        "ok"
      );

      otpInput?.focus();

    } catch (error) {

      console.error(error);

      setLoginStatus(
        "خطا در اتصال به سرویس ورود.",
        "error"
      );

    } finally {

      sendLoginBtn.disabled = false;

    }
  }


  /* =========================================================
     VERIFY OTP
     ========================================================= */

  async function verifyOTP() {
    if (!requireClient()) return;

    const email =
      (emailInput?.value || OWNER_EMAIL)
        .trim()
        .toLowerCase();

    const token =
      (otpInput?.value || "")
        .trim();

    if (email !== OWNER_EMAIL.toLowerCase()) {

      setLoginStatus(
        "این ایمیل اجازه ورود به پنل مدیریت را ندارد.",
        "error"
      );

      return;
    }

    if (!token) {

      setLoginStatus(
        "کد ورود را وارد کنید.",
        "error"
      );

      return;
    }

    verifyLoginBtn.disabled = true;

    setLoginStatus(
      "در حال بررسی کد..."
    );

    try {

      const { data, error } =
        await client.auth.verifyOtp({
          email,
          token,
          type: "email"
        });

      if (error) {
        console.error(error);

        setLoginStatus(
          error.message ||
          "کد ورود صحیح نیست یا منقضی شده است.",
          "error"
        );

        return;
      }

      currentUser = data?.user || null;

      if (!currentUser) {
        setLoginStatus(
          "ورود انجام نشد.",
          "error"
        );

        return;
      }

      /*
       * بررسی نهایی ایمیل
       */
      if (
        String(currentUser.email || "")
          .toLowerCase() !== OWNER_EMAIL.toLowerCase()
      ) {

        await client.auth.signOut();

        setLoginStatus(
          "این ایمیل اجازه ورود به پنل مدیریت را ندارد.",
          "error"
        );

        return;
      }

      /*
       * ورود موفق
       */
      showPanel();

      const who = $("who");

      if (who) {
        who.textContent =
          "مالک: " +
          OWNER_EMAIL +
          " | پنل مدیریت شرکت تعاونی عشایری کوه نور";
      }

      setAdminStatus(
        "ورود مالک با موفقیت انجام شد.",
        "ok"
      );

      await loadEverything();

    } catch (error) {

      console.error(error);

      setLoginStatus(
        "خطا هنگام بررسی کد ورود.",
        "error"
      );

    } finally {

      verifyLoginBtn.disabled = false;

    }
  }


  /* =========================================================
     CHANGE EMAIL
     ========================================================= */

  function changeEmail() {

    if (otpBox) {
      otpBox.classList.add("hidden");
    }

    if (otpInput) {
      otpInput.value = "";
    }

    if (sendLoginBtn) {
      sendLoginBtn.textContent =
        "ارسال کد ورود";
    }

    setLoginStatus("");

    emailInput?.focus();
  }


  /* =========================================================
     AUTH SESSION
     ========================================================= */

  async function checkSession() {

    if (!requireClient()) return;

    try {

      const {
        data,
        error
      } = await client.auth.getSession();

      if (error) {
        console.error(error);
        showLogin();
        return;
      }

      const session = data?.session;

      if (!session?.user) {
        showLogin();
        return;
      }

      const user = session.user;

      if (
        String(user.email || "")
          .toLowerCase() !== OWNER_EMAIL.toLowerCase()
      ) {

        await client.auth.signOut();

        showLogin();

        return;
      }

      currentUser = user;

      showPanel();

      const who = $("who");

      if (who) {
        who.textContent =
          "مالک: " +
          OWNER_EMAIL +
          " | پنل مدیریت شرکت تعاونی عشایری کوه نور";
      }

      await loadEverything();

    } catch (error) {

      console.error(error);

      showLogin();
    }
  }


  /* =========================================================
     LOGOUT
     ========================================================= */

  async function logout() {

    try {
      await client.auth.signOut();
    } catch (error) {
      console.error(error);
    }

    currentUser = null;

    showLogin();

    if (otpBox) {
      otpBox.classList.add("hidden");
    }

    if (otpInput) {
      otpInput.value = "";
    }

    setLoginStatus(
      "از پنل مدیریت خارج شدید.",
      "ok"
    );
  }


  /* =========================================================
     CONTENT
     ========================================================= */

  async function loadContent() {

    const {
      data,
      error
    } = await client
      .from("site_content")
      .select("*")
      .in("slug", [
        "ashayer",
        "cooperative"
      ]);

    if (error) {
      console.error("site_content:", error);
      return;
    }

    for (const item of data || []) {

      if (item.slug === "ashayer") {

        if (ashTitle)
          ashTitle.value = item.title || "";

        if (ashExcerpt)
          ashExcerpt.value =
            item.excerpt || "";

        if (ashBody)
          ashBody.value =
            item.body || "";
      }


      if (item.slug === "cooperative") {

        if (coopTitle)
          coopTitle.value = item.title || "";

        if (coopExcerpt)
          coopExcerpt.value =
            item.excerpt || "";

        if (coopBody)
          coopBody.value =
            item.body || "";
      }
    }
  }


  async function saveContent(slug) {

    if (!currentUser) {
      setAdminStatus(
        "ابتدا وارد پنل شوید.",
        "error"
      );
      return;
    }

    let payload = {};

    if (slug === "ashayer") {

      payload = {
        slug: "ashayer",
        title:
          ashTitle?.value.trim() || "",
        excerpt:
          ashExcerpt?.value.trim() || "",
        body:
          ashBody?.value.trim() || ""
      };
    }


    if (slug === "cooperative") {

      payload = {
        slug: "cooperative",
        title:
          coopTitle?.value.trim() || "",
        excerpt:
          coopExcerpt?.value.trim() || "",
        body:
          coopBody?.value.trim() || ""
      };
    }


    try {

      const {
        error
      } = await client
        .from("site_content")
        .upsert(
          payload,
          {
            onConflict: "slug"
          }
        );

      if (error) {
        console.error(error);

        setAdminStatus(
          "ذخیره محتوا انجام نشد: " +
          error.message,
          "error"
        );

        return;
      }

      setAdminStatus(
        "تغییرات ذخیره شد.",
        "ok"
      );

      refreshPreview();

    } catch (error) {

      console.error(error);

      setAdminStatus(
        "خطا هنگام ذخیره محتوا.",
        "error"
      );
    }
  }


  /* =========================================================
     NEWS
     ========================================================= */

  async function loadNews() {

    const {
      data,
      error
    } = await client
      .from("news")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );

    if (error) {

      console.error("news:", error);

      if (newsAdminList) {
        newsAdminList.innerHTML =
          `<p class="status error">
            خطا در دریافت اخبار:
            ${escapeHTML(error.message)}
          </p>`;
      }

      return;
    }

    renderNewsList(data || []);
  }


  function renderNewsList(items) {

    if (!newsAdminList) return;

    if (!items.length) {

      newsAdminList.innerHTML =
        "<p>هنوز خبری ثبت نشده است.</p>";

      return;
    }


    newsAdminList.innerHTML =
      items.map((item) => {

        const images =
          normalizeImages(item.images);

        const image =
          images[0]
            ? `<img
                 class="thumb"
                 src="${escapeHTML(images[0])}"
                 alt=""
               >`
            : "";


        return `
          <div class="list-item">

            <div style="display:flex;gap:12px;align-items:center">

              ${image}

              <div>

                <strong>
                  ${escapeHTML(item.title)}
                </strong>

                <small>
                  ${escapeHTML(item.date || "")}
                </small>

              </div>

            </div>

            <div class="row">

              <button
                class="admin-btn secondary"
                type="button"
                data-edit-news="${escapeHTML(item.id)}"
              >
                ویرایش
              </button>

              <button
                class="admin-btn danger"
                type="button"
                data-delete-news="${escapeHTML(item.id)}"
              >
                حذف
              </button>

            </div>

          </div>
        `;

      }).join("");
  }


  async function saveNews() {

    if (!currentUser) return;

    const title =
      newsTitle?.value.trim() || "";

    const date =
      newsDate?.value.trim() || "";

    const excerpt =
      newsExcerpt?.value.trim() || "";

    const body =
      newsBody?.value.trim() || "";


    if (!title) {

      setAdminStatus(
        "عنوان خبر را وارد کنید.",
        "error"
      );

      return;
    }


    const files =
      Array.from(
        newsImages?.files || []
      );


    const imageUrls = [];


    /*
     * اگر Storage آماده باشد،
     * تصاویر را در Storage آپلود می‌کنیم.
     */
    for (const file of files) {

      try {

        const path =
          `news/${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}-${file.name}`;


        const {
          error: uploadError
        } = await client
          .storage
          .from("site-media")
          .upload(
            path,
            file,
            {
              cacheControl: "3600",
              upsert: false
            }
          );


        if (uploadError) {

          console.warn(
            "Storage upload failed:",
            uploadError
          );

          continue;
        }


        const {
          data
        } = client
          .storage
          .from("site-media")
          .getPublicUrl(path);


        if (data?.publicUrl) {
          imageUrls.push(
            data.publicUrl
          );
        }

      } catch (error) {

        console.warn(
          "Image upload error:",
          error
        );
      }
    }


    const payload = {

      title,

      date,

      excerpt,

      body,

      text: excerpt,

      images: imageUrls

    };


    try {

      let result;


      if (editingNewsId) {

        /*
         * اگر تصویر جدید انتخاب نشده،
         * تصاویر قبلی حفظ می‌شوند.
         */

        if (!imageUrls.length) {

          const {
            data: oldNews
          } = await client
            .from("news")
            .select("images")
            .eq("id", editingNewsId)
            .single();

          payload.images =
            normalizeImages(
              oldNews?.images
            );
        }


        result = await client
          .from("news")
          .update(payload)
          .eq("id", editingNewsId);

      } else {

        result = await client
          .from("news")
          .insert(payload);
      }


      if (result.error) {

        console.error(result.error);

        setAdminStatus(
          "ذخیره خبر انجام نشد: " +
          result.error.message,
          "error"
        );

        return;
      }


      clearNewsForm();

      await loadNews();

      setAdminStatus(
        editingNewsId
          ? "خبر ویرایش شد."
          : "خبر جدید اضافه شد.",
        "ok"
      );

      refreshPreview();

    } catch (error) {

      console.error(error);

      setAdminStatus(
        "خطا هنگام ذخیره خبر.",
        "error"
      );
    }
  }


  async function editNews(id) {

    const {
      data,
      error
    } = await client
      .from("news")
      .select("*")
      .eq("id", id)
      .single();


    if (error) {

      console.error(error);

      setAdminStatus(
        "خبر پیدا نشد.",
        "error"
      );

      return;
    }


    editingNewsId = id;

    if (newsId)
      newsId.value = id;

    if (newsTitle)
      newsTitle.value =
        data.title || "";

    if (newsDate)
      newsDate.value =
        data.date || "";

    if (newsExcerpt)
      newsExcerpt.value =
        data.excerpt ||
        data.text ||
        "";

    if (newsBody)
      newsBody.value =
        data.body ||
        "";

    if (newsImages)
      newsImages.value = "";

    newsTitle?.focus();

    setAdminStatus(
      "خبر برای ویرایش آماده شد.",
      "ok"
    );
  }


  async function deleteNews(id) {

    if (
      !confirm(
        "آیا از حذف این خبر مطمئن هستید؟"
      )
    ) {
      return;
    }


    const {
      error
    } = await client
      .from("news")
      .delete()
      .eq("id", id);


    if (error) {

      console.error(error);

      setAdminStatus(
        "حذف خبر انجام نشد: " +
        error.message,
        "error"
      );

      return;
    }


    await loadNews();

    setAdminStatus(
      "خبر حذف شد.",
      "ok"
    );

    refreshPreview();
  }


  function clearNewsForm() {

    editingNewsId = null;

    if (newsId)
      newsId.value = "";

    if (newsTitle)
      newsTitle.value = "";

    if (newsDate)
      newsDate.value = "";

    if (newsExcerpt)
      newsExcerpt.value = "";

    if (newsBody)
      newsBody.value = "";

    if (newsImages)
      newsImages.value = "";
  }


  /* =========================================================
     DOCUMENTS
     ========================================================= */

  async function loadDocuments() {

    const {
      data,
      error
    } = await client
      .from("site_documents")
      .select("*")
      .order(
        "sort_order",
        {
          ascending: true
        }
      );


    if (error) {

      console.error(
        "site_documents:",
        error
      );

      if (docsList) {
        docsList.innerHTML =
          `<p class="status error">
            خطا در دریافت اسناد:
            ${escapeHTML(error.message)}
          </p>`;
      }

      return;
    }


    renderDocuments(data || []);
  }


  function renderDocuments(items) {

    if (!docsList) return;


    if (!items.length) {

      docsList.innerHTML =
        "<p>هنوز سندی ثبت نشده است.</p>";

      return;
    }


    docsList.innerHTML =
      items.map((item) => {

        return `
          <div class="list-item">

            <div>

              <strong>
                ${escapeHTML(item.title)}
              </strong>

              <small>
                ${escapeHTML(item.url)}
              </small>

            </div>

            <div class="row">

              <button
                class="admin-btn secondary"
                type="button"
                data-edit-doc="${escapeHTML(item.id)}"
              >
                ویرایش
              </button>

              <button
                class="admin-btn danger"
                type="button"
                data-delete-doc="${escapeHTML(item.id)}"
              >
                حذف
              </button>

            </div>

          </div>
        `;

      }).join("");
  }


  async function saveDocument() {

    const title =
      docTitle?.value.trim() || "";

    const url =
      docUrl?.value.trim() || "";


    if (!title || !url) {

      setAdminStatus(
        "عنوان و آدرس سند را وارد کنید.",
        "error"
      );

      return;
    }


    try {

      let result;


      if (editingDocumentId) {

        result = await client
          .from("site_documents")
          .update({
            title,
            url,
            updated_at:
              new Date().toISOString()
          })
          .eq(
            "id",
            editingDocumentId
          );

      } else {

        const {
          count
        } = await client
          .from("site_documents")
          .select(
            "id",
            {
              count: "exact",
              head: true
            }
          );


        result = await client
          .from("site_documents")
          .insert({
            title,
            url,
            sort_order:
              Number(count || 0)
          });
      }


      if (result.error) {

        console.error(result.error);

        setAdminStatus(
          "ذخیره سند انجام نشد: " +
          result.error.message,
          "error"
        );

        return;
      }


      clearDocumentForm();

      await loadDocuments();

      setAdminStatus(
        editingDocumentId
          ? "سند ویرایش شد."
          : "سند اضافه شد.",
        "ok"
      );

      refreshPreview();

    } catch (error) {

      console.error(error);

      setAdminStatus(
        "خطا هنگام ذخیره سند.",
        "error"
      );
    }
  }


  async function editDocument(id) {

    const {
      data,
      error
    } = await client
      .from("site_documents")
      .select("*")
      .eq("id", id)
      .single();


    if (error) {

      console.error(error);

      setAdminStatus(
        "سند پیدا نشد.",
        "error"
      );

      return;
    }


    editingDocumentId = id;

    if (docTitle)
      docTitle.value =
        data.title || "";

    if (docUrl)
      docUrl.value =
        data.url || "";

    docTitle?.focus();
  }


  async function deleteDocument(id) {

    if (
      !confirm(
        "آیا از حذف این سند مطمئن هستید؟"
      )
    ) {
      return;
    }


    const {
      error
    } = await client
      .from("site_documents")
      .delete()
      .eq("id", id);


    if (error) {

      console.error(error);

      setAdminStatus(
        "حذف سند انجام نشد: " +
        error.message,
        "error"
      );

      return;
    }


    await loadDocuments();

    setAdminStatus(
      "سند حذف شد.",
      "ok"
    );

    refreshPreview();
  }


  function clearDocumentForm() {

    editingDocumentId = null;

    if (docTitle)
      docTitle.value = "";

    if (docUrl)
      docUrl.value = "";
  }


  /* =========================================================
     BUTTONS
     ========================================================= */

  async function loadButtons() {

    const {
      data,
      error
    } = await client
      .from("site_buttons")
      .select("*")
      .order(
        "sort_order",
        {
          ascending: true
        }
      );


    if (error) {

      console.error(
        "site_buttons:",
        error
      );

      if (buttonsList) {
        buttonsList.innerHTML =
          `<p class="status error">
            خطا در دریافت دکمه‌ها:
            ${escapeHTML(error.message)}
          </p>`;
      }

      return;
    }


    renderButtons(data || []);
  }


  function renderButtons(items) {

    if (!buttonsList) return;


    if (!items.length) {

      buttonsList.innerHTML =
        "<p>هنوز دکمه‌ای ثبت نشده است.</p>";

      return;
    }


    buttonsList.innerHTML =
      items.map((item) => {

        return `
          <div class="list-item">

            <div>

              <strong>
                ${escapeHTML(item.label)}
              </strong>

              <small>
                ${escapeHTML(item.section_slug)}
                →
                ${escapeHTML(item.target_value || "")}
              </small>

            </div>

            <div class="row">

              <button
                class="admin-btn secondary"
                type="button"
                data-edit-button="${escapeHTML(item.id)}"
              >
                ویرایش
              </button>

              <button
                class="admin-btn danger"
                type="button"
                data-delete-button="${escapeHTML(item.id)}"
              >
                حذف
              </button>

            </div>

          </div>
        `;

      }).join("");
  }


  async function saveButton() {

    const section =
      buttonSection?.value || "";

    const label =
      buttonLabel?.value.trim() || "";

    const target =
      buttonTarget?.value.trim() || "";


    if (!section || !label) {

      setAdminStatus(
        "بخش و متن دکمه را وارد کنید.",
        "error"
      );

      return;
    }


    try {

      let result;


      if (editingButtonId) {

        result = await client
          .from("site_buttons")
          .update({
            section_slug: section,
            label,
            target_type:
              target.startsWith("http")
                ? "url"
                : "content",
            target_value: target,
            updated_at:
              new Date().toISOString()
          })
          .eq(
            "id",
            editingButtonId
          );

      } else {

        const {
          count
        } = await client
          .from("site_buttons")
          .select(
            "id",
            {
              count: "exact",
              head: true
            }
          );


        result = await client
          .from("site_buttons")
          .insert({
            section_slug: section,
            label,
            target_type:
              target.startsWith("http")
                ? "url"
                : "content",
            target_value: target,
            enabled: true,
            sort_order:
              Number(count || 0)
          });
      }


      if (result.error) {

        console.error(result.error);

        setAdminStatus(
          "ذخیره دکمه انجام نشد: " +
          result.error.message,
          "error"
        );

        return;
      }


      clearButtonForm();

      await loadButtons();

      setAdminStatus(
        editingButtonId
          ? "دکمه ویرایش شد."
          : "دکمه اضافه شد.",
        "ok"
      );

      refreshPreview();

    } catch (error) {

      console.error(error);

      setAdminStatus(
        "خطا هنگام ذخیره دکمه.",
        "error"
      );
    }
  }


  async function editButton(id) {

    const {
      data,
      error
    } = await client
      .from("site_buttons")
      .select("*")
      .eq("id", id)
      .single();


    if (error) {

      console.error(error);

      setAdminStatus(
        "دکمه پیدا نشد.",
        "error"
      );

      return;
    }


    editingButtonId = id;

    if (buttonSection)
      buttonSection.value =
        data.section_slug || "ashayer";

    if (buttonLabel)
      buttonLabel.value =
        data.label || "";

    if (buttonTarget)
      buttonTarget.value =
        data.target_value || "";

    buttonLabel?.focus();
  }


  async function deleteButton(id) {

    if (
      !confirm(
        "آیا از حذف این دکمه مطمئن هستید؟"
      )
    ) {
      return;
    }


    const {
      error
    } = await client
      .from("site_buttons")
      .delete()
      .eq("id", id);


    if (error) {

      console.error(error);

      setAdminStatus(
        "حذف دکمه انجام نشد: " +
        error.message,
        "error"
      );

      return;
    }


    await loadButtons();

    setAdminStatus(
      "دکمه حذف شد.",
      "ok"
    );

    refreshPreview();
  }


  function clearButtonForm() {

    editingButtonId = null;

    if (buttonSection)
      buttonSection.value = "ashayer";

    if (buttonLabel)
      buttonLabel.value = "";

    if (buttonTarget)
      buttonTarget.value = "";
  }


  /* =========================================================
     LOAD EVERYTHING
     ========================================================= */

  async function loadEverything() {

    setAdminStatus(
      "در حال دریافت اطلاعات..."
    );

    try {

      await Promise.all([
        loadContent(),
        loadNews(),
        loadDocuments(),
        loadButtons()
      ]);

      setAdminStatus(
        "اطلاعات پنل با موفقیت بارگذاری شد.",
        "ok"
      );

    } catch (error) {

      console.error(error);

      setAdminStatus(
        "برخی اطلاعات بارگذاری نشد.",
        "error"
      );
    }
  }


  /* =========================================================
     EVENTS
     ========================================================= */

  sendLoginBtn?.addEventListener(
    "click",
    sendOTP
  );

  verifyLoginBtn?.addEventListener(
    "click",
    verifyOTP
  );

  changeEmailBtn?.addEventListener(
    "click",
    changeEmail
  );

  logoutBtn?.addEventListener(
    "click",
    logout
  );


  previewSiteBtn?.addEventListener(
    "click",
    () => {

      window.open(
        "index.html",
        "_blank"
      );

    }
  );


  /*
   * Enter داخل ایمیل
   */
  emailInput?.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Enter") {
        event.preventDefault();
        sendOTP();
      }

    }
  );


  /*
   * Enter داخل کد
   */
  otpInput?.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Enter") {
        event.preventDefault();
        verifyOTP();
      }

    }
  );


  /*
   * محتوای سایت
   */
  document
    .querySelectorAll(
      "[data-save-content]"
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          saveContent(
            button.dataset.saveContent
          );

        }
      );

    });


  /*
   * News
   */
  saveNewsBtn?.addEventListener(
    "click",
    saveNews
  );

  cancelNewsBtn?.addEventListener(
    "click",
    clearNewsForm
  );


  newsAdminList?.addEventListener(
    "click",
    (event) => {

      const edit =
        event.target.closest(
          "[data-edit-news]"
        );

      if (edit) {

        editNews(
          edit.dataset.editNews
        );

        return;
      }


      const del =
        event.target.closest(
          "[data-delete-news]"
        );

      if (del) {

        deleteNews(
          del.dataset.deleteNews
        );

      }

    }
  );


  /*
   * Documents
   */
  saveDocBtn?.addEventListener(
    "click",
    saveDocument
  );

  cancelDocBtn?.addEventListener(
    "click",
    clearDocumentForm
  );


  docsList?.addEventListener(
    "click",
    (event) => {

      const edit =
        event.target.closest(
          "[data-edit-doc]"
        );

      if (edit) {

        editDocument(
          edit.dataset.editDoc
        );

        return;
      }


      const del =
        event.target.closest(
          "[data-delete-doc]"
        );

      if (del) {

        deleteDocument(
          del.dataset.deleteDoc
        );

      }

    }
  );


  /*
   * Buttons
   */
  saveButtonBtn?.addEventListener(
    "click",
    saveButton
  );


  buttonsList?.addEventListener(
    "click",
    (event) => {

      const edit =
        event.target.closest(
          "[data-edit-button]"
        );

      if (edit) {

        editButton(
          edit.dataset.editButton
        );

        return;
      }


      const del =
        event.target.closest(
          "[data-delete-button]"
        );

      if (del) {

        deleteButton(
          del.dataset.deleteButton
        );

      }

    }
  );


  /*
   * فایل‌های انتخاب‌شده
   */
  newsImages?.addEventListener(
    "change",
    () => {

      const container =
        $("selectedFiles");

      if (!container) return;

      const files =
        Array.from(
          newsImages.files || []
        );

      container.innerHTML =
        files.map(
          file =>
            `<small>
              ${escapeHTML(file.name)}
            </small>`
        ).join("<br>");

    }
  );


  /* =========================================================
     AUTH STATE
     ========================================================= */

  client.auth.onAuthStateChange(
    async (event, session) => {

      if (
        event === "SIGNED_OUT"
      ) {

        currentUser = null;

        showLogin();

        return;
      }


      if (
        session?.user &&
        String(session.user.email || "")
          .toLowerCase() ===
          OWNER_EMAIL.toLowerCase()
      ) {

        currentUser =
          session.user;

        showPanel();

      }

    }
  );


  /* =========================================================
     START
     ========================================================= */

  if (emailInput) {
    emailInput.value =
      OWNER_EMAIL;
  }

  checkSession();

})();
