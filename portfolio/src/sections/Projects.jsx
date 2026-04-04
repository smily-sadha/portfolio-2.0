import Section from '../components/Section'
import Badge from '../components/Badge'
import AnimatedWrapper from '../components/AnimatedWrapper'
import { projects } from '../data/projects'
import { motion } from 'framer-motion'

function SectionHeader({ index, title }) {
  return (
    <div className="flex items-center gap-4 mb-16">
      <span className="font-mono text-xs text-ink-ghost">{index}</span>
      <div className="h-px flex-1 bg-wire" />
      <span className="font-mono text-xs tracking-widest text-ink-tertiary uppercase">{title}</span>
    </div>
  )
}

function ProjectRow({ project, index }) {
  return (
    <AnimatedWrapper variant="slideLeft" delay={index * 0.055}>
      <motion.a
        href={project.link}
        target="_blank"
        rel="noreferrer"
        whileHover={{ x: 6 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="flex flex-col sm:flex-row sm:items-center gap-4 group border border-transparent hover:border-wire rounded-lg px-5 py-4 -mx-5 transition-colors duration-200"
      >
        {/* Left: title + desc */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5">
            <span className="font-sans font-600 text-sm text-ink-primary group-hover:text-accent-bright transition-colors" style={{ fontWeight: 600 }}>
              {project.title}
            </span>
            <Badge variant="mono">{project.category}</Badge>
            <span className="font-mono text-[10px] text-ink-ghost">{project.year}</span>
          </div>
          <p className="text-ink-tertiary text-sm leading-relaxed">{project.description}</p>
        </div>

        {/* Right: tech + metrics */}
        <div className="flex flex-col sm:items-end gap-2 shrink-0">
          <div className="flex flex-wrap gap-1.5 sm:justify-end">
            {project.tech.slice(0, 3).map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
            {project.tech.length > 3 && (
              <Badge variant="ghost">+{project.tech.length - 3}</Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {project.metrics.map((m) => (
              <span key={m} className="font-mono text-[11px] text-ink-tertiary">{m}</span>
            ))}
          </div>
        </div>

        {/* Arrow indicator */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <span className="font-mono text-xs text-ink-tertiary">↗</span>
        </div>
      </motion.a>
    </AnimatedWrapper>
  )
}

export default function Projects() {
  return (
    <Section id="projects">
      <SectionHeader index="02" title="Projects" />
      <div className="divide-y divide-wire/40">
        {projects.map((project, i) => (
          <div key={project.id} className={i === 0 ? 'pb-3' : 'py-3'}>
            <ProjectRow project={project} index={i} />
          </div>
        ))}
      </div>
    </Section>
  )
}
