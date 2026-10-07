import { ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'
import Seo from '@/components/ui/Seo'
import { WhatsAppIcon } from '@/components/icons/BrandIcons'
import { ROUTES } from '@/config/routes'
import { generalWhatsappUrl } from '@/lib/whatsapp'

/**
 * Página temporal para las secciones que se construirán en las siguientes
 * etapas. Mantiene la navegación funcionando sin enlaces rotos.
 */
export default function ComingSoon({ title, description }) {
  return (
    <section className="container-page flex min-h-[70svh] flex-col items-start justify-center py-24">
      <Seo title={title} />
      <p className="eyebrow">Próximamente</p>
      <h1 className="heading-display mt-4 max-w-2xl text-4xl leading-tight sm:text-6xl">{title}</h1>
      <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
        {description ??
          'Estamos preparando esta sección. Mientras tanto, escríbenos por WhatsApp y con gusto te ayudamos.'}
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button to={ROUTES.home} variant="secondary">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver al inicio
        </Button>
        <Button href={generalWhatsappUrl()} variant="whatsapp">
          <WhatsAppIcon className="size-4" />
          WhatsApp
        </Button>
      </div>
    </section>
  )
}
