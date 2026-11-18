create table public.arocena_fichas (
  ficha text primary key check (ficha in ('A', 'B', 'C')),
  anio smallint not null unique check (anio between 1 and 9999),
  codigo smallint not null check (codigo between 0 and 9)
);

alter table public.arocena_fichas enable row level security;

revoke all privileges on table public.arocena_fichas from public, anon, authenticated;
grant select on table public.arocena_fichas to anon;

create policy leer_fichas_de_ejemplo
on public.arocena_fichas for select to anon using (true);

insert into public.arocena_fichas (ficha, anio, codigo) values
  ('A', 1920, 7),
  ('B', 1780, 2),
  ('C', 1840, 4);
