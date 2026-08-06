/**
 * scripts/patch-wrangler.mjs
 *
 * Post-build: limpia el dist/server/wrangler.json generado por @astrojs/cloudflare
 * eliminando todos los campos incompatibles con Cloudflare Pages.
 *
 * Cloudflare Pages rechaza: "main", "rules", "previews" y el binding "ASSETS".
 * También eliminamos el binding "SESSION" (KV) que no está provisionado.
 *
 * Uso: node scripts/patch-wrangler.mjs  (se ejecuta automáticamente via postbuild)
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const WRANGLER_DIST = join(process.cwd(), 'dist', 'server', 'wrangler.json');

if (!existsSync(WRANGLER_DIST)) {
  console.error(`[patch-wrangler] No encontrado: ${WRANGLER_DIST}`);
  process.exit(1);
}

const config = JSON.parse(readFileSync(WRANGLER_DIST, 'utf-8'));

// ── Campos incompatibles con Pages (causan error de validación) ───────────────
const CAMPOS_NO_PAGES = ['main', 'rules', 'previews'];
for (const campo of CAMPOS_NO_PAGES) {
  if (campo in config) {
    delete config[campo];
    console.log(`[patch-wrangler] ✓ Campo "${campo}" eliminado (no válido en Pages).`);
  }
}

// ── Binding ASSETS (nombre reservado en Cloudflare Pages) ─────────────────────
if (config.assets?.binding === 'ASSETS') {
  delete config.assets;
  console.log('[patch-wrangler] ✓ Binding "ASSETS" eliminado (nombre reservado en Pages).');
}

// ── Binding SESSION (KV no provisionado) ──────────────────────────────────────
if (Array.isArray(config.kv_namespaces)) {
  const antes = config.kv_namespaces.length;
  config.kv_namespaces = config.kv_namespaces.filter(b => b.binding !== 'SESSION');
  if (config.kv_namespaces.length < antes) {
    console.log('[patch-wrangler] ✓ Binding "SESSION" (KV) eliminado — no provisionado.');
  }
}

writeFileSync(WRANGLER_DIST, JSON.stringify(config, null, 2), 'utf-8');
console.log('[patch-wrangler] ✓ dist/server/wrangler.json listo para Cloudflare Pages.');
