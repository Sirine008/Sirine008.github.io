import { useState } from 'react'
import { Walkthrough } from '../viz/Walkthrough'
import { VizBlock } from '../viz/VizBlock'

const REPO = 'https://github.com/Sirine008/Faculty-Administration-System-'

type Node = 'dept' | 'exam' | 'knowledge' | 'pg' | 'chroma' | 'llm'

interface Request {
  id: string
  text: string
  route: string
  agent: Node
  uses: Node[]
  llm: 'none' | 'optional' | 'yes'
  explain: string
}

// Routing, agents and data sources as documented in the repository README.
const requests: Request[] = [
  {
    id: 'teacher',
    text: 'Add a teacher to a department',
    route: 'POST /api/teachers',
    agent: 'dept',
    uses: ['pg'],
    llm: 'none',
    explain: 'Ordinary business logic: the Department agent validates the record and writes it to PostgreSQL. After such changes, a background job re-indexes records for search.',
  },
  {
    id: 'supervise',
    text: 'Assign a supervisor to an exam',
    route: 'POST /api/exams/{id}/assign-teacher',
    agent: 'exam',
    uses: ['pg'],
    llm: 'none',
    explain: 'The Exam agent checks that the teacher has no overlapping supervision before saving. No language model is involved in a constraint check.',
  },
  {
    id: 'schedule',
    text: 'Generate the exam schedule',
    route: 'POST /api/scheduling/generate',
    agent: 'exam',
    uses: ['pg', 'llm'],
    llm: 'optional',
    explain: 'Rooms, modules and class sizes come from PostgreSQL; placement and conflict checks are deterministic. The LLM may fill missing request details and summarise the result — if it is unavailable, rules take over.',
  },
  {
    id: 'chat',
    text: 'How many exams are scheduled this week?',
    route: 'POST /api/chat',
    agent: 'knowledge',
    uses: ['chroma', 'pg', 'llm'],
    llm: 'yes',
    explain: 'The Knowledge agent retrieves indexed passages from ChromaDB, adds a direct PostgreSQL count for the week, and asks the local model to answer from that context only.',
  },
  {
    id: 'hello',
    text: 'Hello!',
    route: 'POST /api/chat',
    agent: 'knowledge',
    uses: ['llm'],
    llm: 'yes',
    explain: 'Greetings skip retrieval entirely and go straight to the local model — no need to search the database to say hello.',
  },
]

const agents: { id: Node; name: string; role: string }[] = [
  { id: 'dept', name: 'Department agent', role: 'Departments, teachers, classes, students' },
  { id: 'exam', name: 'Exam & scheduling agent', role: 'Exams, rooms, supervision, schedules' },
  { id: 'knowledge', name: 'Knowledge agent', role: 'Questions in natural language (RAG)' },
]
const stores: { id: Node; name: string; role: string }[] = [
  { id: 'pg', name: 'PostgreSQL', role: 'System of record' },
  { id: 'chroma', name: 'ChromaDB', role: 'Indexed website + records' },
  { id: 'llm', name: 'Ollama · Llama 3.2', role: 'Local language model via LangChain' },
]

const llmLabel = { none: 'No language model', optional: 'Language model optional', yes: 'Language model used' }

function Router() {
  const [sel, setSel] = useState(requests[3].id)
  const r = requests.find((x) => x.id === sel)!
  return (
    <div className="router">
      <fieldset className="router-requests">
        <legend className="mono">Pick a request</legend>
        {requests.map((q) => (
          <button key={q.id} type="button" aria-pressed={q.id === sel} onClick={() => setSel(q.id)}>
            “{q.text}”
          </button>
        ))}
      </fieldset>

      <div className="router-map" key={sel} aria-live="polite">
        <div className="router-col">
          <p className="mono router-col-title">API route</p>
          <div className="r-node active step-a">
            <strong>FastAPI</strong>
            <span className="mono">{r.route}</span>
          </div>
        </div>
        <div className="router-col">
          <p className="mono router-col-title">Agent</p>
          {agents.map((a) => (
            <div key={a.id} className={`r-node ${a.id === r.agent ? 'active step-b' : 'idle'}`}>
              <strong>{a.name}</strong>
              <span>{a.role}</span>
              {a.id === r.agent && <span className="visually-hidden"> — handles this request</span>}
            </div>
          ))}
        </div>
        <div className="router-col">
          <p className="mono router-col-title">Data &amp; model</p>
          {stores.map((s) => (
            <div key={s.id} className={`r-node ${s.id === 'llm' ? 'is-llm ' : ''}${r.uses.includes(s.id) ? 'active step-c' : 'idle'}`}>
              <strong>{s.name}</strong>
              <span>{s.role}</span>
              {r.uses.includes(s.id) && <span className="visually-hidden"> — used</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="router-explain">
        <span className={`status ${r.llm === 'none' ? 'pending' : ''}`}>{llmLabel[r.llm]}</span>
        <p>{r.explain}</p>
      </div>
    </div>
  )
}

const walk = [
  {
    kind: 'io' as const,
    tag: 'React frontend',
    title: 'The question is sent to the chat route',
    body: 'A user types the question in the chat page; the frontend posts it to the API.',
    payload: 'POST /api/chat\n{ "query": "How many exams are scheduled this week?" }',
  },
  {
    kind: 'code' as const,
    tag: 'FastAPI',
    title: 'The API hands it to the Knowledge agent',
    body: 'It is not a greeting, so the request goes through retrieval rather than straight to the model.',
  },
  {
    kind: 'store' as const,
    tag: 'ChromaDB',
    title: 'Relevant passages are retrieved',
    body: 'The question is embedded with all-MiniLM-L6-v2 and compared with indexed website passages and records; up to five passages above the similarity threshold are kept.',
  },
  {
    kind: 'store' as const,
    tag: 'PostgreSQL',
    title: 'Exact numbers come from the database',
    body: 'Because the question names a period (“this week”), the agent adds a direct SQL lookup of the exams scheduled in that week.',
  },
  {
    kind: 'llm' as const,
    tag: 'LangChain + Ollama',
    title: 'The local model writes the answer',
    body: 'A LangChain prompt combines the question, the retrieved passages and the database context; Llama 3.2 runs locally through Ollama.',
  },
  {
    kind: 'io' as const,
    tag: 'Response',
    title: 'The answer is returned to the chat',
    body: 'The generated text goes back through the API to the frontend.',
  },
]

export function FacultyVisuals() {
  return (
    <>
      <VizBlock
        id="fac-router"
        kicker="Interactive · how requests are routed"
        title="Which agent answers — and when the model is involved"
        lead={
          <p>
            Choose a request to see the path it takes. Most administrative work never reaches the language model; it is used
            where language is the problem, not where rules are.
          </p>
        }
        source={{ text: 'README — agent architecture and API overview.', href: REPO, label: 'repository' }}
      >
        <Router />
      </VizBlock>

      <VizBlock
        id="fac-walk"
        kicker="Animated walkthrough"
        title="One question, step by step"
        lead={<p>The example request documented in the repository README, replayed step by step.</p>}
        source={{ text: 'README — “Example AI interaction”.', href: REPO, label: 'repository' }}
      >
        <Walkthrough id="fac-walk" steps={walk} />
      </VizBlock>
    </>
  )
}
