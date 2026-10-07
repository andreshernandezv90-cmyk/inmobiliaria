import { useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Phone, X } from 'lucide-react'
import Logo from './Logo'
import Button from '@/components/ui/Button'
import { InstagramIcon, WhatsAppIcon } from '@/components/icons/BrandIcons'
import { MAIN_NAV } from '@/config/navigation'
import { CONTACT, SOCIAL } from '@/config/site'
import { isNavActive } from '@/lib/navigation'
import { generalWhatsappUrl } from '@/lib/whatsapp'

/** Menú de pantalla completa para móvil y tablet. */
export default function MobileMenu({ open, onClose }) {
  const location = useLocation()

  // Bloquear el scroll de fondo y cerrar con Escape.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
          className="fixed inset-0 z-50 flex flex-col bg-ivory lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="container-page flex h-[72px] shrink-0 items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-11 items-center justify-center rounded-full hover:bg-ink/5"
              aria-label="Cerrar menú"
              autoFocus
            >
              <X className="size-6" strokeWidth={1.6} aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Navegación móvil" className="container-page flex-1 overflow-y-auto pt-6">
            <ul className="divide-y divide-line border-y border-line">
              {MAIN_NAV.map((item, index) => {
                const active = isNavActive(item.to, location)
                return (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to={item.to}
                      onClick={onClose}
                      aria-current={active ? 'page' : undefined}
                      className="flex items-center justify-between py-4 font-display text-[1.7rem] font-light"
                    >
                      {item.label}
                      {active && <span className="size-1.5 rounded-full bg-gold-600" aria-hidden="true" />}
                    </Link>
                  </motion.li>
                )
              })}
            </ul>
          </nav>

          <div className="container-page shrink-0 space-y-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <Button href={generalWhatsappUrl()} variant="whatsapp" size="lg" className="w-full">
              <WhatsAppIcon className="size-5" />
              Escríbenos por WhatsApp
            </Button>
            <div className="flex items-center justify-center gap-6 text-sm text-muted">
              <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 hover:text-ink">
                <Phone className="size-4" aria-hidden="true" />
                {CONTACT.phone}
              </a>
              <a
                href={SOCIAL.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-ink"
              >
                <InstagramIcon className="size-4" />
                Instagram
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
