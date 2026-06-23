-- Run this in the Supabase SQL editor at supabase.com → your project → SQL Editor

-- 1. recommendations table
create table if not exists recommendations (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  title       text not null,
  category    text not null check (category in ('recipe','music','book','link','list','other')),
  url         text,
  note        text,
  posted_by   text not null,
  likes       int not null default 0
);

-- 2. members table
create table if not exists members (
  id         uuid primary key default gen_random_uuid(),
  name       text unique not null,
  joined_at  timestamptz not null default now()
);

-- 3. Enable Row Level Security
alter table recommendations enable row level security;
alter table members enable row level security;

-- 4. RLS policies — public read + insert (no auth needed for a friend group)
create policy "public read recommendations"
  on recommendations for select using (true);

create policy "public insert recommendations"
  on recommendations for insert with check (true);

create policy "public update recommendations"
  on recommendations for update using (true);

create policy "public read members"
  on members for select using (true);

create policy "public insert members"
  on members for insert with check (true);

-- 5. Enable Realtime on recommendations
-- Go to Database → Replication in Supabase dashboard and toggle "recommendations" ON.
-- Or run:
alter publication supabase_realtime add table recommendations;
