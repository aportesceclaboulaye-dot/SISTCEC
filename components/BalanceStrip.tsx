export function BalanceStrip({
  ingresos,
  egresos,
}: {
  ingresos: number;
  egresos: number;
}) {
  const saldo = ingresos - egresos;
  const fmt = (n: number) =>
    n.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 });

  return (
    <div className="bg-ledger-ink text-ledger-paper rounded-sm p-5">
      <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-ledger-paper/60 mb-3">
        Cierre del día · {new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "long" })}
      </p>
      <div className="flex justify-between font-mono text-sm text-ledger-paper/80 mb-1">
        <span>Ingresos</span>
        <span className="tabular-nums">{fmt(ingresos)}</span>
      </div>
      <div className="flex justify-between font-mono text-sm text-ledger-paper/80 mb-3">
        <span>Egresos</span>
        <span className="tabular-nums">−{fmt(egresos)}</span>
      </div>
      <div className="border-t border-dashed border-ledger-paper/25 pt-3 flex justify-between items-baseline">
        <span className="font-display text-sm font-medium">Saldo</span>
        <span
          className={`font-mono text-2xl font-semibold tabular-nums ${
            saldo >= 0 ? "text-ledger-accent" : "text-ledger-loss"
          }`}
        >
          {fmt(saldo)}
        </span>
      </div>
    </div>
  );
}
