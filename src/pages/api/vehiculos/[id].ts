/**
 * PUT  /api/vehiculos/[id] — Actualiza un vehículo existente.
 * DELETE /api/vehiculos/[id] — Elimina un vehículo.
 * Requiere cookie de sesión de administrador.
 */
import type { APIRoute } from 'astro';
import {
  actualizarVehiculo,
  eliminarVehiculo,
  type DatosVehiculo,
} from '../../../lib/vehiculos';

export const prerender = false;

// ── PUT — Actualizar ──────────────────────────────────────────────────────────
export const PUT: APIRoute = async ({ params, request, cookies }) => {
  if (cookies.get('admin_session')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const id = Number(params.id);
  if (isNaN(id) || id <= 0) {
    return new Response(JSON.stringify({ error: 'ID inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let datos: Partial<DatosVehiculo>;
  try {
    datos = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'JSON inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const actualizado = await actualizarVehiculo(id, datos);
    if (!actualizado) {
      return new Response(JSON.stringify({ error: 'Vehículo no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const mensaje = err instanceof Error ? err.message : 'Error interno';
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

// ── DELETE — Eliminar ─────────────────────────────────────────────────────────
export const DELETE: APIRoute = async ({ params, cookies }) => {
  if (cookies.get('admin_session')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const id = Number(params.id);
  if (isNaN(id) || id <= 0) {
    return new Response(JSON.stringify({ error: 'ID inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const eliminado = await eliminarVehiculo(id);
    if (!eliminado) {
      return new Response(JSON.stringify({ error: 'Vehículo no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const mensaje = err instanceof Error ? err.message : 'Error interno';
    return new Response(JSON.stringify({ error: mensaje }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
