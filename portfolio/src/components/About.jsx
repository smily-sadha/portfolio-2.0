import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Section from "./Section";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <Section id="about" label="About">
      <motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeUp} className="max-w-2xl">
        <p className="text-zinc-300 text-base leading-relaxed mb-5">
          MIT EECS senior graduating May 2025. Research background in ML systems — primarily inference
          optimization and hardware-software co-design. Spent the last two years at the intersection of
          compiler passes, CUDA programming, and large-scale distributed training.
        </p>
        <p className="text-zinc-400 text-sm leading-relaxed mb-5">
          Interned at Anthropic (ML Infra) and Databricks (Systems) building production systems at scale.
          Comfortable in the full stack from kernel code to orchestration layers.
        </p>
        <p className="text-zinc-500 text-sm leading-relaxed">
          Outside of engineering: trail running, competitive chess (2100 FIDE), and occasionally writing about systems design.
        </p>
      </motion.div>
    </Section>
  );
}
