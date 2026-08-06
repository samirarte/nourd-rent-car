import { createClient } from '@libsql/client';

function getEnvVar(name: string): string | undefined {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[name]) {
    return import.meta.env[name];
  }
  if (typeof process !== 'undefined' && process.env && process.env[name]) {
    return process.env[name];
  }
  if (typeof globalThis !== 'undefined' && (globalThis as any)[name]) {
    return (globalThis as any)[name];
  }
  return undefined;
}

const TURSO_DATABASE_URL = getEnvVar('TURSO_DATABASE_URL');
const TURSO_AUTH_TOKEN = getEnvVar('TURSO_AUTH_TOKEN');

if (!TURSO_DATABASE_URL) {
  throw new Error('[turso] Variable de entorno TURSO_DATABASE_URL no definida.');
}

export const turso = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});