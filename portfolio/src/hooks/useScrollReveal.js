import { useRef } from 'react'
import { useInView } from 'framer-motion'

/**
 * Returns a ref and a boolean indicating if the element is in the viewport.
 * Fires once by default. Adjust `margin` to control trigger offset.
 */
export function useScrollReveal({ margin = '-80px', once = true } = {}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin })
  return { ref, isInView }
}
