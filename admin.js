(() => {
  "use strict";

  const CONFIG = window.SITE_CONFIG || {};
  const SUPABASE_URL = CONFIG.supabaseUrl || "";
  const SUPABASE_KEY = CONFIG.supabaseAnonKey || "";
  const OWNER_EMAIL = "farrokhzad743@gmail.com";

  if (!window.supabase || !SUPABASE_URL || !SUPABASE_KEY) {
    document.body.innerHTML = '<div style="padding:30px;font-family:Arial">تنظیمات Supabase در config.js پیدا نشد.</div>';
    return;
  }

  const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  const $ = id => document.getElementById(id);

  let currentUser = null;
  let news = [];
  let docs = [];
  let buttons = [];
  let editingNewsId = null;
  let editingDocId = null;
  let editingButtonId = null;
  let siteContent = {};

  const ownerEmail = email => String(email || "").trim().toLowerCase() === OWNER_EMAIL.toLowerCase();

  const faDate = () => new Intl.DateTimeFormat("fa-IR", {
    year: "numeric", month: "2-digit", day: "2-digit"
  }).format(new Date());

  const esc = value => String(value ?? "").replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));

  const imagesArray = value => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (!value) return [];
    try {
      const x = JSON.parse(value);
      if (Array.isArray(x)) return x.filter(Boolean);
    } catch (_) {}
    return String(value).split(/\r?\n/).map(x => x.trim()).filter(Boolean);
  };

  function status(message, type = "") {
    const el = $("adminStatus");
    if (!el) return;
    el.textContent = message;
    el.className = "status" + (type ? " " + type : "");
  }

  function loginStatus(message, type = "") {
    const el = $("loginStatus");
    if (!el) return;
    el.textContent = message;
    el.className = "status" + (type ? " " + type : "");
  }

  function showLogin() {
    $("loginCard")?.classList.remove("hidden");
    $("panel")?.classList.add("hidden");
  }

  function showPanel() {
    $("loginCard")?.classList.add("hidden");
    $("panel")?.classList.remove("hidden");
  }

  async function sendOTP() {
    const email = $("email").value.trim().toLowerCase();
    if (email !== OWNER_EMAIL.toLowerCase()) {
      loginStatus("این ایمیل اجازه ورود به پنل مدیریت را ندارد.", "error");
      return;
    }

    const btn = $("sendLogin");
    btn.disabled = true;
    loginStatus("در حال ارسال کد ورود...");

    const { error } = await db.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false }
    });

    btn.disabled = false;

    if (error) {
      loginStatus(error.message || "ارسال کد انجام نشد.", "error");
      return;
    }

    $("otpBox").classList.remove("hidden");
    $("changeEmail").classList.remove("hidden");
    loginStatus("کد ورود ارسال شد.", "ok");
    $("otpCode").focus();
  }

  async function verifyOTP() {
    const email = $("email").value.trim().toLowerCase();
    const token = $("otpCode").value.trim();

    if (email !== OWNER_EMAIL.toLowerCase()) {
      loginStatus("این ایمیل اجازه ورود به پنل مدیریت را ندارد.", "error");
      return;
    }
    if (!token) {
      loginStatus("کد ورود را وارد کنید.", "error");
      return;
    }

    $("verifyLogin").disabled = true;
    const { data, error } = await db.auth.verifyOtp({ email, token, type: "email" });
    $("verifyLogin").disabled = false;

    if (error) {
      loginStatus(error.message || "کد ورود صحیح نیست یا منقضی شده است.", "error");
      return;
    }

    if (!ownerEmail(data?.user?.email)) {
      await db.auth.signOut();
      loginStatus("این حساب مالک نیست.", "error");
      return;
    }

    currentUser = data.user;
    showPanel();
    $("who").textContent = "مالک: " + OWNER_EMAIL;
    await loadEverything();
  }

  async function checkSession() {
    const { data, error } = await db.auth.getSession();
    if (error || !data?.session?.user || !ownerEmail(data.session.user.email)) {
      if (data?.session?.user) await db.auth.signOut();
      showLogin();
      return;
    }
    currentUser = data.session.user;
    showPanel();
    $("who").textContent = "مالک: " + OWNER_EMAIL;
    await loadEverything();
  }

  async function logout() {
    await db.auth.signOut();
    currentUser = null;
    $("otpCode").value = "";
    $("otpBox").classList.add("hidden");
    $("changeEmail").classList.add("hidden");
    showLogin();
    loginStatus("از پنل خارج شدید.", "ok");
  }

  function renderLogoPreview(id, url) {
    const box = $(id);
    if (!box) return;
    box.innerHTML = url
      ? `<img src="${esc(url)}" alt="پیش‌نمایش لوگو" onerror="this.style.display='none'">`
      : "";
  }

  async function loadSiteContent() {
    const { data, error } = await db.from("site_content").select("*");
    if (error) {
      status("خطا در دریافت محتوای سایت: " + error.message, "error");
      return;
    }
    siteContent = {};
    (data || []).forEach(row => { siteContent[row.slug] = row; });

    const ash = siteContent.ashayer || {};
    const coop = siteContent.cooperative || {};
    const about = siteContent.about || {};
    const site = siteContent.site || {};

    $("siteTitle").value = site.title || coop.title || "شرکت تعاونی عشایری کوه نور کهگیلویه";
    $("logoRight").value = site.excerpt || "https://s6.uupload.ir/files/picsart_26-08-12_20-56-50-770_ahhz.png";
    $("logoLeft").value = site.body || "https://s6.uupload.ir/files/1786554350546_9ait.png";
    $("siteDate").value = faDate();

    $("ashTitle").value = ash.title || "";
    $("ashExcerpt").value = ash.excerpt || "";
    $("ashBody").value = ash.body || "";

    $("coopTitle").value = coop.title || "";
    $("coopExcerpt").value = coop.excerpt || "";
    $("coopBody").value = coop.body || "";

    $("aboutTitle").value = about.title || "درباره ما";
    $("aboutBody").value = about.body || "این وب‌سایت با هدف اطلاع‌رسانی، انتشار اخبار و رویدادها، معرفی فعالیت‌های شرکت و دسترسی آسان به اسناد و اطلاعات عمومی راه‌اندازی شده است.";

    renderLogoPreview("logoRightPreview", $("logoRight").value);
    renderLogoPreview("logoLeftPreview", $("logoLeft").value);
  }

  async function loadNews() {
    const { data, error } = await db.from("news").select("*").order("created_at", { ascending:false });
    if (error) {
      status("خطا در دریافت اخبار: " + error.message, "error");
      return;
    }
    news = data || [];
    renderNews();
  }

  function renderNews() {
    const box = $("newsAdminList");
    if (!box) return;
    if (!news.length) {
      box.innerHTML = '<p class="hint">هنوز خبری ثبت نشده است.</p>';
      return;
    }
    box.innerHTML = news.map(n => {
      const img = imagesArray(n.images)[0];
      return `<div class="item">
        <div class="item-head">
          <div><div class="item-title">${esc(n.title)}</div><div class="hint">${esc(n.date || "")}</div></div>
          <div class="item-actions">
            <button class="btn light" data-edit-news="${esc(n.id)}" type="button">ویرایش</button>
            <button class="danger-x" data-delete-news="${esc(n.id)}" type="button" title="حذف خبر">×</button>
          </div>
        </div>
        ${img ? `<img src="${esc(img)}" style="width:100%;max-height:240px;object-fit:cover;border-radius:12px" alt="">` : ""}
        <div class="hint" style="margin-top:8px">${esc(n.excerpt || "")}</div>
      </div>`;
    }).join("");
  }

  function openNewsEditor(id = null) {
    editingNewsId = id;
    $("newsEditor").classList.remove("hidden");
    if (!id) {
      $("newsTitle").value = "";
      $("newsExcerpt").value = "";
      $("newsBody").value = "";
      $("newsImages").value = "";
      $("selectedFiles").textContent = "";
      $("newsDate").value = faDate();
    } else {
      const n = news.find(x => String(x.id) === String(id));
      if (!n) return;
      $("newsTitle").value = n.title || "";
      $("newsExcerpt").value = n.excerpt || "";
      $("newsBody").value = n.body || n.text || "";
      $("newsImages").value = "";
      $("selectedFiles").textContent = "تصویر جدید انتخاب نکردی؛ تصاویر قبلی حفظ می‌شوند.";
      $("newsDate").value = n.date || faDate();
    }
    $("newsTitle").focus();
  }

  async function uploadNewsImages(files) {
    const urls = [];
    for (const file of files) {
      const safe = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `news/${Date.now()}-${Math.random().toString(36).slice(2)}-${safe}`;
      const { error } = await db.storage.from("site-media").upload(path, file, { cacheControl:"31536000", upsert:false });
      if (error) throw error;
      const { data } = db.storage.from("site-media").getPublicUrl(path);
      if (data?.publicUrl) urls.push(data.publicUrl);
    }
    return urls;
  }

  async function saveNews() {
    const title = $("newsTitle").value.trim();
    if (!title) {
      status("عنوان خبر را وارد کن.", "error");
      return;
    }

    const files = Array.from($("newsImages").files || []);
    let imageUrls = [];
    try {
      if (files.length) imageUrls = await uploadNewsImages(files);
    } catch (e) {
      status("آپلود تصویر انجام نشد: " + e.message, "error");
      return;
    }

    let payload = {
      title,
      date: editingNewsId ? $("newsDate").value : faDate(),
      excerpt: $("newsExcerpt").value.trim(),
      body: $("newsBody").value.trim(),
      images: imageUrls
    };

    if (editingNewsId && !imageUrls.length) {
      const old = news.find(x => String(x.id) === String(editingNewsId));
      payload.images = imagesArray(old?.images);
    }

    const result = editingNewsId
      ? await db.from("news").update(payload).eq("id", editingNewsId)
      : await db.from("news").insert(payload);

    if (result.error) {
      status("ذخیره خبر انجام نشد: " + result.error.message, "error");
      return;
    }

    $("newsEditor").classList.add("hidden");
    editingNewsId = null;
    await loadNews();
    status("خبر ذخیره شد.", "ok");
  }

  async function deleteNews(id) {
    if (!confirm("این خبر حذف شود؟")) return;
    const { error } = await db.from("news").delete().eq("id", id);
    if (error) {
      status("حذف خبر انجام نشد: " + error.message, "error");
      return;
    }
    news = news.filter(x => String(x.id) !== String(id));
    renderNews();
    status("خبر حذف شد.", "ok");
  }

  async function loadDocs() {
    const { data, error } = await db.from("site_documents").select("*").order("sort_order", { ascending:true });
    if (error) {
      status("خطا در دریافت اسناد: " + error.message, "error");
      return;
    }
    docs = data || [];
    renderDocs();
  }

  function renderDocs() {
    const box = $("docsList");
    if (!docs.length) {
      box.innerHTML = '<p class="hint">هنوز سندی ثبت نشده است.</p>';
      return;
    }
    box.innerHTML = docs.map(d => `<div class="item">
      <div class="item-head">
        <div><div class="item-title">${esc(d.title)}</div><div class="hint">${esc(d.url)}</div></div>
        <div class="item-actions">
          <button class="btn light" data-edit-doc="${esc(d.id)}" type="button">ویرایش</button>
          <button class="danger-x" data-delete-doc="${esc(d.id)}" type="button">×</button>
        </div>
      </div>
    </div>`).join("");
  }

  function openDocEditor(id = null) {
    editingDocId = id;
    $("docEditor").classList.remove("hidden");
    if (!id) {
      $("docTitle").value = "";
      $("docUrl").value = "";
    } else {
      const d = docs.find(x => String(x.id) === String(id));
      if (!d) return;
      $("docTitle").value = d.title || "";
      $("docUrl").value = d.url || "";
    }
    $("docTitle").focus();
  }

  async function saveDoc() {
    const title = $("docTitle").value.trim();
    const url = $("docUrl").value.trim();
    if (!title || !url) {
      status("عنوان و لینک سند را وارد کن.", "error");
      return;
    }
    let result;
    if (editingDocId) {
      result = await db.from("site_documents").update({ title, url, updated_at:new Date().toISOString() }).eq("id", editingDocId);
    } else {
      const max = docs.reduce((m,x) => Math.max(m, Number(x.sort_order || 0)), -1);
      result = await db.from("site_documents").insert({ title, url, sort_order:max+1 });
    }
    if (result.error) {
      status("ذخیره سند انجام نشد: " + result.error.message, "error");
      return;
    }
    $("docEditor").classList.add("hidden");
    editingDocId = null;
    await loadDocs();
    status("سند ذخیره شد.", "ok");
  }

  async function deleteDoc(id) {
    if (!confirm("این سند حذف شود؟")) return;
    const { error } = await db.from("site_documents").delete().eq("id", id);
    if (error) {
      status("حذف سند انجام نشد: " + error.message, "error");
      return;
    }
    docs = docs.filter(x => String(x.id) !== String(id));
    renderDocs();
    status("سند حذف شد.", "ok");
  }

  async function loadButtons() {
    const { data, error } = await db.from("site_buttons").select("*").order("sort_order", { ascending:true });
    if (error) {
      status("خطا در دریافت باتن‌ها: " + error.message, "error");
      return;
    }
    buttons = data || [];
    renderButtons();
  }

  function renderButtons() {
    const box = $("buttonsList");
    if (!buttons.length) {
      box.innerHTML = '<p class="hint">هنوز باتنی ثبت نشده است.</p>';
      return;
    }
    box.innerHTML = buttons.map(b => `<div class="item">
      <div class="item-head">
        <div><div class="item-title">${esc(b.label)}</div><div class="hint">${esc(b.section_slug)} ← ${esc(b.target_value || "")} ${b.enabled === false ? " (خاموش)" : ""}</div></div>
        <div class="item-actions">
          <button class="btn light" data-edit-button="${esc(b.id)}" type="button">ویرایش</button>
          <button class="danger-x" data-delete-button="${esc(b.id)}" type="button">×</button>
        </div>
      </div>
    </div>`).join("");
  }

  function openButtonEditor(id = null) {
    editingButtonId = id;
    $("buttonEditor").classList.remove("hidden");
    if (!id) {
      $("buttonSection").value = "ashayer";
      $("buttonLabel").value = "";
      $("buttonTarget").value = "";
      $("buttonEnabled").checked = true;
    } else {
      const b = buttons.find(x => String(x.id) === String(id));
      if (!b) return;
      $("buttonSection").value = b.section_slug || "ashayer";
      $("buttonLabel").value = b.label || "";
      $("buttonTarget").value = b.target_value || "";
      $("buttonEnabled").checked = b.enabled !== false;
    }
    $("buttonLabel").focus();
  }

  async function saveButton() {
    const section_slug = $("buttonSection").value;
    const label = $("buttonLabel").value.trim();
    const target_value = $("buttonTarget").value.trim();
    const enabled = $("buttonEnabled").checked;
    if (!label) {
      status("متن باتن را وارد کن.", "error");
      return;
    }
    const target_type = /^https?:\/\//i.test(target_value) ? "url" : "content";
    let result;
    if (editingButtonId) {
      result = await db.from("site_buttons").update({
        section_slug, label, target_type, target_value, enabled,
        updated_at:new Date().toISOString()
      }).eq("id", editingButtonId);
    } else {
      const max = buttons.reduce((m,x) => Math.max(m, Number(x.sort_order || 0)), -1);
      result = await db.from("site_buttons").insert({
        section_slug, label, target_type, target_value, enabled, sort_order:max+1
      });
    }
    if (result.error) {
      status("ذخیره باتن انجام نشد: " + result.error.message, "error");
      return;
    }
    $("buttonEditor").classList.add("hidden");
    editingButtonId = null;
    await loadButtons();
    status("باتن ذخیره شد.", "ok");
  }

  async function deleteButton(id) {
    if (!confirm("این باتن حذف شود؟")) return;
    const { error } = await db.from("site_buttons").delete().eq("id", id);
    if (error) {
      status("حذف باتن انجام نشد: " + error.message, "error");
      return;
    }
    buttons = buttons.filter(x => String(x.id) !== String(id));
    renderButtons();
    status("باتن حذف شد.", "ok");
  }

  async function saveAll() {
    if (!currentUser) {
      status("ابتدا وارد پنل شو.", "error");
      return;
    }

    status("در حال ذخیره همه تنظیمات...");

    const sitePayload = {
      slug: "site",
      title: $("siteTitle").value.trim(),
      excerpt: $("logoRight").value.trim(),
      body: $("logoLeft").value.trim()
    };

    const aboutPayload = {
      slug: "about",
      title: $("aboutTitle").value.trim(),
      excerpt: siteContent.about?.excerpt || "",
      body: $("aboutBody").value.trim()
    };

    const ashPayload = {
      slug: "ashayer",
      title: $("ashTitle").value.trim(),
      excerpt: $("ashExcerpt").value.trim(),
      body: $("ashBody").value.trim()
    };

    const coopPayload = {
      slug: "cooperative",
      title: $("coopTitle").value.trim(),
      excerpt: $("coopExcerpt").value.trim(),
      body: $("coopBody").value.trim()
    };

    const jobs = [
      db.from("site_content").upsert(sitePayload, { onConflict:"slug" }),
      db.from("site_content").upsert(aboutPayload, { onConflict:"slug" }),
      db.from("site_content").upsert(ashPayload, { onConflict:"slug" }),
      db.from("site_content").upsert(coopPayload, { onConflict:"slug" })
    ];

    const results = await Promise.all(jobs);
    const bad = results.find(r => r.error);
    if (bad) {
      status("ذخیره تنظیمات انجام نشد: " + bad.error.message, "error");
      return;
    }

    await loadSiteContent();
    status("✓ همه تنظیمات ذخیره شد.", "ok");
    refreshPreview();
  }

  function refreshPreview() {
    const frame = $("previewFrame");
    if (!frame) return;
    frame.src = "index.html?preview=" + Date.now();
  }

  $("sendLogin").onclick = sendOTP;
  $("verifyLogin").onclick = verifyOTP;
  $("changeEmail").onclick = () => {
    $("otpBox").classList.add("hidden");
    $("otpCode").value = "";
    loginStatus("");
    $("email").focus();
  };
  $("logout").onclick = logout;
  $("previewSite").onclick = () => window.open("index.html", "_blank");

  $("addNews").onclick = () => openNewsEditor();
  $("cancelNews").onclick = () => $("newsEditor").classList.add("hidden");
  $("saveNews").onclick = saveNews;

  $("addDoc").onclick = () => openDocEditor();
  $("cancelDoc").onclick = () => $("docEditor").classList.add("hidden");
  $("saveDoc").onclick = saveDoc;

  $("addButton").onclick = () => openButtonEditor();
  $("cancelButton").onclick = () => $("buttonEditor").classList.add("hidden");
  $("saveButton").onclick = saveButton;

  $("saveAll").onclick = saveAll;

  $("newsImages").addEventListener("change", () => {
    const files = Array.from($("newsImages").files || []);
    $("selectedFiles").textContent = files.length ? files.map(f => f.name).join("، ") : "";
  });

  ["logoRight","logoLeft"].forEach(id => {
    $(id).addEventListener("input", () => {
      renderLogoPreview(id === "logoRight" ? "logoRightPreview" : "logoLeftPreview", $(id).value);
    });
  });

  $("newsAdminList").addEventListener("click", e => {
    const edit = e.target.closest("[data-edit-news]");
    const del = e.target.closest("[data-delete-news]");
    if (edit) openNewsEditor(edit.dataset.editNews);
    if (del) deleteNews(del.dataset.deleteNews);
  });

  $("docsList").addEventListener("click", e => {
    const edit = e.target.closest("[data-edit-doc]");
    const del = e.target.closest("[data-delete-doc]");
    if (edit) openDocEditor(edit.dataset.editDoc);
    if (del) deleteDoc(del.dataset.deleteDoc);
  });

  $("buttonsList").addEventListener("click", e => {
    const edit = e.target.closest("[data-edit-button]");
    const del = e.target.closest("[data-delete-button]");
    if (edit) openButtonEditor(edit.dataset.editButton);
    if (del) deleteButton(del.dataset.deleteButton);
  });

  db.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      currentUser = null;
      showLogin();
      return;
    }
    if (session?.user && ownerEmail(session.user.email)) {
      currentUser = session.user;
      showPanel();
    }
  });

  checkSession();
})();
