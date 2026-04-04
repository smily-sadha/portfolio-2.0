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

export default function Projects() {
  const rest = projects.filter((p) => !p.featured);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <Section id="projects" label="Projects">
      <div ref={ref} className="space-y-px">
        {rest.map((p, i) => (
          <motion.a
            key={p.id}
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
            custom={i}
            className="group flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 p-5 border-b border-zinc-800 hover:bg-zinc-900/40 transition-colors duration-200 block"
          >
            <div className="sm:w-24 shrink-0">
              <p className="text-xs font-mono text-zinc-600">{p.year}</p>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-zinc-100 font-light group-hover:text-white transition-colors" style={{ fontFamily: "Georgia, serif" }}>{p.name}</span>
                <Tag>{p.tag}</Tag>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed mb-3">{p.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.stack.map((s) => <Pill key={s}>{s}</Pill>)}
              </div>
            </div>
            <div className="text-zinc-600 text-sm group-hover:text-zinc-400 transition-colors shrink-0">↗</div>
          </motion.a>
        ))}
      </div>
    </Section>
  );
}
