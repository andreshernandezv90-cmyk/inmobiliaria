import { Link } from 'react-router'
import { Clock, Mail, Phone } from 'lucide-react'
import Logo from './Logo'
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '@/components/icons/BrandIcons'
import { FOOTER_NAV } from '@/config/navigation'
import { ROUTES } from '@/config/routes'
import { CONTACT, SITE, SOCIAL } from '@/config/site'
import { generalWhatsappUrl } from '@/lib/whatsapp'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink text-ivory" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Información de {SITE.name}
      </h2>

      <div className="container-page">
        <div className="grid gap-12 pt-16 pb-14 sm:grid-cols-2 md:pt-20 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/65">
              Acompañamos a familias e inversionistas a comprar, vender y rentar propiedades en la zona metropolitana
              de Guadalajara, con atención personal y fotografía profesional en cada publicación.
            </p>
            <div className="mt-6 flex gap-2">
              <a
                href={SOCIAL.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-ivory/80 transition-colors hover:border-white/40 hover:text-white"
              >
                <InstagramIcon className="size-[1.05rem]" />
              </a>
              <a
                href={SOCIAL.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-ivory/80 transition-colors hover:border-white/40 hover:text-white"
              >
                <FacebookIcon className="size-[1.05rem]" />
              </a>
              <a
                href={generalWhatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-ivory/80 transition-colors hover:border-white/40 hover:text-white"
              >
                <WhatsAppIcon className="size-[1.05rem]" />
              </a>
            </div>
          </div>

          {FOOTER_NAV.map((column) => (
            <nav key={column.title} aria-label={column.title} className="lg:col-span-2">
              <h3 className="text-[0.7rem] font-semibold tracking-[0.22em] text-ivory/50 uppercase">{column.title}</h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-ivory/80 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="lg:col-span-4">
            <h3 className="text-[0.7rem] font-semibold tracking-[0.22em] text-ivory/50 uppercase">Contacto</h3>
            <ul className="mt-5 space-y-3 text-sm text-ivory/80">
              <li>
                <a href={CONTACT.phoneHref} className="inline-flex items-center gap-3 hover:text-white">
                  <Phone className="size-4 text-gold-300" aria-hidden="true" />
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-3 hover:text-white">
                  <Mail className="size-4 text-gold-300" aria-hidden="true" />
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 hover:text-white"
                >
                  <InstagramIcon className="size-4 text-gold-300" />
                  {SOCIAL.instagram.handle}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-gold-300" aria-hidden="true" />
                <span>
                  {CONTACT.schedule.map((s) => (
                    <span key={s.days} className="block">
                      {s.days}: {s.hours}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-8 text-xs text-ivory/50 sm:flex-row sm:justify-between">
          <p>
            © {year} {SITE.name} {SITE.tagline}. Todos los derechos reservados.
          </p>
          <Link to={ROUTES.privacy} className="hover:text-ivory">
            Aviso de privacidad
          </Link>
        </div>
      </div>
    </footer>
  )
}
