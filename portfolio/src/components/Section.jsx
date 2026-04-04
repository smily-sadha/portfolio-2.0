import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Section({ id, label, children, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      id={id}
      ref={ref}
      className={`relative py-24 px-6 max-w-5xl mx-auto ${className}`}
    >
      {label && (
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          className="mb-12"
        >
          <p className="text-xs font-mono tracking-[0.25em] uppercase text-zinc-500 mb-2">
            — {label}
          </p>
          <div className="h-px w-full bg-zinc-800" />
        </motion.div>
      )}
      {children}
    </section>
  );
}
