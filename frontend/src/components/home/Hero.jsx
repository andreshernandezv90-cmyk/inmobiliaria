import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import ResponsiveImage from '@/components/ui/ResponsiveImage'
import SearchBar from '@/components/search/SearchBar'
import { HERO } from '@/data/hero'
import { ROUTES } from '@/config/routes'

const ease = [0.22, 1, 0.36, 1]

/** Portada: fotografía a pantalla completa, mensaje principal y buscador. */
export default function Hero({ zones }) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-svh flex-col overflow-hidden bg-ink">
      {/* Fotografía con un acercamiento lento muy sutil */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease }}
      >
        <ResponsiveImage
          src={HERO.image_url}
          alt={HERO.image_alt}
          priority
          fallbackWidth={1920}
          className="size-full bg-ink!"
        />
      </motion.div>
      <div
        className="absolute inset-0 -z-10 bg-linear-to-t from-black/80 via-black/30 to-black/25"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 hidden bg-linear-to-r from-black/45 to-transparent lg:block"
        aria-hidden="true"
      />

      <div className="container-page flex flex-1 flex-col justify-end pt-32 pb-8 sm:pb-10 lg:pb-14">
        <div className="max-w-3xl">
          <motion.p
            className="eyebrow text-gold-300!"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
          >
            Guadalajara · Zapopan · Zona metropolitana
          </motion.p>

          <motion.h1
            id="hero-title"
            className="heading-display mt-5 text-[2.75rem] leading-[1.02] text-white sm:text-6xl lg:text-[5.2rem]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease }}
          >
            {HERO.title} <em className="font-light text-gold-300 italic">{HERO.highlight}</em>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease }}
          >
            {HERO.subtitle}
          </motion.p>
        </div>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease }}
        >
          <SearchBar zones={zones} className="max-w-5xl" />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <Link
              to={ROUTES.properties}
              className="group inline-flex items-center gap-3 text-sm font-semibold text-white"
            >
              <span className="border-b border-white/40 pb-0.5 transition-colors group-hover:border-white">
                Explorar propiedades
              </span>
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>

            {/* Pie de foto: enlaza a la propiedad que aparece en la portada */}
            <Link
              to={ROUTES.property(HERO.property_slug)}
              className="group hidden items-center gap-2 text-xs font-medium tracking-wide text-white/70 transition-colors hover:text-white md:inline-flex"
            >
              <span className="h-px w-8 bg-white/40" aria-hidden="true" />
              {HERO.caption}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
