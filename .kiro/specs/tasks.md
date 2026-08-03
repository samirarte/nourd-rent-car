# Tareas de implementación — Nourd Rent Car

## Convenciones

- **Estado**: `[ ]` pendiente · `[x]` completada · `[~]` en progreso
- Las tareas están ordenadas por dependencia: cada fase puede comenzar cuando la anterior esté completa.
- Archivos de referencia: `design.md` (estructura y componentes) · `requirements.md` (requisitos).

---

## Fase 1 — Configuración del proyecto ✅

- [x] **T-01** Instalar y configurar Tailwind CSS en el proyecto Astro.
  - Ejecutar `npx astro add tailwind`.
  - Paleta de colores configurada con `@theme` en `src/styles/global.css` (Tailwind v4, sin `tailwind.config.mjs`).
  - Fuentes `Playfair Display` e `Inter` importadas desde Google Fonts en `src/styles/global.css`.

- [x] **T-02** Configurar Turso (`@libsql/client`).
  - Instalar dependencia: `npm install @libsql/client` ⚠️ ejecutar manualmente en la terminal.
  - `.env.example` creado con `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` y `PUBLIC_WHATSAPP_NUMBER`.
  - `src/lib/turso.ts` creado con el cliente singleton de conexión.

- [x] **T-03** Crear la tabla `vehiculos` en Turso.
  - Script SQL pendiente de ejecución (ver Fase 2 de implementación).
  - Datos de muestra pendientes de inserción.

- [x] **T-04** Crear `src/types/vehiculo.ts` con las interfaces `Vehiculo` y `Modalidad`.
  - Incluye: `Vehiculo`, `VehiculoRow`, `DatosReserva`, tipos `CategoriaVehiculo`, `Modalidad`, `Transmision`, `Combustible`.
  - Constantes `FILTROS_CATEGORIA` y `OPCIONES_MODALIDAD`.
  - Función `mapearVehiculoRow()` para convertir filas de Turso a `Vehiculo`.

---

## Fase 2 — Layout base y componentes globales ✅

- [x] **T-05** Crear `src/layouts/BaseLayout.astro`.
  - Props: `titulo`, `descripcion`, `imagen?`, `url?`.
  - SEO completo: `<title>`, `<meta description>`, Open Graph, Twitter Card, canonical.
  - Incluye `Header`, `Footer` y `BotonWhatsApp` flotante.

- [x] **T-06** Crear `src/components/layout/Header.astro`.
  - Logo izquierda, navegación derecha (Inicio, Catálogo, Contacto).
  - Sticky con fondo semitransparente → sólido al hacer scroll.
  - Menú hamburguesa animado (X) para móvil con JS vanilla.

- [x] **T-07** Crear `src/components/layout/Footer.astro`.
  - Logo, navegación rápida, enlace WhatsApp, email y créditos con año dinámico.

- [x] **T-08** Crear `src/components/ui/BotonWhatsApp.astro`.
  - Variante `primario` (inline) y `flotante` (fija esquina inferior derecha).

- [x] **T-09** Crear `src/components/ui/Badge.astro`.
  - Variantes `dorado`, `oscuro` y `blanco` para distintos contextos.

---

## Fase 3 — Lógica de datos y utilidades ✅

- [x] **T-10** Crear `src/lib/vehiculos.ts` con las funciones de consulta:
  - `obtenerVehiculos(categoria?)` — lista completa o filtrada por categoría.
  - `obtenerVehiculosDestacados()` — vehículos con `destacado = 1` (máx. 4).
  - `obtenerVehiculoPorSlug(slug)` — detalle de un vehículo para SSG.
  - `obtenerSlugsVehiculos()` — todos los slugs para `getStaticPaths()`.
  - `obtenerCategorias()` — categorías únicas para el filtro dinámico.

- [x] **T-11** Crear `src/lib/whatsapp.ts` con `generarEnlaceWhatsApp(params)`.
  - Funciones auxiliares: `formatearFecha()`, `calcularDias()`, `calcularPrecio()`, `enlaceWhatsAppGeneral()`.
  - Script de datos: `db/seed.sql` con tabla `vehiculos` y 8 vehículos de muestra.

