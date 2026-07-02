-- ============================================================
-- Migración inicial: roles, perfiles y módulo de caja diaria
-- ============================================================

-- 1. Roles disponibles en el sistema
create type public.user_role as enum ('admin', 'caja');

-- 2. Perfiles: uno por usuario de auth.users, con su rol
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  role public.user_role not null default 'caja',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Cada usuario puede ver su propio perfil; el admin puede ver todos
create policy "profiles: ver propio perfil"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles: admin ve todos los perfiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Trigger: al crear un usuario en auth.users, crear su perfil automáticamente
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nombre, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)),
    'caja'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Módulo: caja diaria
-- ============================================================

create table public.categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  tipo text not null check (tipo in ('ingreso', 'egreso')),
  created_at timestamptz not null default now()
);

alter table public.categorias enable row level security;

create policy "categorias: cualquier usuario autenticado puede leer"
  on public.categorias for select
  using (auth.uid() is not null);

create policy "categorias: solo admin escribe"
  on public.categorias for insert
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "categorias: solo admin actualiza"
  on public.categorias for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create table public.movimientos_caja (
  id uuid primary key default gen_random_uuid(),
  fecha date not null default current_date,
  tipo text not null check (tipo in ('ingreso', 'egreso')),
  monto numeric(12, 2) not null check (monto > 0),
  categoria_id uuid references public.categorias(id),
  descripcion text,
  medio_pago text not null check (medio_pago in ('efectivo', 'transferencia', 'tarjeta', 'cheque')),
  comprobante_url text,
  creado_por uuid not null references public.profiles(id) default auth.uid(),
  created_at timestamptz not null default now()
);

alter table public.movimientos_caja enable row level security;

-- admin y caja: ambos pueden insertar movimientos
create policy "movimientos: usuarios autenticados insertan"
  on public.movimientos_caja for insert
  with check (auth.uid() is not null);

-- admin ve todos los movimientos; caja solo ve los que cargó
create policy "movimientos: admin ve todo"
  on public.movimientos_caja for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "movimientos: caja ve lo propio"
  on public.movimientos_caja for select
  using (creado_por = auth.uid());

-- solo admin puede editar o borrar (auditoría de caja)
create policy "movimientos: solo admin actualiza"
  on public.movimientos_caja for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "movimientos: solo admin borra"
  on public.movimientos_caja for delete
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Índices para las consultas más frecuentes (saldo del día, filtro por categoría)
create index movimientos_caja_fecha_idx on public.movimientos_caja (fecha);
create index movimientos_caja_categoria_idx on public.movimientos_caja (categoria_id);
create index movimientos_caja_creado_por_idx on public.movimientos_caja (creado_por);

-- Categorías base para arrancar
insert into public.categorias (nombre, tipo) values
  ('Ventas', 'ingreso'),
  ('Cobranza cuotas', 'ingreso'),
  ('Otros ingresos', 'ingreso'),
  ('Proveedores', 'egreso'),
  ('Sueldos', 'egreso'),
  ('Servicios', 'egreso'),
  ('Impuestos', 'egreso'),
  ('Otros egresos', 'egreso');
