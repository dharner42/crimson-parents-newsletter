-- Crimson Parents Newsletter Builder - Database Schema
-- Run this in Supabase SQL editor

create table newsletters (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  month integer,
  year integer,
  theme text default 'default',
  status text default 'draft' check (status in ('draft', 'published')),
  created_by uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  content jsonb default '{}'::jsonb
);

alter table newsletters enable row level security;

create policy "Users can CRUD own newsletters" on newsletters
  for all using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

create table newsletter_photos (
  id uuid primary key default gen_random_uuid(),
  newsletter_id uuid references newsletters(id) on delete cascade,
  url text not null,
  caption text,
  position integer default 0
);

alter table newsletter_photos enable row level security;

create policy "Users can CRUD photos for own newsletters" on newsletter_photos
  for all using (
    exists (select 1 from newsletters where id = newsletter_id and created_by = auth.uid())
  )
  with check (
    exists (select 1 from newsletters where id = newsletter_id and created_by = auth.uid())
  );

-- Storage bucket for photos
insert into storage.buckets (id, name, public) values ('newsletter-photos', 'newsletter-photos', true);

create policy "Auth users can upload photos" on storage.objects
  for insert with check (bucket_id = 'newsletter-photos' and auth.role() = 'authenticated');

create policy "Photos are publicly readable" on storage.objects
  for select using (bucket_id = 'newsletter-photos');

create policy "Users can delete own photos" on storage.objects
  for delete using (bucket_id = 'newsletter-photos' and auth.uid() = owner);
