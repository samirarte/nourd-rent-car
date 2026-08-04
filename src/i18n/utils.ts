/**
 * Utilidades para el sistema de internacionalización (i18n).
 * Idioma por defecto: FR (francés).
 * Rutas sin prefijo → francés. Otros: /es/, /en/, /ar/
 */

import { ui, DEFAULT_LANG, LANGUAGES, type Lang, type TranslationKey } from './translations';

/** Detecta el idioma desde el primer segmento de la URL. */
export function getLang(url: URL): Lang {
  const seg = url.pathname.split('/')[1];
  if (seg === 'es') return 'es';
  if (seg === 'en') return 'en';
  if (seg === 'ar') return 'ar';
  return DEFAULT_LANG; // 'fr' — sin prefijo o /fr/
}

/** Devuelve la función t() para el idioma indicado. */
export function useTranslations(lang: Lang) {
  return function t(key: TranslationKey): string {
    return (ui[lang] as Record<string, string>)[key]
        ?? (ui[DEFAULT_LANG] as Record<string, string>)[key]
        ?? key;
  };
}

/** Prefijo de ruta para un idioma ('' para FR, '/es', '/en', '/ar'). */
export function getPathPrefix(lang: Lang): string {
  return lang === DEFAULT_LANG ? '' : `/${lang}`;
}

/** Indica si el idioma se escribe de derecha a izquierda. */
export function isRTL(lang: Lang): boolean {
  return LANGUAGES.find(l => l.code === lang)?.dir === 'rtl';
}

/** Rutas de navegación según idioma. */
export function getNavLinks(lang: Lang) {
  const p = getPathPrefix(lang);
  // EN tiene slugs en inglés; FR (defecto) y ES usan slugs propios
  if (lang === 'en') {
    return [
      { href: '/en',              key: 'nav.home'      },
      { href: '/en/catalogue',    key: 'nav.catalogue' },
      { href: '/en/contact',      key: 'nav.contact'   },
    ];
  }
  if (lang === 'es') {
    return [
      { href: '/es',              key: 'nav.home'      },
      { href: '/es/catalogo',     key: 'nav.catalogue' },
      { href: '/es/contacto',     key: 'nav.contact'   },
    ];
  }
  if (lang === 'ar') {
    return [
      { href: '/ar',              key: 'nav.home'      },
      { href: '/ar/catalogue',    key: 'nav.catalogue' },
      { href: '/ar/contact',      key: 'nav.contact'   },
    ];
  }
  // FR (defecto) — sin prefijo
  return [
    { href: '/',                key: 'nav.home'      },
    { href: '/catalogue',       key: 'nav.catalogue' },
    { href: '/contact',         key: 'nav.contact'   },
  ];
}

/** Devuelve la URL equivalente en otro idioma. */
export function getAlternateUrl(url: URL, targetLang: Lang): string {
  const path        = url.pathname;
  const currentLang = getLang(url);

  // Mapa de slugs por idioma
  const slugs: Record<Lang, { cat: string; contact: string; vehicle: string }> = {
    fr: { cat: 'catalogue', contact: 'contact',  vehicle: 'vehicle'  },
    es: { cat: 'catalogo',  contact: 'contacto', vehicle: 'vehiculo' },
    en: { cat: 'catalogue', contact: 'contact',  vehicle: 'vehicle'  },
    ar: { cat: 'catalogue', contact: 'contact',  vehicle: 'vehicle'  },
  };

  const currentSlug  = slugs[currentLang];
  const targetSlug   = slugs[targetLang];
  const targetPrefix = getPathPrefix(targetLang);
  const currentPrefix = getPathPrefix(currentLang);

  // Quitar prefijo actual
  let cleanPath = path;
  if (currentLang !== DEFAULT_LANG && currentPrefix) {
    cleanPath = path.replace(currentPrefix, '') || '/';
  }

  // Reemplazar slugs de página
  cleanPath = cleanPath
    .replace(`/${currentSlug.cat}`,      `/${targetSlug.cat}`)
    .replace(`/${currentSlug.contact}`,  `/${targetSlug.contact}`)
    .replace(`/${currentSlug.vehicle}/`, `/${targetSlug.vehicle}/`);

  if (targetLang === DEFAULT_LANG) {
    return cleanPath || '/';
  }
  return `${targetPrefix}${cleanPath === '/' ? '' : cleanPath}` || targetPrefix || '/';
}

/** Lista de todos los idiomas con sus URLs alternas (para el selector del Header). */
export function getAllAlternates(url: URL): { lang: Lang; label: string; flag: string; href: string }[] {
  return LANGUAGES.map(l => ({
    lang:  l.code,
    label: l.label,
    flag:  l.flag,
    href:  getAlternateUrl(url, l.code),
  }));
}
