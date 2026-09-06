"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import products from "@/content/products.json";
import bebidas from "@/content/bebidas.json";
import extras from "@/content/extras.json";
import ProductsSwiper from "@/components/ProductsSwiper";
import OptionsSwiper from "@/components/OptionsSwiper";
import { useOrdersStream } from "@/lib/useOrdersStream";
import { ESTADOS, ESTADO_PILL, ESTADO_STEP, totalOrden } from "@/lib/orderStatus";

export default function OrdenSeguimiento() {
  const { numero } = useParams();
  const orders = useOrdersStream();
  const orden = orders.find((o) => o.numero === numero);

  if (!orden) {
    return (
      <main className="container py-5">
        <p className="text-muted">Buscando la orden N° {numero}...</p>
      </main>
    );
  }

  const currentIndex = ESTADOS.indexOf(orden.estado);
  const nombresSeleccionados = orden.items.map((item) => item.nombre);
  const platoId = products.find((p) => nombresSeleccionados.includes(p.nombre))?.id ?? null;
  const bebidaId = bebidas.find((b) => nombresSeleccionados.includes(b.nombre))?.id ?? null;
  const extraId = extras.find((e) => nombresSeleccionados.includes(e.nombre))?.id ?? null;

  return (
    <main>
      <header className="border-bottom border-gray py-2">
        <div className="container">
          <div className="row align-items-center">
            <div className="col">
              <small className="text-muted text-uppercase d-block">Orden</small>
              <span className="fs-1 font-heading">
                N<sup>o</sup> {orden.numero}{" "}
                <small className="text-muted-100 fs-6">#{orden.codigo}</small>
              </span>
            </div>
            <div className="col-auto">
              <span className="d-inline-flex align-items-center gap-2 bg-yellow-900 text-primary rounded-pill px-3 py-2 small fw-semibold text-uppercase">
                <span
                  className="rounded-circle bg-primary"
                  style={{ width: 6, height: 6 }}
                ></span>
                {ESTADO_PILL[orden.estado]}
              </span>
            </div>
          </div>
        </div>
      </header>

      <section className="py-5">
        <div className="container">
          <div className="d-flex align-items-start mb-4">
            {ESTADOS.map((estado, i) => (
              <div
                className="d-flex align-items-center"
                key={estado}
                style={{ flex: i === ESTADOS.length - 1 ? "0 0 auto" : "1 1 auto" }}
              >
                <div className="d-flex flex-column align-items-center" style={{ minWidth: 40 }}>
                  <span
                    className={`small d-inline-flex align-items-center justify-content-center rounded-circle fw-bold ${
                      i <= currentIndex ? "bg-primary text-white" : "border border-gray text-muted"
                    } ${i === currentIndex ? "pulse-ring" : ""}`}
                    style={{ width: 32, height: 32 }}
                  >
                    {i + 1}
                  </span>
                  <small
                    className={`text-uppercase mt-1 fw-semibold text-nowrap ${
                      i <= currentIndex ? "text-primary" : "text-muted"
                    }`}
                  >
                    {ESTADO_STEP[estado]}
                  </small>
                </div>
                {i < ESTADOS.length - 1 && (
                  <span
                    className="flex-grow-1 mx-2"
                    style={{
                      height: 2,
                      backgroundColor: i < currentIndex ? "var(--bs-primary)" : "var(--text-muted-100)",
                    }}
                  ></span>
                )}
              </div>
            ))}
          </div>

          {orden.estado === "listo" && (
            <div className="bg-blue-100 text-blue-700 rounded-4 p-3 mb-4">
              Tu pedido está listo. Acércate a la caja y muestra este recibo para pagar.
            </div>
          )}

          {orden.estado === "pagada" && (
            <div className="bg-yellow-900 text-primary rounded-4 p-3 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
              <span>Pago confirmado. ¡Buen provecho! Orden finalizada.</span>
              <Link href="/" className="btn btn-primary text-white border-0">
                Armar otro combo
              </Link>
            </div>
          )}

          <div className="row">
            <div className="col-12 col-lg-8 mb-4 mb-lg-0">
              <div className="mb-5">
                <h2 className="fs-4">
                  <small className="text-primary fw-bold">01</small> Plato principal
                </h2>
                <ProductsSwiper products={products} selectedId={platoId} />
              </div>
              <div className="mb-5">
                <h2 className="fs-4">
                  <small className="text-primary fw-bold">02</small> Bebida
                </h2>
                <OptionsSwiper>
                  {bebidas.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      className={`btn bg-yellow-900 text-black d-flex flex-column align-items-start w-100 py-2 border ${
                        bebidaId === b.id ? "border-primary border-2" : "border-gray"
                      }`}
                    >
                      <span className="font-body fs-6 text-black text-start fw-bold mb-0">
                        {b.nombre}
                      </span>
                      <span className="font-heading fs-6">${b.precio.toLocaleString("es-CO")}</span>
                    </button>
                  ))}
                </OptionsSwiper>
              </div>
              <div>
                <h2 className="fs-4">
                  <small className="text-primary fw-bold">03</small> Extras
                </h2>
                <OptionsSwiper>
                  {extras.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      className={`btn d-flex flex-wrap justify-content-center align-items-center gap-0 w-100 h-100 py-2 border ${
                        extraId === e.id ? "btn-primary border-0" : "bg-yellow-900 text-black border-gray"
                      }`}
                    >
                      <span className="font-body fw-semibold small text-center">{e.nombre}</span>
                      <span className="font-heading small">+${e.precio.toLocaleString("es-CO")}</span>
                    </button>
                  ))}
                </OptionsSwiper>
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <div className="position-sticky top-0 w-100 py-3 px-4 border border-gray rounded-5 shadow-lg bg-white">
                <div className="d-flex align-items-center justify-content-between">
                  <small className="text-muted">RECIBO</small>
                  <small className="text-muted">{orden.numero}</small>
                </div>
                <span className="d-block w-100 border-top border-dotted my-2"></span>
                {orden.items.map((item) => (
                  <div className="row align-items-center mb-2" key={item.nombre}>
                    <div className="col-6">
                      <p className="fw-semibold small mb-0">{item.nombre}</p>
                    </div>
                    <div className="col-6 d-flex align-items-center justify-content-end">
                      <small className="fw-bold">${item.precio.toLocaleString("es-CO")}</small>
                    </div>
                  </div>
                ))}
                <span className="d-block w-100 border-top border-dotted my-2"></span>
                <div className="row align-items-center mb-2">
                  <div className="col-6">
                    <small className="fw-semibold text-muted mb-0">TOTAL</small>
                  </div>
                  <div className="col-6 d-flex align-items-center justify-content-end">
                    <small className="fs-3 fw-bold">
                      ${totalOrden(orden.items).toLocaleString("es-CO")}
                    </small>
                  </div>
                </div>
                <button className="btn bg-yellow-900 text-primary w-100 border-0 text-uppercase" disabled>
                  {ESTADO_PILL[orden.estado]}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
