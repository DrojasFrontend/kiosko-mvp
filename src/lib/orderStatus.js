export const ESTADOS = ["enviado", "validado", "en-cocina", "listo", "pagada"];

export const ESTADO_PILL = {
  enviado: "Enviado",
  validado: "Validado",
  "en-cocina": "En cocina",
  listo: "Listo para pagar",
  pagada: "Pagada",
};

export const ESTADO_STEP = {
  enviado: "Enviado",
  validado: "Validado",
  "en-cocina": "En cocina",
  listo: "Listo",
  pagada: "Pagada",
};

export function totalOrden(items) {
  return items.reduce((total, item) => total + item.precio, 0);
}
