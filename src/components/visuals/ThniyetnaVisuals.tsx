import { Bars, StackedBars } from '../viz/Bars'
import { Calibration } from '../viz/Calibration'
import { Gallery } from '../viz/Gallery'
import { Walkthrough } from '../viz/Walkthrough'
import { TableView, VizBlock } from '../viz/VizBlock'

const REPO = 'https://github.com/Sirine008/thniyetna'
const BLOB = `${REPO}/blob/main`

// reports/m2/ablation.csv (test PR-AUC, model 2026.10.11-2054)
const ablation = [
  { label: 'All 50 features', value: 0.6111, tone: 'base' as const },
  { label: 'Without accident history', value: 0.5812, tone: 'accent' as const },
  { label: 'Without weather', value: 0.6122, tone: 'muted' as const },
  { label: 'Without calendar', value: 0.6108, tone: 'muted' as const },
  { label: 'Without road network', value: 0.6107, tone: 'muted' as const },
  { label: 'Only accident history', value: 0.6106, tone: 'accent' as const },
  { label: 'Only road network', value: 0.5759, tone: 'muted' as const },
  { label: 'Only calendar', value: 0.4165, tone: 'muted' as const },
  { label: 'Only weather', value: 0.4043, tone: 'muted' as const },
]

// reports/m2/test_calibration.csv
const calibration = [
  [0.1466, 0.1824],
  [0.2226, 0.2054],
  [0.3043, 0.311],
  [0.3461, 0.3629],
  [0.3777, 0.3858],
  [0.4119, 0.4167],
  [0.4489, 0.4167],
  [0.491, 0.502],
  [0.559, 0.5604],
  [0.7299, 0.7487],
].map(([pred, obs]) => ({ pred, obs, n: 1524 }))

// docs/RAG_EVALUATION.md — 16 answerable questions per variant
const rag = [
  { label: 'Baseline', sub: 'prompt v1', values: { correct: 5, partial: 2, refused: 7, wrong: 2 } },
  { label: 'Bilingual retrieval', sub: 'prompt v1', values: { correct: 7, partial: 2, refused: 6, wrong: 1 } },
  { label: 'Prompt v2', sub: 'kept in production', values: { correct: 9, partial: 2, refused: 2, wrong: 3 } },
  { label: 'Prompt v2 + bilingual', sub: 'slower, dropped', values: { correct: 9, partial: 3, refused: 2, wrong: 2 } },
]
const ragSeries = [
  { key: 'correct', label: 'Correct', color: '#2f6f9f' },
  { key: 'partial', label: 'Partly correct', color: '#6f9cc4' },
  { key: 'refused', label: 'Refused (no answer)', color: '#a89e8f' },
  { key: 'wrong', label: 'Wrong', color: '#b8781a' },
]

const walk = [
  {
    kind: 'io' as const,
    tag: 'Citizen page',
    title: 'A citizen reports a damaged road',
    body: 'The photo is uploaded from the citizen page and becomes a job in a durable PostgreSQL queue, so nothing is lost if the worker restarts.',
  },
  {
    kind: 'code' as const,
    tag: 'Perception worker · YOLO',
    title: 'The detector looks for cracks and potholes',
    body: 'A separate worker runs the pretrained YOLO26s road-damage model on CPU — about 140 ms per image. In the end-to-end check, it found an alligator crack.',
    payload: 'defect_type: alligator_crack\nconfidence: 0.354\nseverity:   0.726',
  },
  {
    kind: 'store' as const,
    tag: 'PostGIS',
    title: 'Observations become one road event',
    body: 'Detections are aligned with GPS, snapped to the road network and merged in space and time, so several photos of the same crack make one event.',
  },
  {
    kind: 'io' as const,
    tag: 'Equipment supervisor',
    title: 'A person validates the event',
    body: 'The equipment supervisor confirms the event from the platform. A validated event counts fully in the risk score; an unconfirmed detection only counts with a reduced weight (0.6).',
  },
  {
    kind: 'code' as const,
    tag: 'Risk model',
    title: 'The road segment’s risk is recomputed',
    body: 'On the next scoring pass, the validated defect raises the segment’s condition component. Its main factor becomes the road condition reported by detection.',
    payload: 'segment OSM-100663969\nrisk      0.184 → 0.394\nlevel     low → medium\npriority  P3 → P2',
  },
  {
    kind: 'code' as const,
    tag: 'Routing · OSRM + PostGIS',
    title: 'Bus routes through the hazard are re-checked',
    body: 'A detour is proposed only if it is at least 0.12 safer and stays more than 105 m from every hazard that triggered it. Otherwise the driver receives a warning instead.',
    payload: 'demo line 1: reroute, risk 73 % → 2 %\ndemo line 2: warning, no safe alternative',
  },
  {
    kind: 'llm' as const,
    tag: 'Assistant · Ollama',
    title: 'The supervisor gets an intervention sheet',
    body: 'Findings, priority and missing data are written from the database by template. Only the advice is generated — from field guides, with numbered citations; an uncited section is flagged.',
    payload: 'Constat     ← database\nPriorité    ← database\nConseils    ← guides [1] [2]',
  },
]

