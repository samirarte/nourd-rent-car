/**
 * Prueba del endpoint de subida de imágenes.
 * Uso: node db/test-upload.js
 */
import { readFileSync } from 'node:fs';

const BASE = 'http://localhost:4321';

// 1. Login
const login = await fetch(`${BASE}/api/admin/login`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: 'admin1234' }), redirect: 'manual',
});
const cookie = (login.headers.get('set-cookie') ?? '').split(';')[0].trim();
if (!cookie.startsWith('admin_session=')) throw new Error(`Login fallido: ${login.status}`);
console.log('✅ Login correcto');

// 2. Subir imagen de prueba
const imgBuffer = readFileSync('./test-img.jpg');
const form      = new FormData();
form.append('imagen', new Blob([imgBuffer], { type: 'image/jpeg' }), 'test-img.jpg');

const upload = await fetch(`${BASE}/api/admin/upload`, {
  method: 'POST', headers: { Cookie: cookie, Origin: BASE }, body: form,
});
const data = await upload.json();
console.log(`Upload → ${upload.status}`, JSON.stringify(data));
if (!upload.ok) throw new Error('Upload falló');
console.log(`✅ Imagen subida en: ${data.url}`);

// 3. Verificar que el archivo existe en public/vehiculos/
import { existsSync } from 'node:fs';
import path from 'node:path';
const ruta = path.join(process.cwd(), 'public', data.url);
if (!existsSync(ruta)) throw new Error(`Archivo no encontrado en: ${ruta}`);
console.log('✅ Archivo guardado correctamente en public/vehiculos/');

// 4. Prueba con archivo demasiado grande (debe fallar con 413)
const bigBlob = new Blob([new Uint8Array(6 * 1024 * 1024)], { type: 'image/jpeg' });
const form2   = new FormData();
form2.append('imagen', bigBlob, 'grande.jpg');
const big = await fetch(`${BASE}/api/admin/upload`, {
  method: 'POST', headers: { Cookie: cookie, Origin: BASE }, body: form2,
});
const bigData = await big.json();
console.log(`Archivo grande → ${big.status}`, bigData);
if (big.status !== 413) throw new Error('Debería haber devuelto 413');
console.log('✅ Límite de tamaño verificado (413)');

// Limpiar imagen de prueba
import { unlinkSync } from 'node:fs';
unlinkSync('./test-img.jpg');
try { unlinkSync(path.join(process.cwd(), 'public', data.url)); } catch {}
console.log('\n✅ Todas las pruebas de upload pasaron correctamente.');
