import { motion } from 'framer-motion'
import { CheckCheck, Clock, Phone } from 'lucide-react'
import Button from '@/components/ui/Button'
import Reveal from '@/components/ui/Reveal'
import { WhatsAppIcon } from '@/components/icons/BrandIcons'
import { CONTACT, SITE } from '@/config/site'
import { generalWhatsappUrl } from '@/lib/whatsapp'

/**
 * Sección de contacto directo por WhatsApp.
 * Incluye una conversación ilustrativa que muestra cómo funciona el
 * mensaje automático al preguntar por una propiedad.
 */
export default function WhatsAppCTA({ sampleProperty }) {
  return (
    <section aria-labelledby="whatsapp-title" className="bg-sand-100 py-20 md:py-28">
      <div className="container-page grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="eyebrow">Atención directa</p>
          <h2 id="whatsapp-title" className="heading-display mt-4 text-[2.3rem] leading-[1.05] sm:text-[3.2rem]">
            ¿Buscas algo en específico?
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
            Cuéntanos qué necesitas: zona, presupuesto y número de recámaras. Te enviamos opciones por WhatsApp,
            incluso propiedades que todavía no publicamos.
          </p>

          <Button href={generalWhatsappUrl()} variant="whatsapp" size="lg" className="mt-8">
            <WhatsAppIcon className="size-5" />
            Escríbenos por WhatsApp
          </Button>

          <ul className="mt-8 flex flex-col gap-3 text-sm text-ink-soft sm:flex-row sm:gap-8">
            <li>
              <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 hover:text-ink">
                <Phone className="size-4 text-gold-600" aria-hidden="true" />
                {CONTACT.phone}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <Clock className="size-4 text-gold-600" aria-hidden="true" />
              {CONTACT.schedule[0].days}, {CONTACT.schedule[0].hours}
            </li>
          </ul>
        </Reveal>

        {sampleProperty && <ChatPreview property={sampleProperty} />}
      </div>
    </section>
  )
}

/** Ilustración de una conversación de WhatsApp (decorativa). */
function ChatPreview({ property }) {
  const bubble = {
    hidden: { opacity: 0, y: 12 },
    show: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.25 + i * 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
  }

  return (
    <Reveal className="mx-auto w-full max-w-md lg:mr-0">
      <div
        role="img"
        aria-label="Ejemplo de conversación por WhatsApp preguntando por una propiedad"
        className="overflow-hidden rounded-[2rem] border border-line bg-paper shadow-[0_40px_80px_-40px_rgba(22,21,19,0.35)]"
      >
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-ink font-display text-lg text-gold-300">
            {SITE.name.charAt(0)}
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">
              {SITE.name} {SITE.tagline}
            </p>
            <p className="text-xs text-whatsapp-dark">en línea</p>
          </div>
        </div>

        <motion.div
          className="space-y-3 bg-[#efe9dd] px-4 py-6 sm:px-5"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        >
          <motion.div custom={0} variants={bubble} className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-[#d9fdd3] p-3 text-[0.84rem] leading-snug text-ink shadow-sm">
            Hola, estoy interesado en la propiedad <strong className="font-semibold">{property.title}</strong> con ID{' '}
            {property.code} que vi en su página web. ¿Podrían darme más información?
            <span className="mt-1 flex items-center justify-end gap-1 text-[0.65rem] text-muted">
              10:24 <CheckCheck className="size-3.5 text-sky-500" aria-hidden="true" />
            </span>
          </motion.div>
          <motion.div custom={1} variants={bubble} className="max-w-[85%] rounded-2xl rounded-tl-md bg-white p-3 text-[0.84rem] leading-snug text-ink shadow-sm">
            ¡Hola! Claro que sí. La propiedad sigue disponible. ¿Te gustaría agendar una visita esta semana?
            <span className="mt-1 block text-right text-[0.65rem] text-muted">10:26</span>
          </motion.div>
        </motion.div>
      </div>
    </Reveal>
  )
}
