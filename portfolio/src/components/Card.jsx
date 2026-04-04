import { motion } from 'framer-motion'

/**
 * Generic card component with optional hover lift animation.
 * @param {boolean} hoverable - enables subtle lift on hover
 * @param {string} variant - 'default' | 'bordered' | 'flat'
 */
export default function Card({
  children,
  className = '',
  hoverable = false,
  variant = 'default',
  onClick,
}) {
  const base = 'rounded-xl transition-colors duration-200'

  const variants = {
    default: 'bg-surface-1 border border-wire',
    bordered: 'bg-transparent border border-wire',
    flat: 'bg-surface-2',
  }

  if (hoverable) {
    return (
      <motion.div
        whileHover={{ y: -3, borderColor: 'rgba(90, 87, 84, 0.8)' }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={onClick}
        className={`${base} ${variants[variant]} cursor-pointer group ${className}`}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </div>
  )
}
