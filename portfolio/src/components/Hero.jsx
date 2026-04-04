import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  const words = ["ML Systems", "Inference", "Infrastructure", "Distributed Systems"];
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setWordIdx((i) => (i + 1) % words.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center px-6 max-w-5xl mx-auto relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.025]">
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "80px 80px"
        }} />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="relative z-10"
      >
        <motion.p variants={fadeUp} className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-500 mb-6">
          Available for new grad roles · 2025
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="text-5xl sm:text-7xl font-light tracking-tight text-zinc-100 leading-tight mb-4"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Aiden Park
        </motion.h1>

        <motion.div variants={fadeUp} className="flex flex-wrap items-baseline gap-x-3 mb-8">
          <span className="text-2xl sm:text-3xl text-zinc-400 font-light">Engineer focused on</span>
          <div style={{ minWidth: "220px", height: "2.5rem", position: "relative", display: "inline-flex", alignItems: "center" }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIdx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="text-2xl sm:text-3xl text-zinc-100 font-light absolute"
                style={{ borderBottom: "1px solid #52525b" }}
              >
                {words[wordIdx]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.p variants={fadeUp} className="max-w-xl text-zinc-400 text-base leading-relaxed mb-12">
          MIT EECS '25. Building systems where performance constraints are real and latency margins matter.
          Focused on inference optimization, distributed training infrastructure, and ML-adjacent systems work.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
          <a href="#contact" className="px-5 py-2.5 bg-zinc-100 text-zinc-900 text-sm font-mono tracking-wide hover:bg-white transition-colors">
            Get in touch
          </a>
          <a href="#projects" className="px-5 py-2.5 border border-zinc-700 text-zinc-300 text-sm font-mono tracking-wide hover:border-zinc-500 hover:text-zinc-100 transition-colors">
            View work
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 border border-zinc-800 text-zinc-500 text-sm font-mono tracking-wide hover:text-zinc-400 transition-colors">
            GitHub ↗
          </a>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-20 flex flex-wrap gap-8 text-zinc-600 text-xs font-mono">
          {["MIT · EECS", "GPA 4.8 / 5.0", "2× Intern · Anthropic · Databricks"].map((t) => <span key={t}>{t}</span>)}
        </motion.div>
      </motion.div>
    </section>
  );
}
