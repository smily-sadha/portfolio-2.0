export const experience = [
  {
    company: "Anthropic",
    role: "ML Infrastructure Intern",
    period: "Summer 2024",
    location: "San Francisco, CA",
    bullets: [
      "Built kernel fusion pass for attention layers, reducing memory bandwidth by 2.1× in inference serving.",
      "Implemented speculative decoding with draft model selection heuristics; improved throughput 1.8× on Llama-class models.",
      "Shipped CUDA graph capture pipeline for static-shape inference, cutting kernel launch overhead by 40%.",
    ],
  },
  {
    company: "Databricks",
    role: "Systems Engineering Intern",
    period: "Summer 2023",
    location: "San Francisco, CA",
    bullets: [
      "Designed adaptive shuffle partition tuning for Spark; reduced shuffle read latency 28% across 500+ production workloads.",
      "Contributed columnar reader optimizations to Delta Lake OSS; PR merged, 15% scan improvement on nested schemas.",
      "Built internal benchmark harness for query plan regression detection across Photon engine releases.",
    ],
  },
  {
    company: "Freelance",
    role: "ML Systems Consultant",
    period: "2022 – 2023",
    location: "Remote",
    bullets: [
      "Deployed real-time anomaly detection pipeline for fintech client — 3ms inference on edge hardware.",
      "Optimized LLM inference stack for legal document Q&A; cut token cost 60% via INT8 quantization and KV-cache tuning.",
    ],
  },
];
