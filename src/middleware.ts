/**
 * Middleware de Astro.
 * Protege todas las rutas bajo /admin/* excepto /admin/login y /api/admin/login.
 * Redirige al login si no hay cookie de sesión válida.
 */
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(({ url, cookies, redirect }, next) => {
  const esRutaAdmin = url.pathname.startsWith('/admin');
  const esLogin     = url.pathname === '/admin/login';
  const esApiLogin  = url.pathname.startsWith('/api/admin/login');
  const autenticado = cookies.get('admin_session')?.value === 'authenticated';

  // Rutas de auth: siempre accesibles
  if (esLogin || esApiLogin) return next();

  // Proteger /admin/*
  if (esRutaAdmin && !autenticado) {
    return redirect('/admin/login', 302);
  }

  // Resto de rutas: continuar normalmente
  return next();
});
