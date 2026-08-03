/**
 * Script de seed para la base de datos local SQLite.
 * Usa @libsql/client en modo file: (no requiere sqlite3 en el PATH).
 *
 * Uso:
 *   node db/seed.js
 */

import { createClient } from '@libsql/client';

// Conectar a la base de datos local
const db = createClient({ url: 'file:./local.db' });

// ── Sentencias SQL ────────────────────────────────────────────────────────────
const sentencias = [

  // Tabla principal
  `CREATE TABLE IF NOT EXISTS vehiculos (
    id                    INTEGER PRIMARY KEY AUTOINCREMENT,
    slug                  TEXT    NOT NULL UNIQUE,
    nombre                TEXT    NOT NULL,
    categoria             TEXT    NOT NULL,
    descripcion           TEXT    NOT NULL,
    descripcion_larga     TEXT    NOT NULL,
    precio_sin_conductor  REAL    NOT NULL DEFAULT 0,
    precio_con_conductor  REAL    NOT NULL DEFAULT 0,
    imagen_principal      TEXT    NOT NULL,
    imagenes              TEXT    NOT NULL DEFAULT '[]',
    plazas                INTEGER NOT NULL DEFAULT 5,
    transmision           TEXT    NOT NULL DEFAULT 'Automático',
    combustible           TEXT    NOT NULL DEFAULT 'Gasolina',
    destacado             INTEGER NOT NULL DEFAULT 0,
    disponible            INTEGER NOT NULL DEFAULT 1
  )`,

  // 1. Mercedes Clase E
  `INSERT OR IGNORE INTO vehiculos
    (slug, nombre, categoria, descripcion, descripcion_larga,
     precio_sin_conductor, precio_con_conductor,
     imagen_principal, imagenes, plazas, transmision, combustible, destacado, disponible)
   VALUES (
    'mercedes-clase-e', 'Mercedes Clase E', 'Mercedes',
    'Elegancia y confort de gama alta para trayectos de negocios o placer.',
    'El Mercedes Clase E combina un diseño sofisticado con la última tecnología de asistencia al conductor. Su interior premium ofrece un nivel de confort excepcional, ideal tanto para viajes de negocios como para escapadas de lujo.',
    95.00, 145.00,
    '/vehiculos/mercedes-clase-e.jpg',
    '["/vehiculos/mercedes-clase-e-interior.jpg","/vehiculos/mercedes-clase-e-lateral.jpg"]',
    5, 'Automático', 'Diésel', 1, 1
   )`,

  // 2. Mercedes GLE
  `INSERT OR IGNORE INTO vehiculos
    (slug, nombre, categoria, descripcion, descripcion_larga,
     precio_sin_conductor, precio_con_conductor,
     imagen_principal, imagenes, plazas, transmision, combustible, destacado, disponible)
   VALUES (
    'mercedes-gle', 'Mercedes GLE', 'Mercedes',
    'SUV de lujo con amplio espacio y tecnología de última generación.',
    'El Mercedes GLE es un SUV de lujo que destaca por su espacio interior, suspensión adaptativa y sistema de infoentretenimiento MBUX. Perfecto para familias o grupos que buscan comodidad sin renunciar a la deportividad.',
    110.00, 165.00,
    '/vehiculos/mercedes-gle.jpg',
    '["/vehiculos/mercedes-gle-interior.jpg","/vehiculos/mercedes-gle-trasera.jpg"]',
    5, 'Automático', 'Híbrido', 1, 1
   )`,

  // 3. BMW X5
  `INSERT OR IGNORE INTO vehiculos
    (slug, nombre, categoria, descripcion, descripcion_larga,
     precio_sin_conductor, precio_con_conductor,
     imagen_principal, imagenes, plazas, transmision, combustible, destacado, disponible)
   VALUES (
    'bmw-x5', 'BMW X5', 'SUV',
    'SUV premium con una conducción dinámica y un interior de alto nivel.',
    'El BMW X5 redefine el concepto de SUV de lujo. Su potente motor, la tracción integral xDrive y el sistema iDrive lo convierten en el compañero ideal para cualquier tipo de ruta. El interior ofrece materiales premium y asientos calefactables.',
    100.00, 155.00,
    '/vehiculos/bmw-x5.jpg',
    '["/vehiculos/bmw-x5-interior.jpg","/vehiculos/bmw-x5-frontal.jpg"]',
    5, 'Automático', 'Gasolina', 1, 1
   )`,

  // 4. Dacia Duster
  `INSERT OR IGNORE INTO vehiculos
    (slug, nombre, categoria, descripcion, descripcion_larga,
     precio_sin_conductor, precio_con_conductor,
     imagen_principal, imagenes, plazas, transmision, combustible, destacado, disponible)
   VALUES (
    'dacia-duster', 'Dacia Duster', 'Dacia',
    'SUV compacto robusto, ideal para rutas urbanas y escapadas al campo.',
    'El Dacia Duster es la opción más versátil de nuestro catálogo. Robusto, económico y con tracción 4x4 disponible, es perfecto para quienes buscan aventura sin grandes gastos.',
    45.00, 75.00,
    '/vehiculos/dacia-duster.jpg',
    '["/vehiculos/dacia-duster-interior.jpg","/vehiculos/dacia-duster-lateral.jpg"]',
    5, 'Manual', 'Gasolina', 0, 1
   )`,

  // 5. Dacia Sandero
  `INSERT OR IGNORE INTO vehiculos
    (slug, nombre, categoria, descripcion, descripcion_larga,
     precio_sin_conductor, precio_con_conductor,
     imagen_principal, imagenes, plazas, transmision, combustible, destacado, disponible)
   VALUES (
    'dacia-sandero', 'Dacia Sandero', 'Dacia',
    'Utilitario asequible y fiable, perfecto para la ciudad.',
    'El Dacia Sandero es la solución más económica de nuestra flota sin sacrificar fiabilidad. Ideal para desplazamientos urbanos y trayectos cortos, con bajo consumo y fácil aparcamiento.',
    35.00, 60.00,
    '/vehiculos/dacia-sandero.jpg',
    '["/vehiculos/dacia-sandero-interior.jpg"]',
    5, 'Manual', 'Gasolina', 0, 1
   )`,

  // 6. Toyota RAV4 Híbrido
  `INSERT OR IGNORE INTO vehiculos
    (slug, nombre, categoria, descripcion, descripcion_larga,
     precio_sin_conductor, precio_con_conductor,
     imagen_principal, imagenes, plazas, transmision, combustible, destacado, disponible)
   VALUES (
    'toyota-rav4-hibrido', 'Toyota RAV4 Híbrido', 'SUV',
    'SUV híbrido eficiente con tracción total y gran maletero.',
    'El Toyota RAV4 Híbrido ofrece lo mejor de dos mundos: la eficiencia de un motor híbrido y la versatilidad de un SUV con tracción total AWD. Bajo consumo en ciudad, potente en carretera y maletero de 580 litros.',
    80.00, 125.00,
    '/vehiculos/toyota-rav4.jpg',
    '["/vehiculos/toyota-rav4-interior.jpg","/vehiculos/toyota-rav4-trasera.jpg"]',
    5, 'Automático', 'Híbrido', 1, 1
   )`,

  // 7. Volkswagen Passat
  `INSERT OR IGNORE INTO vehiculos
    (slug, nombre, categoria, descripcion, descripcion_larga,
     precio_sin_conductor, precio_con_conductor,
     imagen_principal, imagenes, plazas, transmision, combustible, destacado, disponible)
   VALUES (
    'volkswagen-passat', 'Volkswagen Passat', 'Berlina',
    'Berlina familiar espaciosa y cómoda para viajes largos.',
    'El Volkswagen Passat es sinónimo de confort en carretera. Su interior silencioso, los asientos ergonómicos y el maletero de 650 litros lo convierten en la berlina perfecta para viajes de empresa o familiares de larga distancia.',
    65.00, 100.00,
    '/vehiculos/volkswagen-passat.jpg',
    '["/vehiculos/volkswagen-passat-interior.jpg"]',
    5, 'Automático', 'Diésel', 0, 1
   )`,

  // 8. Renault Clio
  `INSERT OR IGNORE INTO vehiculos
    (slug, nombre, categoria, descripcion, descripcion_larga,
     precio_sin_conductor, precio_con_conductor,
     imagen_principal, imagenes, plazas, transmision, combustible, destacado, disponible)
   VALUES (
    'renault-clio', 'Renault Clio', 'Utilitario',
    'Utilitario ágil y económico, ideal para el día a día en ciudad.',
    'El Renault Clio es el utilitario más popular de nuestra flota. Ágil, fácil de aparcar y con bajo consumo, es la elección perfecta para desplazamientos urbanos.',
    30.00, 55.00,
    '/vehiculos/renault-clio.jpg',
    '["/vehiculos/renault-clio-interior.jpg"]',
    5, 'Manual', 'Gasolina', 0, 1
   )`,
];

// ── Ejecución ─────────────────────────────────────────────────────────────────
console.log(`\n🚀 Ejecutando seed en local.db...\n`);

for (const sql of sentencias) {
  try {
    await db.execute(sql);
    const preview = sql.trim().split('\n')[0].slice(0, 60);
    console.log(`  ✓ ${preview}`);
  } catch (err) {
    const preview = sql.trim().split('\n')[0].slice(0, 60);
    console.error(`  ✗ ${preview}`);
    console.error(`    ${err.message}\n`);
  }
}

// Verificar resultado
const resultado = await db.execute('SELECT COUNT(*) as total FROM vehiculos');
console.log(`\n✅ Seed completado. Vehículos en la base de datos: ${resultado.rows[0].total}\n`);

db.close();
