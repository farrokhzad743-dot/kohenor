/* =========================================================
   KOHENOR — SUPABASE SCHEMA
   Safe / Idempotent version
   ========================================================= */

create extension if not exists pgcrypto;


/* =========================================================
   SITE CONTENT
   ========================================================= */

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null default '',
  excerpt text not null default '',
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists site_content_slug_unique
on public.site_content(slug);


/* =========================================================
   NEWS
   ========================================================= */

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  date text not null default '',
  excerpt text not null default '',
  body text not null default '',
  text text not null default '',
  images jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


/* =========================================================
   DOCUMENTS
   ========================================================= */

create table if not exists public.site_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  url text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


/* =========================================================
   HOME BUTTONS
   ========================================================= */

create table if not exists public.site_buttons (
  id uuid primary key default gen_random_uuid(),
  section_slug text not null default 'ashayer',
  label text not null default '',
  target_type text not null default 'content',
  target_value text not null default '',
  enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


/* =========================================================
   COMPATIBILITY COLUMNS
   If an older version of the database already exists,
   add missing columns without destroying existing data.
   ========================================================= */

alter table public.site_content
  add column if not exists title text not null default '';

alter table public.site_content
  add column if not exists excerpt text not null default '';

alter table public.site_content
  add column if not exists body text not null default '';

alter table public.site_content
  add column if not exists created_at timestamptz not null default now();

alter table public.site_content
  add column if not exists updated_at timestamptz not null default now();


alter table public.news
  add column if not exists title text not null default '';

alter table public.news
  add column if not exists date text not null default '';

alter table public.news
  add column if not exists excerpt text not null default '';

alter table public.news
  add column if not exists body text not null default '';

alter table public.news
  add column if not exists text text not null default '';

alter table public.news
  add column if not exists images jsonb not null default '[]'::jsonb;

alter table public.news
  add column if not exists created_at timestamptz not null default now();

alter table public.news
  add column if not exists updated_at timestamptz not null default now();


alter table public.site_documents
  add column if not exists title text not null default '';

alter table public.site_documents
  add column if not exists url text not null default '';

alter table public.site_documents
  add column if not exists sort_order integer not null default 0;

alter table public.site_documents
  add column if not exists created_at timestamptz not null default now();

alter table public.site_documents
  add column if not exists updated_at timestamptz not null default now();


alter table public.site_buttons
  add column if not exists section_slug text not null default 'ashayer';

alter table public.site_buttons
  add column if not exists label text not null default '';

alter table public.site_buttons
  add column if not exists target_type text not null default 'content';

alter table public.site_buttons
  add column if not exists target_value text not null default '';

alter table public.site_buttons
  add column if not exists enabled boolean not null default true;

alter table public.site_buttons
  add column if not exists sort_order integer not null default 0;

alter table public.site_buttons
  add column if not exists created_at timestamptz not null default now();

alter table public.site_buttons
  add column if not exists updated_at timestamptz not null default now();


/* =========================================================
   INDEXES
   ========================================================= */

create index if not exists news_created_at_idx
on public.news(created_at desc);

create index if not exists site_documents_sort_idx
on public.site_documents(sort_order);

create index if not exists site_buttons_sort_idx
on public.site_buttons(sort_order);

create index if not exists site_buttons_section_idx
on public.site_buttons(section_slug);


/* =========================================================
   UPDATED_AT FUNCTION
   ========================================================= */

create or replace function public.kohenor_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


/* =========================================================
   UPDATED_AT TRIGGERS
   ========================================================= */

drop trigger if exists trg_site_content_updated_at
on public.site_content;

create trigger trg_site_content_updated_at
before update on public.site_content
for each row
execute function public.kohenor_set_updated_at();


drop trigger if exists trg_news_updated_at
on public.news;

create trigger trg_news_updated_at
before update on public.news
for each row
execute function public.kohenor_set_updated_at();


drop trigger if exists trg_site_documents_updated_at
on public.site_documents;

create trigger trg_site_documents_updated_at
before update on public.site_documents
for each row
execute function public.kohenor_set_updated_at();


drop trigger if exists trg_site_buttons_updated_at
on public.site_buttons;

create trigger trg_site_buttons_updated_at
before update on public.site_buttons
for each row
execute function public.kohenor_set_updated_at();


/* =========================================================
   STORAGE BUCKET
   ========================================================= */

insert into storage.buckets (
  id,
  name,
  public
)
values (
  'site-media',
  'site-media',
  true
)
on conflict (id) do update
set public = true;


/* =========================================================
   DEFAULT CONTENT
   Only inserted if the slug does not already exist.
   ========================================================= */

insert into public.site_content (
  slug,
  title,
  excerpt,
  body
)
values
(
  'ashayer',
  'عشایر؛ سرمایه ملّی',
  'جامعه عشایری ایران یکی از ارزشمندترین بخش‌های اجتماعی، فرهنگی و اقتصادی کشور است.',
  'جامعه عشایری ایران یکی از ارزشمندترین بخش‌های اجتماعی، فرهنگی و اقتصادی کشور است؛ جامعه‌ای که در تولید، حفظ میراث فرهنگی و ارتباط پایدار با سرزمین نقش مهمی دارد.'
),
(
  'cooperative',
  'چگونگی تعاونی',
  'تعاونی، سازوکاری برای مشارکت افراد دارای نیازها و اهداف مشترک است.',
  'تعاونی، سازوکاری برای مشارکت افراد دارای نیازها و اهداف مشترک است؛ تعاونی عشایری نیز با سازمان‌دهی ظرفیت اعضا، تأمین نیازها، ارائه خدمات و تقویت تولید و بازار به جامعه عشایری کمک می‌کند.'
)
on conflict (slug) do nothing;


/* =========================================================
   DONE
   ========================================================= */
