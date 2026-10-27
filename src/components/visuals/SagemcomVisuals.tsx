import { Walkthrough } from '../viz/Walkthrough'
import { VizBlock } from '../viz/VizBlock'

const walk = [
  {
    kind: 'io' as const,
    tag: 'Question',
    title: 'A quality engineer asks in French',
    body: 'The question arrives at the assistant endpoint of the dashboard API.',
    payload: '« Quelles sont les 3 opérations\n  au plus faible rendement ? »',
  },
  {
    kind: 'code' as const,
    tag: 'Cache',
    title: 'Has this been answered since the last data load?',
    body: 'The question is normalised and looked up in the response cache. Cached answers are dropped as soon as newer production data is loaded.',
    payload: 'cache: miss',
  },
  {
    kind: 'llm' as const,
    tag: 'LLM · step 1',
    title: 'The local model only extracts the intent',
    body: 'Llama 3.2, running locally through Ollama, turns the question into a small JSON object, helped by a business glossary of quality terms. It never writes SQL.',
    payload: '{ "intent": "ranking", "metric": "yield",\n  "level": "operation", "direction": "worst",\n  "limit": 3 }',
  },
  {
    kind: 'code' as const,
    tag: 'Pydantic',
    title: 'The intent is validated',
    body: 'The JSON must match a strict schema. Invalid or low-confidence output is treated as an unsupported question and gets a clarification, not a guess.',
    payload: 'schema: valid · confidence: high',
  },
  {
    kind: 'code' as const,
    tag: 'Glossary + pg_trgm',
    title: 'Names are matched against real values',
    body: 'Any product, operation or machine named in a question is looked up among the values actually stored, with trigram similarity. An uncertain match makes the assistant ask which one was meant.',
  },
  {
    kind: 'code' as const,
    tag: 'Templates',
    title: 'A reviewed SQL template is chosen',
    body: 'The intent maps to one predefined, parameterised query. The values from the question are passed as bound parameters, never pasted into SQL text.',
    payload: 'template: ranking by yield\nparams:   direction=worst, limit=3',
  },
  {
    kind: 'code' as const,
    tag: 'SQL guard',
    title: 'The query passes the guard',
    body: 'Even a template goes through the guard before it runs.',
    payload: '✓ SELECT only           ✓ single statement\n✓ schema-qualified      ✓ LIMIT bounded\n✓ no DDL or mutation keyword',
  },
  {
    kind: 'store' as const,
    tag: 'PostgreSQL',
    title: 'It runs with a read-only role',
    body: 'A dedicated role that can only read, with a 10-second statement timeout, separate from the dashboard’s connection pool.',
  },
  {
    kind: 'llm' as const,
    tag: 'LLM · step 2',
    title: 'The model phrases the answer from the rows',
    body: 'The returned rows — and only those — are given to the model to write a short French answer. The response can also show the SQL used and the data returned, so the answer can be checked.',
    payload: '« Les 3 opérations au plus faible rendement\n  sont OP-A, OP-B et OP-C … »',
  },
]

export function SagemcomVisuals() {
  return (
    <VizBlock
      id="fpy-walk"
      kicker="Animated walkthrough · illustrative example"
      title="One question, nine steps, two short visits to the model"
      lead={
        <p>
          This replays the assistant pipeline documented in the repository. The question, names and values are invented —
          production data is confidential — but every step is the real one.
        </p>
      }
      source={{ text: 'README — “Assistant pipeline” and “Why the assistant is grounded and safe”.', href: 'https://github.com/Sirine008/dashboard-fpy-rag-assistant', label: 'repository' }}
    >
      <Walkthrough id="fpy-walk" steps={walk} note="Illustrative example: the question, the intent fields and the operation names are invented." />
    </VizBlock>
  )
}
