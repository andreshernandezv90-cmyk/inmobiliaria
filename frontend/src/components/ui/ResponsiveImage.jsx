import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { buildSrcSet, imageAtWidth } from '@/lib/images'

/**
 * Imagen optimizada:
 *  - `srcset` + `sizes` para que el navegador descargue el tamaño adecuado.
 *  - Lazy loading por defecto (usar `priority` en la imagen principal del hero).
 *  - Fondo beige mientras carga y un respaldo elegante si la imagen falla.
 */
export default function ResponsiveImage({
  src,
  alt,
  sizes = '100vw',
  widths,
  fallbackWidth = 1080,
  priority = false,
  className = '',
  imgClassName = '',
}) {
  const [status, setStatus] = useState('loading')

  return (
    <div className={`relative overflow-hidden bg-sand-200 ${className}`}>
      {status === 'error' || !src ? (
        <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-sand-100 to-sand-300 text-muted">
          <ImageOff className="size-6" aria-hidden="true" />
          <span className="sr-only">{alt}</span>
        </div>
      ) : (
        <img
          src={imageAtWidth(src, fallbackWidth)}
          srcSet={buildSrcSet(src, widths)}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`size-full object-cover transition-opacity duration-700 ease-(--ease-premium) ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}
    </div>
  )
}
