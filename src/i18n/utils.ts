/**
 * Utilidades para el sistema de internacionalización (i18n).
 */

import { ui, DEFAULT_LANG, type Lang, type TranslationKey } from './translations';

/**
 * Detecta el idioma desde la URL.
 * /en/... → 'en'  |  /... → 'es' (por defecto)
 */
export function getLang(url: URL): Lang {
  const [, firstSegment] = url.pathname.split('/');
  if (firstSegment === 'en') return 'en';
  return DEFAULT_LANG;
}

/**
 * Devuelve la función de traducción para el idioma indicado.
 * Uso: const t = useTranslations('en'); t('nav.home') → 'Home'
 */
export function useTranslations(lang: Lang) {
  return function t(key: TranslationKey): string {
    return (ui[lang] as Record<string, string>)[key]
        ?? (ui[DEFAULT_LANG] as Record<string, string>)[key]
        ?? key;
  };
}

/**
 * Devuelve la URL equivalente en el otro idioma.
 * /catalogo       → /en/catalogue   (ES → EN)
 * /en/catalogue   → /catalogo       (EN → ES)
 */
export function getAlternateUrl(url: URL, targetLang: Lang): string {
  const path = url.pathname;

  // Mapa de rutas ES → EN
  const rutas: Record<string, string> = {
    '/':          '/en',
    '/catalogo':  '/en/catalogue',
    '/contacto':  '/en/contact',
  };
  // Mapa inverso EN → ES
  const rutasInverso: Record<string, string> = Object.fromEntries(
    Object.entries(rutas).map(([es, en]) => [en, es])
  );

  if (targetLang === 'en') {
    // Buscar coincidencia exacta o de prefijo para páginas de detalle
    if (rutas[path]) return rutas[path];
    if (path.startsWith('/vehiculo/')) {
      return path.replace('/vehiculo/', '/en/vehicle/');
    }
    return `/en${path}`;
  } else {
    if (rutasInverso[path]) return rutasInverso[path];
    if (path.startsWith('/en/vehicle/')) {
      return path.replace('/en/vehicle/', '/vehiculo/');
    }
    if (path.startsWith('/en')) return path.replace('/en', '') || '/';
    return path;
  }
}

/**
 * Prefijos de ruta según idioma.
 * Útil para construir href en componentes.
 */
export function getPathPrefix(lang: Lang): string {
  return lang === 'en' ? '/en' : '';
}

/**
 * Rutas de navegación según idioma.
 */
export function getNavLinks(lang: Lang) {
  const prefix = getPathPrefix(lang);
  if (lang === 'en') {
    return [
      { href: '/en',             key: 'nav.home'      },
      { href: '/en/catalogue',   key: 'nav.catalogue' },
      { href: '/en/contact',     key: 'nav.contact'   },
    ];
  }
  return [
    { href: '/',          key: 'nav.home'      },
    { href: '/catalogo',  key: 'nav.catalogue' },
    { href: '/contacto',  key: 'nav.contact'   },
  ];
}
