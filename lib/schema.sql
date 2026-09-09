create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique,
  name text not null,
  email text not null,
  company text,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  title text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists media_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  r2_key text,
  link_url text,
  original_filename text,
  type text not null check (type in ('image', 'video', 'file', 'link')),
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists reactions (
  id uuid primary key default gen_random_uuid(),
  media_item_id uuid not null references media_items(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (media_item_id, client_id)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  sender_type text not null check (sender_type in ('stylist', 'client')),
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  replied_at timestamptz,
  created_at timestamptz not null default now()
);
