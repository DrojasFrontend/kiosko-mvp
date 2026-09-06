"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductsSwiper from "@/components/ProductsSwiper";
import OptionsSwiper from "@/components/OptionsSwiper";
import { crearOrden } from "@/lib/orders";

export default function OrderBuilder({ products, bebidas, extras }) {
  const router = useRouter();
  const [platoId, setPlatoId] = useState(
    products.find((p) => p.seleccionado)?.id ?? products[0]?.id ?? null
  );
  const [bebidaId, setBebidaId] = useState(
    bebidas.find((b) => b.seleccionado)?.id ?? bebidas[0]?.id ?? null
  );
  const [extraId, setExtraId] = useState(
    extras.find((e) => e.seleccionado)?.id ?? null
  );
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const plato = products.find((p) => p.id === platoId) ?? null;
  const bebida = bebidas.find((b) => b.id === bebidaId) ?? null;
  const extra = extras.find((e) => e.id === extraId) ?? null;

  const seleccionados = [plato, bebida, extra].filter(Boolean);
  const total = seleccionados.reduce((acc, item) => acc + item.precio, 0);

  async function enviarOrden() {
    if (!plato || !bebida) return;
    setEnviando(true);
    setError(null);

    try {
      const items = seleccionados.map(({ nombre, precio }) => ({ nombre, precio }));
      const orden = await crearOrden(items);
      router.push(`/orden/${orden.numero}`);
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  }

  return (
    <div className="row">
      <div className="col-12 col-lg-8 mb-4 mb-lg-0">
        <div className="mb-5">
          <h2 className="fs-4">
            <small className="text-primary fw-bold">01</small> Plato principal
          </h2>
          <ProductsSwiper products={products} selectedId={platoId} onSelect={setPlatoId} />
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
                onClick={() => setBebidaId(b.id)}
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
                onClick={() => setExtraId(extraId === e.id ? null : e.id)}
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
            {seleccionados.length === 0 && "-"}
          </div>
          <span className="d-block w-100 border-top border-dotted my-2"></span>
          {seleccionados.map((item) => (
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
              <small className="fs-3 fw-bold">${total.toLocaleString("es-CO")}</small>
            </div>
          </div>
          {error && <small className="text-primary d-block mb-2">{error}</small>}
          <button
            className="btn btn-primary w-100 border-0"
            disabled={!plato || !bebida || enviando}
            onClick={enviarOrden}
          >
            {enviando ? "Enviando..." : "Enviar orden"}
          </button>
        </div>
      </div>
    </div>
  );
}
