# Requisitos — Nourd Rent Car

## 1. Descripción general

Nourd Rent Car es una web de alquiler de vehículos de gama media-alta (SUVs, Mercedes, Dacia, etc.) orientada al mercado hispanohablante. El objetivo principal es mostrar el catálogo de vehículos disponibles y permitir al usuario iniciar una reserva directamente por WhatsApp con un mensaje preformateado.

---

## 2. Requisitos funcionales

### RF-01 — Catálogo de vehículos
- El sistema debe mostrar una lista de vehículos disponibles para alquiler.
- Cada vehículo incluirá: imagen, nombre/modelo, categoría (SUV, berlina, utilitario…), descripción breve, precio por día y disponibilidad.
- El catálogo debe permitir filtrar por categoría (SUV, Mercedes, Dacia, etc.).

### RF-02 — Modalidad de alquiler
- Cada vehículo ofrecerá dos modalidades de alquiler:
  - **Con Conductor**: el vehículo se entrega con conductor incluido.
  - **Sin Conductor**: el cliente conduce él mismo.
- El precio puede variar según la modalidad seleccionada.

### RF-03 — Formulario / acción de reserva
- Cada tarjeta de vehículo incluirá un formulario o botón de reserva con los campos:
  - Fecha de inicio del alquiler.
  - Fecha de fin del alquiler.
  - Modalidad de alquiler (Con Conductor / Sin Conductor).
- Al confirmar, se abrirá WhatsApp (web o app) con un mensaje preformateado que incluya:
  - Nombre y modelo del vehículo.
  - Fechas seleccionadas.
  - Modalidad elegida.
  - Precio estimado (opcional, calculado según días).

### RF-04 — Página de detalle de vehículo
- Al hacer clic en un vehículo del catálogo, se mostrará una página de detalle con:
  - Galería de imágenes.
  - Especificaciones técnicas (plazas, transmisión, combustible, etc.).
  - Descripción completa.
  - Formulario de reserva integrado.

### RF-05 — Página de inicio (hero + secciones)
- La página de inicio contendrá:
  - Hero con eslogan, llamada a la acción y imagen destacada.
  - Sección de vehículos destacados (los 3–4 más populares).
  - Sección "¿Por qué elegirnos?" (ventajas del servicio).
  - Sección de contacto / ubicación.

### RF-06 — Página de contacto
- Mostrar número de WhatsApp, email y ubicación (con enlace a Google Maps).
- Botón directo de WhatsApp para consultas generales.

---

## 3. Requisitos no funcionales

### RNF-01 — Stack tecnológico
- **Framework**: Astro (generación estática con hidratación parcial donde sea necesario).
- **Estilos**: Tailwind CSS.
- **Base de datos**: Turso (SQLite en el edge) para almacenar el catálogo de vehículos.
- **Despliegue**: compatible con Vercel / Netlify / Cloudflare Pages.

### RNF-02 — Rendimiento
- Puntuación Lighthouse ≥ 90 en Performance, Accesibilidad y SEO.
- Imágenes optimizadas con el componente `<Image>` de Astro.
- Uso de renderizado estático (SSG) para páginas de catálogo con revalidación periódica.

### RNF-03 — Idioma
- Todo el contenido visible, comentarios de código y documentación están en español.

### RNF-04 — Responsividad
- Diseño completamente adaptable (mobile-first) con breakpoints para móvil, tablet y escritorio.

### RNF-05 — Accesibilidad
- Cumplimiento WCAG 2.1 nivel AA: contraste de colores, textos alternativos en imágenes, navegación por teclado.

### RNF-06 — SEO
- Metaetiquetas configuradas por página (título, descripción, Open Graph).
- URL amigables (p. ej. `/catalogo/mercedes-clase-e`).

### RNF-07 — Seguridad
- No se almacenan datos personales del usuario en la web.
- La reserva se gestiona íntegramente a través de WhatsApp (fuera del alcance de la web).

---

## 4. Casos de uso principales

| ID   | Actor   | Acción                                          | Resultado esperado                                      |
|------|---------|-------------------------------------------------|---------------------------------------------------------|
| CU-1 | Visitante | Navega al catálogo y filtra por categoría     | Ve los vehículos de la categoría seleccionada           |
| CU-2 | Visitante | Abre detalle de un vehículo                   | Ve galería, specs y formulario de reserva               |
| CU-3 | Visitante | Selecciona fechas y modalidad, pulsa "Reservar"| Se abre WhatsApp con mensaje preformateado              |
| CU-4 | Visitante | Pulsa "Contacto" desde cualquier página        | Accede a datos de contacto y botón de WhatsApp general  |

---

## 5. Restricciones y dependencias

- Se requiere una cuenta de Turso y una base de datos creada antes del desarrollo.
- El número de WhatsApp del negocio debe configurarse como variable de entorno (`PUBLIC_WHATSAPP_NUMBER`).
- Las imágenes de los vehículos se almacenarán en la carpeta `public/vehiculos/` o en un CDN externo.
