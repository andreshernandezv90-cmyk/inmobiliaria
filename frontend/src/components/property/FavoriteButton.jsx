import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useFavorites } from '@/hooks/useFavorites'

/** Corazón para guardar una propiedad en favoritos (localStorage). */
export default function FavoriteButton({ propertyId, title, className = '' }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const active = isFavorite(propertyId)

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.88 }}
      onClick={(event) => {
        // La tarjeta completa es un enlace: evitamos navegar al pulsar el corazón.
        event.preventDefault()
        event.stopPropagation()
        toggleFavorite(propertyId)
      }}
      aria-pressed={active}
      aria-label={active ? `Quitar ${title} de favoritos` : `Guardar ${title} en favoritos`}
      className={`inline-flex size-10 items-center justify-center rounded-full bg-white/85 text-ink backdrop-blur-sm transition-colors hover:bg-white ${className}`}
    >
      <Heart
        className={`size-[1.1rem] transition-colors duration-300 ${active ? 'fill-[#c2453b] text-[#c2453b]' : ''}`}
        strokeWidth={1.8}
        aria-hidden="true"
      />
    </motion.button>
  )
}
