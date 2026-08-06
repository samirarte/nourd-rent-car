/**
 * scripts/patch-wrangler.mjs
 *
 * Post-build: limpia dist/server/wrangler.json (generado por @astrojs/cloudflare)
 * de rutas absolutas y bindings no provisionados.
 * El wrangler.json raíz es la config real usada por `wrangler deploy`.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const WRANGLER_DIST = join(process.cwd(), 'dist', 'server', 'wrangler.json');
if (!existsSync(WRANGLER_DIST)) { console.log('[patch-wrangler] nada que parchear'); process.exit(0); }

const config = JSON.parse(readFileSync(WRANGLER_DIST, 'utf-8'));

// Eliminar rutas absolutas locales
for (const c of ['configPath','userConfigPath','pages_build_output_dir']) delete config[c];

// Eliminar binding SESSION no provisionado
if (Array.isArray(config.kv_namespaces))
  config.kv_namespaces = config.kv_namespaces.filter(b => b.binding !== 'SESSION');
if (config.previews?.kv_namespaces)
  config.previews.kv_namespaces = config.previews.kv_namespaces.filter(b => b.binding !== 'SESSION');

writeFileSync(WRANGLER_DIST, JSON.stringify(config, null, 2), 'utf-8');
console.log(`[patch-wrangler] ✓ listo. main="${config.main}"`);
