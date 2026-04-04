import Section from '../components/Section'
import AnimatedWrapper from '../components/AnimatedWrapper'
import Card from '../components/Card'
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

const proofItems = [
  {
    id: 'github',
    label: 'GitHub',
    moniker: SITE_CONFIG.github,
    detail: '23 public repos · 1,200+ contributions in 2024',
    icon: 'GH',
    href: `https://${SITE_CONFIG.github}`,
  },
  {
    id: 'hf',
    label: 'HuggingFace',
    moniker: SITE_CONFIG.huggingface,
    detail: '4 model cards · 2 datasets · 340 downloads',
    icon: 'HF',
    href: `https://${SITE_CONFIG.huggingface}`,
  },
  {
    id: 'arxiv',
    label: 'Preprints',
    moniker: 'arxiv.org/search/?query=aryanmehta',
    detail: '1 published · 2 under review',
    icon: 'Ax',
    href: 'https://arxiv.org',
  },
  {
    id: 'demos',
    label: 'Live Demos',
    moniker: 'aryanmehta.dev/demos',
    detail: 'Inference endpoints + interactive Colab notebooks',
    icon: '↗',
    href: '#',
  },
]

const stats = [
  { value: '23', label: 'Public repos' },
  { value: '1.2k', label: '2024 contributions' },
  { value: '4', label: 'Model cards' },
  { value: '340', label: 'Model downloads' },
]

export default function Proof() {
  return (
    <Section id="proof">
      <SectionHeader index="05" title="Verification" />

      {/* Stats row */}
      <AnimatedWrapper variant="fadeIn" delay={0} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface-2 border border-wire rounded-xl p-5 text-center">
            <div className="font-sans text-2xl text-ink-primary mb-1" style={{ fontWeight: 700 }}>
              {s.value}
            </div>
            <div className="font-mono text-[10px] text-ink-ghost uppercase tracking-widest">
              {s.label}
            </div>
          </div>
        ))}
      </AnimatedWrapper>

      {/* Link cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {proofItems.map((item, i) => (
          <AnimatedWrapper key={item.id} variant="fadeUp" delay={i * 0.07}>
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-5 bg-surface-1 border border-wire hover:border-wire-bright rounded-xl px-6 py-5 transition-colors duration-200 group"
            >
              <span className="w-10 h-10 flex items-center justify-center font-mono text-xs text-ink-tertiary bg-surface-2 border border-wire rounded shrink-0 group-hover:text-ink-secondary transition-colors">
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className="font-sans text-sm text-ink-primary group-hover:text-accent-bright transition-colors mb-0.5" style={{ fontWeight: 600 }}>
                  {item.label}
                </p>
                <p className="font-mono text-xs text-ink-ghost truncate mb-1">{item.moniker}</p>
                <p className="font-mono text-xs text-ink-tertiary">{item.detail}</p>
              </div>
            </a>
          </AnimatedWrapper>
        ))}
      </div>
    </Section>
  )
}
