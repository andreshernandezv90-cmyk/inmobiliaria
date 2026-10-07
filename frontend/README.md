# Frontend

React 19 · Vite · Tailwind CSS 4 · Framer Motion · React Router · lucide-react.

## Scripts

```bash
npm run dev       # servidor de desarrollo
npm run build     # compilación de producción en dist/
npm run preview   # sirve la compilación
npm run lint      # ESLint
```

## Variables de entorno (`.env`)

| Variable | Uso |
| -------- | --- |
| `VITE_WHATSAPP_NUMBER` | Número de WhatsApp en formato internacional sin `+` (ej. `5213312345678`) |
| `VITE_SITE_URL` | URL pública del sitio (enlaces en mensajes de WhatsApp y Open Graph) |
| `VITE_API_URL` | URL de la API de Laravel (a partir de la etapa de backend) |

Nombre, teléfono, correo, horarios y redes sociales se editan en `src/config/site.js`.

## Estructura

```
src/
├── components/
│   ├── layout/     Header, MobileMenu, Footer, Logo, Layout, WhatsAppFloatingButton
│   ├── home/       Secciones de la portada (Hero, QuickAccess, FeaturedProperties…)
│   ├── property/   PropertyCard, PriceDisplay, PropertyFeatures, FavoriteButton…
│   ├── search/     SearchBar
│   ├── ui/         Button, ResponsiveImage, Reveal, SectionHeading, Seo
│   └── icons/      Íconos de marca (WhatsApp, Instagram, Facebook)
├── config/         Datos del sitio, rutas y navegación
├── constants/      Catálogos: operaciones, tipos, estados, etiquetas, amenidades
├── data/           Datos temporales (misma forma que la futura API)
├── hooks/          useAsync, useFavorites (localStorage), useScrolled
├── lib/            Formato de precios, WhatsApp, imágenes responsivas, filtros
├── pages/          Home, ComingSoon (temporal), NotFound
├── services/       Acceso a datos (hoy datos locales, mañana API) + cliente HTTP
├── styles/         Tailwind y tokens de diseño
└── types/          Tipos JSDoc del dominio
```

### Flujo de datos

Hoy: `componentes → hooks (useAsync) → services → data/`.
Al integrar Laravel solo cambia `services/`, que pasará a usar `services/http.js`.

### Imágenes

`lib/images.js` genera `srcset` automáticamente para URLs de **Cloudinary**
(transformaciones `w_…,f_auto,q_auto`) y de Unsplash (datos de ejemplo). Las
imágenes del servidor propio se usan tal cual. Todas las imágenes usan lazy
loading excepto la del hero. Si una imagen falla, se muestra un respaldo neutro.

## Notas para el backend

Los datos de ejemplo incluyen algunos campos adicionales a los del modelo
inicial que conviene agregar a la tabla `properties`:

- `code`: ID interno visible (`PROP-004`), usado en el mensaje de WhatsApp.
- `label`: etiqueta promocional opcional (`nueva`, `destacada`, `oportunidad`, `preventa`).
- `state` y `city_slug`: para la ubicación pública y los filtros por zona.
- `published_at`: fecha de publicación (orden "Más recientes").
- `property_images.alt`: texto alternativo de cada fotografía.

Los filtros de `lib/filterProperties.js` documentan los query params que debe
aceptar `GET /api/properties` (`operation`, `property_type`, `city`, `zone`,
`min_price`, `max_price`, `bedrooms`, `bathrooms`, `sort`).
