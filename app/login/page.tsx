import { signIn } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-mono text-xs tracking-[0.2em] text-ledger-inkSoft uppercase mb-2">
            Control financiero
          </p>
          <h1 className="font-display text-3xl font-semibold text-ledger-ink">
            Iniciar sesión
          </h1>
        </div>

        <form
          action={signIn}
          className="bg-white/60 border border-ledger-line rounded-sm p-6 space-y-4 shadow-card"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-ledger-inkSoft mb-1"
            >
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full border border-ledger-line bg-ledger-paper px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-ledger-accent"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-ledger-inkSoft mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full border border-ledger-line bg-ledger-paper px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-ledger-accent"
            />
          </div>

          {searchParams.error && (
            <p className="text-xs text-ledger-loss">{searchParams.error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-ledger-ink text-ledger-paper text-sm font-medium py-2.5 rounded-sm hover:bg-ledger-ink/90 transition-colors"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ledger-inkSoft">
          Acceso restringido. Las cuentas las crea el administrador desde Supabase.
        </p>
      </div>
    </main>
  );
}
