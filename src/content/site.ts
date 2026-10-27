import { projects } from './projects'

/** Public URL of the deployed site (used for canonical and social-preview URLs). */
export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ?? 'https://sirine008.github.io'

export const evidence = [
  {
    id: 1,
    label: 'Evidence',
    text: 'Sagemcom internship, 2026 — an assistant that answers questions on production-quality data through validated SQL templates and a read-only database role, never free-form generated SQL.',
    href: '/work/grounded-quality-assistant',
    linkLabel: 'Case study 01',
  },
  {
    id: 2,
    label: 'Evidence',
    text: 'THNIYETNA, 2026 — intervention sheets take every figure from the database by template; the LLM writes only cited advice. In evaluation, the assistant refused all 4 questions its sources could not answer.',
    href: '/work/thniyetna',
    linkLabel: 'Case study 02',
  },
  {
    id: 3,
    label: 'Availability',
    text: 'Final-year engineering internship (PFE) in 2027 — Artificial Intelligence, Data Engineering or Software Engineering.',
    href: '#contact',
    linkLabel: 'Contact',
  },
] as const

export const path = [
  { when: '07/2026', what: 'Software development, Data Engineering & AI intern — Sagemcom, BLE Test department' },
  { when: '06/2025', what: 'Software development & Machine Learning intern — Attijari Bank headquarters, IT Studies department' },
  { when: '09/2024 — now', what: 'Engineering cycle, Software Engineering & Data Engineering — Faculté des Sciences de Bizerte, Université de Carthage' },
  { when: '09/2022 — 06/2024', what: 'Integrated preparatory cycle (Mathematics, Physics, Computer Science) — Faculté des Sciences de Bizerte' },
]

export const expertise = [
  {
    domain: 'AI & LLM systems',
    items: 'LLM integration, RAG (vector, hybrid, database-grounded), multi-agent systems, LangChain, embeddings, vector stores (ChromaDB, pgvector), local LLMs with Ollama, NLP, RAG evaluation',
    usedIn: '01 · 02 · 03 · notebook',
  },
  {
    domain: 'Data engineering',
    items: 'ETL pipelines, data warehousing, data analytics, PostgreSQL / PostGIS, MongoDB, Big Data (Apache Spark, Hadoop)',
    usedIn: '01 · 02 · notebook',
  },
  {
    domain: 'Machine & deep learning, vision',
    items: 'scikit-learn, XGBoost, TensorFlow / Keras (LSTM), temporal validation, YOLO, OpenCV',
    usedIn: '02 · 04 · notebook',
  },
  {
    domain: 'Backend & frontend',
    items: 'FastAPI, Spring Boot, Django, REST APIs · Angular, React, Streamlit',
    usedIn: 'all projects',
  },
  {
    domain: 'Systems & tools',
    items: 'Linux, Docker, Git / GitHub, DevOps & MLOps (MLflow), Alembic, pytest',
    usedIn: '',
  },
  {
    domain: 'Languages',
    items: 'Python, Java, C/C++, SQL · spoken: French, English',
    usedIn: '',
  },
]

export interface RouteMeta {
  path: string
  title: string
  description: string
}

const homeDescription =
  'Sirine Tiouajni — software & data engineering student building AI systems grounded in real data: RAG assistants, multi-agent systems, ETL pipelines and machine learning. Seeking a PFE internship for 2027.'

export const routes: RouteMeta[] = [
  { path: '/', title: 'Sirine Tiouajni — AI & Data Engineering', description: homeDescription },
  ...projects.map((p) => ({
    path: `/work/${p.slug}`,
    title: `${p.title} — Sirine Tiouajni`,
    description: p.summary,
  })),
  { path: '/404', title: 'Page not found — Sirine Tiouajni', description: homeDescription },
]

export const metaFor = (pathname: string): RouteMeta =>
  routes.find((r) => r.path === pathname.replace(/\/$/, '') || (r.path === '/' && pathname === '/')) ?? routes[routes.length - 1]
