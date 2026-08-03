/**
 * Funciones de consulta al catálogo de vehículos en Turso.
 * Todas las consultas se ejecutan en tiempo de build (SSG).
 */

import { turso } from './turso';
import { type Vehiculo, type VehiculoRow, mapearVehiculoRow } from '../types/vehiculo';

// ─── Consultas principales ────────────────────────────────────────────────────

/**
 * Devuelve todos los vehículos disponibles.
 * Si se indica una categoría, filtra por ella (case-insensitive).
 */
export async function obtenerVehiculos(categoria?: string): Promise<Vehiculo[]> {
  let sql: string;
  let args: Record<string, string | number> = {};

  if (categoria && categoria !== 'Todos') {
    sql  = 'SELECT * FROM vehiculos WHERE disponible = 1 AND categoria = :categoria ORDER BY nombre ASC';
    args = { categoria };
  } else {
    sql = 'SELECT * FROM vehiculos WHERE disponible = 1 ORDER BY nombre ASC';
  }

  const resultado = await turso.execute({ sql, args });
  return (resultado.rows as unknown as VehiculoRow[]).map(mapearVehiculoRow);
}

/**
 * Devuelve los vehículos marcados como destacados (máximo 4).
 * Se usan en la sección de destacados de la página de inicio.
 */
export async function obtenerVehiculosDestacados(): Promise<Vehiculo[]> {
  const resultado = await turso.execute(
    'SELECT * FROM vehiculos WHERE disponible = 1 AND destacado = 1 ORDER BY nombre ASC LIMIT 4'
  );
  return (resultado.rows as unknown as VehiculoRow[]).map(mapearVehiculoRow);
}

/**
 * Devuelve un vehículo por su slug o null si no existe.
 * Se usa en la página de detalle /vehiculo/[slug].
 */
export async function obtenerVehiculoPorSlug(slug: string): Promise<Vehiculo | null> {
  const resultado = await turso.execute({
    sql:  'SELECT * FROM vehiculos WHERE slug = :slug AND disponible = 1 LIMIT 1',
    args: { slug },
  });

  if (resultado.rows.length === 0) return null;
  return mapearVehiculoRow(resultado.rows[0] as unknown as VehiculoRow);
}

/**
 * Devuelve todos los slugs de vehículos disponibles.
 * Se usa en getStaticPaths() para generar las rutas dinámicas en build time.
 */
export async function obtenerSlugsVehiculos(): Promise<string[]> {
  const resultado = await turso.execute(
    'SELECT slug FROM vehiculos WHERE disponible = 1'
  );
  return (resultado.rows as unknown as { slug: string }[]).map((r) => r.slug);
}

/**
 * Devuelve las categorías únicas que tienen al menos un vehículo disponible.
 * Se usa para construir el filtro del catálogo dinámicamente.
 */
export async function obtenerCategorias(): Promise<string[]> {
  const resultado = await turso.execute(
    'SELECT DISTINCT categoria FROM vehiculos WHERE disponible = 1 ORDER BY categoria ASC'
  );
  return (resultado.rows as unknown as { categoria: string }[]).map((r) => r.categoria);
}

// ─── Funciones de administración (CRUD) ──────────────────────────────────────

/**
 * Datos necesarios para crear o actualizar un vehículo.
 * Todos los campos son opcionales en actualización.
 */
export interface DatosVehiculo {
  slug: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  descripcionLarga: string;
  precioSinConductor: number;
  precioConConductor: number;
  imagenPrincipal: string;
  imagenes?: string[];      // se serializa a JSON
  plazas: number;
  transmision: string;
  combustible: string;
  destacado: boolean;
  disponible: boolean;
}

/**
 * Devuelve TODOS los vehículos (incluidos los no disponibles).
 * Solo para uso en el panel de administración.
 */
export async function obtenerTodosLosVehiculos(): Promise<Vehiculo[]> {
  const resultado = await turso.execute(
    'SELECT * FROM vehiculos ORDER BY id ASC'
  );
  return (resultado.rows as unknown as VehiculoRow[]).map(mapearVehiculoRow);
}

/**
 * Devuelve un vehículo por su ID (sin filtrar por disponible).
 * Solo para uso en el panel de administración.
 */
