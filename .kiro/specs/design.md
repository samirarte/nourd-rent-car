# Diseño — Nourd Rent Car

## 1. Arquitectura general

```
┌─────────────────────────────────────────────────────────┐
│                        Navegador                        │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP / SSG
┌────────────────────────▼────────────────────────────────┐
│               Astro (SSG + Island Architecture)         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  src/pages/  │  │ src/layouts/ │  │ src/components│  │
│  └──────┬───────┘  └──────────────┘  └───────────────┘  │
│         │ build time                                     │
│  ┌──────▼───────────────────────────┐                   │
│  │    src/lib/turso.ts              │                   │
│  │  (cliente Turso / libsql)        │                   │
└──┴──────┬───────────────────────────┴───────────────────┘
          │ SQL (HTTP edge)
┌─────────▼────────────────┐
│     Turso (SQLite edge)   │
│   Tabla: vehiculos        │
└──────────────────────────┘
```

- **Astro** genera páginas estáticas en tiempo de build; los datos del catálogo se leen desde Turso durante el build.
- Las islas interactivas (filtro de categoría, formulario de reserva) se hidratan en el cliente con componentes Astro puros (sin framework adicional salvo que se requiera).
- **Tailwind CSS** gestiona todos los estilos mediante clases utilitarias.
- **Turso** actúa como base de datos SQLite en el edge, consultada con `@libsql/client`.

---

## 2. Estructura de directorios

```
nourd-rent-car/
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   └── vehiculos/           # Imágenes de los vehículos
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   └── NavMenu.astro
│   │   ├── ui/
│   │   │   ├── BotonWhatsApp.astro
│   │   │   ├── Tarjeta.astro        # Tarjeta genérica reutilizable
│   │   │   └── Badge.astro          # Etiqueta de categoría
│   │   ├── catalogo/
│   │   │   ├── TarjetaVehiculo.astro
│   │   │   ├── FiltroCategorias.astro
│   │   │   └── ListadoVehiculos.astro
│   │   ├── detalle/
│   │   │   ├── GaleriaImagenes.astro
│   │   │   ├── EspecificacionesTecnicas.astro
│   │   │   └── FormularioReserva.astro
│   │   └── inicio/
│   │       ├── HeroSeccion.astro
│   │       ├── VehiculosDestacados.astro
│   │       └── PorQueElegirnos.astro
│   ├── layouts/
│   │   └── BaseLayout.astro         # Layout principal con SEO
│   ├── lib/
│   │   ├── turso.ts                 # Cliente de base de datos
│   │   ├── vehiculos.ts             # Funciones de consulta al catálogo
│   │   └── whatsapp.ts              # Generador de enlace de WhatsApp
│   ├── pages/
│   │   ├── index.astro              # Página de inicio
│   │   ├── catalogo/
│   │   │   └── index.astro          # Catálogo completo con filtros
│   │   ├── vehiculo/
│   │   │   └── [slug].astro         # Página de detalle dinámica
│   │   └── contacto.astro           # Página de contacto
│   ├── styles/
│   │   └── global.css               # Estilos base + fuentes
│   └── types/
│       └── vehiculo.ts              # Tipos TypeScript
├── .env                             # Variables de entorno (no commitear)
├── .env.example                     # Plantilla de variables de entorno
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

---

## 3. Modelo de datos

### Tabla `vehiculos` (Turso / SQLite)

| Columna           | Tipo    | Descripción                                        |
|-------------------|---------|----------------------------------------------------|
| `id`              | INTEGER | Clave primaria autoincremental                     |
| `slug`            | TEXT    | Identificador URL amigable (p. ej. `mercedes-c200`)|
| `nombre`          | TEXT    | Nombre completo del vehículo                       |
| `categoria`       | TEXT    | SUV / Mercedes / Dacia / Berlina / Utilitario      |
| `descripcion`     | TEXT    | Descripción breve (tarjeta)                        |
| `descripcion_larga` | TEXT  | Descripción completa (página de detalle)           |
| `precio_sin_conductor` | REAL | Precio por día sin conductor (€)              |
| `precio_con_conductor` | REAL | Precio por día con conductor (€)             |
| `imagen_principal`| TEXT    | Ruta o URL de la imagen principal                  |
| `imagenes`        | TEXT    | JSON array con rutas de imágenes adicionales       |
| `plazas`          | INTEGER | Número de plazas                                   |
| `transmision`     | TEXT    | Manual / Automático                                |
| `combustible`     | TEXT    | Gasolina / Diésel / Híbrido / Eléctrico            |
| `destacado`       | INTEGER | 1 = mostrar en sección de destacados               |
| `disponible`      | INTEGER | 1 = disponible para reserva                        |

### Tipo TypeScript (`src/types/vehiculo.ts`)

```typescript
export interface Vehiculo {
  id: number;
  slug: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  descripcionLarga: string;
  precioSinConductor: number;
  precioConConductor: number;
  imagenPrincipal: string;
  imagenes: string[];
  plazas: number;
  transmision: string;
  combustible: string;
  destacado: boolean;
  disponible: boolean;
}

