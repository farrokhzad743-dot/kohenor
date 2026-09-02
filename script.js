(() => {
'use strict';

const FALLBACK_CONTENT={
 ashayer:{title:'عشایر؛ سرمایه ملّی',excerpt:'جامعه عشایری ایران یکی از ارزشمندترین بخش‌های اجتماعی، فرهنگی و اقتصادی کشور است؛ جامعه‌ای که در تولید، حفظ میراث فرهنگی و ارتباط پایدار با سرزمین نقش مهمی دارد.',body:'جامعه عشایری ایران یکی از ارزشمندترین بخش‌های اجتماعی، فرهنگی و اقتصادی کشور است؛ جامعه‌ای که در طول تاریخ، پیوندی عمیق و ناگسستنی با سرزمین، طبیعت، تولید و فرهنگ ایرانی داشته و بخش مهمی از هویت تاریخی و اجتماعی ایران را شکل داده است. عشایر تنها یک شیوه زندگی یا یک جامعه کوچ‌رو نیستند، بلکه مجموعه‌ای از ظرفیت‌های انسانی، اقتصادی، فرهنگی و زیست‌محیطی را در خود جای داده‌اند که حفظ، تقویت و حمایت از آن‌ها، بخشی از صیانت از سرمایه‌های ملی کشور به شمار می‌رود.'},
 cooperative:{title:'چگونگی تعاونی',excerpt:'تعاونی، سازوکاری برای مشارکت افراد دارای نیازها و اهداف مشترک است؛ تعاونی عشایری نیز با سازمان‌دهی ظرفیت اعضا، تأمین نیازها، ارائه خدمات و تقویت تولید و بازار به جامعه عشایری کمک می‌کند.',body:'تعاونی یکی از مهم‌ترین شیوه‌های سازمان‌دهی اقتصادی و اجتماعی بر پایه مشارکت افراد است. در ساختار تعاونی، اشخاصی که دارای نیازها، منافع یا اهداف مشترک هستند، با گردهم آمدن و مشارکت در سرمایه و تصمیم‌گیری، تلاش می‌کنند بخشی از نیازهای اقتصادی و اجتماعی خود را به صورت جمعی تأمین کنند. تعاونی عشایری نیز با توجه به شرایط زندگی عشایری، پراکندگی جغرافیایی و نیاز به نهاده‌ها و خدمات، نقش مهمی در سامان‌دهی خدمات و تقویت توان اقتصادی اعضا دارد.'},
 about:{title:'درباره ما',body:'این وب‌سایت با هدف اطلاع‌رسانی، انتشار اخبار و رویدادها، معرفی فعالیت‌های شرکت و دسترسی آسان به اسناد و اطلاعات عمومی راه‌اندازی شده است.'}
};

const FALLBACK_NEWS=[
 {date:'۱۴۰۴/۱۰/۲۱',title:'تصویب اساسنامه جدید شرکت تعاونی عشایری کوه نور دهدشت',text:'جلسه مجمع عمومی فوق‌العاده شرکت با حضور اکثریت اعضا برگزار و اساسنامه جدید به تصویب رسید.',body:'جلسه مجمع عمومی بطور فوق العاده شرکت تعاونی عشایری کوه نور دهدشت در تاریخ 1400/10/21 رأس ساعت 16 در محل شرکت واقع در دهدشت با حضور اکثریت اعضاء برگزار گردید. در این جلسه اساسنامه جدید شرکت با 70 ماده و 51 تبصره و 135 بند به تصویب اعضاء مجمع رسیده است.',images:['https://ibb.co/CshY940f','https://ibb.co/0jY0Tb1w','https://ibb.co/mwP9bFG','https://ibb.co/ym0yVZRP','https://ibb.co/7xMBt8Qk','https://ibb.co/gLQ3PjL5','https://ibb.co/TDjQS272','https://ibb.co/0yqTRHvK','https://ibb.co/24yPXMN','https://ibb.co/Kct64y74','https://ibb.co/TDh9XPyV']},
 {date:'۲۱/۹/۱۴۰۴',title:'توزیع نفت سفید به عشایر حوزه',text:'توزیع نفت سفید به عشایر محترم حوزه در محوطه شرکت انجام شد.',body:'توزیع نفت سفید به عشایر محترم حوزه در محوطهٔ شرکت انجام شد.',images:['https://ibb.co/S7r9KY64','https://ibb.co/KcRShWN5']},
 {date:'۲۹/۱۲/۱۴۰۳',title:'برگزاری مجمع عمومی عادی سالیانه شرکت',text:'جلسه مجمع عمومی عادی سالیانه شرکت تعاونی عشایری کوه نور دهدشت با حضور اکثریت اعضاء برگزار گردید.',body:'جلسه مجمع عمومی عادی سالیانه سال مالی منتهی به 1403/12/29 شرکت تعاونی عشایری کوه نور دهدشت با حضور اکثریت اعضاء برگزار گردید. در این جلسه صورتهای مالی سال 1403 به تصویب اعضاء مجمع رسید.',images:['https://ibb.co/XrpwsJ9b','https://ibb.co/jZ11bjH6','https://ibb.co/WvZ3zLCH','https://ibb.co/kVxXv4ZL','https://ibb.co/Zpz2hFkS','https://ibb.co/Q7NrB892']},
 {date:'۱۴۰۴',title:'تداوم خدمات آبرسانی و پشتیبانی از عشایر شهرستان کهگیلویه',text:'خدمات آبرسانی سیار و توزیع اقلام مورد نیاز عشایر شهرستان کهگیلویه به صورت مستمر انجام می‌شود.',body:'خدمات آبرسانی سیار با تانکر به عشایر شهرستان کهگیلویه توسط شرکت تعاونی عشایری کوه نور دهدشت به صورت مستمر صورت می پذیرد. آقای پروره مدیرعامل تعاونی عشایری کوه نور دهدشت در همین راستا بیان کردند که طی سال 1404 قریب به 1500 سرویس 12000 لیتری آب شرب با تانکر سیار تحویل عشایر شهرستان کهگیلویه گردیده است. وی افزود سال 1404 خدماتی اعم از توزیع آرد، علوفه دامی، توزیع نفت سفید، توزیع سیلندر گاز مایع و...... به صورت مستمر در اختیار عشایر تحت پوشش و سهامدار شرکت تعاونی قرار گرفته است.',images:['https://ibb.co/xKWHYsJr','https://ibb.co/QFVJcQVQ','https://ibb.co/Rp2sWYQK','https://ibb.co/ycZD71PH','https://ibb.co/fV3Kdp6c','https://ibb.co/Zz5hgxk6','https://ibb.co/Y7rBLBWM']}
];

const FALLBACK_DOCS=[
 {title:'استعلام شناسه ملی',url:'https://ibb.co/W4nDjgT1'},
 {title:'ثبت شرکت در دهدشت',url:'https://ibb.co/Z6NZyJcy'},
 {title:'آگهی تأسیس',url:'https://ibb.co/d0t1nDCd'},
 {title:'اساسنامه',url:'asname.pdf',kind:'pdf'}
];

const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[m]));
const parseList=v=>{if(Array.isArray(v))return v.filter(Boolean);if(!v)return[];try{const x=JSON.parse(v);if(Array.isArray(x))return x.filter(Boolean)}catch{}return String(v).split(/\r?\n|,/).map(x=>x.trim()).filter(Boolean)};
const cfg=window.SITE_CONFIG||{};
const sb=(window.supabase&&cfg.supabaseUrl&&cfg.supabaseAnonKey)?window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey):null;
let news=[...FALLBACK_NEWS],docs=[...FALLBACK_DOCS],content=JSON.parse(JSON.stringify(FALLBACK_CONTENT)),activeNews=0,timer=null;

