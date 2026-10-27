import type { CSSProperties } from 'react'
import type { Diagram as DiagramData, StepKind } from '../content/projects'

const kindLabel: Record<StepKind, string> = {
  io: 'Input or output',
  llm: 'Language model',
  code: 'Deterministic code',
  store: 'Data store',
}

/**
 * Architecture diagram built from real HTML (not an image), so it reads in order
 * for screen readers, reflows on small screens and stays sharp at any size.
 */
export function Diagram({ data, id }: { data: DiagramData; id: string }) {
  const kinds = Array.from(new Set(data.lanes.flatMap((l) => l.steps.map((s) => s.kind))))
  const order: StepKind[] = ['llm', 'code', 'store', 'io']
  let index = 0

  return (
    <figure className="diagram" aria-labelledby={`${id}-title`}>
      <div className="diagram-head">
        <h2 id={`${id}-title`}>{data.title}</h2>
        <ul className="legend" aria-label="Legend">
          {order
            .filter((k) => kinds.includes(k))
            .map((k) => (
              <li key={k}>
                <span className={`swatch ${k}`} aria-hidden="true" />
                {kindLabel[k]}
              </li>
            ))}
        </ul>
      </div>

      {data.lanes.map((lane, li) => (
        <div className="lane" key={li}>
          {lane.label && <p className="lane-label mono">{lane.label}</p>}
          {!lane.label && li > 0 && (
            <p className="lane-label mono" aria-hidden="true">
              ↓ continued
            </p>
          )}
          <ol className="steps" aria-label={lane.label ? `${lane.label} steps` : 'Steps'}>
            {lane.steps.map((step) => {
              const style = { '--i': index++ } as CSSProperties
              return (
                <li className="step" key={step.title}>
                  <div className={`step-box ${step.kind}`} style={style}>
                    <span className="mono">
                      <span className="visually-hidden">{kindLabel[step.kind]}: </span>
                      {step.tag}
                    </span>
                    <strong>{step.title}</strong>
                    {step.detail && <span className="detail">{step.detail}</span>}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      ))}

      {data.note && <p className="diagram-note">{data.note}</p>}
      <figcaption className="mono">{data.caption}</figcaption>
    </figure>
  )
}
