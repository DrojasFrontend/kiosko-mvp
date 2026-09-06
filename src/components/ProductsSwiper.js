"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import "swiper/css";

export default function ProductsSwiper({ products, selectedId, onSelect }) {
  return (
    <Swiper
      className="sombra"
      spaceBetween={8}
      slidesPerView={2.1}
      grabCursor
      breakpoints={{
        576: { slidesPerView: 2 },
        992: { slidesPerView: 3.4 },
      }}
    >
      {products.map((product) => (
        <SwiperSlide key={product.id}>
          <button
            type="button"
            onClick={onSelect ? () => onSelect(product.id) : undefined}
            className={`p-3 border rounded-5 bg-yellow-900 w-100 text-start ${
              selectedId === product.id ? "border-primary border-2" : "border-gray"
            }`}
          >
            <Image
              src={product.imagen}
              alt={product.nombre}
              width={512}
              height={512}
              className="w-100 h-auto rounded-5 mb-3"
            />
            <h3 className="font-body fs-6 text-black text-start fw-bold mb-2">
              {product.nombre}
            </h3>
            <span className="d-block font-heading text-black text-start fs-5">
              ${product.precio.toLocaleString("es-CO")}
            </span>
          </button>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
