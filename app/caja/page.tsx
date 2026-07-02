import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";
import { MovementForm } from "@/components/MovementForm";
import { BalanceStrip } from "@/components/BalanceStrip";
import { LedgerTape } from "@/components/LedgerTape";
import { signOut } from "@/app/login/actions";

export default async function CajaPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const supabase = createClient();
  const profile = await getProfile();

  const hoy = new Date().toISOString().slice(0, 10);

  const { data: categorias } = await supabase
    .from("categorias")
    .select("id, nombre, tipo")
    .order("nombre");

  const { data: movimientos } = await supabase
    .from("movimientos_caja")
    .select("id, tipo, monto, descripcion, medio_pago, created_at, categorias(nombre)")
    .eq("fecha", hoy)
    .order("created_at", { ascending: false });

  const ingresos = (movimientos ?? [])
    .filter((m) => m.tipo === "ingreso")
    .reduce((sum, m) => sum + Number(m.monto), 0);

  const egresos = (movimientos ?? [])
    .filter((m) => m.tipo === "egreso")
    .reduce((sum, m) => sum + Number(m.monto), 0);

  return (
    <main className="min-h-screen px-6 py-10 max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-ledger-inkSoft uppercase mb-1">
            {profile?.role === "admin" ? "Administrador" : "Caja"}
          </p>
          <h1 className="font-display text-2xl font-semibold">
            Hola, {profile?.nombre ?? "..."}
          </h1>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="text-xs font-medium text-ledger-inkSoft hover:text-ledger-ink border border-ledger-line rounded-sm px-3 py-1.5"
          >
            Cerrar sesión
          </button>
        </form>
      </header>

      {searchParams.error && (
        <p className="mb-4 text-sm text-ledger-loss bg-ledger-loss/5 border border-ledger-loss/30 rounded-sm px-3 py-2">
          {searchParams.error}
        </p>
      )}

      <div className="grid md:grid-cols-[1fr_1.4fr] gap-6">
        <div className="space-y-6">
          <BalanceStrip ingresos={ingresos} egresos={egresos} />
          <MovementForm categorias={categorias ?? []} />
        </div>

        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-ledger-inkSoft mb-3">
            Movimientos de hoy
          </p>
          <LedgerTape movimientos={(movimientos as any) ?? []} />
        </div>
      </div>
    </main>
  );
}
