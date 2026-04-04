import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Section from "./Section";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const contactLinks = [
  { label: "Email", value: "aiden@mit.edu", href: "mailto:aiden@mit.edu" },
  { label: "LinkedIn", value: "linkedin.com/in/aidenpark", href: "https://linkedin.com" },
  { label: "GitHub", value: "github.com/aidenpark", href: "https://github.com" },
  { label: "Twitter / X", value: "@aidenpark_dev", href: "https://x.com" },
];

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <Section id="contact" label="Contact">
      <motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeUp} className="max-w-lg">
        <h2 className="text-3xl font-light text-zinc-100 mb-4" style={{ fontFamily: "Georgia, serif" }}>Open to opportunities.</h2>
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
          Targeting ML infrastructure and systems engineering roles at companies building serious ML products. Prefer teams working close to hardware and inference.
        </p>
        <div className="space-y-3 mb-10">
          {contactLinks.map((c) => (
            <div key={c.label} className="flex items-center gap-6">
              <span className="w-20 text-xs font-mono text-zinc-600 uppercase tracking-wider">{c.label}</span>
              <a href={c.href} className="text-sm text-zinc-300 hover:text-white transition-colors font-mono">{c.value}</a>
            </div>
          ))}
        </div>
        <a href="mailto:aiden@mit.edu" className="inline-block px-6 py-3 bg-zinc-100 text-zinc-900 text-sm font-mono tracking-wide hover:bg-white transition-colors">
          Send a message →
        </a>
      </motion.div>
    </Section>
  );
}
