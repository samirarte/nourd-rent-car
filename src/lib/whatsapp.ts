/**
 * Utilidades para generar enlaces de WhatsApp con mensajes preformateados.
 * El número de teléfono se lee de la variable de entorno PUBLIC_WHATSAPP_NUMBER.
 */

import type { Modalidad } from '../types/vehiculo';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface ParamsReserva {
  /** Nombre completo del vehículo (ej: "Mercedes Clase E") */
  vehiculo: string;
  /** Fecha de inicio en formato legible (ej: "10/08/2026") */
  fechaInicio: string;
  /** Fecha de fin en formato legible (ej: "15/08/2026") */
  fechaFin: string;
  /** Modalidad seleccionada: 'con-conductor' | 'sin-conductor' */
  modalidad: Modalidad;
  /** Precio estimado total en euros (opcional) */
  precioEstimado?: number;
}

// ─── Función principal ────────────────────────────────────────────────────────

/**
 * Genera el enlace de WhatsApp con el mensaje de reserva preformateado.
 *
 * @example
 * const url = generarEnlaceWhatsApp({
 *   vehiculo:       'Mercedes Clase E',
 *   fechaInicio:    '10/08/2026',
 *   fechaFin:       '15/08/2026',
 *   modalidad:      'con-conductor',
 *   precioEstimado: 375,
 * });
 * // → https://wa.me/34600000000?text=Hola%2C%20me%20interesa...
 */
export function generarEnlaceWhatsApp(params: ParamsReserva): string {
  const numero = import.meta.env.PUBLIC_WHATSAPP_NUMBER ?? '34600000000';

  const etiquetaModalidad =
    params.modalidad === 'con-conductor' ? 'Con conductor' : 'Sin conductor';

  const lineaPrecio = params.precioEstimado
    ? `\n💶 Precio estimado: ${params.precioEstimado} €`
    : '';

  const mensaje =
    `Hola, me interesa alquilar el vehículo *${params.vehiculo}*.\n\n` +
    `📅 Fecha de inicio: ${params.fechaInicio}\n` +
    `📅 Fecha de fin:    ${params.fechaFin}\n` +
    `🚗 Modalidad:       ${etiquetaModalidad}` +
    `${lineaPrecio}\n\n` +
    `¿Podría confirmarme la disponibilidad? Gracias.`;

  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

// ─── Utilidades de fecha ──────────────────────────────────────────────────────

/**
 * Convierte una fecha en formato ISO (YYYY-MM-DD) al formato legible dd/mm/aaaa.
 * Útil para mostrar y enviar fechas en el mensaje de WhatsApp.
 */
export function formatearFecha(iso: string): string {
  if (!iso) return '';
  const [anio, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${anio}`;
}

/**
 * Calcula el número de días entre dos fechas ISO.
 * Devuelve 0 si las fechas son inválidas o la fecha de fin es anterior al inicio.
 */
export function calcularDias(fechaInicioISO: string, fechaFinISO: string): number {
  if (!fechaInicioISO || !fechaFinISO) return 0;
  const inicio = new Date(fechaInicioISO).getTime();
  const fin    = new Date(fechaFinISO).getTime();
  const diff   = fin - inicio;
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
}

/**
 * Calcula el precio estimado según la modalidad y el número de días.
 */
export function calcularPrecio(
  dias: number,
  precioPorDia: number,
): number {
  return Math.round(dias * precioPorDia * 100) / 100;
}

/**
 * Genera el enlace general de contacto por WhatsApp (sin datos de reserva).
 */
export function enlaceWhatsAppGeneral(mensaje?: string): string {
  const numero = import.meta.env.PUBLIC_WHATSAPP_NUMBER ?? '34600000000';
  const texto  = mensaje ?? 'Hola, me gustaría obtener información sobre vuestros servicios de alquiler.';
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}
