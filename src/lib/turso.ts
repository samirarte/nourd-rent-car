/**
 * Cliente de conexión a Turso (SQLite en el edge).
 * Se inicializa una sola vez y se reutiliza en toda la aplicación.
 *
 * Variables de entorno requeridas (ver .env.example):
 *   TURSO_DATABASE_URL  — URL de la base de datos Turso
 *   TURSO_AUTH_TOKEN    — Token de autenticación
 */

import { createClient } from '@libsql/client';

// Validación de variables de entorno en tiempo de build
const url   = import.meta.env.TURSO_DATABASE_URL;
const token = import.meta.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error(
    '[turso] Variable de entorno TURSO_DATABASE_URL no definida. ' +
    'Copia .env.example a .env y configura tus credenciales.'
  );
}

/**
 * Cliente Turso singleton.
 * Usa HTTP (edge) cuando se proporciona token; SQLite local cuando no hay token
 * (útil para desarrollo con un archivo .db local).
 */
export const turso = createClient({
  url,
  authToken: token,
});
