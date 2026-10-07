import { useCallback, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Heart, Menu } from 'lucide-react'
import Logo from './Logo'
import MobileMenu from './MobileMenu'
import Button from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/icons/BrandIcons'
import { MAIN_NAV } from '@/config/navigation'
import { ROUTES } from '@/config/routes'
import { useScrolled } from '@/hooks/useScrolled'
import { useFavorites } from '@/hooks/useFavorites'
import { isNavActive } from '@/lib/navigation'
import { generalWhatsappUrl } from '@/lib/whatsapp'

/**
 * Header fijo.
 * `overlay`: en páginas con foto a pantalla completa (inicio) empieza
 * transparente con texto blanco y se vuelve sólido al hacer scroll.
 */
export default function Header({ overlay = false }) {
  const location = useLocation()
  const scrolled = useScrolled(40)
  const { count } = useFavorites()
  // El menú queda "abierto" solo para la URL en la que se abrió:
  // al navegar a otra página se cierra automáticamente.
  const [menuOpenAt, setMenuOpenAt] = useState(null)
  const menuOpen = menuOpenAt === location.key
  const openMenu = () => setMenuOpenAt(location.key)
  const closeMenu = useCallback(() => setMenuOpenAt(null), [])

  const transparent = overlay && !scrolled && !menuOpen
  const textTone = transparent ? 'text-white' : 'text-ink'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-(--ease-premium) ${
          transparent
            ? 'bg-linear-to-b from-black/35 to-transparent'
            : 'bg-ivory/90 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md'
        }`}
      >
        <div className="container-page flex h-[72px] items-center justify-between gap-6 lg:h-20">
          <Logo tone={transparent ? 'light' : 'dark'} />

          <nav aria-label="Navegación principal" className="hidden lg:block">
            <ul className="flex items-center gap-1 xl:gap-2">
              {MAIN_NAV.map((item) => {
                const active = isNavActive(item.to, location)
                return (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      aria-current={active ? 'page' : undefined}
                      className={`relative rounded-full px-3 py-2 text-[0.84rem] font-medium transition-opacity duration-300 ${textTone} ${
                        active ? 'opacity-100' : 'opacity-75 hover:opacity-100'
                      }`}
                    >
                      {item.label}
                      {active && (
                        <span className="absolute inset-x-3 -bottom-0.5 h-px bg-current" aria-hidden="true" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to={ROUTES.favorites}
              className={`relative inline-flex size-11 items-center justify-center rounded-full transition-colors ${textTone} ${
                transparent ? 'hover:bg-white/10' : 'hover:bg-ink/5'
              }`}
              aria-label={`Favoritos${count ? ` (${count})` : ''}`}
            >
              <Heart className="size-[1.15rem]" strokeWidth={1.8} aria-hidden="true" />
              {count > 0 && (
                <span className="absolute top-1.5 right-1.5 flex min-w-4 items-center justify-center rounded-full bg-gold-400 px-1 text-[0.62rem] leading-4 font-bold text-ink">
                  {count}
                </span>
              )}
            </Link>

            <Button
              href={generalWhatsappUrl()}
              variant="whatsapp"
              size="sm"
              className="max-sm:hidden"
              aria-label="Escríbenos por WhatsApp"
            >
              <WhatsAppIcon className="size-[1.05rem]" />
              WhatsApp
            </Button>

            <button
              type="button"
              onClick={openMenu}
              className={`inline-flex size-11 items-center justify-center rounded-full lg:hidden ${textTone} ${
                transparent ? 'hover:bg-white/10' : 'hover:bg-ink/5'
              }`}
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="size-6" strokeWidth={1.6} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  )
}
