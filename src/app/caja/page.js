"use client";
import { useState } from "react";
import cocineros from "@/content/cocineros.json";
import { useOrdersStream } from "@/lib/useOrdersStream";
import { transicionarOrden } from "@/lib/orders";
import { ESTADO_PILL, totalOrden } from "@/lib/orderStatus";

const COLUMNAS = [
  { id: "por-validar", titulo: "Por validar", filtro: (o) => o.estado === "enviado" },
  {
    id: "en-preparacion",
    titulo: "En preparación",
    filtro: (o) => o.estado === "validado" || o.estado === "en-cocina",
  },
  {
    id: "caja",
    titulo: "Caja",
    filtro: (o) => o.estado === "listo" || o.estado === "pagada",
  },
];

export default function Caja() {
  const orders = useOrdersStream();
  const [enviando, setEnviando] = useState(null);

  async function ejecutar(numero, accion, extra) {
    setEnviando(numero);
    await transicionarOrden(numero, accion, extra);
    setEnviando(null);
  }

  return (
    <main>
      <header className="border-bottom border-gray py-2">
        <div className="container">
          <div className="row align-items-center">
            <div className="col">
              <small className="text-muted text-uppercase d-block">Turno</small>
              <h1 className="fs-1 mb-0">Caja &amp; control</h1>
            </div>
            <div className="col-auto">
              <small className="text-muted text-uppercase">{orders.length} órdenes hoy</small>
            </div>
          </div>
        </div>
      </header>
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {COLUMNAS.map((columna) => {
              const ordenes = orders.filter(columna.filtro);
              return (
                <div className="col-12 col-lg-4" key={columna.id}>
                  <div className="bg-yellow-900 border border-gray rounded-pill py-2 px-3 d-flex align-items-center justify-content-between mb-3">
                    <small className="text-uppercase fw-semibold">{columna.titulo}</small>
                    <small className="fw-semibold">{ordenes.length}</small>
                  </div>

                  {ordenes.length === 0 && (
                    <div
                      className="border border-gray rounded-5 py-5 text-center"
                      style={{ borderStyle: "dashed" }}
                    >
                      <small className="text-muted">Sin órdenes</small>
                    </div>
                  )}

                  {ordenes.map((orden) => (
                    <div
                      key={orden.numero}
                      className="bg-white border border-gray rounded-5 shadow-lg p-4 mb-3"
                    >
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <span className="font-heading fs-3">
                          N<sup>o</sup> {orden.numero}
                        </span>
                        <small className="text-muted text-uppercase">
                          {ESTADO_PILL[orden.estado]}
                        </small>
                      </div>
                      <span className="d-block w-100 border-top border-dotted my-2"></span>
                      {orden.items.map((item) => (
                        <div className="row align-items-center mb-2" key={item.nombre}>
                          <div className="col-6">
                            <p className="fw-semibold small mb-0">{item.nombre}</p>
                          </div>
                          <div className="col-6 d-flex align-items-center justify-content-end">
                            <small className="fw-bold">
                              ${item.precio.toLocaleString("es-CO")}
                            </small>
                          </div>
                        </div>
                      ))}
                      <span className="d-block w-100 border-top border-dotted my-2"></span>
                      <div className="row align-items-center mb-2">
                        <div className="col-6">
                          <small className="fw-semibold text-muted mb-0">Total</small>
                        </div>
                        <div className="col-6 d-flex align-items-center justify-content-end">
                          <small className="fs-3 fw-bold">
                            ${totalOrden(orden.items).toLocaleString("es-CO")}
                          </small>
                        </div>
                      </div>

                      {orden.cocinero && (
                        <small className="text-muted d-block mb-3 text-uppercase">
                          Cocinero: {orden.cocinero}
                        </small>
                      )}

                      {orden.estado === "enviado" && (
                        <button
                          className="btn btn-night w-100"
                          disabled={enviando === orden.numero}
                          onClick={() => ejecutar(orden.numero, "validar")}
                        >
                          Validar orden
                        </button>
                      )}

                      {orden.estado === "validado" && (
                        <div>
                          <small className="text-muted text-uppercase d-block mb-2">
                            Asignar a cocinero
                          </small>
                          <div className="d-flex flex-wrap gap-2">
                            {cocineros.map((cocinero) => (
                              <button
                                key={cocinero}
                                className="btn bg-yellow-900 text-black border border-gray"
                                disabled={enviando === orden.numero}
                                onClick={() =>
                                  ejecutar(orden.numero, "asignar-cocinero", { cocinero })
                                }
                              >
                                {cocinero}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {orden.estado === "en-cocina" && (
                        <button
                          className="btn bg-yellow-900 text-primary w-100 border-0 rounded-pill text-uppercase"
                          disabled
                        >
                          {ESTADO_PILL[orden.estado]}
                        </button>
                      )}

                      {orden.estado === "listo" && (
                        <button
                          className="btn btn-primary w-100 border-0"
                          disabled={enviando === orden.numero}
                          onClick={() => ejecutar(orden.numero, "confirmar-pago")}
                        >
                          Confirmar pago y finalizar
                        </button>
                      )}

                      {orden.estado === "pagada" && (
                        <button
                          className="btn bg-green-100 text-green-700 w-100 border-0 rounded-pill text-uppercase"
                          disabled
                        >
                          Finalizada
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