export async function obtenerVehiculoPorId(id: number): Promise<Vehiculo | null> {
  const resultado = await turso.execute({
    sql:  'SELECT * FROM vehiculos WHERE id = :id LIMIT 1',
    args: { id },
  });
  if (resultado.rows.length === 0) return null;
  return mapearVehiculoRow(resultado.rows[0] as unknown as VehiculoRow);
}

/**
 * Inserta un nuevo vehículo en la base de datos.
 * Devuelve el ID generado.
 */
export async function crearVehiculo(datos: DatosVehiculo): Promise<number> {
  const imagenesJson = JSON.stringify(datos.imagenes ?? []);
  const resultado = await turso.execute({
    sql: `INSERT INTO vehiculos
            (slug, nombre, categoria, descripcion, descripcion_larga,
             precio_sin_conductor, precio_con_conductor,
             imagen_principal, imagenes,
             plazas, transmision, combustible, destacado, disponible)
          VALUES
            (:slug, :nombre, :categoria, :descripcion, :descripcionLarga,
             :precioSinConductor, :precioConConductor,
             :imagenPrincipal, :imagenes,
             :plazas, :transmision, :combustible, :destacado, :disponible)`,
    args: {
      slug:               datos.slug,
      nombre:             datos.nombre,
      categoria:          datos.categoria,
      descripcion:        datos.descripcion,
      descripcionLarga:   datos.descripcionLarga,
      precioSinConductor: datos.precioSinConductor,
      precioConConductor: datos.precioConConductor,
      imagenPrincipal:    datos.imagenPrincipal,
      imagenes:           imagenesJson,
      plazas:             datos.plazas,
      transmision:        datos.transmision,
      combustible:        datos.combustible,
      destacado:          datos.destacado ? 1 : 0,
      disponible:         datos.disponible ? 1 : 0,
    },
  });
  return Number(resultado.lastInsertRowid);
}

/**
 * Actualiza los datos de un vehículo existente.
 * Devuelve true si se modificó al menos una fila.
 */
export async function actualizarVehiculo(
  id: number,
  datos: Partial<DatosVehiculo>,
): Promise<boolean> {
  // Construir SET dinámico con solo los campos presentes
  const mapa: Record<string, string> = {
    slug:               'slug',
    nombre:             'nombre',
    categoria:          'categoria',
    descripcion:        'descripcion',
    descripcionLarga:   'descripcion_larga',
    precioSinConductor: 'precio_sin_conductor',
    precioConConductor: 'precio_con_conductor',
    imagenPrincipal:    'imagen_principal',
    plazas:             'plazas',
    transmision:        'transmision',
    combustible:        'combustible',
    destacado:          'destacado',
    disponible:         'disponible',
  };

  const setClauses: string[] = [];
  const args: Record<string, unknown> = { id };

  for (const [campoJS, columnaSQL] of Object.entries(mapa)) {
    if (campoJS in datos) {
      let valor = (datos as Record<string, unknown>)[campoJS];
      if (campoJS === 'destacado' || campoJS === 'disponible') valor = valor ? 1 : 0;
      setClauses.push(`${columnaSQL} = :${campoJS}`);
      args[campoJS] = valor;
    }
  }

  // Campo especial: imagenes (array → JSON)
  if ('imagenes' in datos && datos.imagenes !== undefined) {
    setClauses.push('imagenes = :imagenes');
    args['imagenes'] = JSON.stringify(datos.imagenes);
  }

  if (setClauses.length === 0) return false;

  const resultado = await turso.execute({
    sql:  `UPDATE vehiculos SET ${setClauses.join(', ')} WHERE id = :id`,
    args,
  });

  return (resultado.rowsAffected ?? 0) > 0;
}

/**
 * Elimina un vehículo de la base de datos por su ID.
 * Devuelve true si se eliminó alguna fila.
 */
export async function eliminarVehiculo(id: number): Promise<boolean> {
  const resultado = await turso.execute({
    sql:  'DELETE FROM vehiculos WHERE id = :id',
    args: { id },
  });
  return (resultado.rowsAffected ?? 0) > 0;
}
