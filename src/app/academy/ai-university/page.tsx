'use client'

import Link from 'next/link'

/* ── Types ── */

interface Faculty {
  id: string
  name: string
  tagline: string
  description: string
  icon: string
  topics: string[]
  color: string
}

/* ── 13 Faculties ── */

const FACULTIES: Faculty[] = [
  {
    id: 'memory-systems',
    name: 'Memory Systems',
    tagline: 'Foundations of persistent AI memory',
    description:
      'Explore how AI agents store, retrieve, and forget information. Covering Honcho, Mem0, file-based persistence, semantic search, embedding strategies, and memory compaction.',
    icon: '🧠',
    topics: ['Honcho Server', 'Mem0 Embeddings', 'Semantic Search', 'Memory Compaction', 'Forgetting Strategies'],
    color: 'border-brand-500',
  },
  {
    id: 'context-engineering',
    name: 'Context Engineering',
    tagline: 'Crafting effective context windows',
    description:
      'Learn to build, budget, and optimize context windows. Covers context builders, budget management, token optimization, sliding windows, and dynamic context scaling.',
    icon: '📐',
    topics: ['Context Builder', 'Budget Management', 'Token Optimization', 'Sliding Windows', 'Dynamic Scaling'],
    color: 'border-accent-400',
  },
  {
    id: 'model-architecture',
    name: 'Model Architecture',
    tagline: 'Understanding LLM internals',
    description:
      'Deep dive into transformer architectures, attention mechanisms, MoE layers, quantization, and how different model families (Llama, DeepSeek, Qwen) make trade-offs.',
    icon: '🏗️',
    topics: ['Transformer Internals', 'Attention Mechanisms', 'MoE Architecture', 'Quantization', 'Model Families'],
    color: 'border-info',
  },
  {
    id: 'provider-integration',
    name: 'Provider Integration',
    tagline: 'Connecting to any AI backend',
    description:
      'Master the provider adapter pattern — integrate OpenAI, Anthropic, Google, local models (Ollama, LM Studio), and custom endpoints through a unified interface.',
    icon: '🔌',
    topics: ['Provider Adapter Pattern', 'OpenAI / Anthropic', 'Google Gemini', 'Ollama / Local', 'Custom Providers'],
    color: 'border-success',
  },
  {
    id: 'agent-design',
    name: 'Agent Design',
    tagline: 'Building autonomous AI agents',
    description:
      'Principles of agent architecture: tool-use, reasoning loops, goal decomposition, multi-agent coordination, and the event-bus pattern for scalable agent meshes.',
    icon: '🤖',
    topics: ['Tool-Use Patterns', 'Reasoning Loops', 'Goal Decomposition', 'Multi-Agent Coordination', 'Event Bus Pattern'],
    color: 'border-warning',
  },
  {
    id: 'observability',
    name: 'Observability',
    tagline: 'Seeing inside your AI system',
    description:
      'Trace requests across providers, monitor context usage, log agent decisions, set up dashboards, and build alerting for production AI workloads.',
    icon: '📊',
    topics: ['Distributed Tracing', 'Context Monitoring', 'Agent Logging', 'Dashboards', 'Alerting'],
    color: 'border-brand-500',
  },
  {
    id: 'security-privacy',
    name: 'Security & Privacy',
    tagline: 'Safe and compliant AI operations',
    description:
      'Policy engines, PII redaction, access control, encryption at rest and in transit, audit logging, and compliance patterns for enterprise AI deployments.',
    icon: '🔒',
    topics: ['Policy Engine', 'PII Redaction', 'Access Control', 'Encryption', 'Audit Logging'],
    color: 'border-accent-400',
  },
  {
    id: 'performance',
    name: 'Performance Optimization',
    tagline: 'Making AI fast and efficient',
    description:
      'Latency reduction, throughput tuning, caching strategies, batch processing, speculative decoding, and hardware-aware optimization for LLM inference.',
    icon: '⚡',
    topics: ['Latency Reduction', 'Throughput Tuning', 'Caching Strategies', 'Batch Processing', 'Speculative Decoding'],
    color: 'border-info',
  },
  {
    id: 'testing-quality',
    name: 'Testing & Quality',
    tagline: 'Confidence through rigorous testing',
    description:
      'Test-driven development for AI prompts, evaluation harnesses, regression testing, hallucination detection, and quality gates for agent outputs.',
    icon: '🧪',
    topics: ['TDD for Prompts', 'Eval Harnesses', 'Regression Testing', 'Hallucination Detection', 'Quality Gates'],
    color: 'border-success',
  },
  {
    id: 'deployment-devops',
    name: 'Deployment & DevOps',
    tagline: 'From laptop to production',
    description:
      'Containerization with Docker, orchestration with Kubernetes, CI/CD pipelines, blue-green deployments, and infrastructure-as-code for AI services.',
    icon: '🚀',
    topics: ['Docker & Compose', 'Kubernetes', 'CI/CD Pipelines', 'Blue-Green Deploy', 'Infrastructure as Code'],
    color: 'border-warning',
  },
  {
    id: 'api-design',
    name: 'API Design',
    tagline: 'Building elegant AI interfaces',
    description:
      'Design principles for AI-facing APIs: consistent schemas, streaming, error handling, rate limiting, versioning, and the single-API gateway pattern.',
    icon: '🌐',
    topics: ['API Gateway Pattern', 'Streaming APIs', 'Error Handling', 'Rate Limiting', 'Versioning'],
    color: 'border-brand-500',
  },
  {
    id: 'data-engineering',
    name: 'Data Engineering',
    tagline: 'Powering AI with quality data',
    description:
      'Data pipelines for RAG, embedding generation, dataset curation, deduplication, data versioning, and vector database operations.',
    icon: '🗄️',
    topics: ['RAG Pipelines', 'Embedding Generation', 'Dataset Curation', 'Data Versioning', 'Vector Databases'],
    color: 'border-accent-400',
  },
  {
    id: 'ethics-governance',
    name: 'Ethics & Governance',
    tagline: 'Responsible AI by design',
    description:
      'Fairness auditing, bias detection, transparency reporting, human-in-the-loop patterns, and governance frameworks for responsible AI deployment.',
    icon: '⚖️',
    topics: ['Fairness Auditing', 'Bias Detection', 'Transparency', 'Human-in-the-Loop', 'Governance Frameworks'],
    color: 'border-info',
  },
]

