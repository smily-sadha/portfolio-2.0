import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Section from "./Section";
import { projects } from "../data/projects";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};

const Tag = ({ children }) => (
  <span className="inline-block text-xs font-mono tracking-widest uppercase px-2 py-0.5 border border-zinc-700 text-zinc-400 rounded-sm">{children}</span>
);
const Pill = ({ children }) => (
  <span className="inline-block text-xs font-mono px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded">{children}</span>
);

export default function CaseStudies() {
  const featured = projects.filter((p) => p.featured);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <Section id="case-studies" label="Featured Work">
      <div ref={ref} className="grid md:grid-cols-2 gap-6">
        {featured.map((p, i) => (
          <motion.a
            key={p.id}
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
            custom={i}
            whileHover={{ y: -4 }}
            className="group block border border-zinc-800 bg-zinc-900/50 p-8 rounded-sm hover:border-zinc-600 transition-colors duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <Tag>{p.tag}</Tag>
              <span className="text-xs font-mono text-zinc-600">{p.year}</span>
            </div>
            <h3 className="text-xl font-light text-zinc-100 mb-3 group-hover:text-white transition-colors" style={{ fontFamily: "Georgia, serif" }}>
              {p.name}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">{p.description}</p>
            <div className="border-t border-zinc-800 pt-5 mb-5">
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">Key Results</p>
              <ul className="space-y-1">
                {p.metrics.map((m) => (
                  <li key={m} className="text-sm text-zinc-300 font-mono flex gap-2">
                    <span className="text-zinc-600">→</span> {m}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-2">
              {p.stack.map((s) => <Pill key={s}>{s}</Pill>)}
            </div>
          </motion.a>
        ))}
      </div>
    </Section>
  );
}
