import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SITE_CONFIG, NAV_LINKS } from '../constants/config'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface-0/90 backdrop-blur-md border-b border-wire/60'
          : ''
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-8 h-14 flex items-center justify-between">
        {/* Wordmark */}
        <a href="#hero" className="font-mono text-xs text-ink-tertiary hover:text-ink-secondary transition-colors tracking-widest uppercase">
          {SITE_CONFIG.name.split(' ').map(n => n[0]).join('')}
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-mono text-[11px] text-ink-ghost hover:text-ink-secondary transition-colors tracking-widest uppercase"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Resume CTA */}
        <div className="flex items-center gap-4">
          <a
            href={SITE_CONFIG.resume}
            className="hidden md:inline-flex font-mono text-[11px] text-ink-ghost border border-wire rounded px-3 py-1.5 hover:border-wire-bright hover:text-ink-secondary transition-all duration-200"
          >
            Resume
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-ink-tertiary hover:text-ink-secondary"
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <span className={`block w-5 h-px bg-current transition-transform ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-3 h-px bg-current transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-px bg-current transition-transform ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-surface-0 border-b border-wire px-6 py-6"
        >
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="font-mono text-sm text-ink-secondary hover:text-ink-primary transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
        </motion.div>
      )}
    </motion.header>
  )
}
