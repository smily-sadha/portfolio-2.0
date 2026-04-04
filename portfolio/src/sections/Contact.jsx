import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Section from '../components/Section'
import AnimatedWrapper from '../components/AnimatedWrapper'
import { SITE_CONFIG } from '../constants/config'

function SectionHeader({ index, title }) {
  return (
    <div className="flex items-center gap-4 mb-16">
      <span className="font-mono text-xs text-ink-ghost">{index}</span>
      <div className="h-px flex-1 bg-wire" />
      <span className="font-mono text-xs tracking-widest text-ink-tertiary uppercase">{title}</span>
    </div>
  )
}

function FormField({ label, name, type = 'text', value, onChange, required }) {
  return (
    <div>
      <label className="block font-mono text-[10px] tracking-widest text-ink-ghost uppercase mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-surface-2 border border-wire rounded-lg px-4 py-2.5 font-mono text-sm text-ink-primary placeholder-ink-ghost focus:outline-none focus:border-wire-bright transition-colors duration-200"
      />
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <Section id="contact">
      <SectionHeader index="08" title="Contact" />

      <div className="grid md:grid-cols-2 gap-12 md:gap-20">
        {/* Left: info */}
        <AnimatedWrapper variant="fadeUp" delay={0}>
          <div>
            <p className="text-ink-primary text-lg font-sans mb-3 leading-snug" style={{ fontWeight: 600 }}>
              Open to full-time roles · Fall 2025
            </p>
            <p className="text-ink-secondary text-sm leading-relaxed mb-8">
              Looking for infrastructure, ML systems, or research engineering positions.
              Prefer teams working on inference, data infra, or production ML at scale.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { label: 'Email', value: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}` },
                { label: 'LinkedIn', value: SITE_CONFIG.linkedin, href: `https://${SITE_CONFIG.linkedin}` },
                { label: 'Twitter', value: SITE_CONFIG.twitter, href: `https://twitter.com/${SITE_CONFIG.twitter}` },
                { label: 'GitHub', value: SITE_CONFIG.github, href: `https://${SITE_CONFIG.github}` },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-4">
                  <span className="font-mono text-[10px] tracking-widest text-ink-ghost uppercase w-16 shrink-0">
                    {c.label}
                  </span>
                  <a
                    href={c.href}
                    className="font-mono text-xs text-ink-secondary hover:text-ink-primary transition-colors"
                  >
                    {c.value}
                  </a>
                </div>
              ))}
            </div>

            <a
              href={SITE_CONFIG.resume}
              className="inline-flex items-center gap-2 font-mono text-xs text-ink-tertiary border border-wire rounded px-4 py-2 hover:border-wire-bright hover:text-ink-secondary transition-all duration-200"
            >
              Download resume ↓
            </a>
          </div>
        </AnimatedWrapper>

        {/* Right: form */}
        <AnimatedWrapper variant="fadeUp" delay={0.1}>
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-5"
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField label="Name" name="name" value={form.name} onChange={handleChange} required />
                  <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>
                <FormField label="Subject" name="subject" value={form.subject} onChange={handleChange} />
                <div>
                  <label className="block font-mono text-[10px] tracking-widest text-ink-ghost uppercase mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    value={form.message}
                    onChange={handleChange}
                    className="w-full bg-surface-2 border border-wire rounded-lg px-4 py-2.5 font-mono text-sm text-ink-primary placeholder-ink-ghost focus:outline-none focus:border-wire-bright transition-colors duration-200 resize-none"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.98 }}
                  className="w-full font-mono text-sm bg-ink-primary text-surface-0 py-3 rounded-lg hover:bg-accent-bright transition-colors duration-200"
                >
                  Send message
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-center border border-wire rounded-xl p-12"
              >
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-signal/10 border border-signal/30 flex items-center justify-center mx-auto mb-4">
                    <span className="text-signal text-sm">✓</span>
                  </div>
                  <p className="font-mono text-sm text-ink-secondary">Message sent.</p>
                  <p className="font-mono text-xs text-ink-ghost mt-1">I'll respond within 48 hours.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </AnimatedWrapper>
      </div>
    </Section>
  )
}
