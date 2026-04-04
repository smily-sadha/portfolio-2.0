import Section from '../components/Section'
import Badge from '../components/Badge'
import AnimatedWrapper from '../components/AnimatedWrapper'
import { experience } from '../data/experience'

function SectionHeader({ index, title }) {
  return (
    <div className="flex items-center gap-4 mb-16">
      <span className="font-mono text-xs text-ink-ghost">{index}</span>
      <div className="h-px flex-1 bg-wire" />
      <span className="font-mono text-xs tracking-widest text-ink-tertiary uppercase">{title}</span>
    </div>
  )
}

function ExperienceItem({ item, index }) {
  return (
    <AnimatedWrapper variant="fadeUp" delay={index * 0.09}>
      <div className="grid md:grid-cols-[200px,1fr] gap-6 md:gap-12 py-8 border-b border-wire/50 last:border-0">
        {/* Left: company info */}
        <div className="shrink-0">
          <p className="font-sans text-sm text-ink-primary mb-1" style={{ fontWeight: 600 }}>
            {item.company}
          </p>
          <p className="text-sm text-ink-secondary mb-2">{item.role}</p>
          <p className="font-mono text-xs text-ink-tertiary mb-1">{item.period}</p>
          <p className="font-mono text-xs text-ink-ghost mb-3">{item.location}</p>
          <Badge variant="mono">{item.type}</Badge>
        </div>

        {/* Right: bullets + tech */}
        <div>
          <ul className="space-y-3 mb-5">
            {item.bullets.map((b, bi) => (
              <li key={bi} className="text-sm text-ink-secondary leading-relaxed pl-4 border-l border-wire relative">
                {b}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-1.5">
            {item.tech.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        </div>
      </div>
    </AnimatedWrapper>
  )
}

export default function Experience() {
  return (
    <Section id="experience">
      <SectionHeader index="04" title="Experience" />
      <div>
        {experience.map((item, i) => (
          <ExperienceItem key={item.id} item={item} index={i} />
        ))}
      </div>
    </Section>
  )
}
