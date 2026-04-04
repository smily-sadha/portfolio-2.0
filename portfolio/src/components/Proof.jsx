import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Section from "./Section";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};

const stats = [
  { label: "GitHub Stars", value: "1.2k", sub: "across OSS projects" },
  { label: "Commits (12mo)", value: "847", sub: "avg 70/month" },
  { label: "OSS Contributions", value: "23", sub: "merged PRs" },
  { label: "Papers / Workshops", value: "2", sub: "NeurIPS · MLSys" },
];

const links = [
  { label: "GitHub Profile", href: "https://github.com" },
  { label: "StreamInfer Demo", href: "#" },
  { label: "VectorCache Demo", href: "#" },
  { label: "Research Paper (NeurIPS '24)", href: "#" },
];

export default function Proof() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <Section id="proof" label="GitHub & Demos">
      <div ref={ref}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-800 border border-zinc-800 mb-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={fadeUp}
              custom={i}
              className="bg-zinc-950 p-6 text-center"
            >
              <p className="text-3xl font-light text-zinc-100 mb-1">{s.value}</p>
              <p className="text-xs font-mono text-zinc-400 mb-0.5">{s.label}</p>
              <p className="text-xs text-zinc-600">{s.sub}</p>
            </motion.div>
          ))}
        </div>
        <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeUp} custom={4} className="flex flex-wrap gap-4">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="text-sm font-mono text-zinc-400 border border-zinc-800 px-4 py-2 hover:border-zinc-600 hover:text-zinc-200 transition-colors">
              {link.label} ↗
            </a>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
