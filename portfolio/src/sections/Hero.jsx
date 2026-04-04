import { motion } from 'framer-motion'
import { SITE_CONFIG, NAV_LINKS } from '../constants/config'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-8 overflow-hidden"
    >
      {/* Subtle grid texture */}
      <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />

      {/* Faint radial glow — top-right */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top right, rgba(126,232,162,0.04) 0%, transparent 70%)',
        }}
        aria-hidden
      />

      <div className="max-w-5xl mx-auto w-full pt-24 pb-16">
        <motion.div variants={container} initial="hidden" animate="visible">
          {/* Status pill */}
          <motion.div variants={item} className="mb-10">
            <span className="inline-flex items-center gap-2 text-xs font-mono text-ink-tertiary border border-wire px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
              {SITE_CONFIG.status}
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={item}
            className="text-[clamp(3rem,8vw,6.5rem)] font-sans font-800 leading-[0.92] tracking-tight text-ink-primary mb-4"
            style={{ fontWeight: 800 }}
          >
            {SITE_CONFIG.name}
          </motion.h1>

          {/* Role — italic serif contrast */}
          <motion.p
            variants={item}
            className="text-[clamp(1.4rem,3.5vw,2.4rem)] font-serif italic text-ink-secondary mb-8 leading-tight"
          >
            {SITE_CONFIG.title}
          </motion.p>

          {/* Tagline */}
          <motion.p
            variants={item}
            className="text-ink-secondary text-base md:text-lg font-sans font-400 max-w-xl leading-relaxed mb-12"
          >
            {SITE_CONFIG.tagline}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-wrap gap-3">
            <a
              href="#case-studies"
              className="font-mono text-sm bg-ink-primary text-surface-0 px-5 py-2.5 rounded hover:bg-accent-bright transition-colors duration-200"
            >
              View work
            </a>
            <a
              href={SITE_CONFIG.resume}
              className="font-mono text-sm text-ink-secondary border border-wire px-5 py-2.5 rounded hover:border-wire-bright hover:text-ink-primary transition-all duration-200"
            >
              Resume ↓
            </a>
            <a
              href="#contact"
              className="font-mono text-sm text-ink-tertiary px-5 py-2.5 rounded hover:text-ink-secondary transition-colors duration-200"
            >
              Contact →
            </a>
          </motion.div>
        </motion.div>

        {/* Bottom meta row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="absolute bottom-10 left-6 md:left-8 right-6 max-w-5xl mx-auto flex items-end justify-between"
        >
          <p className="font-mono text-xs text-ink-ghost tracking-widest uppercase">
            {SITE_CONFIG.location}
          </p>
          <div className="hidden md:flex items-center gap-6">
            {[
              { label: 'GH', href: `https://${SITE_CONFIG.github}` },
              { label: 'LI', href: `https://${SITE_CONFIG.linkedin}` },
              { label: 'X', href: `https://twitter.com/${SITE_CONFIG.twitter}` },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="font-mono text-xs text-ink-ghost hover:text-ink-secondary tracking-widest transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
