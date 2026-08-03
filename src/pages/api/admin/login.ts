/**
 * POST /api/admin/login — Valida la contraseña y crea la cookie de sesión.
 * POST /api/admin/logout — Elimina la cookie de sesión.
 */
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, url }) => {
  const accion = url.searchParams.get('accion');

  // ── Logout ────────────────────────────────────────────────────────────────
  if (accion === 'logout') {
    cookies.delete('admin_session', { path: '/' });
    return new Response(null, {
      status: 302,
      headers: { Location: '/admin/login' },
    });
  }

  // ── Login ─────────────────────────────────────────────────────────────────
  let clave = '';
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const body = await request.json();
    clave = body?.password ?? '';
  } else {
    const formData = await request.formData();
    clave = formData.get('password')?.toString() ?? '';
  }

  const claveCorrecta = import.meta.env.ADMIN_PASSWORD;
  if (!claveCorrecta || clave !== claveCorrecta) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/admin/login?error=1' },
    });
  }

  // Crear cookie de sesión HTTP-only (8 horas)
  cookies.set('admin_session', 'authenticated', {
    path:     '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge:   60 * 60 * 8,
    secure:   import.meta.env.PROD,
  });

  return new Response(null, {
    status: 302,
    headers: { Location: '/admin' },
  });
};