export type Modalidad = 'con-conductor' | 'sin-conductor';
```

---

## 4. Diseño UX/UI

### 4.1 Paleta de colores

| Token             | Hex       | Uso                                        |
|-------------------|-----------|--------------------------------------------|
| `primary`         | `#1A1A2E` | Fondo oscuro principal (navy profundo)     |
| `primary-light`   | `#16213E` | Fondo de tarjetas y secciones alternas     |
| `accent`          | `#C9A84C` | Dorado: CTAs, badges, detalles premium     |
| `accent-hover`    | `#B8973D` | Hover del color acento                     |
| `text-base`       | `#F5F5F5` | Texto principal sobre fondo oscuro         |
| `text-muted`      | `#9CA3AF` | Texto secundario / metadatos               |
| `success`         | `#25D366` | Verde WhatsApp                             |
| `white`           | `#FFFFFF` | Fondos de formularios y tarjetas claras    |

### 4.2 Tipografía

- **Encabezados**: `Playfair Display` (serif elegante) — marca premium.
- **Cuerpo y UI**: `Inter` (sans-serif legible) — etiquetas, precios, botones.
- Escala tipográfica gestionada con Tailwind (`text-sm`, `text-base`, `text-xl`, `text-4xl`…).

### 4.3 Componentes de UI principales

#### Header
- Logo izquierda + menú de navegación derecha.
- Sticky con fondo semitransparente que se vuelve sólido al hacer scroll.
- Hamburger menu en móvil.

#### TarjetaVehiculo
```
┌──────────────────────────┐
│   [Imagen del vehículo]  │
│   Badge: categoría       │
├──────────────────────────┤
│  Nombre del vehículo     │
│  Descripción breve       │
│  ───────────────────     │
│  Desde 45 €/día          │
│  [Ver detalles →]        │
└──────────────────────────┘
```

#### FormularioReserva (página de detalle)
```
┌──────────────────────────────────┐
│  Modalidad: [Con conductor ▼]    │
│  Fecha inicio: [──/──/────]      │
│  Fecha fin:    [──/──/────]      │
│  Precio estimado: 135 €          │
│  [  Reservar por WhatsApp  ]     │
└──────────────────────────────────┘
```

#### BotonWhatsApp
- Fondo verde `#25D366`, icono de WhatsApp + texto.
- Abre `https://wa.me/{numero}?text={mensaje_codificado}`.

### 4.4 Páginas y flujo de navegación

```
Inicio (/)
  ├── Hero + CTA "Ver catálogo"
  ├── Vehículos destacados → [click] → Detalle de vehículo
  └── ¿Por qué elegirnos?

Catálogo (/catalogo)
  ├── Filtros por categoría (tabs o chips)
  └── Grid de tarjetas → [click] → Detalle de vehículo

Detalle (/vehiculo/[slug])
  ├── Galería de imágenes
  ├── Especificaciones técnicas
  └── Formulario de reserva → [Reservar] → WhatsApp

Contacto (/contacto)
  └── Datos + mapa + botón WhatsApp general
```

### 4.5 Diseño responsive (breakpoints Tailwind)

| Breakpoint | Ancho    | Layout del catálogo |
|------------|----------|---------------------|
| `sm`       | < 640px  | 1 columna           |
| `md`       | 640–1023px | 2 columnas        |
| `lg`       | ≥ 1024px | 3 columnas          |

---

## 5. Lógica de negocio clave

### Generador de enlace WhatsApp (`src/lib/whatsapp.ts`)

```typescript
// Genera el enlace de WhatsApp con el mensaje preformateado
export function generarEnlaceWhatsApp(params: {
  vehiculo: string;
  fechaInicio: string;
  fechaFin: string;
  modalidad: Modalidad;
  precioEstimado?: number;
}): string {
  const numero = import.meta.env.PUBLIC_WHATSAPP_NUMBER;
  const mensaje = `Hola, me interesa alquilar el vehículo *${params.vehiculo}*.
  
📅 Fecha de inicio: ${params.fechaInicio}
📅 Fecha de fin: ${params.fechaFin}
🚗 Modalidad: ${params.modalidad === 'con-conductor' ? 'Con conductor' : 'Sin conductor'}
${params.precioEstimado ? `💶 Precio estimado: ${params.precioEstimado} €` : ''}

¿Podría confirmarme la disponibilidad?`;

  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}
```

### Variables de entorno necesarias

```env
# .env.example
TURSO_DATABASE_URL=libsql://tu-base.turso.io
TURSO_AUTH_TOKEN=tu-token-de-autenticacion
PUBLIC_WHATSAPP_NUMBER=34600000000   # Sin el '+'
```

---

## 6. SEO y metadatos

Cada página recibirá a través de `BaseLayout.astro`:

```astro
---
// Propiedades del layout base
interface Props {
  titulo: string;          // <title>
  descripcion: string;     // <meta name="description">
  imagen?: string;         // Open Graph image
  url?: string;            // Open Graph URL canónica
}
---
```

Páginas de detalle generarán metadatos dinámicos a partir del vehículo:
- Título: `{Nombre del vehículo} — Nourd Rent Car`
- Descripción: los primeros 160 caracteres de `descripcionLarga`.
