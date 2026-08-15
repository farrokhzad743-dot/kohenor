-- Kohenor final security migration
-- Run once in Supabase SQL Editor.
-- This migration is idempotent: existing policies with these names are removed first.

alter table public.owner_access enable row level security;
alter table public.site_content enable row level security;
alter table public.news enable row level security;

-- owner_access is never publicly readable. An authenticated owner can only read their own row.
drop policy if exists "owner read access list" on public.owner_access;
create policy "owner read own access" on public.owner_access
for select to authenticated
using (
  lower(email) = lower(coalesce(auth.jwt()->>'email', ''))
  and enabled = true
);

-- No INSERT/UPDATE/DELETE policies are intentionally created for owner_access.
-- Owner access is managed from the Supabase dashboard / trusted SQL, not the public app.

-- Public website: read only.
drop policy if exists "public read site content" on public.site_content;
create policy "public read site content" on public.site_content
for select to anon, authenticated
using (true);

drop policy if exists "public read news" on public.news;
create policy "public read news" on public.news
for select to anon, authenticated
using (true);

-- Approved owner: full content management.
drop policy if exists "approved owner insert content" on public.site_content;
create policy "approved owner insert content" on public.site_content
for insert to authenticated
with check (
  exists (
    select 1
    from public.owner_access a
    where lower(a.email) = lower(coalesce(auth.jwt()->>'email', ''))
      and a.enabled = true
  )
);

drop policy if exists "approved owner update content" on public.site_content;
create policy "approved owner update content" on public.site_content
for update to authenticated
using (
  exists (
    select 1
    from public.owner_access a
    where lower(a.email) = lower(coalesce(auth.jwt()->>'email', ''))
      and a.enabled = true
  )
)
with check (
  exists (
    select 1
    from public.owner_access a
    where lower(a.email) = lower(coalesce(auth.jwt()->>'email', ''))
      and a.enabled = true
  )
);

drop policy if exists "approved owner delete content" on public.site_content;
create policy "approved owner delete content" on public.site_content
for delete to authenticated
using (
  exists (
    select 1
    from public.owner_access a
    where lower(a.email) = lower(coalesce(auth.jwt()->>'email', ''))
      and a.enabled = true
  )
);

drop policy if exists "approved owner insert news" on public.news;
create policy "approved owner insert news" on public.news
for insert to authenticated
with check (
  exists (
    select 1
    from public.owner_access a
    where lower(a.email) = lower(coalesce(auth.jwt()->>'email', ''))
      and a.enabled = true
  )
);

drop policy if exists "approved owner update news" on public.news;
create policy "approved owner update news" on public.news
for update to authenticated
using (
  exists (
    select 1
    from public.owner_access a
    where lower(a.email) = lower(coalesce(auth.jwt()->>'email', ''))
      and a.enabled = true
  )
)
with check (
  exists (
    select 1
    from public.owner_access a
    where lower(a.email) = lower(coalesce(auth.jwt()->>'email', ''))
      and a.enabled = true
  )
);

drop policy if exists "approved owner delete news" on public.news;
create policy "approved owner delete news" on public.news
for delete to authenticated
using (
  exists (
    select 1
    from public.owner_access a
    where lower(a.email) = lower(coalesce(auth.jwt()->>'email', ''))
      and a.enabled = true
  )
);

-- Public media bucket: read only for everyone; writes only for approved owners.
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do update set public = true;

drop policy if exists "public read site media" on storage.objects;
create policy "public read site media" on storage.objects
for select to anon, authenticated
using (bucket_id = 'site-media');

drop policy if exists "approved owner upload site media" on storage.objects;
create policy "approved owner upload site media" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'site-media'
  and name like 'news/%'
  and exists (
    select 1
    from public.owner_access a
    where lower(a.email) = lower(coalesce(auth.jwt()->>'email', ''))
      and a.enabled = true
  )
);

drop policy if exists "approved owner update site media" on storage.objects;
create policy "approved owner update site media" on storage.objects
for update to authenticated
using (
  bucket_id = 'site-media'
  and name like 'news/%'
  and exists (
    select 1
    from public.owner_access a
    where lower(a.email) = lower(coalesce(auth.jwt()->>'email', ''))
      and a.enabled = true
  )
)
with check (
  bucket_id = 'site-media'
  and name like 'news/%'
  and exists (
    select 1
    from public.owner_access a
    where lower(a.email) = lower(coalesce(auth.jwt()->>'email', ''))
      and a.enabled = true
  )
);

drop policy if exists "approved owner delete site media" on storage.objects;
create policy "approved owner delete site media" on storage.objects
for delete to authenticated
using (
  bucket_id = 'site-media'
  and name like 'news/%'
  and exists (
    select 1
    from public.owner_access a
    where lower(a.email) = lower(coalesce(auth.jwt()->>'email', ''))
      and a.enabled = true
  )
);

-- Ensure the intended owner exists and is enabled.
insert into public.owner_access (email, enabled)
values ('farrokhzad743@gmail.com', true)
on conflict (email) do update set enabled = true;
