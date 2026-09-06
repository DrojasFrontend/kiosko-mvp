"use client";
import { useState } from "react";
import { useOrdersStream } from "@/lib/useOrdersStream";
import { transicionarOrden } from "@/lib/orders";
import { totalOrden } from "@/lib/orderStatus";

export default function Cocina() {
  const orders = useOrdersStream();
  const [enviando, setEnviando] = useState(null);

  const enCocina = orders.filter((o) => o.estado === "en-cocina");
  const entregadas = orders.filter((o) => o.estado === "listo" || o.estado === "pagada");

  async function finalizar(numero) {
    setEnviando(numero);
    await transicionarOrden(numero, "finalizar-cocina");
    setEnviando(null);
  }

  return (
    <main>
      <header className="border-bottom border-gray py-2">
        <div className="container">
          <div className="row align-items-center">
            <div className="col">
              <small className="text-muted text-uppercase d-block">Pase</small>
              <h1 className="fs-1 mb-0">Cocina</h1>
            </div>
            <div className="col-auto">
              <small className="text-muted text-uppercase">{enCocina.length} en preparación</small>
            </div>
          </div>
        </div>
      </header>
      <section className="py-5">
        <div className="container">
          {enCocina.length === 0 ? (
            <div
              className="border border-gray rounded-5 py-5 text-center mb-5"
              style={{ borderStyle: "dashed" }}
            >
              <small className="text-muted">
                No hay tickets asignados. La caja te enviará el siguiente pedido.
              </small>
            </div>
          ) : (
            <div className="row g-4 mb-5">
              {enCocina.map((orden) => (
                <div className="col-12 col-sm-6 col-lg-4" key={orden.numero}>
                  <div className="bg-night text-white rounded-5 shadow-lg p-4 h-100 d-flex flex-column">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span className="font-heading fs-2">
                        N<sup>o</sup> {orden.numero}
                      </span>
                      <small className="text-accent fw-semibold text-uppercase">
                        {orden.cocinero}
                      </small>
                    </div>

                    <span className="d-block w-100 border-top border-dotted border-light-25 my-2"></span>

                    <div className="flex-grow-1">
                      {orden.items.map((item) => (
                        <p className="font-body fw-bold text-white mb-2" key={item.nombre}>
                          {item.nombre}
                        </p>
                      ))}
                    </div>

                    <small className="text-muted-light text-uppercase mb-3 d-block">
                      Total{" "}
                      <span className="fw-bold text-white">
                        ${totalOrden(orden.items).toLocaleString("es-CO")}
                      </span>
                    </small>

                    <button
                      className="btn btn-success-gradient text-black w-100 border-0"
                      disabled={enviando === orden.numero}
                      onClick={() => finalizar(orden.numero)}
                    >
                      Finalizar y despachar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <small className="text-muted text-uppercase d-block mb-2">Entregados a caja</small>
          <div className="d-flex flex-wrap gap-2">
            {entregadas.map((orden) => (
              <span
                key={orden.numero}
                className="d-inline-block bg-green-100 text-green-700 rounded-pill px-3 py-2 small fw-semibold"
              >
                N<sup>o</sup> {orden.numero}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
