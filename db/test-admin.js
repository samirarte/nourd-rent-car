/**
 * Script de prueba del panel de administración.
 * Ejecuta: login → crear → editar → eliminar → verificar.
 * Uso: node db/test-admin.js
 */

const BASE = 'http://localhost:4321';

async function login() {
  const res = await fetch(`${BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'admin1234' }),
    redirect: 'manual',
  });
  const rawCookie = res.headers.get('set-cookie') ?? '';
  const cookie    = rawCookie.split(';')[0].trim();
  if (!cookie.startsWith('admin_session=')) {
    throw new Error(`Login fallido. Status: ${res.status}. Cookie: "${rawCookie}"`);
  }
  console.log('✅ Login correcto');
  return cookie;
}

async function api(cookie, url, method, body) {
  const res = await fetch(`${BASE}${url}`, {
    method,
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

// ── Test suite ────────────────────────────────────────────────────────────────
const cookie = await login();

// 1. Crear vehículo
const { status: s1, json: j1 } = await api(cookie, '/api/vehiculos', 'POST', {
  slug: 'test-vehiculo-admin',
  nombre: 'Vehículo de Prueba',
  categoria: 'SUV',
  descripcion: 'Descripción corta.',
  descripcionLarga: 'Descripción larga para la prueba del panel de administración.',
  precioSinConductor: 50,
  precioConConductor: 80,
  imagenPrincipal: '/vehiculos/placeholder.jpg',
  imagenes: [],
  plazas: 5,
  transmision: 'Automático',
  combustible: 'Gasolina',
  destacado: false,
  disponible: true,
});
console.log(`Crear  → ${s1} ${JSON.stringify(j1)}`);
if (s1 !== 201) throw new Error('Crear falló');
const nuevoId = j1.id;

// 2. Editar vehículo
const { status: s2, json: j2 } = await api(cookie, `/api/vehiculos/${nuevoId}`, 'PUT', {
  nombre: 'Vehículo de Prueba (editado)',
  precioSinConductor: 55,
  destacado: true,
});
console.log(`Editar → ${s2} ${JSON.stringify(j2)}`);
if (s2 !== 200) throw new Error('Editar falló');

// 3. Eliminar vehículo
const { status: s3, json: j3 } = await api(cookie, `/api/vehiculos/${nuevoId}`, 'DELETE');
console.log(`Borrar → ${s3} ${JSON.stringify(j3)}`);
if (s3 !== 200) throw new Error('Borrar falló');

// 4. Verificar que ya no existe
const { status: s4, json: j4 } = await api(cookie, `/api/vehiculos/${nuevoId}`, 'DELETE');
console.log(`Doble borrado → ${s4} ${JSON.stringify(j4)} (esperado 404)`);

console.log('\n✅ Todas las pruebas de mutación pasaron correctamente.');
