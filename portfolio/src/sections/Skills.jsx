import Section from '../components/Section'
import Badge from '../components/Badge'
import AnimatedWrapper from '../components/AnimatedWrapper'
import { skills, coreCompetencies } from '../data/skills'

function SectionHeader({ index, title }) {
  return (
    <div className="flex items-center gap-4 mb-16">
      <span className="font-mono text-xs text-ink-ghost">{index}</span>
      <div className="h-px flex-1 bg-wire" />
      <span className="font-mono text-xs tracking-widest text-ink-tertiary uppercase">{title}</span>
    </div>
  )
}

export default function Skills() {
  return (
    <Section id="skills">
      <SectionHeader index="03" title="Technical Stack" />

      <div className="grid md:grid-cols-[1fr,2fr] gap-12 md:gap-16">
        {/* Core competencies — left column */}
        <AnimatedWrapper variant="fadeIn" delay={0.05}>
          <div>
            <p className="font-mono text-[10px] tracking-widest text-ink-ghost uppercase mb-6">
              Core competencies
            </p>
            <ul className="space-y-3">
              {coreCompetencies.map((c) => (
                <li key={c} className="flex items-center gap-3 text-sm text-ink-secondary font-sans">
                  <span className="w-1 h-1 rounded-full bg-signal shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </AnimatedWrapper>

        {/* Skills grid — right column */}
        <div className="space-y-8">
          {skills.map((group, i) => (
            <AnimatedWrapper key={group.category} variant="fadeUp" delay={i * 0.07}>
              <div>
                <p className="font-mono text-[10px] tracking-widest text-ink-ghost uppercase mb-3">
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Badge key={item} variant="default">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </AnimatedWrapper>
          ))}
        </div>
      </div>
    </Section>
  )
}
