import { Bars } from '../viz/Bars'
import { Gallery, type Shot } from '../viz/Gallery'
import { TableView, VizBlock } from '../viz/VizBlock'

const REPO = 'https://github.com/Sirine008/documind-ai'
const README_EVAL = `${REPO}#evaluation`

const W = '/images/work/'
const shots: Shot[] = [
  {
    src: `${W}documind-chat`,
    width: 1320,
    height: 825,
    title: 'Chat and evidence',
    alt: 'Chat page: the question "How much is the home office stipend?" is answered with a page 3 citation badge, and the evidence panel highlights the matching sentence in the full passage of the remote work policy. A second question about parental leave gets "Not enough evidence in the documents".',
    caption: 'Selecting the "p. 3" badge opens the passage the answer came from, with the supporting sentence highlighted. A question the documents cannot answer is declined.',
  },
  {
    src: `${W}documind-study`,
    width: 1320,
    height: 825,
    title: 'Study tools',
    alt: 'Study page: a quiz built from "Introduction to solar energy". The first question is answered correctly and the explanation quotes the source sentence with a page 1 badge.',
    caption: 'Quizzes, summaries and revision notes are built from the passages; each item links back to its source and page.',
  },
  {
    src: `${W}documind-evaluation`,
    width: 1320,
    height: 825,
    title: 'Evaluation page',
    alt: 'Evaluation page for the demo configuration: retrieval metrics (MRR 0.964, Recall@5 1.000), answer metrics (citation validity 1.000, citation correctness 0.950, false abstention 0.286) and a per-question table.',
    caption: 'The same metrics as the command-line script, with a per-question table. Shown here for the demo configuration.',
  },
  {
    src: `${W}documind-mobile`,
    width: 390,
    height: 844,
    title: 'Phone',
    alt: 'Chat page at phone width: an answer about core collaboration hours with a page 2 citation, and tabs for Library, Chat and Evidence at the bottom.',
    caption: 'At phone width, the library, chat and evidence panel become tabs.',
  },
]

// docs/evaluation-results-demo.json and docs/evaluation-results-ollama.json
const compare = [
  ['Recall@5', '1.000', '1.000'],
  ['MRR', '0.964', '0.929'],
  ['Answerable questions answered (of 14)', '10', '14'],
  ['Questions to decline, declined (of 4)', '4', '4'],
  ['Citation validity', '1.000', '1.000'],
  ['Citation correctness', '0.950', '1.000'],
  ['Page accuracy', '1.000', '1.000'],
  ['Groundedness (lexical)', '0.919', '0.872'],
  ['Answer relevance (lexical)', '0.827', '0.912'],
  ['Answer latency, median', '13.4 ms', '26.6 s'],
]

// README, "Measured results (real models)": the three runs with Llama 3.2 3B
const runs = [
  { run: 'Run 1', validity: 0, abstention: 0.75, note: 'right answers, no [S1] labels' },
  { run: 'Run 2', validity: 1, abstention: 0.5, note: '"not mentioned in the passages" counted as answers' },
  { run: 'Run 3', validity: 1, abstention: 1, note: 'reported' },
]

const f3 = (v: number) => v.toFixed(3)

export function DocumindVisuals() {
  return (
    <>
      <VizBlock
        id="dm-shots"
        kicker="Real screenshots · demo mode"
        title="Every answer points to its page"
        lead={
          <p>
            Screenshots from the repository, taken in demo mode — a deterministic answer provider, no language model — on
            the bundled sample documents, which are written for the project and published under CC0.
          </p>
        }
        source={{ text: 'docs/screenshots in the repository.', href: `${REPO}/tree/main/docs/screenshots`, label: 'screenshots' }}
      >
        <Gallery shots={shots} label="Choose a screenshot" />
      </VizBlock>

      <VizBlock
        id="dm-compare"
        kicker="Evaluation · same 18 questions"
        title="A small local model answers what the demo could not"
        lead={
          <p>
            The demo provider copies sentences that share words with the question, so it declined 4 paraphrased questions it
            could have answered. Llama 3.2 3B answers all 14 and cites the right passage every time. The cost is time: about
            27 seconds per answer on a laptop CPU, against milliseconds.
          </p>
        }
        source={{ text: 'raw evaluation output in the repository.', href: `${REPO}/tree/main/docs`, label: 'docs' }}
      >
        <p className="mono viz-kicker">Answerable questions answered, of 14</p>
        <Bars
          label="Answerable questions answered, demo against real models"
          max={14}
          format={(v) => `${v}`}
          rows={[
            { label: 'Demo mode', value: 10, tone: 'muted', note: 'extractive, no LLM' },
            { label: 'Real models', value: 14, tone: 'accent', note: 'MiniLM + Llama 3.2 3B' },
          ]}
        />
        <p className="mono viz-kicker" style={{ marginTop: '1.5rem' }}>
          Mean reciprocal rank — retrieval
        </p>
        <Bars
          label="Mean reciprocal rank, demo against real models"
          max={1}
          format={f3}
          rows={[
            { label: 'Demo mode', value: 0.964, tone: 'muted', note: 'hashing embedder' },
            { label: 'Real models', value: 0.929, tone: 'accent', note: 'one more question ranks its passage second' },
          ]}
        />
        <TableView caption="Demo mode against real models on the bundled question set" head={['Metric', 'Demo mode', 'Real models']} rows={compare} />
      </VizBlock>

      <VizBlock
        id="dm-runs"
        kicker="Three runs with Llama 3.2 3B"
        title="The model broke the format twice before the numbers held"
        lead={
          <p>
            A 3B model does not follow an output format as reliably as a large one. Each run exposed a problem; each was fixed
            in the prompt and the parser, with a regression test, before the next run. Because the fixes were made on this
            same question set, the final numbers are optimistic.
          </p>
        }
        source={{ text: 'README, evaluation section.', href: README_EVAL, label: 'README' }}
      >
        <p className="mono viz-kicker">Citation validity</p>
        <Bars
          label="Citation validity per run"
          max={1}
          format={f3}
          rows={runs.map((r) => ({ label: r.run, value: r.validity, tone: r.run === 'Run 3' ? 'accent' : 'muted', note: r.run === 'Run 1' ? r.note : undefined }))}
        />
        <p className="mono viz-kicker" style={{ marginTop: '1.5rem' }}>
          Questions to decline, correctly declined
        </p>
        <Bars
          label="Correct abstention rate per run"
          max={1}
          format={f3}
          rows={runs.map((r) => ({ label: r.run, value: r.abstention, tone: r.run === 'Run 3' ? 'accent' : 'muted', note: r.run === 'Run 1' ? undefined : r.note }))}
        />
        <TableView
          caption="Citation validity and correct abstention for each run"
          head={['Run', 'Citation validity', 'Correct abstention', 'What happened']}
          rows={runs.map((r) => [r.run, f3(r.validity), f3(r.abstention), r.note])}
        />
      </VizBlock>
    </>
  )
}
