-- Young Scholars Grammar Secondary School — office records schema
-- Run this in your Supabase project's SQL editor (Database > SQL Editor).

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  father_name text,
  class_name text,
  contact text,
  monthly_fee numeric not null default 0,
  admission_date date,
  created_at timestamptz not null default now()
);

create table if not exists teachers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text,
  contact text,
  monthly_salary numeric not null default 0,
  join_date date,
  created_at timestamptz not null default now()
);

create table if not exists fee_payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete set null,
  student_name text,
  amount numeric not null default 0,
  month text not null,       -- format: 'YYYY-MM'
  paid_on date not null,
  created_at timestamptz not null default now()
);

create table if not exists salary_payments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references teachers(id) on delete set null,
  teacher_name text,
  amount numeric not null default 0,
  month text not null,       -- format: 'YYYY-MM'
  paid_on date not null,
  created_at timestamptz not null default now()
);

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  category text,
  amount numeric not null default 0,
  spent_on date not null,
  created_at timestamptz not null default now()
);

-- Row Level Security: enable, then allow full access to authenticated
-- office staff only. Adjust once you add Supabase Auth / login.
alter table students enable row level security;
alter table teachers enable row level security;
alter table fee_payments enable row level security;
alter table salary_payments enable row level security;
alter table expenses enable row level security;

create policy "Authenticated full access" on students for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated full access" on teachers for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated full access" on fee_payments for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated full access" on salary_payments for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated full access" on expenses for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
