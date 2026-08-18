/* =========================================================
   KOHENOR — SUPABASE SECURITY
   Owner:
   farrokhzad743@gmail.com
   ========================================================= */


/* =========================================================
   OWNER CHECK
   ========================================================= */

create or replace function public.kohenor_is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select lower(
    coalesce(
      auth.jwt() ->> 'email',
      ''
    )
  ) = 'farrokhzad743@gmail.com';
$$;

revoke all
on function public.kohenor_is_owner()
from public;

grant execute
on function public.kohenor_is_owner()
to authenticated;


/* =========================================================
   ENABLE RLS
   ========================================================= */

alter table public.site_content enable row level security;
alter table public.news enable row level security;
alter table public.site_documents enable row level security;
alter table public.site_buttons enable row level security;


/* =========================================================
   REMOVE OLD POLICIES
   Only policies on these four site tables are removed.
   ========================================================= */


/* site_content */

drop policy if exists "site content public read"
on public.site_content;

drop policy if exists "site content owner insert"
on public.site_content;

drop policy if exists "site content owner update"
on public.site_content;

drop policy if exists "site content owner delete"
on public.site_content;

drop policy if exists "owner read site content"
on public.site_content;

drop policy if exists "owner insert site content"
on public.site_content;

drop policy if exists "owner update site content"
on public.site_content;

drop policy if exists "owner delete site content"
on public.site_content;


/* news */

drop policy if exists "news public read"
on public.news;

drop policy if exists "news owner insert"
on public.news;

drop policy if exists "news owner update"
on public.news;

drop policy if exists "news owner delete"
on public.news;

drop policy if exists "owner read news"
on public.news;

drop policy if exists "owner insert news"
on public.news;

drop policy if exists "owner update news"
on public.news;

drop policy if exists "owner delete news"
on public.news;


/* site_documents */

drop policy if exists "documents public read"
on public.site_documents;

drop policy if exists "documents owner insert"
on public.site_documents;

drop policy if exists "documents owner update"
on public.site_documents;

drop policy if exists "documents owner delete"
on public.site_documents;

drop policy if exists "owner read documents"
on public.site_documents;

drop policy if exists "owner insert documents"
on public.site_documents;

drop policy if exists "owner update documents"
on public.site_documents;

drop policy if exists "owner delete documents"
on public.site_documents;


/* site_buttons */

drop policy if exists "buttons public read"
on public.site_buttons;

drop policy if exists "buttons owner insert"
on public.site_buttons;

drop policy if exists "buttons owner update"
on public.site_buttons;

drop policy if exists "buttons owner delete"
on public.site_buttons;

drop policy if exists "owner read buttons"
on public.site_buttons;

drop policy if exists "owner insert buttons"
on public.site_buttons;

drop policy if exists "owner update buttons"
on public.site_buttons;

drop policy if exists "owner delete buttons"
on public.site_buttons;


/* =========================================================
   SITE CONTENT POLICIES
   ========================================================= */

create policy "site content public read"
on public.site_content
for select
to anon, authenticated
using (true);


create policy "site content owner insert"
on public.site_content
for insert
to authenticated
with check (
  public.kohenor_is_owner()
);


create policy "site content owner update"
on public.site_content
for update
to authenticated
using (
  public.kohenor_is_owner()
)
with check (
  public.kohenor_is_owner()
);


create policy "site content owner delete"
on public.site_content
for delete
to authenticated
using (
  public.kohenor_is_owner()
);


/* =========================================================
   NEWS POLICIES
   ========================================================= */

create policy "news public read"
on public.news
for select
to anon, authenticated
using (true);


create policy "news owner insert"
on public.news
for insert
to authenticated
with check (
  public.kohenor_is_owner()
);


create policy "news owner update"
on public.news
for update
to authenticated
using (
  public.kohenor_is_owner()
)
with check (
  public.kohenor_is_owner()
);


create policy "news owner delete"
on public.news
for delete
to authenticated
using (
  public.kohenor_is_owner()
);


/* =========================================================
   DOCUMENT POLICIES
   ========================================================= */

create policy "documents public read"
on public.site_documents
for select
to anon, authenticated
using (true);


create policy "documents owner insert"
on public.site_documents
for insert
to authenticated
with check (
  public.kohenor_is_owner()
);


create policy "documents owner update"
on public.site_documents
for update
to authenticated
using (
  public.kohenor_is_owner()
)
with check (
  public.kohenor_is_owner()
);


create policy "documents owner delete"
on public.site_documents
for delete
to authenticated
using (
  public.kohenor_is_owner()
);


/* =========================================================
   BUTTON POLICIES
   ========================================================= */

create policy "buttons public read"
on public.site_buttons
for select
to anon, authenticated
using (true);


create policy "buttons owner insert"
on public.site_buttons
for insert
to authenticated
with check (
  public.kohenor_is_owner()
);


create policy "buttons owner update"
on public.site_buttons
for update
to authenticated
using (
  public.kohenor_is_owner()
)
with check (
  public.kohenor_is_owner()
);


create policy "buttons owner delete"
on public.site_buttons
for delete
to authenticated
using (
  public.kohenor_is_owner()
);


/* =========================================================
   STORAGE
   Bucket:
   site-media
   ========================================================= */


/* Remove only our possible old site-media policies. */

drop policy if exists "site media public read"
on storage.objects;

drop policy if exists "site media owner upload"
on storage.objects;

drop policy if exists "site media owner update"
on storage.objects;

drop policy if exists "site media owner delete"
on storage.objects;

drop policy if exists "site media owner insert"
on storage.objects;


/* Public can view website images. */

create policy "site media public read"
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'site-media'
);


/* Owner can upload images. */

create policy "site media owner upload"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'site-media'
  and public.kohenor_is_owner()
);


/* Owner can replace/update images. */

create policy "site media owner update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'site-media'
  and public.kohenor_is_owner()
)
with check (
  bucket_id = 'site-media'
  and public.kohenor_is_owner()
);


/* Owner can delete images. */

create policy "site media owner delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'site-media'
  and public.kohenor_is_owner()
);


/* =========================================================
   FINAL
   ========================================================= */
