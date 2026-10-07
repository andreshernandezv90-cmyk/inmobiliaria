import { Outlet, useLocation } from 'react-router'
import Header from './Header'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
import WhatsAppFloatingButton from './WhatsAppFloatingButton'
import { ROUTES } from '@/config/routes'

/** Páginas que inician con una fotografía a pantalla completa. */
const OVERLAY_ROUTES = [ROUTES.home]

export default function Layout() {
  const { pathname } = useLocation()
  const overlay = OVERLAY_ROUTES.includes(pathname)

  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#contenido"
        className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-sm text-ivory focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>
      <ScrollToTop />
      <Header overlay={overlay} />
      <main id="contenido" className={`flex-1 ${overlay ? '' : 'pt-[72px] lg:pt-20'}`}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  )
}