function normalizeNews(n){
 const images=parseList(n.images||n.image_urls||n.image_url||n.photo_url);
 return {id:n.id,date:n.date||n.publish_date||dateFa(n.created_at)||'',title:n.title||'خبر شرکت تعاونی',text:n.excerpt||n.text||n.summary||'',body:n.body||n.content||n.text||n.excerpt||'',images};
}
function dateFa(v){if(!v)return'';try{return new Intl.DateTimeFormat('fa-IR-u-ca-persian',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:'Asia/Tehran'}).format(new Date(v))}catch{return''}}
function mediaUrl(u){u=String(u||'').trim();if(!u)return'';if(/^https?:\/\/ibb\.co\//i.test(u)){return 'https://image.thum.io/get/width/1200/crop/1000/noanimate/'+u}return u}
function isImage(u){return /\.(jpe?g|png|gif|webp|avif)(\?.*)?$/i.test(u)||/^https:\/\/i\.ibb\.co\//i.test(u)}
function isPdf(u){return /\.pdf(\?.*)?$/i.test(u)}
function openModal(id){const m=$(id);if(!m)return;m.classList.add('open');m.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function closeModal(id){const m=$(id);if(!m)return;m.classList.remove('open');m.setAttribute('aria-hidden','true');document.body.style.overflow=''}

function renderNews(){
 const track=$('newsTrack'),dots=$('newsDots'),all=$('allNewsList');if(!track)return;
 track.innerHTML=news.map((n,i)=>{const first=n.images?.[0];return `<article class="news-card" data-index="${i}"><div class="news-cover">${first?`<img src="${esc(mediaUrl(first))}" alt="${esc(n.title)}" loading="lazy" onerror="this.onerror=null;this.parentElement.innerHTML='<span aria-hidden=\"true\">✦</span>'">`:'<span aria-hidden="true">✦</span>'}</div><div class="news-body"><time class="news-date">${esc(n.date)}</time><h3>${esc(n.title)}</h3><p>${esc(n.text)}</p></div></article>`}).join('');
 dots.innerHTML=news.map((_,i)=>`<button aria-label="نمایش خبر ${i+1}" data-dot="${i}" class="${i===0?'active':''}"></button>`).join('');
 all.innerHTML=news.map((n,i)=>`<button class="all-news-item" data-index="${i}"><div><time>${esc(n.date)}</time><h3>${esc(n.title)}</h3><p>${esc(n.text)}</p></div><span>←</span></button>`).join('');
 track.querySelectorAll('.news-card').forEach(c=>c.addEventListener('click',()=>showArticle(Number(c.dataset.index))));
 dots.querySelectorAll('[data-dot]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();goToNews(Number(b.dataset.dot))}));
 showNews(0);restartTimer();
}
function showArticle(i){const n=news[i];if(!n)return;const gallery=(n.images||[]).map((src,j)=>`<div class="article-media"><img src="${esc(mediaUrl(src))}" alt="${esc(n.title)} - تصویر ${j+1}" loading="lazy" onerror="this.parentElement.innerHTML='<a href="${esc(src)}" target="_blank" rel="noopener">مشاهده تصویر ${j+1}</a>'"></div>`).join('');$('articleContent').innerHTML=`<span class="eyebrow">خبر</span><h2>${esc(n.title)}</h2><div class="article-meta">${esc(n.date)}</div>${gallery?`<div class="article-gallery">${gallery}</div>`:''}<div class="article-text">${esc(n.body).replace(/\n/g,'<br>')}</div>`;openModal('articleModal')}
function showContent(slug){const c=content[slug];if(!c)return;$('contentModalBody').innerHTML=`<span class="eyebrow">معرفی</span><h2>${esc(c.title)}</h2><div class="article-text">${esc(c.body).replace(/\n/g,'<br>')}</div>`;openModal('contentModal')}
function showNews(i){if(!news.length)return;activeNews=(i+news.length)%news.length;const track=$('newsTrack');const card=track?.querySelector(`[data-index="${activeNews}"]`);if(card)track.scrollTo({left:card.offsetLeft-(track.clientWidth-card.offsetWidth)/2,behavior:'smooth'});$('newsDots')?.querySelectorAll('button').forEach((b,j)=>b.classList.toggle('active',j===activeNews))}
function goToNews(i){showNews(i);restartTimer()}
function restartTimer(){clearInterval(timer);if(news.length>1)timer=setInterval(()=>showNews(activeNews+1),6000)}

function renderDocs(){
 const tabs=$('documentButtons'),viewer=$('documentViewer');if(!tabs||!viewer)return;
 tabs.innerHTML=docs.map((d,i)=>`<button class="document-tab ${i===0?'active':''}" data-doc="${i}">${esc(d.title)}</button>`).join('');
 const show=i=>{const d=docs[i];if(!d)return;const u=d.url||d.file_url||'';let html='';if(isPdf(u)){html=`<iframe src="${esc(u)}" title="${esc(d.title)}" style="width:100%;min-height:760px;border:0;border-radius:18px;background:#fff"></iframe><p style="text-align:center"><a href="${esc(u)}" target="_blank" rel="noopener">باز کردن فایل PDF</a></p>`}else if(isImage(u)){html=`<img src="${esc(mediaUrl(u))}" alt="${esc(d.title)}" style="width:100%;height:auto;display:block;border-radius:18px" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><p style="display:none;text-align:center"><a href="${esc(u)}" target="_blank" rel="noopener">مشاهده سند</a></p>`}else if(/^https?:\/\/ibb\.co\//i.test(u)){html=`<iframe src="${esc(u)}" title="${esc(d.title)}" style="width:100%;min-height:760px;border:0;border-radius:18px;background:#fff"></iframe>`}else{html=`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(d.title)}</a>`}viewer.innerHTML=html;tabs.querySelectorAll('.document-tab').forEach((b,j)=>b.classList.toggle('active',j===i))};
 tabs.querySelectorAll('.document-tab').forEach((b,i)=>b.addEventListener('click',()=>show(i)));show(0);
}

function renderIranDate(){const el=$('iranDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('fa-IR-u-ca-persian',{year:'numeric',month:'long',day:'numeric',timeZone:'Asia/Tehran'}).format(new Date())}catch{el.textContent=new Date().toLocaleDateString('fa-IR')}}
function bind(){
 $('openNews')?.addEventListener('click',()=>openModal('newsModal'));
 $('nextNews')?.addEventListener('click',()=>goToNews(activeNews+1));$('prevNews')?.addEventListener('click',()=>goToNews(activeNews-1));
 $('allNewsList')?.addEventListener('click',e=>{const b=e.target.closest('[data-index]');if(b){closeModal('newsModal');showArticle(Number(b.dataset.index))}});
 document.querySelectorAll('.menu-card').forEach(b=>b.addEventListener('click',()=>$(b.dataset.target)?.scrollIntoView({behavior:'smooth',block:'start'})));
 document.querySelectorAll('.read-more').forEach(b=>b.addEventListener('click',()=>showContent(b.dataset.content)));
 document.addEventListener('click',e=>{const c=e.target.closest('[data-close]');if(c)closeModal(c.dataset.close)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')['newsModal','articleModal','contentModal'].forEach(closeModal);if(e.key==='ArrowLeft')goToNews(activeNews+1);if(e.key==='ArrowRight')goToNews(activeNews-1)});
 renderIranDate();setInterval(renderIranDate,60000);
}
async function loadRemote(){
 if(!sb)return;
 try{
  const cRes=await sb.from('site_content').select('*');
  if(!cRes.error){for(const r of cRes.data||[]){const key=r.slug||r.key;if(!key)continue;if(key==='ashayer'||key==='cooperative'||key==='about')content[key]={...content[key],...r}}}
  const nRes=await sb.from('news').select('*').order('created_at',{ascending:false});
  if(!nRes.error&&Array.isArray(nRes.data)&&nRes.data.length){const remote=nRes.data.map(normalizeNews);news=remote.map(r=>{const f=FALLBACK_NEWS.find(x=>x.title===r.title||x.date===r.date);return {...(f||{}),...r,images:r.images.length?r.images:(f?.images||[]),text:r.text||f?.text||'',body:r.body||f?.body||''}})}
  const dRes=await sb.from('site_documents').select('*').order('sort_order',{ascending:true});
  if(!dRes.error&&Array.isArray(dRes.data)&&dRes.data.length)docs=dRes.data.map(d=>({id:d.id,title:d.title,url:d.url||d.file_url||d.document_url||''}));
 }catch(e){console.warn('Supabase unavailable; fallback content kept.',e)}
 document.querySelector('#ashayerExcerpt').textContent=content.ashayer.excerpt||'';document.querySelector('#cooperativeExcerpt').textContent=content.cooperative.excerpt||'';renderNews();renderDocs();
}

renderNews();renderDocs();bind();loadRemote();
})();
