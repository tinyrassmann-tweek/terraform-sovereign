-- TerraForm Sovereign / Think Tank Solutions AI — Supabase schema
-- Run in the Supabase SQL editor, then enable Row Level Security policies
-- appropriate to each portal before going live.

create table if not exists conductors (
  id text primary key,                    -- slug, e.g. 'nova-abelek'
  name text not null,
  tagline text,
  specialties text[] not null default '{}', -- AI_AGENTS ids from src/data/constants.js
  harmony_score numeric(2,1) default 0,
  resonance_count integer default 0,
  location text,
  price_from numeric(10,2),
  sponsored boolean default false,
  certified boolean default false,        -- Certified Brand Symphony Conductor
  status text not null default 'pending' check (status in ('approved','pending','suspended')),
  portfolio jsonb not null default '[]',  -- [{title, url}]
  accent text,
  bio text,
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  conductor_id text not null references conductors(id) on delete cascade,
  author text not null,
  rating integer not null check (rating between 1 and 5),
  text text,
  status text not null default 'pending' check (status in ('approved','pending','flagged','removed')),
  response text,                          -- provider's reply ("Resonance" reprise)
  created_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  conductor_id text not null references conductors(id),
  client_id uuid references auth.users(id),
  date date not null,
  slot text not null,
  price numeric(10,2),
  status text not null default 'confirmed' check (status in ('confirmed','cancelled','completed')),
  created_at timestamptz not null default now()
);

create table if not exists sponsored_placements (
  slot_id text primary key,               -- e.g. 'hero', 'category-top', 'search-boost'
  conductor_id text references conductors(id),
  updated_at timestamptz not null default now()
);