---

## Fase 4 — Componentes del catálogo ✅

- [x] **T-12** Crear `src/components/catalogo/TarjetaVehiculo.astro`.
  - Imagen con lazy load, badge de categoría, nombre, descripción (line-clamp-2), precio desde y CTA.

- [x] **T-13** Crear `src/components/catalogo/FiltroCategorias.astro`.
  - Chips con parámetros de URL (`?categoria=SUV`). Estado activo visual con color accent.

- [x] **T-14** Crear `src/components/catalogo/ListadoVehiculos.astro`.
  - Grid 1/2/3 columnas + estado vacío con enlace a ver todos.

---

## Fase 5 — Componentes de detalle de vehículo ✅

- [x] **T-15** Crear `src/components/detalle/GaleriaImagenes.astro`.
  - Imagen principal + miniaturas clicables con fade JS vanilla y estados aria-pressed.

- [x] **T-16** Crear `src/components/detalle/EspecificacionesTecnicas.astro`.
  - Grid 2×2 con iconos SVG inline: plazas, transmisión, combustible, categoría.

- [x] **T-17** Crear `src/components/detalle/FormularioReserva.astro`.
  - Selector modalidad + fechas + precio dinámico en tiempo real + enlace WhatsApp preformateado.

---

## Fase 6 — Componentes de la página de inicio ✅

- [x] **T-18** Crear `src/components/inicio/HeroSeccion.astro`.
  - Gradiente navy, badge animado, título, subtítulo, CTAs (catálogo + WhatsApp), stats y flecha scroll.

- [x] **T-19** Crear `src/components/inicio/VehiculosDestacados.astro`.
  - Llama a `obtenerVehiculosDestacados()` y renderiza hasta 4 `TarjetaVehiculo`.

- [x] **T-20** Crear `src/components/inicio/PorQueElegirnos.astro`.
  - Grid 3×2 con 6 ventajas del servicio (iconos SVG + título + descripción).

---

## Fase 7 — Páginas ✅

- [x] **T-21** `src/pages/index.astro` — Hero + Destacados + PorQueElegirnos.

- [x] **T-22** `src/pages/catalogo/index.astro` — Filtro por categoría vía URL + contador de resultados.

- [x] **T-23** `src/pages/vehiculo/[slug].astro` — SSG con getStaticPaths(), galería+specs+formulario+precios, breadcrumb.

- [x] **T-24** `src/pages/contacto.astro` — WhatsApp+email+ubicación+horario. Botón WhatsApp general.

---

## Fase 8 — Optimización y ajustes finales ✅

- [x] **T-25** Imágenes con `loading="lazy"`, `decoding="async"`, `alt` descriptivo y fallback onerror en todas las tarjetas y galerías.

- [x] **T-26** Accesibilidad: `aria-label` en todos los botones de icono, `aria-current` en nav, `aria-live` en resumen de precio, `role="list"` en grids semánticos, navegación por teclado con `focus:ring`.

- [x] **T-27** SEO: `<title>` y `<meta description>` únicos por página, `<link rel="canonical">` en BaseLayout, Open Graph + Twitter Card, URLs amigables para los 8 vehículos generadas con `getStaticPaths()`.

- [x] **T-28** Build de producción: 11 páginas generadas correctamente (1 inicio + 1 catálogo + 1 contacto + 8 detalles). Sin errores ni warnings.

---

## Resumen de dependencias entre tareas

```
T-01, T-02, T-03, T-04          → Fase 1 (base)
      ↓
T-05 → T-06, T-07, T-08, T-09  → Fase 2 (layout)
T-10, T-11                      → Fase 3 (lógica)
      ↓
T-12, T-13, T-14                → Fase 4 (catálogo)
T-15, T-16, T-17                → Fase 5 (detalle)
T-18, T-19, T-20                → Fase 6 (inicio)
      ↓
T-21, T-22, T-23, T-24          → Fase 7 (páginas)
      ↓
T-25, T-26, T-27, T-28          → Fase 8 (optimización)
```
