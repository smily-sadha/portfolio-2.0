import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Section from '../components/Section'
import Badge from '../components/Badge'
import AnimatedWrapper from '../components/AnimatedWrapper'
import { caseStudies } from '../data/caseStudies'

function SectionHeader({ index, title }) {
  return (
    <div className="flex items-center gap-4 mb-16">
      <span className="font-mono text-xs text-ink-ghost">{index}</span>
      <div className="h-px flex-1 bg-wire" />
      <span className="font-mono text-xs tracking-widest text-ink-tertiary uppercase">{title}</span>
    </div>
  )
}

function MetricPill({ label, value }) {
  return (
    <div className="bg-surface-2 border border-wire rounded-lg px-4 py-3 text-center">
      <div className="font-mono text-base text-ink-primary font-500 mb-0.5">{value}</div>
      <div className="font-mono text-[10px] text-ink-ghost uppercase tracking-widest">{label}</div>
    </div>
  )
}

function CaseStudyCard({ study, index }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <AnimatedWrapper variant="fadeUp" delay={index * 0.08}>
      <div className="border border-wire rounded-xl overflow-hidden bg-surface-1 hover:border-wire-bright transition-colors duration-300">
        {/* Header */}
        <div className="p-7 md:p-8">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <Badge variant="mono">{study.category}</Badge>
              <span className="font-mono text-xs text-ink-ghost">{study.year}</span>
            </div>
            <a
              href={study.link}
              className="font-mono text-xs text-ink-ghost hover:text-ink-secondary transition-colors group"
              aria-label={`View ${study.title} on GitHub`}
            >
              <span className="group-hover:opacity-100 opacity-0 transition-opacity mr-1">↗</span>
              GitHub
            </a>
          </div>

          <h3
            className="text-2xl md:text-3xl font-sans text-ink-primary mb-3 tracking-tight"
            style={{ fontWeight: 700 }}
          >
            {study.title}
          </h3>

          <p className="text-ink-secondary text-sm leading-relaxed mb-6">
            {study.headline}
          </p>

          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {Object.entries(study.metrics).map(([key, val]) => (
              <MetricPill key={key} label={key} value={val} />
            ))}
          </div>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {study.tech.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>

          {/* Toggle */}
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="font-mono text-xs text-ink-tertiary hover:text-ink-secondary transition-colors mt-2 flex items-center gap-1.5"
          >
            <motion.span
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="inline-block"
            >
              →
            </motion.span>
            {expanded ? 'Collapse' : 'Read case study'}
          </button>
        </div>

        {/* Expandable detail */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              key="detail"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t border-wire px-7 md:px-8 py-7 grid md:grid-cols-2 gap-8">
                <div>
                  <p className="font-mono text-[10px] tracking-widest text-ink-ghost uppercase mb-3">Problem</p>
                  <p className="text-sm text-ink-secondary leading-relaxed">{study.problem}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-widest text-ink-ghost uppercase mb-3">Solution</p>
                  <p className="text-sm text-ink-secondary leading-relaxed">{study.solution}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="font-mono text-[10px] tracking-widest text-ink-ghost uppercase mb-3">Outcome</p>
                  <ul className="space-y-2">
                    {study.outcome.map((o, i) => (
                      <li key={i} className="text-sm text-ink-secondary flex gap-3">
                        <span className="text-signal font-mono mt-0.5 shrink-0">✓</span>
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedWrapper>
  )
}

export default function CaseStudies() {
  return (
    <Section id="case-studies">
      <SectionHeader index="01" title="Featured Work" />
      <div className="space-y-5">
        {caseStudies.map((study, i) => (
          <CaseStudyCard key={study.id} study={study} index={i} />
        ))}
      </div>
    </Section>
  )
}
