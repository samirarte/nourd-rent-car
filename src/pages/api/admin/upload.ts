/**
 * POST /api/admin/upload — Sube una imagen al servidor.
 *
 * Acepta multipart/form-data con un campo "imagen" (File).
 * Guarda el archivo en public/vehiculos/ y devuelve la URL pública.
 *
 * Límites: 5 MB por imagen. Formatos: JPEG, PNG, WebP, AVIF.
 */
import type { APIRoute } from 'astro';
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

export const prerender = false;

const MAX_BYTES    = 5 * 1024 * 1024; // 5 MB
const TIPOS_OK     = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const UPLOAD_DIR   = path.join(process.cwd(), 'public', 'vehiculos');

/** Sanitiza el nombre de archivo eliminando caracteres peligrosos. */
function sanitizarNombre(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   // quitar tildes
    .replace(/[^a-z0-9.\-_]/g, '-')                      // solo alfanumérico
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export const POST: APIRoute = async ({ request, cookies }) => {
  // Auth
  if (cookies.get('admin_session')?.value !== 'authenticated') {
    return json({ error: 'No autorizado' }, 401);
  }

  // Parsear multipart
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ error: 'Cuerpo de petición inválido' }, 400);
  }

  const archivo = formData.get('imagen');
  if (!(archivo instanceof File)) {
    return json({ error: 'Se esperaba un campo "imagen" de tipo File' }, 400);
  }

  // Validar tipo
  if (!TIPOS_OK.has(archivo.type)) {
    return json({ error: `Tipo no permitido: ${archivo.type}. Usa JPEG, PNG, WebP o AVIF.` }, 415);
  }

  // Validar tamaño
  if (archivo.size > MAX_BYTES) {
    return json({ error: `El archivo supera el límite de 5 MB (${(archivo.size / 1048576).toFixed(1)} MB)` }, 413);
  }

  // Generar nombre único: timestamp_nombre-original.ext
  const ext          = archivo.name.split('.').pop() ?? 'jpg';
  const base         = sanitizarNombre(archivo.name.replace(/\.[^.]+$/, ''));
  const nombreFinal  = `${Date.now()}_${base}.${ext}`;
  const rutaAbsoluta = path.join(UPLOAD_DIR, nombreFinal);

  // Crear directorio si no existe
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  // Guardar archivo
  try {
    const buffer = Buffer.from(await archivo.arrayBuffer());
    await writeFile(rutaAbsoluta, buffer);
  } catch (err) {
    console.error('[upload] Error al guardar:', err);
    return json({ error: 'Error al guardar el archivo en el servidor' }, 500);
  }

  return json({ ok: true, url: `/vehiculos/${nombreFinal}` }, 201);
};

/** Helper para respuestas JSON */
function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
