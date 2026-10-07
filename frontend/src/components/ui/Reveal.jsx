import { motion } from 'framer-motion'

/**
 * Aparición suave al entrar en pantalla (fade + desplazamiento corto).
 * Respeta "reducir movimiento" gracias a <MotionConfig reducedMotion="user"> en App.
 */
export default function Reveal({ as = 'div', delay = 0, y = 18, className, children, ...props }) {
  const Component = motion[as] ?? motion.div
  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  )
}
