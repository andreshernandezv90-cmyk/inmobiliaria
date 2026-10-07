import { Camera, Calculator, Megaphone } from 'lucide-react'
import Button from '@/components/ui/Button'
import ResponsiveImage from '@/components/ui/ResponsiveImage'
import Reveal from '@/components/ui/Reveal'
import { WhatsAppIcon } from '@/components/icons/BrandIcons'
import { ROUTES } from '@/config/routes'
import { whatsappUrl } from '@/lib/whatsapp'

const STEPS = [
  {
    icon: Calculator,
    title: 'Valuación sin costo',
    text: 'Analizamos tu propiedad y el mercado de la zona para definir un precio competitivo.',
  },
  {
    icon: Camera,
    title: 'Fotografía profesional',
    text: 'Fotografías y video que muestran tu propiedad como merece ser vista.',
  },
  {
    icon: Megaphone,
    title: 'Promoción y seguimiento',
    text: 'Publicación en el sitio y redes sociales; filtramos a los interesados por ti.',
  },
]

const SELL_MESSAGE = 'Hola, me interesa vender mi propiedad. ¿Me pueden dar información sobre el proceso?'

/** Invitación a propietarios para vender con la inmobiliaria. */
export default function SellPropertyCTA() {
  return (
    <section aria-labelledby="sell-title" className="overflow-hidden bg-ink py-20 text-ivory md:py-28">
      <div className="container-page grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Imagen con remate en arco: guiño al logotipo */}
        <Reveal className="relative mx-auto w-full max-w-[19rem] sm:max-w-sm lg:col-span-5 lg:max-w-none">
          <ResponsiveImage
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
            alt="Casa con jardín lista para venderse"
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="aspect-[4/5] rounded-t-full rounded-b-2xl bg-ink-soft!"
          />
          <div className="absolute -bottom-6 left-4 rounded-2xl bg-ivory px-5 py-4 text-ink shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)] sm:left-auto sm:-right-6">
            <p className="font-display text-xl font-light">De la valuación a la firma</p>
            <p className="mt-1 text-xs text-muted">te acompañamos en cada paso</p>
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow text-gold-300!">Vende con nosotros</p>
            <h2 id="sell-title" className="heading-display mt-4 text-[2.3rem] leading-[1.05] sm:text-[3.4rem]">
              ¿Quieres vender tu propiedad?
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-ivory/70">
              Nos encargamos de todo el proceso para que vendas al mejor precio y sin complicaciones: desde la
              valuación hasta la firma ante notario.
            </p>
          </Reveal>

          <ol className="mt-10 grid gap-6 sm:grid-cols-3 sm:gap-5">
            {STEPS.map(({ icon: Icon, title, text }, index) => (
              <Reveal as="li" key={title} delay={index * 0.08} className="border-t border-white/15 pt-5">
                <div className="flex items-center gap-3">
                  <span className="font-display text-sm text-gold-300">0{index + 1}</span>
                  <Icon className="size-4 text-ivory/60" strokeWidth={1.6} aria-hidden="true" />
                </div>
                <h3 className="mt-3 text-[0.95rem] font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/60">{text}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.2} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button to={ROUTES.sell} variant="light" size="lg">
              Quiero vender mi propiedad
            </Button>
            <a
              href={whatsappUrl(SELL_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-2 text-sm font-semibold text-ivory/80 transition-colors hover:text-white"
            >
              <WhatsAppIcon className="size-4" />o escríbenos por WhatsApp
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
