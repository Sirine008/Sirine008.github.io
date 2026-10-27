import type { CSSProperties } from 'react'
import { useReveal } from './useReveal'

export interface BarRow {
  label: string
  value: number
  /** 'accent' draws attention to the bars the text talks about; others stay recessive. */
  tone?: 'accent' | 'base' | 'muted'
  note?: string
}

/**
 * Horizontal bar chart in plain HTML: readable without JavaScript, values printed at the bar tip,
 * bars grow from the baseline when the chart first scrolls into view.
 */
export function Bars({
  rows,
  min = 0,
  max,
  format,
  reference,
  label,
}: {
  rows: BarRow[]
  min?: number
  max: number
  format: (v: number) => string
  reference?: { value: number; label: string }
  label: string
}) {
  const { ref, className } = useReveal<HTMLDivElement>()
  const pct = (v: number) => Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100))

  return (
    <div ref={ref} className={`bars ${className}${reference ? ' has-ref' : ''}`} role="group" aria-label={label}>
      {rows.map((r, i) => (
        <div className={`bar-row tone-${r.tone ?? 'base'}`} key={r.label}>
          <span className="bar-label">
            {r.label}
            {r.note && <span className="bar-note">{r.note}</span>}
          </span>
          <span className="bar-track">
            <span className="bar-fill" style={{ width: `${pct(r.value)}%`, '--d': `${i * 60}ms` } as CSSProperties} />
            <span className="bar-value" style={{ left: `${pct(r.value)}%` }}>
              {format(r.value)}
            </span>
            {reference && (
              <span className="bar-ref" style={{ left: `${pct(reference.value)}%` }} aria-hidden="true">
                {i === 0 && <span>{reference.label}</span>}
              </span>
            )}
          </span>
        </div>
      ))}
      {reference && <p className="visually-hidden">Reference: {reference.label}.</p>}
      {min > 0 && <p className="mono bar-axis-note">Axis starts at {format(min)} so that small differences stay visible.</p>}
    </div>
  )
}

export interface StackSeries {
  key: string
  label: string
  color: string
}

/** 100 %-stacked horizontal bars with a legend; each segment is labelled when it is wide enough. */
export function StackedBars({
  series,
  rows,
  total,
  label,
}: {
  series: StackSeries[]
  rows: { label: string; sub?: string; values: Record<string, number> }[]
  total: number
  label: string
}) {
  const { ref, className } = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={`stacked ${className}`} role="group" aria-label={label}>
      <ul className="legend chart-legend" aria-label="Legend">
        {series.map((s) => (
          <li key={s.key}>
            <span className="swatch" style={{ background: s.color }} aria-hidden="true" />
            {s.label}
          </li>
        ))}
      </ul>
      {rows.map((r, i) => (
        <div className="stack-row" key={r.label}>
          <span className="bar-label">
            {r.label}
            {r.sub && <span className="bar-note">{r.sub}</span>}
          </span>
          <span className="stack-track" style={{ '--d': `${i * 90}ms` } as CSSProperties}>
            {series.map((s) => {
              const v = r.values[s.key] ?? 0
              if (!v) return null
              const w = (v / total) * 100
              return (
                <span
                  key={s.key}
                  className="stack-seg"
                  style={{ width: `${w}%`, background: s.color }}
                  title={`${s.label}: ${v} of ${total}`}
                >
                  {w >= 9 && <span className={`seg-label ${s.key === 'correct' ? 'on-dark' : ''}`}>{v}</span>}
                  <span className="visually-hidden">
                    {s.label}: {v} of {total}.
                  </span>
                </span>
              )
            })}
          </span>
        </div>
      ))}
    </div>
  )
}
