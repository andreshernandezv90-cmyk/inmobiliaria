import Button from '@/components/ui/Button'
import Seo from '@/components/ui/Seo'
import { ROUTES } from '@/config/routes'

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[70svh] flex-col items-start justify-center py-24">
      <Seo title="Página no encontrada" />
      <p className="eyebrow">Error 404</p>
      <h1 className="heading-display mt-4 text-4xl sm:text-6xl">Esta puerta no lleva a ningún lado.</h1>
      <p className="mt-5 max-w-md text-muted">La página que buscas no existe o fue movida.</p>
      <div className="mt-10 flex gap-3">
        <Button to={ROUTES.home}>Ir al inicio</Button>
        <Button to={ROUTES.properties} variant="secondary">
          Ver propiedades
        </Button>
      </div>
    </section>
  )
}
