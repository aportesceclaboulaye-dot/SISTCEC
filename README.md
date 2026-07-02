# Gestión Financiera

Sistema propio (separado de Sant Brothers) para automatizar caja diaria, y en las próximas etapas: conciliación bancaria, vencimientos de pagos, cuotas de vivienda/terreno y cheques.

Stack: **Next.js** (Vercel) + **Supabase** (Postgres, Auth, RLS) + **GitHub** (repo y deploy automático).

## Estado actual

✅ Módulo 1: **Caja diaria** (ingresos/egresos, saldo del día, roles admin/caja)
⏳ Próximos módulos: conciliación bancaria, vencimientos, cuotas, cheques

## 1. Supabase

1. Creá un proyecto nuevo en [supabase.com](https://supabase.com) (independiente del de Sant Brothers).
2. Andá a **SQL Editor** y corré el contenido de `supabase/migrations/0001_init.sql`.
3. En **Authentication → Users**, creá tu primer usuario (vos, como admin).
4. Corré esto en el SQL Editor para hacerte admin (reemplazá el email):

   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'tu-email@ejemplo.com');
   ```
5. En **Project Settings → API**, copiá `Project URL` y `anon public key`.

## 2. Variables de entorno

Copiá `.env.example` a `.env.local` y completá con los valores de Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 3. Correr local

```bash
npm install
npm run dev
```

Abrí `http://localhost:3000`.

## 4. GitHub + Vercel

1. Creá un repo nuevo en GitHub (no reutilices el de GESTION-SANT) y subí este proyecto.
2. En [vercel.com](https://vercel.com), importá el repo.
3. Cargá las mismas variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) en **Project Settings → Environment Variables**.
4. Deploy. Cada push a `main` despliega solo.

## Cómo dar acceso a otra persona (rol "caja")

1. Creá el usuario en **Authentication → Users** desde Supabase (o que se registre, si más adelante agregamos self-signup).
2. Su perfil se crea automático con rol `caja` (ve y carga solo sus propios movimientos, no el panel completo).
3. Para darle más acceso en el futuro, se cambia el `role` en la tabla `profiles`.

## Estructura

```
app/
  login/          → login + logout (server actions)
  caja/           → módulo de caja diaria
lib/supabase/     → clientes de Supabase (browser, server) + helper de perfil
components/       → formulario de carga, cinta de movimientos, resumen del día
supabase/migrations/ → SQL versionado (tablas + políticas RLS)
middleware.ts     → protege rutas y mantiene viva la sesión
```
