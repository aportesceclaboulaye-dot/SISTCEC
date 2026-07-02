type Movimiento = {
  id: string;
  tipo: "ingreso" | "egreso";
  monto: number;
  descripcion: string | null;
  medio_pago: string;
  created_at: string;
  categorias: { nombre: string } | null;
};

export function LedgerTape({ movimientos }: { movimientos: Movimiento[] }) {
  const fmt = (n: number) =>
    n.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 });

  if (movimientos.length === 0) {
    return (
      <div className="border border-dashed border-ledger-line rounded-sm p-8 text-center text-sm text-ledger-inkSoft">
        Todavía no hay movimientos cargados hoy. El primero que registrés abre la cinta.
      </div>
    );
  }

  return (
    <div className="border border-ledger-line rounded-sm divide-y divide-ledger-line">
      {movimientos.map((m) => (
        <div key={m.id} className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-medium">
              {m.categorias?.nombre ?? "Sin categoría"}
              {m.descripcion ? (
                <span className="text-ledger-inkSoft font-normal"> · {m.descripcion}</span>
              ) : null}
            </p>
            <p className="font-mono text-[11px] text-ledger-inkSoft mt-0.5 uppercase tracking-wide">
              {m.medio_pago} · {new Date(m.created_at).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <span
            className={`font-mono text-sm font-semibold tabular-nums ${
              m.tipo === "ingreso" ? "text-ledger-gain" : "text-ledger-loss"
            }`}
          >
            {m.tipo === "ingreso" ? "+" : "−"}
            {fmt(m.monto)}
          </span>
        </div>
      ))}
    </div>
  );
}
