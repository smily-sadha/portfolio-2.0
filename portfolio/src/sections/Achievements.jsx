import Section from '../components/Section'
import Badge from '../components/Badge'
import AnimatedWrapper from '../components/AnimatedWrapper'
import { achievements } from '../data/achievements'

function SectionHeader({ index, title }) {
  return (
    <div className="flex items-center gap-4 mb-16">
      <span className="font-mono text-xs text-ink-ghost">{index}</span>
      <div className="h-px flex-1 bg-wire" />
      <span className="font-mono text-xs tracking-widest text-ink-tertiary uppercase">{title}</span>
    </div>
  )
}

const typeColors = {
  Publication: 'signal',
  Competition: 'mono',
  'Open Source': 'mono',
}

export default function Achievements() {
  return (
    <Section id="achievements">
      <SectionHeader index="06" title="Recognition" />
      <div className="space-y-6">
        {achievements.map((a, i) => (
          <AnimatedWrapper key={a.id} variant="fadeUp" delay={i * 0.08}>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 py-6 border-b border-wire/50 last:border-0">
              {/* Year */}
              <div className="shrink-0 sm:w-16">
                <span className="font-mono text-xs text-ink-ghost">{a.year}</span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start flex-wrap gap-3 mb-2">
                  <h3 className="font-sans text-sm text-ink-primary" style={{ fontWeight: 600 }}>
                    {a.title}
                  </h3>
                  <Badge variant={typeColors[a.type] || 'mono'}>{a.type}</Badge>
                </div>
                <p className="text-sm text-ink-secondary leading-relaxed mb-3">{a.description}</p>
                {a.link && (
                  <a
                    href={a.link}
                    className="font-mono text-xs text-ink-ghost hover:text-ink-secondary transition-colors"
                  >
                    View →
                  </a>
                )}
              </div>
            </div>
          </AnimatedWrapper>
        ))}
      </div>
    </Section>
  )
}
