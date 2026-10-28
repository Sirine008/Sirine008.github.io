import { projectLinks } from './links'

export type StepKind = 'io' | 'llm' | 'code' | 'store'

export interface Step {
  kind: StepKind
  /** Small label above the title, e.g. the tool used. */
  tag: string
  title: string
  detail?: string
}

export interface Diagram {
  title: string
  lanes: { label?: string; steps: Step[] }[]
  note?: string
  caption: string
}

export interface Source {
  id: number
  text: string
  href?: string
  linkLabel?: string
}

/** A real screenshot of the application (never a mock-up). */
export interface Screenshot {
  /** Path without extension; `.webp` and `.jpg` versions must exist in /public. */
  src: string
  width: number
  height: number
  alt: string
  caption: string
  /** Narrow screenshots (phone-like) are displayed smaller. */
  narrow?: boolean
}

export interface CaseStudy {
  facts: { term: string; value: string }[]
  problem: string[]
  built: string[]
  diagram: Diagram
  screenshot?: Screenshot
  decisions: { title: string; body: string }[]
  results?: { intro: string; rows?: { label: string; value: string }[]; note?: string }
  limits: string[]
  notice?: string
  stack: string[]
  sources: Source[]
}

export interface Project {
  slug: string
  number: string
  title: string
  context: string
  status?: string
  summary: string
  stackLine: string
  decision: string
  repo: string | null
  demo: string | null
  caseStudy: CaseStudy
}

const link = (slug: string) => projectLinks[slug] ?? { repo: null, demo: null }
const THN = 'https://github.com/Sirine008/thniyetna/blob/main'

