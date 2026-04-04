export const caseStudies = [
  {
    id: 'stream-infer',
    title: 'StreamInfer',
    category: 'ML Systems',
    year: '2024',
    headline: 'Low-latency streaming inference engine for real-time speech-to-text at scale.',
    problem: 'Batch inference introduced 600ms+ tail latency for a transcription service handling 8k concurrent streams. The existing setup blocked on full audio chunks before running inference.',
    solution: 'Designed a custom token-streaming protocol over WebSockets that runs rolling inference on partial audio buffers. Built a shared KV-cache coordinator in Redis to maintain decoder state across fragments.',
    outcome: [
      'P99 latency reduced from 610ms to 270ms under production load',
      'Throughput scaled to 12k concurrent streams on 4× A10G nodes',
      '99.97% uptime over 90-day production window',
    ],
    tech: ['Python', 'PyTorch', 'WebSocket', 'Redis', 'CUDA', 'Triton'],
    metrics: {
      latency: '−55% P99',
      throughput: '12k streams',
      uptime: '99.97%',
    },
    link: 'https://github.com',
  },
  {
    id: 'vec-store',
    title: 'VecStore',
    category: 'Infrastructure',
    year: '2024',
    headline: 'Distributed vector database with HNSW indexing for sub-10ms embedding retrieval.',
    problem: 'Existing vector stores (Pinecone, Weaviate) introduced 30–80ms query overhead and lacked shard-level control for multi-tenant embedding workloads with strict SLA requirements.',
    solution: 'Implemented a custom HNSW index in Rust with a gRPC query layer. Sharding strategy uses consistent hashing with configurable replication factor. RocksDB backs persistent storage; hot index segments are memory-mapped.',
    outcome: [
      '2M vectors per node with <10ms p95 ANN query latency',
      'Horizontal scale-out validated to 8 nodes, 16M total vectors',
      'Shard rebalancing completes in under 40s without query disruption',
    ],
    tech: ['Rust', 'gRPC', 'HNSW', 'RocksDB', 'Kubernetes', 'Prometheus'],
    metrics: {
      capacity: '2M vectors/node',
      latency: '<10ms p95',
      rebalance: '<40s',
    },
    link: 'https://github.com',
  },
]
