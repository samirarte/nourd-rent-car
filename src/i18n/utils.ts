/**
 * Utilidades para el sistema de internacionalización (i18n).
 * Soporta: ES (defecto), EN, FR, AR (RTL).
 */

import { ui, DEFAULT_LANG, LANGUAGES, type Lang, type TranslationKey } from './translations';

/** Detecta el idioma desde el primer segmento de la URL. */
export function getLang(url: URL): Lang {
  const seg = url.pathname.split('/')[1];
  if (seg === 'en') return 'en';
  if (seg === 'fr') return 'fr';
  if (seg === 'ar') return 'ar';
  return DEFAULT_LANG;
}

/** Devuelve la función t() para el idioma indicado. */
export function useTranslations(lang: Lang) {
  return function t(key: TranslationKey): string {
    return (ui[lang] as Record<string, string>)[key]
        ?? (ui[DEFAULT_LANG] as Record<string, string>)[key]
        ?? key;
  };
}

/** Prefijo de ruta para un idioma ('' para ES, '/en', '/fr', '/ar'). */
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
  // EN tiene nombres de ruta en inglés; FR y AR usan el mismo patrón /fr/ /ar/
  const catSlug     = lang === 'en' ? 'catalogue'  : 'catalogo';
  const contactSlug = lang === 'en' ? 'contact'     : 'contacto';
  return [
    { href: p || '/',                         key: 'nav.home'      },
    { href: `${p}/${catSlug}`,                key: 'nav.catalogue' },
    { href: `${p}/${contactSlug}`,            key: 'nav.contact'   },
  ];
}

/** Devuelve la URL equivalente en otro idioma. */
export function getAlternateUrl(url: URL, targetLang: Lang): string {
  const path = url.pathname;

  // Mapa de slugs de ruta por idioma
  const slugs: Record<Lang, { cat: string; contact: string; vehicle: string }> = {
    es: { cat: 'catalogo',   contact: 'contacto', vehicle: 'vehiculo' },
    en: { cat: 'catalogue',  contact: 'contact',  vehicle: 'vehicle'  },
    fr: { cat: 'catalogue',  contact: 'contact',  vehicle: 'vehicle'  },
    ar: { cat: 'catalogue',  contact: 'contact',  vehicle: 'vehicle'  },
  };

  // Detectar idioma actual desde la URL
  const currentLang = getLang(url);
  const currentSlug = slugs[currentLang];
  const targetSlug  = slugs[targetLang];
  const targetPrefix = getPathPrefix(targetLang);

  // Quitar prefijo del idioma actual
  let cleanPath = path;
  if (currentLang !== DEFAULT_LANG) {
    cleanPath = path.replace(`/${currentLang}`, '') || '/';
  }

  // Remplazar slugs de ruta
  cleanPath = cleanPath
    .replace(`/${currentSlug.cat}`,     `/${targetSlug.cat}`)
    .replace(`/${currentSlug.contact}`, `/${targetSlug.contact}`)
    .replace(`/${currentSlug.vehicle}/`, `/${targetSlug.vehicle}/`);

  // Añadir prefijo del idioma destino
  if (targetLang === DEFAULT_LANG) {
    return cleanPath || '/';
  }
  return `${targetPrefix}${cleanPath === '/' ? '' : cleanPath}` || targetPrefix || '/';
}

/** Lista de todos los idiomas disponibles con sus URLs alternas. */
export function getAllAlternates(url: URL): { lang: Lang; label: string; flag: string; href: string }[] {
  return LANGUAGES.map(l => ({
    lang:  l.code,
    label: l.label,
    flag:  l.flag,
    href:  getAlternateUrl(url, l.code),
  }));
}