export const projects: Project[] = [
  {
    slug: 'grounded-quality-assistant',
    number: '01',
    title: 'A quality assistant that is not allowed to write SQL',
    context: 'Internship · Sagemcom, BLE Test department · 2026',
    summary:
      'A production-quality dashboard fed by an Excel-to-PostgreSQL ETL pipeline, extended with a French natural-language assistant running on a local LLM.',
    stackLine: 'Python · FastAPI · PostgreSQL · Ollama · ETL · Streamlit · Docker',
    decision: 'The model extracts intent; parameterised templates build the query.',
    ...link('grounded-quality-assistant'),
    caseStudy: {
      facts: [
        { term: 'Role', value: 'Intern — software development, data engineering & AI' },
        { term: 'When', value: 'July 2026' },
        { term: 'Scope', value: 'ETL, dashboard, assistant' },
        { term: 'Model', value: 'Llama 3.2 via Ollama, local, CPU only' },
      ],
      problem: [
        'Production quality — First Pass Yield, yields and non-conformities — was tracked in multi-sheet Excel workbooks. Answering a focused question meant finding the right view by hand or writing SQL.',
        'A general-purpose chatbot was not an option: on production data, a fluent answer built on a wrong query is worse than no answer at all.',
      ],
      built: [
        'An end-to-end ETL pipeline that extracts multi-sheet Excel workbooks, transforms them and loads them into PostgreSQL staging and fact tables, with a validation mode that checks parsing without writing to the database.',
        'A dashboard that drills down from operation to product to resource, with filters, charts and PDF reports.',
        'A RAG assistant that answers questions in French from the same data: it understands the question with a local LLM, but every query it runs comes from a reviewed template, backed by a business glossary.',
      ],
      diagram: {
        title: 'How a question becomes an answer',
        lanes: [
          {
            steps: [
              { kind: 'io', tag: 'Input', title: 'Question in French' },
              { kind: 'llm', tag: 'LLM · step 1', title: 'Extract intent and entities', detail: 'returns JSON only' },
              { kind: 'code', tag: 'Pydantic', title: 'Validate the intent' },
              { kind: 'code', tag: 'Glossary + pg_trgm', title: 'Resolve names against real values' },
              { kind: 'code', tag: 'Templates', title: 'Pick a parameterised SQL template' },
            ],
          },
          {
            steps: [
              { kind: 'code', tag: 'SQL guard', title: 'SELECT only, schema-qualified, bounded LIMIT' },
              { kind: 'store', tag: 'PostgreSQL', title: 'Run with a read-only role and a timeout' },
              { kind: 'llm', tag: 'LLM · step 2', title: 'Phrase the answer from returned rows' },
              { kind: 'io', tag: 'Output', title: 'Concise French answer', detail: 'cached until the next data load' },
            ],
          },
        ],
        note: 'If the intent is unsupported or a name cannot be resolved with enough confidence, the assistant asks a clarifying question instead of running a query.',
        caption: 'Illustrative diagram, simplified. The language model appears twice, and neither step touches the database.',
      },
      decisions: [
        {
          title: 'The LLM never writes SQL',
          body: 'An early free-form text-to-SQL version turned a quoted column name into a string literal and returned plausible-looking nonsense — with no error. Moving to intent → template made every query reviewable and traceable.',
        },
        {
          title: 'Ask instead of guessing',
          body: 'Fuzzy name matching runs against values actually stored in the database. Below a confidence threshold, the user is asked to clarify rather than shown a guess.',
        },
        {
          title: 'Least privilege by default',
          body: 'The assistant connects through a dedicated read-only PostgreSQL role with a statement timeout, separate from the dashboard’s connection pool. Cached answers are invalidated whenever new data is loaded.',
        },
      ],
      limits: [
        'Answers only the question types it was designed for, by intent — by design.',
        'No automated test suite in the repository yet.',
        'No quantitative evaluation is published for this project.',
      ],
      notice:
        'The interface and production data are confidential and are not shown. The diagram is a simplified illustration of the architecture.',
      stack: ['Python', 'FastAPI', 'asyncpg', 'PostgreSQL + pg_trgm', 'Ollama', 'Pydantic', 'ETL', 'Streamlit', 'ReportLab', 'Chart.js', 'Docker'],
      sources: [
        {
          id: 1,
          text: 'Repository README — architecture, RAG pipeline, SQL guard, read-only role, limitations.',
          href: 'https://github.com/Sirine008/dashboard-fpy-rag-assistant',
          linkLabel: 'dashboard-fpy-rag-assistant',
        },
        { id: 2, text: 'CV — Sagemcom internship, July 2026.', href: '/cv/Sirine_Tiouajni_CV_FR.pdf', linkLabel: 'CV (PDF)' },
      ],
    },
  },
  {
    slug: 'thniyetna',
    number: '02',
    title: 'THNIYETNA — road intelligence for Bizerte',
    context: 'Academic project · Project lead · 2026',
    status: 'In progress',
    summary:
      'A road-maintenance platform: road-damage detection from photos and video, accident-risk prediction for 675 road segments, risk-aware routing, and a cited assistant for maintenance supervisors.',
    stackLine: 'FastAPI · PostgreSQL / PostGIS · YOLO · scikit-learn · OSRM · Ollama · React · Docker',
    decision: 'Figures come from the database by template; the LLM only writes advice — with citations.',
    ...link('thniyetna'),
    caseStudy: {
      facts: [
        { term: 'Role', value: 'Project lead; built the risk-prediction module' },
        { term: 'Area', value: 'Governorate of Bizerte, Tunisia' },
        { term: 'Status', value: 'In progress — figures as of 23 October 2026' },
        { term: 'Tests', value: '143 automated tests passing' },
      ],
      problem: [
        'Road maintenance and public transport in Bizerte have no shared view of where the roads are damaged, where accidents are likely, and which route is safer today.',
        'The data is imperfect: Tunisian accident records carry a governorate but no GPS position, and there was no labelled road-damage data from Tunisia. The system had to stay useful — and honest — with those gaps.',
      ],
      built: [
        'Risk prediction: about 69,400 recorded accidents (2015–2026), weather and OpenStreetMap roads turned into a governorate-day dataset, with every feature computed from the past only. The model forecasts accident probability per governorate and day, and turns it into a risk score and a maintenance priority for each of 675 road segments in Bizerte.',
        'Road-damage detection: a public pretrained YOLO model (RDD2022: cracks and potholes) runs on CPU in a separate worker fed by a durable job queue. Detections are aligned with GPS, merged into road events, and once a supervisor validates one, the segment’s risk score rises.',
        'Risk-aware routing: OSRM computes the routes; PostGIS measures the true distance between each route and each hazard. A detour is proposed only when it is clearly safer and avoids the hazards that triggered it; otherwise the driver receives a warning.',
        'An assistant for maintenance supervisors that answers from field guides with numbered citations, using hybrid retrieval (pgvector + PostgreSQL full-text, fused by Reciprocal Rank Fusion), and produces printable intervention sheets.',
      ],
      diagram: {
        title: 'From a road photo to a safer route',
        lanes: [
          {
            label: 'Detection and prediction',
            steps: [
              { kind: 'io', tag: 'Input', title: 'Citizen photo or inspection video' },
              { kind: 'code', tag: 'YOLO worker', title: 'Detect cracks and potholes', detail: 'CPU, job queue' },
              { kind: 'store', tag: 'PostGIS', title: 'Road events, deduplicated and validated' },
              { kind: 'code', tag: 'Risk model', title: 'Risk score per road segment' },
              { kind: 'io', tag: 'Output', title: 'Maintenance priority · safer route' },
            ],
          },
          {
            label: 'Intervention sheet',
            steps: [
              { kind: 'io', tag: 'Input', title: 'Supervisor selects a road segment' },
              { kind: 'store', tag: 'Templates', title: 'Findings and priority from the database' },
              { kind: 'code', tag: 'Hybrid retrieval', title: 'Relevant passages of field guides' },
              { kind: 'llm', tag: 'LLM', title: 'Advice with numbered citations [n]' },
              { kind: 'io', tag: 'Output', title: 'Printable sheet', detail: 'uncited sections flagged' },
            ],
          },
        ],
        note: 'The language model never produces a number. Measurements, risk levels and priorities are written from the database; advice without a citation is shown with a warning.',
        caption: 'Illustrative diagram, simplified.',
      },
      decisions: [
        {
          title: 'The simple model stays unless beaten',
          body: 'A tree model replaces the logistic regression only if it improves validation PR-AUC by at least 0.005. Random Forest and XGBoost did not, so the simpler, more explainable model is deployed (with calibrated probabilities).',
        },
        {
          title: 'Never reroute through the hazard',
          body: 'An end-to-end check showed a detour passing 0 m from the hazard that triggered it, because distances were measured on sampled route points. Hazard distance is now measured exactly in PostGIS, and an alternative must stay more than 105 m from every triggering hazard.',
        },
        {
          title: 'Negative results are kept',
          body: 'Per-governorate weather was tested as a possible improvement. It did not raise test PR-AUC or help in the ablation, so the baseline model was kept and the experiment documented.',
        },
      ],
      results: {
        intro: 'Test period January 2025 – September 2026. The prediction mostly separates which governorates are risky; the day-to-day timing is close to unpredictable.',
        rows: [
          { label: 'Accident occurrence — ROC-AUC (logistic regression)', value: '0.683' },
          { label: 'Accident occurrence — PR-AUC (naive 30-day rate: 0.580)', value: '0.611' },
          { label: 'Within one governorate — median ROC-AUC', value: '0.524' },
          { label: 'Assistant — correct answers, best prompt (16 answerable questions)', value: '9 / 16' },
          { label: 'Assistant — unanswerable questions correctly refused', value: '4 / 4' },
          { label: 'Damage detector — median CPU time per image', value: '140 ms' },
        ],
        note: 'Detector accuracy is not reported: it is a public pretrained model and has not been re-measured on local data.',
      },
      limits: [
        'Accidents have no GPS position, so segment risk is an allocation by road class and length, not a black-spot model.',
        'The pretrained detector missed all 7 potholes in close-up citizen photos during the pilot; a labelled Bizerte dataset is needed.',
        'With a 3-billion-parameter local model, the assistant answers correctly about half of the answerable questions. Source excerpts are shown so supervisors can check every answer.',
      ],
      stack: ['Python', 'FastAPI', 'PostgreSQL', 'PostGIS', 'pgvector', 'Alembic', 'scikit-learn', 'XGBoost', 'YOLO', 'OpenCV', 'OSRM', 'Ollama', 'React', 'Leaflet', 'Docker Compose', 'MLflow', 'pytest'],
      sources: [
        { id: 1, text: 'Repository README — platform architecture, routing, RAG assistant.', href: 'https://github.com/Sirine008/thniyetna', linkLabel: 'Sirine008/thniyetna' },
        { id: 2, text: 'Risk model card — data, temporal split, results, limits.', href: `${THN}/docs/M2_MODEL_CARD.md`, linkLabel: 'M2_MODEL_CARD.md' },
        { id: 3, text: 'Assistant evaluation — retrieval and answer quality.', href: `${THN}/docs/RAG_EVALUATION.md`, linkLabel: 'RAG_EVALUATION.md' },
        { id: 4, text: 'Detector card — source, license, CPU latency, pilot.', href: `${THN}/docs/M1_MODEL_CARD.md`, linkLabel: 'M1_MODEL_CARD.md' },
        { id: 5, text: 'Decision record — rerouting rule.', href: `${THN}/docs/DECISIONS.md`, linkLabel: 'DECISIONS.md' },
      ],
    },
  },
  {
    slug: 'faculty-administration',
    number: '03',
    title: 'An agentic information system for university administration',
    context: 'Academic project · Faculté des Sciences de Bizerte · 2026',
    summary:
      'Specialised agents for knowledge, exams, records and scheduling, with a RAG knowledge agent answering from the faculty website and the database through a local LLM.',
    stackLine: 'Python · LangChain · ChromaDB · PostgreSQL · Ollama · FastAPI · React · BPMN 2.0',
    decision: 'Scheduling and conflict checks stay deterministic; the LLM only summarises.',
    ...link('faculty-administration'),
    caseStudy: {
      facts: [
        { term: 'Type', value: 'Academic project' },
        { term: 'When', value: '2026' },
        { term: 'Scope', value: 'Agents, RAG pipeline, process modelling, UI' },
        { term: 'Model', value: 'Llama 3.2 via Ollama, local' },
      ],
      problem: [
        'Faculty information is spread between the public website and administrative records. Staff and students ask simple questions — when is this exam, who supervises it — that require looking in several places.',
        'Exam scheduling has hard constraints — room capacity, room overlaps, supervisor availability — that cannot be left to a language model.',
      ],
      built: [
        'Administrative processes modelled in BPMN 2.0, then implemented as specialised agents: department and student records, exam management, scheduling, and a knowledge agent.',
        'An exam-scheduling workflow that collects rooms, modules and class sizes, builds a schedule with conflict detection, and exports it as PDF.',
        'A RAG pipeline orchestrated with LangChain: the faculty website is crawled, split into overlapping passages, embedded and indexed in ChromaDB, with PostgreSQL as persistent storage and direct SQL context for questions about exams and supervision.',
      ],
      diagram: {
        title: 'How the knowledge agent answers',
        lanes: [
          {
            label: 'Indexing',
            steps: [
              { kind: 'io', tag: 'Sources', title: 'Faculty website pages · selected database records' },
              { kind: 'code', tag: 'Crawler', title: 'Same-domain crawl, text extraction' },
              { kind: 'code', tag: 'Chunker', title: '~1,000-character passages, 200 overlap' },
              { kind: 'store', tag: 'ChromaDB', title: 'all-MiniLM-L6-v2 embeddings + metadata' },
            ],
          },
          {
            label: 'Question',
            steps: [
              { kind: 'io', tag: 'Input', title: 'Question in natural language' },
              { kind: 'code', tag: 'Retrieval', title: 'Top passages above a similarity threshold' },
              { kind: 'store', tag: 'PostgreSQL', title: 'Direct context for exam questions' },
              { kind: 'llm', tag: 'LangChain + Ollama', title: 'Answer from the assembled context' },
            ],
          },
        ],
        note: 'Each request is routed by the API to the agent of its domain. Schedule placement and conflict checks are ordinary backend code; the language model helps parse a request and summarise a result, and the scheduler still works when it is unavailable.',
        caption: 'Illustrative diagram, simplified.',
      },
      decisions: [
        {
          title: 'Constraints in code, language in the model',
          body: 'Room overlaps and supervisor conflicts are checked by deterministic backend logic. The model never decides where an exam goes.',
        },
        {
          title: 'The database stays the source of truth',
          body: 'Records are indexed in ChromaDB for semantic search, but PostgreSQL remains the system of record, and exam questions get direct SQL context.',
        },
        {
          title: 'Graceful degradation',
          body: 'If the local LLM is unavailable, request parsing falls back to rules and the scheduler still produces a schedule.',
        },
      ],
      limits: [
        'Agents are routed by the API; they do not plan or communicate with each other autonomously.',
        'No automated test suite in the repository yet.',
        'Some routes are not yet protected by authentication; one debug route is meant for local testing only.',
      ],
      stack: ['Python', 'LangChain', 'ChromaDB', 'Sentence Transformers', 'PostgreSQL', 'Ollama', 'FastAPI', 'React', 'JWT', 'BPMN 2.0'],
      sources: [
        {
          id: 1,
          text: 'Repository README — agents, RAG pipeline, limitations.',
          href: 'https://github.com/Sirine008/Faculty-Administration-System-',
          linkLabel: 'Faculty-Administration-System-',
        },
        { id: 2, text: 'CV — project description, BPMN modelling.', href: '/cv/Sirine_Tiouajni_CV_FR.pdf', linkLabel: 'CV (PDF)' },
      ],
    },
  },
  {
    slug: 'stock-forecasting',
    number: '04',
    title: 'Stock forecasting — when the baseline wins',
    context: 'Personal project · 2026',
    summary:
      'Next-day price forecasts for Amazon, Domino’s, Bitcoin and Netflix, comparing an LSTM with classical models and a naive baseline, served in an interactive Streamlit dashboard.',
    stackLine: 'Python · TensorFlow/Keras · scikit-learn · pandas · Streamlit · Plotly',
    decision: 'Predict the % change, not the price: MAPE on Amazon fell from 42 % to 1.6 %.',
    ...link('stock-forecasting'),
    caseStudy: {
      facts: [
        { term: 'Type', value: 'Personal project' },
        { term: 'When', value: '2026' },
        { term: 'Data', value: 'Daily closes, May 2013 – May 2019' },
        { term: 'Models', value: 'Naive, Ridge, Random Forest, 2-layer LSTM' },
      ],
      problem: [
        'Many stock-prediction projects report very high accuracy. Most of it comes from data leakage — shuffled time series, scalers fitted on the whole dataset — or from never comparing against a baseline.',
        'The goal was a fair comparison: the same data, a strictly chronological split, and metrics a reader can interpret in dollars and in direction.',
      ],
      built: [
        'A leak-free pipeline: 70 / 15 / 15 % chronological split, models selected on validation only, the test set used once for the final report.',
        'Scale-free inputs and targets: each 60-day window is normalised by its last price, and models predict the next-day % change, converted back to a price.',
        'Four models compared on the same data — a naive "tomorrow = today" baseline, Ridge, Random Forest and a 2-layer LSTM — with RMSE, MAE, MAPE and directional accuracy.',
        'A Streamlit dashboard with recursive 1–30-day forecasts, a volatility band, a backtest view, model comparison and CSV export.',
      ],
      diagram: {
        title: 'A fair comparison, step by step',
        lanes: [
          {
            steps: [
              { kind: 'io', tag: 'Input', title: 'Daily closes, 4 assets' },
              { kind: 'code', tag: 'Split', title: 'Chronological train / validation / test' },
              { kind: 'code', tag: 'Features', title: '60-day windows as % of last price' },
              { kind: 'code', tag: 'Models', title: 'Naive · Ridge · Random Forest · LSTM' },
              { kind: 'io', tag: 'Output', title: 'Test metrics and dashboard', detail: 'best model chosen on validation' },
            ],
          },
        ],
        caption: 'Illustrative diagram, simplified. No language model is involved in this project.',
      },
      screenshot: {
        src: '/images/work/stock-dashboard',
        width: 1320,
        height: 1140,
        alt: 'StockSight Streamlit dashboard for Amazon: last close, 7-day forecast, test RMSE 38.36, MAPE 1.62 %, direction accuracy 52.6 %, a price chart with forecast band, and a model comparison where the naive baseline has the lowest error.',
        caption: 'Real screenshot of the Streamlit dashboard (Amazon, Random Forest, 7-day forecast).',
      },
      decisions: [
        {
          title: 'Feature design over model choice',
          body: 'A first version predicted scaled raw prices. Test prices were higher than anything seen in training, so Random Forest reached 42 % MAPE on Amazon and the LSTM 18 %. Predicting % change brought both to about 1.6 %.',
        },
        {
          title: 'Always compare with a naive baseline',
          body: 'Without "tomorrow = today" as a reference, a 1.6 % error looks impressive. With it, the result is put in perspective.',
        },
        {
          title: 'Report the honest outcome',
          body: 'No model clearly beats the naive baseline, and directional accuracy stays near 50 %. That is the expected result for daily prices using past prices only, and it is reported as such.',
        },
      ],
      results: {
        intro: 'Test period June 2018 – May 2019, Amazon (AMZN):',
        rows: [
          { label: 'Naive baseline — RMSE', value: '$38.28' },
          { label: 'Random Forest — RMSE · MAPE', value: '$38.36 · 1.62 %' },
          { label: 'LSTM — RMSE · MAPE', value: '$38.37 · 1.59 %' },
          { label: 'LSTM — directional accuracy', value: '54.4 %' },
        ],
        note: 'Results for all four assets are in the repository. The naive baseline is best or tied on every asset.',
      },
      limits: [
        'Prices only — no volume, indicators or news — and a static dataset ending in 2019.',
        'The dataset and the original LSTM architecture come from a reference repository, credited in the README; this project rewrites the pipeline around them.',
        'Recursive multi-day forecasts accumulate errors; educational project, not financial advice.',
      ],
      stack: ['Python', 'TensorFlow / Keras', 'scikit-learn', 'pandas', 'NumPy', 'Streamlit', 'Plotly'],
      sources: [
        {
          id: 1,
          text: 'Repository README — methodology, results, credits.',
          href: 'https://github.com/Sirine008/stock-market-prediction',
          linkLabel: 'stock-market-prediction',
        },
      ],
    },
  },
  {
    slug: 'attendance-dashboard',
    number: '05',
    title: 'Absence-risk estimates a manager can question',
    context: 'Internship · Attijari Bank, IT Studies department · 2025',
    summary:
      'An attendance dashboard for HR and line managers, built from raw badge-clock records, with next-day and next-week absence-risk estimates that show their associated factors and never claim certainty.',
    stackLine: 'Spring Boot · Angular · FastAPI · scikit-learn · LightGBM · SHAP · PostgreSQL · Docker',
    decision: 'A model is promoted only if it beats a simple baseline on validation. On the real data, none did.',
    ...link('attendance-dashboard'),
    caseStudy: {
      facts: [
        { term: 'Role', value: 'Intern — software development & machine learning' },
        { term: 'When', value: 'June 2025 · public version of the code, 2026' },
        { term: 'Data', value: '11,358 badge records, 8 employees, Jan 2024 – May 2025' },
        { term: 'Scope', value: 'Data rules, API, ML service, dashboard, tests' },
      ],
      problem: [
        'Attendance lived in raw badge-clock exports: one sheet per employee, entry and exit events on several doors, duplicates, missing punches. Answering "how is my team doing this month?" meant reading timestamps by hand.',
        'The bank also wanted to anticipate absences. With eight employees and about 130 one-off absence days, the risk was a model that looks accurate but is no better than common sense.',
      ],
      built: [
        'An idempotent import of the Excel exports into PostgreSQL, and a daily attendance table built from explicit rules: Tunisian public holidays, personal reference schedules (arrival times range from 7:50 to 9:30), internal doors that are not building exits, incomplete days flagged instead of guessed.',
        'A Spring Boot API with JWT roles — a line manager only sees their own team, enforced server-side — and an audit log of every individual record viewed.',
        'A Python pipeline with leakage-free features, two baselines, logistic regression and LightGBM, probability calibration, SHAP explanations and model versioning, served by FastAPI and called by a scheduled job every working morning.',
        'An Angular dashboard: day / month / year KPIs, trends, a per-employee calendar and punch timeline, and risk cards labelled "statistical estimate, not a certainty".',
      ],
      diagram: {
        title: 'From badge records to an estimate',
        lanes: [
          {
            label: 'Every import',
            steps: [
              { kind: 'io', tag: 'Input', title: 'Badge-clock Excel export' },
              { kind: 'code', tag: 'Spring Boot', title: 'Clean, deduplicate, normalise doors' },
              { kind: 'code', tag: 'Rules', title: 'Holidays, personal schedule, one-off vs long absence' },
              { kind: 'store', tag: 'PostgreSQL', title: 'Daily attendance per employee' },
            ],
          },
          {
            label: 'Every working morning',
            steps: [
              { kind: 'code', tag: 'Scheduled job', title: 'Ask the ML service for estimates' },
              { kind: 'code', tag: 'FastAPI', title: 'Features known at that date only' },
              { kind: 'code', tag: 'Active model', title: 'Calibrated probability + associated factors' },
              { kind: 'store', tag: 'PostgreSQL', title: 'Estimates stored with the model version', detail: 'compared later with what happened' },
            ],
          },
        ],
        note: 'If the ML service is down, the dashboard keeps working and shows that estimates are unavailable.',
        caption: 'Illustrative diagram, simplified. No language model is involved in this project.',
      },
      decisions: [
        {
          title: 'Promote a model only if it beats the baseline',
          body: 'Models were selected on a monthly walk-forward validation over the second half of 2024. A simple rule — the employee’s own absence rate for that weekday — scored best on both horizons, so the rule produces the estimates.',
        },
        {
          title: 'Do not choose on the test set',
          body: 'On the 2025 test period, logistic regression did better for the next day (PR-AUC 0.193 against 0.135). Switching to it after seeing the test would have been leakage, so the result is documented and the choice unchanged.',
        },
        {
          title: 'Estimates, not verdicts',
          body: 'Probabilities are calibrated and shown as low / moderate / high bands with their associated factors, never as causes. No estimate is shown with less than 30 working days of history, and the tool is documented as a planning aid, not an evaluation.',
        },
      ],
      results: {
        intro: 'Precision–recall AUC on the real data — selection on validation (July–December 2024), test on 2025:',
        rows: [
          { label: 'Next day — weekday-rate baseline (used) · validation', value: '0.162' },
          { label: 'Next day — best learned model (LightGBM) · validation', value: '0.152' },
          { label: 'Next day — share of absence days in the 2025 test', value: '5.2 %' },
          { label: 'Next week — weekday-rate baseline (used) · validation', value: '0.311' },
          { label: 'Next week — best learned model (LightGBM) · validation', value: '0.225' },
          { label: 'Tests — backend, ML, frontend, end-to-end', value: '36 · 20 · 12 · 4' },
        ],
        note: 'On 60 synthetic employees calibrated on the real statistics, the learned models clearly beat the baselines for the next day (0.21–0.22 against 0.11–0.13): the pipeline learns when the signal exists. The weakness on real data comes from its size. Synthetic results are reported separately.',
      },
      limits: [
        'Eight employees and about 130 one-off absence days: differences of a few points are not significant.',
        'The export contains no leave data, so a long absence (3+ working days) is an inference; team structure and most hire dates are fictional seed data.',
        'Risk thresholds set on 2024 turn out high for the week horizon in 2025 and need recalibrating with users.',
      ],
      notice:
        'Employee identities in the source export were anonymised by the bank (shown as letters). The export itself is not published; the public repository ships synthetic data only.',
      stack: ['Java 21', 'Spring Boot', 'Spring Security + JWT', 'Flyway', 'PostgreSQL', 'Python', 'scikit-learn', 'LightGBM', 'SHAP', 'FastAPI', 'Angular', 'ECharts', 'Docker', 'Testcontainers', 'Playwright'],
      sources: [
        {
          id: 1,
          text: 'Repository README — architecture, business rules, results, limits.',
          href: 'https://github.com/Sirine008/attendance-dashboard-ml',
          linkLabel: 'attendance-dashboard-ml',
        },
        {
          id: 2,
          text: 'Model card — data, temporal split, baselines, calibration, thresholds.',
          href: 'https://github.com/Sirine008/attendance-dashboard-ml/blob/main/ml-service/reports/model_card.md',
          linkLabel: 'model_card.md',
        },
        { id: 3, text: 'CV — Attijari Bank internship, June 2025.', href: '/cv/Sirine_Tiouajni_CV_FR.pdf', linkLabel: 'CV (PDF)' },
      ],
    },
  },
]

export interface NotebookEntry {
  slug: string
  year: string
  title: string
  detail: string
  label: string
  repo: string | null
}

export const notebook: NotebookEntry[] = [
  {
    slug: 'agri-analytics',
    year: '2025',
    title: 'Analytics and RAG platform for international agricultural trade',
    detail: 'Data warehouse, automated ETL pipeline, and Django dashboards with a RAG assistant for natural-language questions.',
    label: 'Academic project',
  },
  {
    slug: 'semantic-matching',
    year: '2026',
    title: 'Semantic matching of equipment names',
    detail: 'Embeddings with FAISS, a BM25 lexical fallback and cross-encoder reranking, behind a FastAPI endpoint.',
    label: 'Synthetic data',
  },
].map((e) => ({ ...e, repo: (projectLinks[e.slug] ?? { repo: null }).repo }))

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
