import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Section from "./Section";
import { skills } from "../data/skills";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};
const Pill = ({ children }) => (
  <span className="inline-block text-xs font-mono px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded">{children}</span>
);

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <Section id="skills" label="Technical Stack">
      <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(skills).map(([category, items], i) => (
          <motion.div
            key={category}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
            custom={i}
            className="border border-zinc-800 p-6 rounded-sm"
          >
            <p className="text-xs font-mono tracking-widest uppercase text-zinc-500 mb-4">{category}</p>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => <Pill key={item}>{item}</Pill>)}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
