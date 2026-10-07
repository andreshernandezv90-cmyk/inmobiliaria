import { MotionConfig } from 'framer-motion'
import { Route, Routes } from 'react-router'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home'
import ComingSoon from '@/pages/ComingSoon'
import NotFound from '@/pages/NotFound'

/**
 * Rutas del sitio público.
 * En la Etapa 1 solo la portada está terminada; el resto muestra una página
 * temporal para que la navegación funcione de punta a punta.
 */
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="propiedades"
            element={<ComingSoon title="Catálogo de propiedades" description="El catálogo con filtros y ordenamiento llega en la siguiente etapa." />}
          />
          <Route
            path="propiedad/:slug"
            element={<ComingSoon title="Ficha de propiedad" description="La página de detalle con galería, mapa y WhatsApp se construirá en una etapa posterior." />}
          />
          <Route path="favoritos" element={<ComingSoon title="Tus favoritos" />} />
          <Route path="mapa" element={<ComingSoon title="Mapa de propiedades" />} />
          <Route path="vende-tu-propiedad" element={<ComingSoon title="¿Quieres vender tu propiedad?" />} />
          <Route path="contacto" element={<ComingSoon title="Contacto" />} />
          <Route path="aviso-de-privacidad" element={<ComingSoon title="Aviso de privacidad" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </MotionConfig>
  )
}
