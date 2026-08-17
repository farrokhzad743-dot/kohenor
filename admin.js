(()=>{"use strict";

const OWNER_EMAIL="farrokhzad743@gmail.com";
const $=id=>document.getElementById(id);

const cfg=window.SITE_CONFIG||{};

const c=
  window.supabaseClient ||
  (
    window.supabase?.createClient &&
    cfg.supabaseUrl &&
    cfg.supabaseAnonKey
      ? window.supabase.createClient(
          cfg.supabaseUrl,
          cfg.supabaseAnonKey
        )
      : null
  );

if(c) window.supabaseClient=c;

if(!c){
  document.body.innerHTML=`
    <p style="
      padding:30px;
      font-family:sans-serif;
      direction:rtl;
      text-align:center
    ">
      اتصال به Supabase پیدا نشد.
    </p>
  `;
  return;
}

let S={
  news:[],
  buttons:[],
  docs:[],
  content:{}
};


/* =========================
   ابزارهای عمومی
========================= */

const isOwner=u=>
  String(u?.email||"")
    .trim()
    .toLowerCase()===OWNER_EMAIL;


const setMsg=(id,text,bad=false)=>{
  const el=$(id);

  if(!el)return;

  el.textContent=text;

  el.style.color=
    bad
      ? "#d92d3a"
      : "#16703c";
};


const hide=()=>{
  $("panelView")?.classList.add("hidden");
  $("loginView")?.classList.remove("hidden");
};


const show=async()=>{
  $("loginView")?.classList.add("hidden");
  $("panelView")?.classList.remove("hidden");

  await load();
};


const esc=x=>
  String(x??"").replace(
    /[&<>'"]/g,
    m=>({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      "'":"&#039;",
      '"':"&quot;"
    }[m])
  );


const today=()=>{
  return new Intl.DateTimeFormat(
    "fa-IR",
    {
      year:"numeric",
      month:"long",
      day:"numeric"
    }
  ).format(new Date());
};


/* =========================
   ورود مالک
========================= */

async function session(){

  const {data,error}=await c.auth.getSession();

  if(error){
    hide();
    return;
  }

  if(isOwner(data.session?.user)){
    await show();
  }else{
    hide();
  }
}


async function send(){

  const e=
    $("emailInput")
      .value
      .trim()
      .toLowerCase();

  if(e!==OWNER_EMAIL){

    setMsg(
      "loginMsg",
      "این ایمیل اجازه ورود به پنل مدیریت را ندارد.",
      true
    );

    return;
  }


  setMsg(
    "loginMsg",
    "در حال ارسال کد..."
  );


  const {error}=await c.auth.signInWithOtp({

    email:e,

    options:{
      shouldCreateUser:true
    }

  });


  if(error){

    setMsg(
      "loginMsg",
      "خطا در ارسال کد: "+error.message,
      true
    );

    return;
  }


  $("otpBox")?.classList.remove("hidden");

  $("resendOtp")?.classList.remove("hidden");


  setMsg(
    "loginMsg",
    "کد ورود به ایمیل مالک ارسال شد."
  );
}


async function verify(){

  const e=
    $("emailInput")
      .value
      .trim()
      .toLowerCase();

  const token=
    $("otpInput")
      .value
      .trim();


  if(e!==OWNER_EMAIL){

    setMsg(
      "loginMsg",
      "این ایمیل اجازه ورود به پنل مدیریت را ندارد.",
      true
    );

    return;
  }


  if(!token){

    setMsg(
      "loginMsg",
      "کد ورود را وارد کنید.",
      true
    );

    return;
  }


  setMsg(
    "loginMsg",
    "در حال بررسی کد..."
  );


  const {data,error}=
    await c.auth.verifyOtp({

      email:e,

      token:token,

      type:"email"

    });


  if(error){

    setMsg(
      "loginMsg",
      "کد ورود صحیح نیست یا منقضی شده است.",
      true
    );

    return;
  }


  if(!isOwner(data.user)){

    await c.auth.signOut();

    setMsg(
      "loginMsg",
      "این حساب مالک نیست.",
      true
    );

    return;
  }


  await show();
}


/* =========================
   خواندن اطلاعات سایت
========================= */

async function load(){

  setMsg("saveMsg","");


  const [
    contentResult,
    newsResult,
    docsResult,
    buttonsResult
  ]=await Promise.all([

    c
      .from("site_content")
      .select("*"),

    c
      .from("news")
      .select("*")
      .order(
        "created_at",
        {
          ascending:false
        }
      ),

    c
      .from("documents")
      .select("*")
      .order(
        "created_at",
        {
          ascending:true
        }
      ),

    c
      .from("site_buttons")
      .select("*")
      .order(
        "sort_order",
        {
          ascending:true
        }
      )

  ]);


  if(
    contentResult.error ||
    newsResult.error ||
    docsResult.error ||
    buttonsResult.error
  ){

    const error=
      contentResult.error ||
      newsResult.error ||
      docsResult.error ||
      buttonsResult.error;


    setMsg(
      "saveMsg",
      "خطا در خواندن اطلاعات: "+error.message,
      true
    );

    return;
  }


  S.content={};


  (contentResult.data||[])
    .forEach(x=>{
      S.content[x.key]=x;
    });


  S.news=
    newsResult.data||[];


  S.docs=
    docsResult.data||[];


  S.buttons=
    buttonsResult.data||[];


  $("siteTitle").value=
    S.content.site_title?.value ||
    "شرکت تعاونی عشایری کوه نور کهگیلویه";


  $("siteDate").value=today();


  $("logoRight").value=
    S.content.logo_right?.value||"";


  $("logoLeft").value=
    S.content.logo_left?.value||"";


  $("ashayerTitle").value=
    S.content.ashayer_title?.value ||
    "عشایر؛ سرمایه ملّی";


  $("ashayerExcerpt").value=
    S.content.ashayer_excerpt?.value||"";


  $("ashayerBody").value=
    S.content.ashayer_body?.value||"";


  $("coopTitle").value=
    S.content.cooperative_title?.value ||
    "چگونگی تعاونی";


  $("coopExcerpt").value=
    S.content.cooperative_excerpt?.value||"";


  $("coopBody").value=
    S.content.cooperative_body?.value||"";


  $("aboutTitle").value=
    S.content.about_title?.value ||
    "درباره ما";


  $("aboutBody").value=
    S.content.about_body?.value||"";


  render();
}


/* =========================
   نمایش پنل
========================= */

function render(){

  if($("titlePreview")){

    $("titlePreview").textContent=
      $("siteTitle").value ||
      "شرکت تعاونی عشایری کوه نور کهگیلویه";
  }


  if($("leftPreview")){

    $("leftPreview").src=
      $("logoLeft").value||"";
  }


  if($("rightPreview")){

    $("rightPreview").src=
      $("logoRight").value||"";
  }


  /* ---------- اخبار ---------- */

  $("newsList").innerHTML=

    S.news.map((n,i)=>`

      <div class="item">

        <div class="item-head">

          <div>
            <span class="item-index">
              خبر ${i+1}
            </span>
          </div>

          <button
            class="delete-x"
            data-del-news="${esc(n.id)}"
            title="حذف خبر"
          >
            ×
          </button>

        </div>


        <div class="news-admin-card">

          <div class="field">

            <label>
              تصویر خبر — URL
            </label>

            <input
              data-n="${esc(n.id)}"
              data-k="image_url"
              value="${esc(n.image_url)}"
              placeholder="https://..."
            >

          </div>


          ${
            n.image_url
              ? `
                <img
                  class="news-cover"
                  src="${esc(n.image_url)}"
                  alt=""
                >
              `
              :""
          }


          <div class="grid">

            <div class="field">

              <label>
                عنوان خبر
              </label>

              <input
                data-n="${esc(n.id)}"
                data-k="title"
                value="${esc(n.title)}"
              >

            </div>


            <div class="field">

              <label>
                خلاصه خبر
              </label>

              <textarea
                data-n="${esc(n.id)}"
                data-k="excerpt"
              >${esc(n.excerpt)}</textarea>

            </div>


            <div
              class="field full"
            >

              <label>
                متن کامل خبر
              </label>

              <textarea
                data-n="${esc(n.id)}"
                data-k="content"
              >${esc(n.content)}</textarea>

            </div>

          </div>

        </div>

      </div>

    `).join("")

    ||

    `
      <p class="section-note">
        هنوز خبری ثبت نشده است.
      </p>
    `;


  /* ---------- باتن‌ها ---------- */

  $("buttonsList").innerHTML=

    S.buttons.map((b,i)=>`

      <div class="item">

        <div class="item-head">

          <div>

            <span class="item-index">
              باتن ${i+1}
            </span>

          </div>


          <button
            class="delete-x"
            data-del-button="${esc(b.id)}"
            title="حذف باتن"
          >
            ×
          </button>

        </div>


        <div class="grid">

          <div class="field">

            <label>
              متن باتن
            </label>

            <input
              data-b="${esc(b.id)}"
              data-k="label"
              value="${esc(b.label||b.title)}"
            >

          </div>


          <div class="field">

            <label>
              مقصد / شناسه بخش یا URL
            </label>

            <input
              data-b="${esc(b.id)}"
              data-k="target"
              value="${esc(b.target)}"
            >

          </div>

        </div>

      </div>

    `).join("")

    ||

    `
      <p class="section-note">
        هنوز باتنی ثبت نشده است.
      </p>
    `;


  /* ---------- اسناد ---------- */

  $("docsList").innerHTML=

    S.docs.map((d,i)=>`

      <div class="item">

        <div class="item-head">

          <div>

            <span class="item-index">
              سند ${i+1}
            </span>

          </div>


          <button
            class="delete-x"
            data-del-doc="${esc(d.id)}"
            title="حذف سند"
          >
            ×
          </button>

        </div>


        <div class="grid">

          <div class="field">

            <label>
              عنوان سند
            </label>

            <input
              data-d="${esc(d.id)}"
              data-k="title"
              value="${esc(d.title)}"
            >

          </div>


          <div class="field">

            <label>
              لینک فایل / URL
            </label>

            <input
              data-d="${esc(d.id)}"
              data-k="file_url"
              value="${esc(d.file_url||d.url||"")}"
              placeholder="https://..."
            >

          </div>

        </div>

      </div>

    `).join("")

    ||

    `
      <p class="section-note">
        هنوز سندی ثبت نشده است.
      </p>
    `;
}


/* =========================
   هماهنگ کردن فرم با حافظه
========================= */

function sync(){

  document
    .querySelectorAll("[data-n]")
    .forEach(x=>{

      const o=
        S.news.find(
          v=>String(v.id)===x.dataset.n
        );

      if(o){

        o[x.dataset.k]=x.value;

      }

    });


  document
    .querySelectorAll("[data-b]")
    .forEach(x=>{

      const o=
        S.buttons.find(
          v=>String(v.id)===x.dataset.b
        );

      if(o){

        o[x.dataset.k]=x.value;

      }

    });


  document
    .querySelectorAll("[data-d]")
    .forEach(x=>{

      const o=
        S.docs.find(
          v=>String(v.id)===x.dataset.d
        );

      if(o){

        o[x.dataset.k]=x.value;

      }

    });

}


/* =========================
   ذخیره محتوای عمومی
========================= */

async function upsertContent(
  key,
  value
){

  const old=
    S.content[key];


  if(old?.id){

    return await c
      .from("site_content")
      .update({
        value
      })
      .eq(
        "id",
        old.id
      );

  }


  return await c
    .from("site_content")
    .insert({
      key,
      value
    });

}


/* =========================
   ذخیره کل پنل
========================= */

async function save(){

  sync();

  setMsg(
    "saveMsg",
    "در حال ذخیره تغییرات..."
  );


  const jobs=[];


  const values={

    site_title:
      $("siteTitle").value,

    logo_right:
      $("logoRight").value,

    logo_left:
      $("logoLeft").value,

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
      $("aboutBody").value

  };


  for(
    const [k,v]
    of Object.entries(values)
  ){

    jobs.push(
      upsertContent(k,v)
    );

  }


  /* اخبار */

  for(
    const n
    of S.news
  ){

    const x={

      title:n.title,

      excerpt:n.excerpt,

      content:n.content,

      image_url:n.image_url

    };


    jobs.push(

      n._new

        ? c
            .from("news")
            .insert(x)

        : c
            .from("news")
            .update(x)
            .eq("id",n.id)

    );

  }


  /* باتن‌ها */

  for(
    const b
    of S.buttons
  ){

    const x={

      label:b.label,

      target:b.target,

      sort_order:
        S.buttons.indexOf(b)

    };


    jobs.push(

      b._new

        ? c
            .from("site_buttons")
            .insert(x)

        : c
            .from("site_buttons")
            .update(x)
            .eq("id",b.id)

    );

  }


  /* اسناد */

  for(
    const d
    of S.docs
  ){

    const x={

      title:d.title,

      file_url:d.file_url

    };


    jobs.push(

      d._new

        ? c
            .from("documents")
            .insert(x)

        : c
            .from("documents")
            .update(x)
            .eq("id",d.id)

    );

  }


  const results=
    await Promise.all(jobs);


  const bad=
    results.find(
      r=>r.error
    );


  if(bad){

    setMsg(
      "saveMsg",
      "خطا: "+bad.error.message,
      true
    );

    return;
  }


  setMsg(
    "saveMsg",
    "✓ همه تغییرات با موفقیت ذخیره شد."
  );


  await load();


  setTimeout(
    ()=>{
      setMsg(
        "saveMsg",
        ""
      );
    },
    3500
  );

}


/* =========================
   حذف خبر
========================= */

async function deleteNews(id){

  if(
    String(id).startsWith("new-")
  ){

    S.news=
      S.news.filter(
        x=>String(x.id)!==String(id)
      );

    render();

    return;
  }


  const {error}=
    await c
      .from("news")
      .delete()
      .eq("id",id);


  if(error){

    setMsg(
      "saveMsg",
      "خطا در حذف خبر: "+error.message,
      true
    );

    return;
  }


  S.news=
    S.news.filter(
      x=>String(x.id)!==String(id)
    );


  render();


  setMsg(
    "saveMsg",
    "خبر حذف شد."
  );

}


/* =========================
   حذف باتن
========================= */

async function deleteButton(id){

  if(
    String(id).startsWith("new-")
  ){

    S.buttons=
      S.buttons.filter(
        x=>String(x.id)!==String(id)
      );

    render();

    return;
  }


  const {error}=
    await c
      .from("site_buttons")
      .delete()
      .eq("id",id);


  if(error){

    setMsg(
      "saveMsg",
      "خطا در حذف باتن: "+error.message,
      true
    );

    return;
  }


  S.buttons=
    S.buttons.filter(
      x=>String(x.id)!==String(id)
    );


  render();


  setMsg(
    "saveMsg",
    "باتن حذف شد."
  );

}


/* =========================
   حذف سند
========================= */

async function deleteDoc(id){

  if(
    String(id).startsWith("new-")
  ){

    S.docs=
      S.docs.filter(
        x=>String(x.id)!==String(id)
      );

    render();

    return;
  }


  const {error}=
    await c
      .from("documents")
      .delete()
      .eq("id",id);


  if(error){

    setMsg(
      "saveMsg",
      "خطا در حذف سند: "+error.message,
      true
    );

    return;
  }


  S.docs=
    S.docs.filter(
      x=>String(x.id)!==String(id)
    );


  render();


  setMsg(
    "saveMsg",
    "سند حذف شد."
  );

}


/* =========================
   افزودن خبر
========================= */

function addNews(){

  S.news.unshift({

    id:"new-"+Date.now(),

    title:"خبر جدید",

    excerpt:"",

    content:"",

    image_url:"",

    _new:true

  });


  render();


  window.scrollTo({

    top:document.body.scrollHeight,

    behavior:"smooth"

  });

}


/* =========================
   افزودن باتن
========================= */

function addButton(){

  S.buttons.push({

    id:"new-"+Date.now(),

    label:"باتن جدید",

    target:"",

    _new:true

  });


  render();


  window.scrollTo({

    top:document.body.scrollHeight,

    behavior:"smooth"

  });

}


/* =========================
   افزودن سند
========================= */

function addDoc(){

  S.docs.push({

    id:"new-"+Date.now(),

    title:"سند جدید",

    file_url:"",

    _new:true

  });


  render();


  window.scrollTo({

    top:document.body.scrollHeight,

    behavior:"smooth"

  });

}


/* =========================
   دکمه‌های پنل
========================= */

$("sendOtp").onclick=send;

$("resendOtp").onclick=send;

$("verifyOtp").onclick=verify;


$("logout").onclick=
  async()=>{
    await c.auth.signOut();
    hide();
  };


if($("viewSite")){

  $("viewSite").onclick=
    ()=>{
      location.href="/";
    };

}


$("addNews").onclick=addNews;

if($("addNewsBottom"))
  $("addNewsBottom").onclick=addNews;


$("addButton").onclick=addButton;

if($("addButtonBottom"))
  $("addButtonBottom").onclick=addButton;


$("addDoc").onclick=addDoc;

if($("addDocBottom"))
  $("addDocBottom").onclick=addDoc;


$("saveAll").onclick=save;


/* =========================
   پیش‌نمایش زنده هدر
========================= */

$("siteTitle")?.addEventListener(
  "input",
  ()=>{
    if($("titlePreview"))
      $("titlePreview").textContent=
        $("siteTitle").value;
  }
);


$("logoLeft")?.addEventListener(
  "input",
  ()=>{
    if($("leftPreview"))
      $("leftPreview").src=
        $("logoLeft").value;
  }
);


$("logoRight")?.addEventListener(
  "input",
  ()=>{
    if($("rightPreview"))
      $("rightPreview").src=
        $("logoRight").value;
  }
);


/* =========================
   حذف‌ها
========================= */

document.addEventListener(
  "click",
  e=>{

    if(e.target.dataset.delNews){

      deleteNews(
        e.target.dataset.delNews
      );

    }


    if(e.target.dataset.delButton){

      deleteButton(
        e.target.dataset.delButton
      );

    }


    if(e.target.dataset.delDoc){

      deleteDoc(
        e.target.dataset.delDoc
      );

    }

  }
);


/* =========================
   وضعیت ورود
========================= */

c.auth.onAuthStateChange(
  (event,sessionUser)=>{

    if(event==="SIGNED_OUT"){

      hide();

    }

    else if(
      event==="SIGNED_IN" &&
      isOwner(sessionUser?.user)
    ){

      show();

    }

  }
);


/* =========================
   شروع
========================= */

session();

})();