/* ── Component ── */

export default function AIUniversityPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-surface-500 dark:text-surface-400">
        <Link href="/academy" className="hover:text-brand-500 transition-colors">Academy</Link>
        <span className="mx-2">/</span>
        <span className="text-surface-700 dark:text-surface-200">AI University</span>
      </nav>

      {/* Header */}
      <div className="mb-12 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-3xl dark:bg-brand-900/50">
          🎓
        </span>
        <h1 className="mt-4 text-3xl font-bold text-surface-900 dark:text-white">
          AI University
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-surface-500 dark:text-surface-400">
          A structured curriculum across{' '}
          <strong className="text-surface-700 dark:text-surface-200">13 faculties</strong>.
          Each faculty covers a core discipline of building and operating AI memory systems.
        </p>
      </div>

      {/* Faculty Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FACULTIES.map((faculty) => (
          <article
            key={faculty.id}
            className={`group rounded-xl border-2 ${faculty.color} bg-white p-6 transition-all hover:shadow-lg dark:bg-surface-900`}
          >
            <div className="mb-4 flex items-start justify-between">
              <span className="text-3xl" aria-hidden="true">{faculty.icon}</span>
              <span className="rounded-full bg-surface-100 px-2.5 py-0.5 text-2xs font-semibold uppercase tracking-wider text-surface-500 dark:bg-surface-800 dark:text-surface-400">
                Faculty
              </span>
            </div>

            <h2 className="text-lg font-bold text-surface-900 dark:text-white">
              {faculty.name}
            </h2>
            <p className="mt-0.5 text-sm font-medium text-brand-600 dark:text-brand-400">
              {faculty.tagline}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-surface-600 dark:text-surface-400">
              {faculty.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {faculty.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-md bg-surface-100 px-2 py-0.5 text-2xs font-medium text-surface-600 dark:bg-surface-800 dark:text-surface-400"
                >
                  {topic}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-surface-400 dark:text-surface-500">
        13 faculties · Continually updated · Designed for colorblind safety
      </p>
    </div>
  )
}
