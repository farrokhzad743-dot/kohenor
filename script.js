(()=>{"use strict";
const c=window.supabaseClient||window.supabase;
if(!c)return;
const $=id=>document.getElementById(id);
let NEWS=[],BUTTONS=[],DOCS=[],CONTENT={};
let currentNews=0, newsTimer=null;

const esc=x=>String(x??"").replace(/[&<>'"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#039;",'"':"&quot;"}[m]));
const text=x=>String(x??"");
const contentVal=(...keys)=>{for(const k of keys){if(CONTENT[k]?.value!=null)return CONTENT[k].value}return""};

function setText(id,value){const el=$(id);if(el)el.textContent=value||""}
function openModal(id){const el=$(id);if(!el)return;el.classList.add("open");el.setAttribute("aria-hidden","false");document.body.classList.add("modal-open")}
function closeModal(id){const el=$(id);if(!el)return;el.classList.remove("open");el.setAttribute("aria-hidden","true");if(!document.querySelector(".modal.open"))document.body.classList.remove("modal-open")}

function renderHeader(){
  const title=contentVal("site_title")||"شرکت تعاونی عشایری کوه نور کهگیلویه";
  document.querySelectorAll(".persian-title").forEach(x=>x.textContent=title);
  const imgs=document.querySelectorAll(".brand-side img");
  if(imgs[0])imgs[0].src=contentVal("logo_left")||imgs[0].src;
  if(imgs[1])imgs[1].src=contentVal("logo_right")||imgs[1].src;
}

function renderContent(){
  setText("ashayerExcerpt",contentVal("ashayer_excerpt"));
  setText("cooperativeExcerpt",contentVal("cooperative_excerpt"));
  const aTitle=contentVal("ashayer_title");if(aTitle)setText("ashayer",aTitle);
  const cTitle=contentVal("cooperative_title");if(cTitle)setText("cooperative",cTitle);
  const aboutTitle=contentVal("about_title");if(aboutTitle)setText("about",aboutTitle);
  const about=document.querySelector("#about .about-card p");if(about)about.textContent=contentVal("about_body")||about.textContent;
  const ah=document.querySelector("#ashayer h2");if(ah)ah.textContent=aTitle||ah.textContent;
  const ch=document.querySelector("#cooperative h2");if(ch)ch.textContent=cTitle||ch.textContent;
  const abh=document.querySelector("#about h2");if(abh)abh.textContent=aboutTitle||abh.textContent;
}

function renderButtons(){
  const wrap=document.querySelector(".quick-menu");if(!wrap)return;
  if(!BUTTONS.length)return;
  wrap.innerHTML=BUTTONS.map(b=>`<button class="menu-card" data-target="${esc(b.target||"")}"><span>${esc(b.label||b.title||"")}</span><b>←</b></button>`).join("");
  wrap.querySelectorAll(".menu-card").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const target=btn.dataset.target||"";
      if(target.startsWith("http"))location.href=target;
      else{const el=document.getElementById(target.replace(/^#/,""));if(el)el.scrollIntoView({behavior:"smooth",block:"start"})}
    });
  });
}

function renderDocs(){
  const tabs=document.querySelector(".document-buttons"),viewer=$("documentViewer");if(!tabs||!viewer)return;
  tabs.innerHTML=DOCS.map((d,i)=>`<button class="document-tab ${i===0?"active":""}" data-doc="${i}">${esc(d.title)}</button>`).join("");
  const show=i=>{
    const d=DOCS[i];if(!d)return;
    viewer.innerHTML=`<div style="padding:18px;text-align:center"><a href="${esc(d.file_url||d.url||"#")}" target="_blank" rel="noopener" style="font-weight:800">${esc(d.title)}</a></div>`;
    tabs.querySelectorAll(".document-tab").forEach((x,j)=>x.classList.toggle("active",j===i));
  };
  tabs.querySelectorAll(".document-tab").forEach((b,i)=>b.addEventListener("click",()=>show(i)));
  if(DOCS.length)show(0);
}

function dateFa(v){
  try{return new Intl.DateTimeFormat("fa-IR",{year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(v))}
  catch{return""}
}

function renderNews(){
  const track=$("newsTrack"),dots=$("newsDots");if(!track)return;
  if(!NEWS.length){track.innerHTML='<div class="news-empty">خبری برای نمایش وجود ندارد.</div>';if(dots)dots.innerHTML="";return}
  track.innerHTML=NEWS.map((n,i)=>`
    <article class="news-card" data-index="${i}">
      <div class="news-image-wrap">${n.image_url?`<img src="${esc(n.image_url)}" alt="${esc(n.title)}">`:"<div class='news-no-image'>تصویر خبر</div>"}</div>
      <div class="news-card-body">
        <div class="news-card-date">${dateFa(n.created_at)}</div>
        <h3>${esc(n.title)}</h3>
        <p>${esc(n.excerpt)}</p>
      </div>
    </article>`).join("");
  if(dots)dots.innerHTML=NEWS.map((_,i)=>`<button class="news-dot ${i===0?"active":""}" data-i="${i}" aria-label="خبر ${i+1}"></button>`).join("");
  track.querySelectorAll(".news-card").forEach(card=>card.addEventListener("click",()=>openArticle(Number(card.dataset.index))));
  dots?.querySelectorAll(".news-dot").forEach(d=>d.addEventListener("click",e=>{e.stopPropagation();showNews(Number(d.dataset.i))}));
  showNews(0);
  clearInterval(newsTimer);if(NEWS.length>1)newsTimer=setInterval(()=>showNews((currentNews+1)%NEWS.length),6000);
}
function showNews(i){
  currentNews=(i+NEWS.length)%NEWS.length;
  const track=$("newsTrack");if(!track)return;
  track.style.transform=`translateX(${currentNews*100}%)`;
  document.querySelectorAll(".news-dot").forEach((d,j)=>d.classList.toggle("active",j===currentNews));
}
function openArticle(i){
  const n=NEWS[i];if(!n)return;
  const body=$("articleContent");if(!body)return;
  body.innerHTML=`<span class="eyebrow">خبر شرکت</span><h2>${esc(n.title)}</h2><div class="article-date">${dateFa(n.created_at)}</div>${n.image_url?`<img src="${esc(n.image_url)}" alt="${esc(n.title)}" style="width:100%;border-radius:20px;margin:16px 0">`:""}<div class="article-text">${esc(n.content||n.excerpt).replace(/\n/g,"<br>")}</div>`;
  openModal("articleModal");
}
function renderAllNews(){
  const list=$("allNewsList");if(!list)return;
  list.innerHTML=NEWS.map((n,i)=>`<button class="all-news-item" data-i="${i}"><strong>${esc(n.title)}</strong><span>${esc(n.excerpt||"")}</span></button>`).join("");
  list.querySelectorAll("[data-i]").forEach(b=>b.addEventListener("click",()=>{closeModal("newsModal");openArticle(Number(b.dataset.i))}));
}

function bindStatic(){
  $("openNews")?.addEventListener("click",()=>{renderAllNews();openModal("newsModal")});
  $("nextNews")?.addEventListener("click",()=>showNews(currentNews+1));
  $("prevNews")?.addEventListener("click",()=>showNews(currentNews-1));
  document.querySelectorAll("[data-close]").forEach(x=>x.addEventListener("click",()=>closeModal(x.dataset.close)));
  document.querySelectorAll(".read-more").forEach(btn=>btn.addEventListener("click",()=>{
    const k=btn.dataset.content;
    const title=k==="ashayer"?contentVal("ashayer_title"):"چگونگی تعاونی";
    const body=k==="ashayer"?contentVal("ashayer_body"):contentVal("cooperative_body");
    const el=$("contentModalBody");if(el)el.innerHTML=`<span class="eyebrow">${esc(title)}</span><h2>${esc(title)}</h2><div class="article-text">${esc(body).replace(/\n/g,"<br>")}</div>`;
    openModal("contentModal");
  }));
  document.addEventListener("keydown",e=>{if(e.key==="Escape")document.querySelectorAll(".modal.open").forEach(m=>closeModal(m.id))});
}

async function init(){
  const [a,n,d,b]=await Promise.all([
    c.from("site_content").select("*"),
    c.from("news").select("*").order("created_at",{ascending:false}),
    c.from("documents").select("*").order("created_at",{ascending:true}),
    c.from("site_buttons").select("*").order("sort_order",{ascending:true})
  ]);
  CONTENT={};(a.data||[]).forEach(x=>CONTENT[x.key]=x);
  NEWS=n.data||[];DOCS=d.data||[];BUTTONS=b.data||[];
  renderHeader();renderContent();renderButtons();renderDocs();renderNews();bindStatic();
  const dateEl=$("iranDate");if(dateEl)dateEl.textContent=new Intl.DateTimeFormat("fa-IR",{year:"numeric",month:"long",day:"numeric"}).format(new Date());
}
init();
})();
