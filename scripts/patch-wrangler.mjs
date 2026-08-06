/**
 * scripts/patch-wrangler.mjs
 *
 * Post-build: elimina el binding "ASSETS" del wrangler.json generado por
 * @astrojs/cloudflare, ya que "ASSETS" es un nombre reservado en
 * Cloudflare Pages y causa error al desplegar.
 *
 * Uso: node scripts/patch-wrangler.mjs
 * Se ejecuta automáticamente tras `astro build` vía npm run deploy.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const WRANGLER_DIST = join(process.cwd(), 'dist', 'server', 'wrangler.json');

if (!existsSync(WRANGLER_DIST)) {
  console.error(`[patch-wrangler] No encontrado: ${WRANGLER_DIST}`);
  console.error('  Ejecuta primero: npm run build');
  process.exit(1);
}

const config = JSON.parse(readFileSync(WRANGLER_DIST, 'utf-8'));

// Eliminar el binding de assets si se llama "ASSETS" (nombre reservado en Pages)
if (config.assets?.binding === 'ASSETS') {
  delete config.assets;
  console.log('[patch-wrangler] ✓ Binding "ASSETS" eliminado de dist/server/wrangler.json');
} else if (config.assets) {
  console.log(`[patch-wrangler] ℹ Binding assets encontrado con nombre: "${config.assets.binding}" (no es "ASSETS", no se modifica)`);
} else {
  console.log('[patch-wrangler] ℹ No existe binding de assets, nada que parchear.');
}

// Eliminar también el binding SESSION de KV si no está configurado manualmente
// (el adaptador lo añade automáticamente, pero no lo hemos provisionado en Cloudflare)
if (config.kv_namespaces) {
  const antes = config.kv_namespaces.length;
  config.kv_namespaces = config.kv_namespaces.filter(b => b.binding !== 'SESSION');
  if (config.kv_namespaces.length < antes) {
    console.log('[patch-wrangler] ✓ Binding "SESSION" (KV) eliminado — no está provisionado en este proyecto.');
  }
}
if (config.previews?.kv_namespaces) {
  config.previews.kv_namespaces = config.previews.kv_namespaces.filter(b => b.binding !== 'SESSION');
}

writeFileSync(WRANGLER_DIST, JSON.stringify(config, null, 2), 'utf-8');
console.log('[patch-wrangler] ✓ dist/server/wrangler.json actualizado.');
