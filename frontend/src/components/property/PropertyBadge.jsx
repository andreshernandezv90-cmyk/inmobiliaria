/**
 * Etiqueta sobre la fotografía (Nueva, Destacada, Preventa, Apartada…).
 * Fondo translúcido claro para no competir con la imagen.
 */
const TONES = {
  default: 'bg-white/90 text-ink',
  dark: 'bg-ink/80 text-white',
  gold: 'bg-gold-300/95 text-ink',
}

export default function PropertyBadge({ children, tone = 'default' }) {
  return (
    <span
      className={`inline-flex h-7 items-center rounded-full px-3 text-[0.7rem] font-semibold tracking-[0.06em] backdrop-blur-sm ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}
