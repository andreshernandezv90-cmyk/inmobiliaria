import { Link } from 'react-router'

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap ' +
  'transition-colors duration-300 ease-(--ease-premium) disabled:pointer-events-none disabled:opacity-50'

const VARIANTS = {
  primary: 'bg-ink text-ivory hover:bg-ink-soft',
  secondary: 'border border-ink/15 bg-transparent text-ink hover:border-ink/40 hover:bg-ink/[0.03]',
  light: 'bg-ivory text-ink hover:bg-white',
  outlineLight: 'border border-white/40 text-white hover:border-white hover:bg-white/10',
  whatsapp: 'bg-whatsapp text-ink hover:bg-[#2fe072]',
}

const SIZES = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-sm',
  lg: 'h-14 px-7 text-[0.95rem]',
}

/**
 * Botón reutilizable. Se comporta como:
 *  - <Link> si recibe `to` (navegación interna),
 *  - <a> si recibe `href` (enlace externo, se abre en otra pestaña),
 *  - <button> en cualquier otro caso.
 */
export default function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}
