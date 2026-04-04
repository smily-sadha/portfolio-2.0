import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'

const VARIANTS = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  },
}

/**
 * Wraps children in a Framer Motion element that animates in on scroll.
 * @param {string} variant - 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight'
 * @param {number} delay - animation delay in seconds
 * @param {number} duration - animation duration in seconds
 */
export default function AnimatedWrapper({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.5,
  margin = '-60px',
  className = '',
  as = 'div',
}) {
  const { ref, isInView } = useScrollReveal({ margin })
  const MotionTag = motion[as] || motion.div

  return (
    <MotionTag
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={VARIANTS[variant]}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </MotionTag>
  )
}
