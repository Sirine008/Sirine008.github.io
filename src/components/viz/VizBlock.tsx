import type { ReactNode } from 'react'

/** A titled explanatory block inside a case study: heading, short reading guide, the visual, and its source. */
export function VizBlock({
  id,
  kicker,
  title,
  children,
  lead,
  source,
}: {
  id: string
  kicker: string
  title: string
  lead: ReactNode
  children: ReactNode
  source?: { text: string; href?: string; label?: string }
}) {
  return (
    <section className="viz" aria-labelledby={`${id}-title`}>
      <div className="viz-head">
        <p className="mono viz-kicker">{kicker}</p>
        <h2 id={`${id}-title`}>{title}</h2>
        <div className="viz-lead">{lead}</div>
      </div>
      <div className="viz-body">{children}</div>
      {source && (
        <p className="mono viz-source">
          Source: {source.text}{' '}
          {source.href && (
            <a href={source.href} rel="noopener">
              {source.label ?? 'link'} ↗
            </a>
          )}
        </p>
      )}
    </section>
  )
}

export function TableView({ caption, head, rows }: { caption: string; head: string[]; rows: (string | number)[][] }) {
  return (
    <details className="table-view">
      <summary>View the data as a table</summary>
      <div className="table-scroll">
        <table>
          <caption className="visually-hidden">{caption}</caption>
          <thead>
            <tr>
              {head.map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) =>
                  j === 0 ? (
                    <th key={j} scope="row">
                      {c}
                    </th>
                  ) : (
                    <td key={j}>{c}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}
