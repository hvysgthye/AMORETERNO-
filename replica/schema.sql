-- Schema for Dedicapag NextGen (Optional Cloud Tier / Micro-backend)
-- Standard PostgreSQL schema with Row-Level Security (RLS)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Templates Catalog Table
create table if not exists templates (
  id text primary key,
  name text not null,
  category text not null check (category in ('popular', 'romantico', 'minijuegos', 'flores', 'espacial')),
  description text not null,
  defaults jsonb not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Dedications Table (For persistent shortlinks or optional cloud syncing)
create table if not exists dedications (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  template_id text not null references templates(id) on delete restrict,
  title text not null,
  lock_title text not null default 'Toca para abrir mi corazón',
  unlock_msg text not null default '¡Desbloqueaste mi corazón!',
  letter_title text not null default 'Para el amor de mi vida',
  letter_body text not null,
  combination int[] default array[14, 2, 24],
  photo_url text,
  custom_audio_url text,
  voice_note_url text,
  ambient_fx text not null default 'hearts' check (ambient_fx in ('hearts', 'stars', 'sakura', 'fireflies', 'snow')),
  preset_melody text not null default 'music-box',
  custom_signature text,
  views_count int not null default 0,
  unlocked_count int not null default 0,
  is_permanent boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists idx_dedications_slug on dedications (slug);
create index if not exists idx_dedications_created_at on dedications (created_at desc);

-- 3. Voluntary Contributions ("Paga lo que sientas")
create table if not exists voluntary_tips (
  id uuid primary key default gen_random_uuid(),
  dedication_id uuid references dedications(id) on delete set null,
  donor_name text default 'Anónimo',
  amount_cents int not null,
  currency text not null default 'USD',
  stripe_payment_id text unique,
  status text not null default 'completed' check (status in ('pending', 'completed', 'refunded')),
  created_at timestamptz not null default now()
);

-- Row-Level Security (RLS)
alter table dedications enable row level security;
alter table templates enable row level security;
alter table voluntary_tips enable row level security;

-- Public read access: Anyone can view a published dedication and read template catalog
create policy "Public read templates" on templates for select using (is_active = true);
create policy "Public read dedications" on dedications for select using (true);

-- Anyone can insert a new dedication without requiring user accounts
create policy "Public insert dedications" on dedications for insert with check (true);
