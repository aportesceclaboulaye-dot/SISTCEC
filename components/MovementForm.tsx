import { addMovimiento } from "@/app/caja/actions";

type Categoria = { id: string; nombre: string; tipo: "ingreso" | "egreso" };

export function MovementForm({ categorias }: { categorias: Categoria[] }) {
  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <form
      action={addMovimiento}
      className="bg-white/60 border border-ledger-line rounded-sm p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Nuevo movimiento</h2>
        <input
          type="date"
          name="fecha"
          defaultValue={hoy}
          className="text-xs font-mono border border-ledger-line bg-ledger-paper px-2 py-1 rounded-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex items-center gap-2 border border-ledger-line rounded-sm px-3 py-2 cursor-pointer has-[:checked]:border-ledger-gain has-[:checked]:bg-ledger-gain/5">
          <input type="radio" name="tipo" value="ingreso" defaultChecked className="accent-ledger-gain" />
          <span className="text-sm font-medium">Ingreso</span>
        </label>
        <label className="flex items-center gap-2 border border-ledger-line rounded-sm px-3 py-2 cursor-pointer has-[:checked]:border-ledger-loss has-[:checked]:bg-ledger-loss/5">
          <input type="radio" name="tipo" value="egreso" className="accent-ledger-loss" />
          <span className="text-sm font-medium">Egreso</span>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-ledger-inkSoft mb-1">Monto</label>
          <input
            type="number"
            name="monto"
            step="0.01"
            min="0.01"
            required
            className="w-full border border-ledger-line bg-ledger-paper px-3 py-2 text-sm font-mono rounded-sm focus:outline-none focus:ring-2 focus:ring-ledger-accent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ledger-inkSoft mb-1">Medio de pago</label>
          <select
            name="medio_pago"
            required
            className="w-full border border-ledger-line bg-ledger-paper px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-ledger-accent"
          >
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="cheque">Cheque</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-ledger-inkSoft mb-1">Categoría</label>
        <select
          name="categoria_id"
          className="w-full border border-ledger-line bg-ledger-paper px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-ledger-accent"
        >
          <option value="">Sin categoría</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre} ({c.tipo})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-ledger-inkSoft mb-1">Descripción</label>
        <input
          type="text"
          name="descripcion"
          placeholder="Opcional"
          className="w-full border border-ledger-line bg-ledger-paper px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-ledger-accent"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-ledger-ink text-ledger-paper text-sm font-medium py-2.5 rounded-sm hover:bg-ledger-ink/90 transition-colors"
      >
        Registrar movimiento
      </button>
    </form>
  );
}
