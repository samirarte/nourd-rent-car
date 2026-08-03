/**
 * POST /api/vehiculos — Crea un nuevo vehículo.
 * Requiere cookie de sesión de administrador.
 */
import type { APIRoute } from 'astro';
import { crearVehiculo, type DatosVehiculo } from '../../../lib/vehiculos';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  // Verificar sesión de administrador
  if (cookies.get('admin_session')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let datos: DatosVehiculo;
  try {
    datos = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'JSON inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validación básica de campos obligatorios
  const obligatorios: (keyof DatosVehiculo)[] = [
    'slug', 'nombre', 'categoria', 'descripcion', 'descripcionLarga',
    'precioSinConductor', 'precioConConductor', 'imagenPrincipal', 'plazas',
    'transmision', 'combustible',
  ];
  const faltantes = obligatorios.filter((c) => datos[c] === undefined || datos[c] === '');
  if (faltantes.length > 0) {
    return new Response(
      JSON.stringify({ error: `Campos obligatorios faltantes: ${faltantes.join(', ')}` }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  try {
    const id = await crearVehiculo(datos);
    return new Response(JSON.stringify({ ok: true, id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const mensaje = err instanceof Error ? err.message : 'Error interno';
    // Slug duplicado → 409 Conflict
    if (mensaje.includes('UNIQUE') || mensaje.includes('unique')) {
      return new Response(JSON.stringify({ error: 'El slug ya existe' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: mensaje }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
