import { SITE } from '@/config/site'

/**
 * Metadatos por página. React 19 mueve automáticamente <title> y <meta>
 * al <head>. Para SEO completo en producción (vistas previas en redes
 * sociales) el backend o un prerender deberá servir estas mismas etiquetas.
 */
export default function Seo({ title, description = SITE.description, image, path = '' }) {
  const fullTitle = title ? `${title} · ${SITE.name}` : `${SITE.name} · Bienes raíces en ${SITE.region}`
  const url = `${SITE.url}${path}`
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content="es_MX" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
    </>
  )
}
