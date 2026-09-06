import { supabase } from "@/lib/supabaseClient";

const TRANSICIONES = {
  validar: { desde: "enviado", hacia: "validado" },
  "asignar-cocinero": { desde: "validado", hacia: "en-cocina", requiereCocinero: true },
  "finalizar-cocina": { desde: "en-cocina", hacia: "listo" },
  "confirmar-pago": { desde: "listo", hacia: "pagada" },
};

export async function crearOrden(items) {
  const { data, error } = await supabase.from("ordenes").insert({ items }).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function transicionarOrden(numero, accion, extra = {}) {
  const transicion = TRANSICIONES[accion];
  if (!transicion) throw new Error("Acción inválida");
  if (transicion.requiereCocinero && !extra.cocinero) {
    throw new Error("cocinero es requerido");
  }

  const cambios = { estado: transicion.hacia };
  if (transicion.requiereCocinero) {
    cambios.cocinero = extra.cocinero;
  }

  const { data, error } = await supabase
    .from("ordenes")
    .update(cambios)
    .eq("numero", numero)
    .eq("estado", transicion.desde)
    .select()
    .single();

  if (error) {
    throw new Error(`La orden no está en '${transicion.desde}'`);
  }
  return data;
}
