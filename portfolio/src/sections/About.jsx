import Section from '../components/Section'
import AnimatedWrapper from '../components/AnimatedWrapper'

function SectionHeader({ index, title }) {
  return (
    <div className="flex items-center gap-4 mb-16">
      <span className="font-mono text-xs text-ink-ghost">{index}</span>
      <div className="h-px flex-1 bg-wire" />
      <span className="font-mono text-xs tracking-widest text-ink-tertiary uppercase">{title}</span>
    </div>
  )
}

export default function About() {
  return (
    <Section id="about">
      <SectionHeader index="07" title="About" />

      <div className="grid md:grid-cols-[2fr,1fr] gap-12 md:gap-20">
        <AnimatedWrapper variant="fadeUp" delay={0.05}>
          <div className="space-y-5">
            <p className="text-ink-primary text-xl md:text-2xl font-serif italic leading-relaxed">
              Fourth-year Computer Engineering at the University of Waterloo.
            </p>
            <p className="text-ink-secondary text-base leading-relaxed">
              Most of my work is at the boundary of ML research and systems engineering —
              making inference faster, pipelines more reliable, and deployments more
              observable. I care about correctness, latency, and infrastructure that
              holds under production traffic.
            </p>
            <p className="text-ink-secondary text-base leading-relaxed">
              Currently focused on LLM serving infrastructure: KV-cache management,
              speculative decoding, and disaggregated prefill/decode architectures.
            </p>
            <p className="text-ink-tertiary text-sm leading-relaxed">
              Outside engineering: competitive programming, distributed systems reading
              groups, and arguing about HNSW vs IVF-PQ tradeoffs.
            </p>
          </div>
        </AnimatedWrapper>

        <AnimatedWrapper variant="fadeIn" delay={0.15}>
          <div className="space-y-6">
            <div>
              <p className="font-mono text-[10px] tracking-widest text-ink-ghost uppercase mb-3">Currently reading</p>
              <ul className="space-y-2">
                {[
                  'Raft consensus algorithm (Ongaro)',
                  'Dynamo: Amazon\'s KV store',
                  'Attention with Linear Biases (ALiBi)',
                ].map((item) => (
                  <li key={item} className="text-xs text-ink-tertiary font-sans leading-relaxed">
                    — {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-widest text-ink-ghost uppercase mb-3">Interested in</p>
              <ul className="space-y-2">
                {[
                  'Speculative decoding at scale',
                  'Disaggregated KV-cache architectures',
                  'ML compiler (Triton / XLA internals)',
                ].map((item) => (
                  <li key={item} className="text-xs text-ink-tertiary font-sans leading-relaxed">
                    — {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AnimatedWrapper>
      </div>
    </Section>
  )
}
