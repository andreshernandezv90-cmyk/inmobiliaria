import { motion } from 'framer-motion'
import { WhatsAppIcon } from '@/components/icons/BrandIcons'
import { generalWhatsappUrl } from '@/lib/whatsapp'

/**
 * Botón flotante de WhatsApp, visible en todo el sitio.
 * `href` permite que una página (p. ej. el detalle de propiedad) envíe
 * un mensaje específico en lugar del general.
 */
export default function WhatsAppFloatingButton({ href = generalWhatsappUrl() }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      initial={{ opacity: 0, scale: 0.8, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex h-14 items-center gap-0 overflow-hidden rounded-full bg-whatsapp pr-[1.0625rem] pl-[1.0625rem] text-white shadow-[0_10px_30px_-10px_rgba(18,140,75,0.6)] transition-[gap,padding] duration-500 ease-(--ease-premium) hover:gap-2.5 hover:pr-5 sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="size-[1.4rem] shrink-0" />
      <span className="max-w-0 text-sm font-semibold whitespace-nowrap opacity-0 transition-all duration-500 ease-(--ease-premium) group-hover:max-w-40 group-hover:opacity-100 group-focus-visible:max-w-40 group-focus-visible:opacity-100">
        ¿Hablamos?
      </span>
    </motion.a>
  )
}
