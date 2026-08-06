/**
 * scripts/patch-wrangler.mjs
 *
 * Post-build: limpia el dist/server/wrangler.json generado por @astrojs/cloudflare
 * para que sea válido en Cloudflare Pages.
 *
 * El adaptador genera un wrangler.json con rutas absolutas de Windows y campos
 * que solo sirven para Workers, no para Pages. Este script:
 *   1. Elimina pages_build_output_dir (ruta absoluta, no válida en el servidor de CI)
 *   2. Elimina el binding "ASSETS" (nombre reservado en Pages)
 *   3. Elimina el binding "SESSION" (KV no provisionado)
 *   4. Elimina configPath / userConfigPath (rutas absolutas locales, no necesarias)
 *   5. Convierte pages_build_output_dir a relativo — no: lo elimina porque
 *      el worker se despliega desde dist/server/ y el directorio de assets
 *      lo gestiona Cloudflare Pages automáticamente.
 *
 * NOTA: "main" se conserva — apunta a entry.mjs y es necesario para el Worker SSR.
 * NOTA: "rules" se conserva — Wrangler lo necesita para resolver módulos ESM.
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

// ── 1. Eliminar campos con rutas absolutas locales (inútiles en CI) ───────────
const CAMPOS_RUTAS_LOCALES = ['configPath', 'userConfigPath'];
for (const campo of CAMPOS_RUTAS_LOCALES) {
  if (campo in config) {
    delete config[campo];
    console.log(`[patch-wrangler] ✓ Campo "${campo}" eliminado (ruta local absoluta).`);
  }
}

// ── 2. Eliminar pages_build_output_dir (también ruta absoluta en Windows) ─────
//    El Worker SSR vive en dist/server/ y se despliega con "main": "entry.mjs"
//    Cloudflare Pages gestiona dist/client/ como assets automáticamente.
if ('pages_build_output_dir' in config) {
  delete config.pages_build_output_dir;
  console.log('[patch-wrangler] ✓ Campo "pages_build_output_dir" eliminado (ruta absoluta local).');
}

// ── 3. Eliminar "previews" (solo válido en Workers, no en Pages) ───────────────
if ('previews' in config) {
  delete config.previews;
  console.log('[patch-wrangler] ✓ Campo "previews" eliminado (no válido en Pages).');
}

// ── 4. Binding ASSETS (nombre reservado en Cloudflare Pages) ──────────────────
if (config.assets?.binding === 'ASSETS') {
  delete config.assets;
  console.log('[patch-wrangler] ✓ Binding "ASSETS" eliminado (nombre reservado en Pages).');
}

// ── 5. Binding SESSION en kv_namespaces (KV no provisionado) ──────────────────
if (Array.isArray(config.kv_namespaces)) {
  const antes = config.kv_namespaces.length;
  config.kv_namespaces = config.kv_namespaces.filter(b => b.binding !== 'SESSION');
  if (config.kv_namespaces.length < antes) {
    console.log('[patch-wrangler] ✓ Binding "SESSION" (KV) eliminado — no provisionado.');
  }
}

writeFileSync(WRANGLER_DIST, JSON.stringify(config, null, 2), 'utf-8');
console.log('[patch-wrangler] ✓ dist/server/wrangler.json listo para Cloudflare Pages.');
console.log(`[patch-wrangler]   main: ${config.main ?? '⚠ FALTA'}`);
