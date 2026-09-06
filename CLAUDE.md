# Kiosko MVP

Next.js (App Router) + Bootstrap vía npm, contenido de catálogo en JSON (`src/content/`). MVP para cliente — no es un sitio de marketing, es un flujo transaccional de kiosko de autoservicio.

## Qué hace

Un cliente arma un combo (plato + bebida + extra) y la orden viaja en vivo por 3 roles/pantallas:

- `/` — armador de combo (cliente). Selección tipo radio-button por sección (`OrderBuilder.js`), recibo en vivo, `crearOrden()` al enviar → redirige a `/orden/[numero]`.
- `/orden/[numero]` — seguimiento del cliente: stepper de 5 pasos (`enviado → validado → en-cocina → listo → pagada`).
- `/caja` — 3 columnas (Por validar / En preparación / Caja): validar orden, asignar cocinero, confirmar pago.
- `/cocina` — cards de órdenes asignadas, "Finalizar y despachar", chip de entregadas.

Las 3 pantallas están pensadas para dispositivos distintos (kiosko/celular del cliente, tablet de caja, pantalla de cocina) sincronizados en tiempo real.

## Estado y tiempo real — Supabase

- El estado de las órdenes vive en **Supabase** (proyecto `kiosko-mvp`, región São Paulo), tabla `ordenes` (`numero`, `codigo`, `estado`, `cocinero`, `items` jsonb, `creada_en`). RLS habilitada con policies públicas de select/insert/update (no hay auth todavía — MVP).
- `numero` (`"001"`, zero-padded) y `codigo` (`"TX1"`) se generan solos vía trigger (`set_orden_numero`) a partir del `id` autoincremental — nunca se insertan a mano.
- Tiempo real: **Supabase Realtime** (`postgres_changes` sobre la tabla `ordenes`, canal suscripto en `src/lib/useOrdersStream.js`). Ya no hay Server-Sent Events ni API routes propias — todo el CRUD de órdenes vive en `src/lib/orders.js` (`crearOrden`, `transicionarOrden`) llamando directo a `supabase-js` desde los Client Components.
- Transiciones válidas en `src/lib/orders.js` (objeto `TRANSICIONES`): `validar → asignar-cocinero → finalizar-cocina → confirmar-pago`. La validación de "no saltarse un estado" se hace con un `update().eq("estado", desde)` atómico: si la fila no está en el estado esperado, el update no afecta filas y `transicionarOrden` tira error — no hace falta un endpoint propio para el chequeo 409 que existía antes.
- Credenciales en `.env.local` (gitignorado): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. **Hay que cargar las mismas env vars en Vercel antes de deployar** (Project Settings → Environment Variables).

## Convenciones del proyecto

- Fuentes vía `next/font/google`: Anton (`--font-heading`, headings), Inter (`--font-body`, párrafos), JetBrains Mono (`--font-small`, `small`/labels uppercase).
- Bootstrap 5 instalado por npm (no CDN): CSS importado en `layout.js`, JS aislado en `src/components/BootstrapClient.js` (patrón obligatorio para cualquier librería que dependa del DOM — ver Swiper abajo).
- Swiper (`swiper/react`) en `ProductsSwiper.js`/`OptionsSwiper.js`: `OptionsSwiper` es genérico, envuelve los `children` que le pasen en `SwiperSlide` — así un Server Component puede pasarle botones ya armados sin tener que pasar funciones (no se pueden pasar props-función de Server a Client Component).
- Paleta: `--bs-primary` (rojo-naranja) como único acento de marca. Evitar introducir colores nuevos (ej. verde) sin chequear que combinen con la paleta existente.
- Gotcha de CSS: nunca pongas `overflow-x: hidden` en `body` — rompe `position: sticky` (por spec, el otro eje de overflow pasa a `auto` y `body` se vuelve su propio contenedor de scroll). Va solo en `html`.
- Gotcha de Bootstrap: no combines `class="btn bg-algo"` para un botón custom — `.btn:hover` de Bootstrap trae `background-color: transparent` con la misma especificidad y gana en hover. Crear una variante propia (`.btn-primary`, `.btn-night`, `.btn-success-gradient` son los ejemplos existentes en `globals.css`).

## Deploy

Listo para deployar a Vercel — solo falta cargar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` como env vars del proyecto en Vercel (los valores están en `.env.local`, no se commitean).

@AGENTS.md
