import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Section from "./Section";
import { achievements } from "../data/achievements";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Achievements() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <Section id="achievements" label="Achievements">
      <div ref={ref} className="grid sm:grid-cols-2 gap-5">
        {achievements.map((a, i) => (
          <motion.div
            key={a.title}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
            custom={i}
            className="border border-zinc-800 p-6 rounded-sm"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-zinc-100 font-light leading-snug" style={{ fontFamily: "Georgia, serif" }}>{a.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{a.sub}</p>
              </div>
              <span className="text-xs font-mono text-zinc-600 shrink-0">{a.year}</span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">{a.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