const shots = [
  {
    src: '/images/work/thniyetna-route',
    width: 620,
    height: 800,
    title: 'Safer alternative',
    alt: 'Route page: the initial route is affected (risk 73 %, two hazards) and a safer alternative is recommended (risk 2 %, 28.2 km, 38 minutes).',
    caption: 'The fastest route crosses two hazards; the recommended alternative avoids both.',
  },
  {
    src: '/images/work/thniyetna-warning',
    width: 620,
    height: 800,
    title: 'Warning, no detour',
    alt: 'Route page in red: danger on the route and no safe alternative, risk 80 %, with three cracks listed by distance from the start.',
    caption: 'When no alternative is clearly safer, the user is warned instead of being sent on a worse detour.',
  },
  {
    src: '/images/work/thniyetna-search-ar',
    width: 620,
    height: 800,
    title: 'Search in Arabic',
    alt: 'Destination search with Arabic input showing Menzel Bourguiba as the first suggestion.',
    caption: 'An index of 711 places in the governorate, searchable in French and Arabic, tolerant to accents and spelling variants.',
  },
  {
    src: '/images/work/thniyetna-out-of-zone',
    width: 620,
    height: 800,
    title: 'Outside the area',
    alt: 'Route page message: destination outside the covered area (governorate of Bizerte).',
    caption: 'Destinations outside the governorate get a clear message instead of a misleading route.',
  },
  {
    src: '/images/work/thniyetna-mobile-verified',
    width: 520,
    height: 1125,
    title: 'Phone · verified route',
    alt: 'Mobile view of a verified route from the centre of Bizerte to the military hospital, with no significant hazard.',
    caption: 'The same page at phone width: a route checked with no significant hazard.',
  },
]

export function ThniyetnaVisuals() {
  return (
    <>
      <VizBlock
        id="thn-walk"
        kicker="Animated walkthrough · real end-to-end check"
        title="Follow one report through the whole system"
        lead={
          <p>
            This sequence replays the verification run of 23 October 2026. The values are the ones recorded in the project
            status report; the routing step uses the labelled demonstration lines.
          </p>
        }
        source={{ text: 'docs/STATUS.md and docs/DECISIONS.md in the repository.', href: `${BLOB}/docs/STATUS.md`, label: 'STATUS.md' }}
      >
        <Walkthrough id="thn-walk" steps={walk} />
      </VizBlock>

      <VizBlock
        id="thn-gallery"
        kicker="Real screenshots"
        title="What a citizen sees"
        lead={<p>Screenshots taken by the project’s automated interface check (headless browser, 28 checks). The hazards shown are demonstration data, labelled as such in the application.</p>}
        source={{ text: 'docs/ui/ in the repository.', href: `${REPO}/tree/main/docs/ui`, label: 'docs/ui' }}
      >
        <Gallery shots={shots} label="Choose a screenshot" />
      </VizBlock>

      <VizBlock
        id="thn-ablation"
        kicker="Ablation study · test period"
        title="Accident history carries almost all the signal"
        lead={
          <p>
            Each bar retrains the model with a group of features removed, or kept alone. Removing history costs the most;
            history alone does as well as everything together. Weather or calendar alone stay at chance level — and that is
            why the per-governorate weather experiment was run, and recorded as a negative result.
          </p>
        }
        source={{ text: 'reports/m2/ablation.csv.', href: `${BLOB}/docs/M2_MODEL_CARD.md`, label: 'model card' }}
      >
        <Bars
          label="Test PR-AUC by feature group"
          max={0.7}
          format={(v) => v.toFixed(3)}
          reference={{ value: 0.4092, label: 'chance (base rate 0.41)' }}
          rows={ablation}
        />
        <TableView caption="Ablation: test PR-AUC by feature group" head={['Variant', 'PR-AUC']} rows={ablation.map((a) => [a.label, a.value.toFixed(4)])} />
      </VizBlock>

      <VizBlock
        id="thn-calibration"
        kicker="Calibration · test period"
        title="When it says 40 %, it means about 40 %"
        lead={
          <p>
            The test days are split into ten equal groups by predicted probability. For each group, the dot shows how often an
            accident was actually recorded. Points close to the diagonal mean the probabilities can be read at face value —
            which matters more for maintenance priorities than a single accuracy score.
          </p>
        }
        source={{ text: 'reports/m2/test_calibration.csv.', href: `${BLOB}/docs/M2_MODEL_CARD.md`, label: 'model card' }}
      >
        <div className="viz-split">
          <Calibration bins={calibration} label="Calibration of the accident model on the test period: predicted probability against observed frequency, close to the diagonal." />
          <TableView
            caption="Calibration bins"
            head={['Group', 'Predicted', 'Observed']}
            rows={calibration.map((b, i) => [String(i + 1), `${(b.pred * 100).toFixed(1)} %`, `${(b.obs * 100).toFixed(1)} %`])}
          />
        </div>
      </VizBlock>

      <VizBlock
        id="thn-rag"
        kicker="Assistant evaluation · 16 answerable + 4 unanswerable questions"
        title="Fewer refusals, without inventing answers"
        lead={
          <p>
            Every answer was read against its source and labelled by hand. The second prompt cut refusals from 7 to 2 out of 16.
            In every variant, all 4 questions that the guides cannot answer were correctly refused. Bilingual retrieval was
            dropped: same quality, slower, and users ask in French only.
          </p>
        }
        source={{ text: 'docs/RAG_EVALUATION.md.', href: `${BLOB}/docs/RAG_EVALUATION.md`, label: 'RAG_EVALUATION.md' }}
      >
        <StackedBars label="Answer quality by assistant variant" series={ragSeries} rows={rag} total={16} />
        <TableView
          caption="Assistant evaluation by variant"
          head={['Variant', 'Correct', 'Partly correct', 'Refused', 'Wrong']}
          rows={rag.map((r) => [r.label, r.values.correct, r.values.partial, r.values.refused, r.values.wrong])}
        />
      </VizBlock>
    </>
  )
}
