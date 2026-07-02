"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addMovimiento(formData: FormData) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const tipo = String(formData.get("tipo") || "");
  const monto = Number(formData.get("monto"));
  const categoria_id = String(formData.get("categoria_id") || "") || null;
  const descripcion = String(formData.get("descripcion") || "");
  const medio_pago = String(formData.get("medio_pago") || "");
  const fecha = String(formData.get("fecha") || new Date().toISOString().slice(0, 10));

  if (!tipo || !monto || monto <= 0 || !medio_pago) {
    redirect("/caja?error=Completá todos los campos obligatorios");
  }

  const { error } = await supabase.from("movimientos_caja").insert({
    tipo,
    monto,
    categoria_id,
    descripcion,
    medio_pago,
    fecha,
    creado_por: user.id,
  });

  if (error) {
    redirect(`/caja?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/caja");
}
