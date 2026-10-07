# Umbral · Plataforma inmobiliaria

Sitio web inmobiliario para publicar y promocionar propiedades en venta y renta
en la zona metropolitana de Guadalajara, con contacto directo por WhatsApp y un
panel administrativo (etapas posteriores).

```
inmobiliaria/
├── frontend/   React 19 + Vite + Tailwind CSS 4 + Framer Motion
└── backend/    Laravel + MySQL (API REST): próxima etapa
```

## Etapas

| Etapa | Contenido | Estado |
| ----- | --------- | ------ |
| 1 | Frontend visual: header, portada, buscador, destacadas, zonas, vender, WhatsApp, Instagram, footer | En revisión |
| 2 | Catálogo `/propiedades` con filtros y ordenamiento | Pendiente |
| 3 | Ficha `/propiedad/:slug`: galería, mapa Leaflet, compartir, relacionadas | Pendiente |
| 4 | Vende tu propiedad, Contacto, Favoritos | Pendiente |
| 5 | Laravel + MySQL + API REST | Pendiente |
| 6 | Panel administrativo `/admin` (CRUD, galería, estados) | Pendiente |
| V2 | Mapa completo `/mapa`, Instagram real, analíticas, leads | Pendiente |

## Desarrollo local

```bash
cd frontend
cp .env.example .env    # opcional: número de WhatsApp real
npm install
npm run dev             # http://localhost:5173
```

Más detalles en [`frontend/README.md`](frontend/README.md).
