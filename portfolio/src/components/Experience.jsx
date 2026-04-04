import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Section from "./Section";
import { experience } from "../data/experience";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <Section id="experience" label="Experience">
      <div ref={ref} className="space-y-12">
        {experience.map((e, i) => (
          <motion.div
            key={e.company}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
            custom={i}
            className="grid md:grid-cols-[220px_1fr] gap-6 md:gap-12"
          >
            <div>
              <p className="text-lg text-zinc-100 font-light mb-0.5" style={{ fontFamily: "Georgia, serif" }}>{e.company}</p>
              <p className="text-sm text-zinc-400 mb-1">{e.role}</p>
              <p className="text-xs font-mono text-zinc-600">{e.period}</p>
              <p className="text-xs font-mono text-zinc-600">{e.location}</p>
            </div>
            <div className="space-y-2.5 pt-1">
              {e.bullets.map((b, j) => (
                <p key={j} className="text-sm text-zinc-300 leading-relaxed flex gap-3">
                  <span className="text-zinc-700 mt-0.5 shrink-0">—</span>
                  <span>{b}</span>
                </p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
