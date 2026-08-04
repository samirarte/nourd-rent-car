/**
 * Traducciones de la interfaz en español e inglés.
 * Español es el idioma por defecto.
 */

export type Lang = 'es' | 'en';
export const DEFAULT_LANG: Lang = 'es';
export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: 'es', label: 'ES', flag: '🇲🇦' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
];

export const ui = {
  es: {
    // ── Navegación ──────────────────────────────────────────────────
    'nav.home':      'Inicio',
    'nav.catalogue': 'Catálogo',
    'nav.contact':   'Contacto',
    'nav.admin':     'Administración',

    // ── Hero ────────────────────────────────────────────────────────
    'hero.badge':     'Vehículos disponibles ahora',
    'hero.title':     'Alquila el vehículo',
    'hero.title.accent': 'que mereces',
    'hero.subtitle':  'Flota premium de SUVs, Mercedes, Dacia y más. Disponibles con o sin conductor. Reserva en segundos directamente por WhatsApp.',
    'hero.cta.catalogue': 'Ver catálogo completo',
    'hero.cta.whatsapp':  'Consultar disponibilidad',
    'hero.stat.vehicles':     'Vehículos',
    'hero.stat.rating':       'Valoración',
    'hero.stat.availability': 'Disponibilidad',

    // ── Catálogo ────────────────────────────────────────────────────
    'catalogue.fleet':       'Nuestra flota',
    'catalogue.title':       'Catálogo completo',
    'catalogue.title.prefix':'Vehículos —',
    'catalogue.filter.all':  'Todos',
    'catalogue.results':     'vehículo disponible',
    'catalogue.results.pl':  'vehículos disponibles',
    'catalogue.empty':       'No hay vehículos disponibles',
    'catalogue.empty.cat':   'en la categoría',
    'catalogue.see.all':     'Ver todos los vehículos',

    // ── Tarjeta vehículo ────────────────────────────────────────────
    'card.from':        'Desde',
    'card.per.day':     '/día',
    'card.see.details': 'Ver detalles',
    'card.unavailable': 'No disponible',

    // ── Detalle vehículo ────────────────────────────────────────────
    'detail.breadcrumb.home':      'Inicio',
    'detail.breadcrumb.catalogue': 'Catálogo',
    'detail.specs':        'Especificaciones',
    'detail.description':  'Descripción',
    'detail.without.driver': 'Sin conductor',
    'detail.with.driver':    'Con conductor',
    'detail.per.day':        '/día',
    'detail.spec.seats':      'Plazas',
    'detail.spec.gearbox':    'Transmisión',
    'detail.spec.fuel':       'Combustible',
    'detail.spec.category':   'Categoría',

    // ── Formulario reserva ──────────────────────────────────────────
    'form.title':       'Reservar este vehículo',
    'form.modality':    'Modalidad de alquiler',
    'form.date.start':  'Fecha de inicio',
    'form.date.end':    'Fecha de fin',
    'form.price.est':   'Precio estimado',
    'form.price.dash':  '— €',
    'form.error.dates': 'La fecha de fin debe ser posterior a la de inicio.',
    'form.cta':         'Reservar por WhatsApp',
    'form.modality.without': 'Sin conductor',
    'form.modality.with':    'Con conductor',

    // ── WhatsApp mensaje ────────────────────────────────────────────
    'wa.greeting':    'Hola, me interesa alquilar el vehículo',
    'wa.start':       'Fecha de inicio',
    'wa.end':         'Fecha de fin',
    'wa.modality':    'Modalidad',
    'wa.price':       'Precio estimado',
    'wa.question':    '¿Podría confirmarme la disponibilidad? Gracias.',
    'wa.general':     'Hola, me gustaría obtener información sobre vuestros servicios de alquiler.',

    // ── ¿Por qué elegirnos? ─────────────────────────────────────────
    'why.label':    '¿Por qué elegirnos?',
    'why.title':    'El servicio que te mereces',
    'why.subtitle': 'En Nourd Rent Car ponemos al cliente en el centro de todo lo que hacemos.',
    'why.1.title':  'Vehículos verificados',
    'why.1.desc':   'Toda nuestra flota pasa revisiones periódicas para garantizar tu seguridad y comodidad en cada trayecto.',
    'why.2.title':  'Disponibilidad 24h',
    'why.2.desc':   'Puedes contactarnos en cualquier momento del día. Respondemos rápido por WhatsApp para confirmar tu reserva.',
    'why.3.title':  'Con o sin conductor',
    'why.3.desc':   'Elige la modalidad que mejor se adapte a ti. Ofrecemos conductores profesionales para mayor tranquilidad.',
    'why.4.title':  'Precios transparentes',
    'why.4.desc':   'Sin costes ocultos. El precio que ves es el precio real. Paga solo por los días que necesitas.',
    'why.5.title':  'Reserva express',
    'why.5.desc':   'Reserva en menos de 2 minutos por WhatsApp. Sin formularios complicados ni esperas innecesarias.',
    'why.6.title':  'Atención personalizada',
    'why.6.desc':   'Te asesoramos para encontrar el vehículo perfecto según tu presupuesto y necesidades.',

    // ── Destacados ──────────────────────────────────────────────────
    'featured.label':    'Nuestra flota',
    'featured.title':    'Vehículos destacados',
    'featured.subtitle': 'Selección de nuestros vehículos más populares. Disponibles con o sin conductor según tus necesidades.',
    'featured.cta':      'Ver catálogo completo',
    'featured.empty':    'No hay vehículos destacados en este momento.',

    // ── Contacto ────────────────────────────────────────────────────
    'contact.label':       'Estamos aquí para ayudarte',
    'contact.title':       'Contacto',
    'contact.subtitle':    'La forma más rápida de contactarnos es por WhatsApp. Respondemos en minutos para confirmar tu reserva.',
    'contact.wa.reply':    'Respuesta en minutos',
    'contact.wa.send':     'Enviar mensaje',
    'contact.email.title': 'Email',
    'contact.loc.title':   'Ubicación',
    'contact.loc.main':    'Oficina principal:',
    'contact.loc.city':    'Casablanca, Marruecos',
    'contact.loc.airport': 'Recogida y entrega también en el',
    'contact.loc.gmaps':   'Ver en Google Maps →',
    'contact.hours.title': 'Disponibilidad',
    'contact.hours.text':  'Lunes a domingo — 24 horas por WhatsApp',

    // ── Footer ──────────────────────────────────────────────────────
    'footer.tagline':  'Alquiler de vehículos premium con y sin conductor en Casablanca (Marruecos). Servicio de recogida y entrega en el Aeropuerto Mohammed V (CMN).',
    'footer.nav':      'Navegación',
    'footer.contact':  'Contacto',
    'footer.rights':   'Todos los derechos reservados.',
    'footer.location': 'Casablanca, Marruecos · Aeropuerto Mohammed V (CMN)',
  },

  en: {
    // ── Navigation ──────────────────────────────────────────────────
    'nav.home':      'Home',
    'nav.catalogue': 'Catalogue',
    'nav.contact':   'Contact',
    'nav.admin':     'Administration',

    // ── Hero ────────────────────────────────────────────────────────
    'hero.badge':     'Vehicles available now',
    'hero.title':     'Rent the vehicle',
    'hero.title.accent': 'you deserve',
    'hero.subtitle':  'Premium fleet of SUVs, Mercedes, Dacia and more. Available with or without driver. Book in seconds directly on WhatsApp.',
    'hero.cta.catalogue': 'View full catalogue',
    'hero.cta.whatsapp':  'Check availability',
    'hero.stat.vehicles':     'Vehicles',
    'hero.stat.rating':       'Rating',
    'hero.stat.availability': 'Availability',

    // ── Catalogue ───────────────────────────────────────────────────
    'catalogue.fleet':       'Our fleet',
    'catalogue.title':       'Full catalogue',
    'catalogue.title.prefix':'Vehicles —',
    'catalogue.filter.all':  'All',
    'catalogue.results':     'vehicle available',
    'catalogue.results.pl':  'vehicles available',
    'catalogue.empty':       'No vehicles available',
    'catalogue.empty.cat':   'in category',
    'catalogue.see.all':     'View all vehicles',

    // ── Vehicle card ────────────────────────────────────────────────
    'card.from':        'From',
    'card.per.day':     '/day',
    'card.see.details': 'View details',
    'card.unavailable': 'Unavailable',

    // ── Vehicle detail ──────────────────────────────────────────────
    'detail.breadcrumb.home':      'Home',
    'detail.breadcrumb.catalogue': 'Catalogue',
    'detail.specs':        'Specifications',
    'detail.description':  'Description',
    'detail.without.driver': 'Without driver',
    'detail.with.driver':    'With driver',
    'detail.per.day':        '/day',
    'detail.spec.seats':      'Seats',
    'detail.spec.gearbox':    'Gearbox',
    'detail.spec.fuel':       'Fuel',
    'detail.spec.category':   'Category',

    // ── Booking form ────────────────────────────────────────────────
    'form.title':       'Book this vehicle',
    'form.modality':    'Rental mode',
    'form.date.start':  'Start date',
    'form.date.end':    'End date',
    'form.price.est':   'Estimated price',
    'form.price.dash':  '— €',
    'form.error.dates': 'End date must be after start date.',
    'form.cta':         'Book via WhatsApp',
    'form.modality.without': 'Without driver',
    'form.modality.with':    'With driver',

    // ── WhatsApp message ────────────────────────────────────────────
    'wa.greeting':    'Hello, I am interested in renting the vehicle',
    'wa.start':       'Start date',
    'wa.end':         'End date',
    'wa.modality':    'Mode',
    'wa.price':       'Estimated price',
    'wa.question':    'Could you confirm availability? Thank you.',
    'wa.general':     'Hello, I would like to get information about your car rental services.',

    // ── Why choose us ───────────────────────────────────────────────
    'why.label':    'Why choose us?',
    'why.title':    'The service you deserve',
    'why.subtitle': 'At Nourd Rent Car we put the customer at the centre of everything we do.',
    'why.1.title':  'Verified vehicles',
    'why.1.desc':   'Our entire fleet undergoes periodic inspections to ensure your safety and comfort on every journey.',
    'why.2.title':  '24h availability',
    'why.2.desc':   'You can contact us at any time of day. We respond quickly on WhatsApp to confirm your booking.',
    'why.3.title':  'With or without driver',
    'why.3.desc':   'Choose the mode that suits you best. We offer professional drivers for greater peace of mind.',
    'why.4.title':  'Transparent pricing',
    'why.4.desc':   'No hidden costs. The price you see is the real price. Pay only for the days you need.',
    'why.5.title':  'Express booking',
    'why.5.desc':   'Book in under 2 minutes on WhatsApp. No complicated forms or unnecessary waiting.',
    'why.6.title':  'Personalised service',
    'why.6.desc':   'We help you find the perfect vehicle for your budget and needs.',

    // ── Featured ────────────────────────────────────────────────────
    'featured.label':    'Our fleet',
    'featured.title':    'Featured vehicles',
    'featured.subtitle': 'A selection of our most popular vehicles. Available with or without driver to suit your needs.',
    'featured.cta':      'View full catalogue',
    'featured.empty':    'No featured vehicles at this time.',

    // ── Contact ─────────────────────────────────────────────────────
    'contact.label':       'We are here to help',
    'contact.title':       'Contact',
    'contact.subtitle':    'The fastest way to reach us is via WhatsApp. We respond in minutes to confirm your booking.',
    'contact.wa.reply':    'Reply in minutes',
    'contact.wa.send':     'Send message',
    'contact.email.title': 'Email',
    'contact.loc.title':   'Location',
    'contact.loc.main':    'Head office:',
    'contact.loc.city':    'Casablanca, Morocco',
    'contact.loc.airport': 'Pick-up and drop-off also at',
    'contact.loc.gmaps':   'View on Google Maps →',
    'contact.hours.title': 'Availability',
    'contact.hours.text':  'Monday to Sunday — 24 hours via WhatsApp',

    // ── Footer ──────────────────────────────────────────────────────
    'footer.tagline':  'Premium car rental with and without driver in Casablanca (Morocco). Pick-up and drop-off service at Mohammed V Airport (CMN).',
    'footer.nav':      'Navigation',
    'footer.contact':  'Contact',
    'footer.rights':   'All rights reserved.',
    'footer.location': 'Casablanca, Morocco · Mohammed V Airport (CMN)',
  },
} as const;

export type TranslationKey = keyof typeof ui.es;
