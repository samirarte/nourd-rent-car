/**
 * Tipos TypeScript para la entidad Vehículo y sus derivados.
 * Usados en todo el proyecto: consultas a Turso, componentes y formularios.
 */

// ─── Entidad principal ────────────────────────────────────────────────────────

export interface Vehiculo {
  id: number;
  slug: string;
  nombre: string;
  categoria: CategoriaVehiculo;
  descripcion: string;               // Texto corto para la tarjeta del catálogo
  descripcionLarga: string;          // Texto completo para la página de detalle
  precioSinConductor: number;        // Precio por día sin conductor (€)
  precioConConductor: number;        // Precio por día con conductor (€)
  imagenPrincipal: string;           // Ruta o URL de la imagen principal
  imagenes: string[];                // Galería de imágenes adicionales
  plazas: number;
  transmision: Transmision;
  combustible: Combustible;
  destacado: boolean;                // true → aparece en sección de destacados
  disponible: boolean;               // false → muestra "No disponible"
}

// ─── Tipos enumerados ─────────────────────────────────────────────────────────

/** Categorías de vehículos mostradas en los filtros del catálogo */
export type CategoriaVehiculo =
  | 'SUV'
  | 'Mercedes'
  | 'Dacia'
  | 'Berlina'
  | 'Utilitario'
  | 'Otro';

/** Modalidad de alquiler seleccionable en el formulario de reserva */
export type Modalidad = 'con-conductor' | 'sin-conductor';

/** Tipo de transmisión del vehículo */
export type Transmision = 'Manual' | 'Automático';

/** Tipo de combustible del vehículo */
export type Combustible = 'Gasolina' | 'Diésel' | 'Híbrido' | 'Eléctrico';

// ─── Tipos auxiliares para filtros y formularios ──────────────────────────────

/** Opción de filtro en el catálogo (incluye "Todos") */
export interface FiltroCategoriaOpcion {
  valor: CategoriaVehiculo | 'Todos';
  etiqueta: string;
}

/** Lista predefinida de opciones de filtro para el componente FiltroCategorias */
export const FILTROS_CATEGORIA: FiltroCategoriaOpcion[] = [
  { valor: 'Todos',      etiqueta: 'Todos' },
  { valor: 'SUV',        etiqueta: 'SUV' },
  { valor: 'Mercedes',   etiqueta: 'Mercedes' },
  { valor: 'Dacia',      etiqueta: 'Dacia' },
  { valor: 'Berlina',    etiqueta: 'Berlina' },
  { valor: 'Utilitario', etiqueta: 'Utilitario' },
  { valor: 'Otro',       etiqueta: 'Otro' },
];

/** Opciones de modalidad de alquiler para el formulario de reserva */
export interface ModalidadOpcion {
  valor: Modalidad;
  etiqueta: string;
}

export const OPCIONES_MODALIDAD: ModalidadOpcion[] = [
  { valor: 'sin-conductor', etiqueta: 'Sin conductor' },
  { valor: 'con-conductor', etiqueta: 'Con conductor' },
];

// ─── Datos del formulario de reserva ─────────────────────────────────────────

export interface DatosReserva {
  vehiculoSlug: string;
  vehiculoNombre: string;
  modalidad: Modalidad;
  fechaInicio: string;   // Formato ISO: YYYY-MM-DD
  fechaFin: string;      // Formato ISO: YYYY-MM-DD
  precioEstimado?: number;
}

// ─── Tipo para la fila cruda de Turso (snake_case → camelCase) ────────────────

/** Fila tal como la devuelve la base de datos Turso (columnas en snake_case) */
export interface VehiculoRow {
  id: number;
  slug: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  descripcion_larga: string;
  precio_sin_conductor: number;
  precio_con_conductor: number;
  imagen_principal: string;
  imagenes: string;       // JSON serializado: "[\"ruta1.jpg\",\"ruta2.jpg\"]"
  plazas: number;
  transmision: string;
  combustible: string;
  destacado: number;      // SQLite usa 0/1 en lugar de boolean
  disponible: number;
}

/**
 * Convierte una fila cruda de Turso al tipo Vehiculo.
 * Centraliza el mapeo snake_case → camelCase y la deserialización de JSON.
 */
export function mapearVehiculoRow(row: VehiculoRow): Vehiculo {
  return {
    id:                  row.id,
    slug:                row.slug,
    nombre:              row.nombre,
    categoria:           row.categoria as CategoriaVehiculo,
    descripcion:         row.descripcion,
    descripcionLarga:    row.descripcion_larga,
    precioSinConductor:  row.precio_sin_conductor,
    precioConConductor:  row.precio_con_conductor,
    imagenPrincipal:     row.imagen_principal,
    imagenes:            JSON.parse(row.imagenes || '[]') as string[],
    plazas:              row.plazas,
    transmision:         row.transmision as Transmision,
    combustible:         row.combustible as Combustible,
    destacado:           row.destacado === 1,
    disponible:          row.disponible === 1,
  };
}
