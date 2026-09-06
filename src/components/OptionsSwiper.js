"use client";
import { Children } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function OptionsSwiper({ children }) {
	return (
		<Swiper
			className="sombra"
			spaceBetween={8}
			slidesPerView={2.5}
			grabCursor
			breakpoints={{
				576: { slidesPerView: 2 },
				992: { slidesPerView: 3.5 },
			}}
		>
			{Children.map(children, (child, index) => (
				<SwiperSlide className="h-auto" key={index} style={{ width: "auto" }}>
					{child}
				</SwiperSlide>
			))}
		</Swiper>
	);
}
