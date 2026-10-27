import { useState } from 'react'
import { useReveal } from './useReveal'

/**
 * Reliability diagram: predicted probability (x) against observed frequency (y), one dot per bin,
 * with the perfect-calibration diagonal as reference. Dots appear in order when the chart enters view.
 */
export function Calibration({ bins, label }: { bins: { pred: number; obs: number; n: number }[]; label: string }) {
  const { ref, className } = useReveal<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)
  const S = 320
  const P = { l: 46, r: 14, t: 14, b: 40 }
  const iw = S - P.l - P.r
  const ih = S - P.t - P.b
  const x = (v: number) => P.l + v * iw
  const y = (v: number) => P.t + (1 - v) * ih
  const ticks = [0, 0.2, 0.4, 0.6, 0.8, 1]
  const d = bins.map((b, i) => `${i ? 'L' : 'M'}${x(b.pred).toFixed(1)},${y(b.obs).toFixed(1)}`).join('')
  const pct = (v: number) => `${Math.round(v * 100)} %`

  return (
    <div className={`calib ${className}`} ref={ref}>
      <ul className="legend chart-legend" aria-label="Legend">
        <li>
          <span className="line-key" style={{ background: '#2f6f9f' }} aria-hidden="true" />
          Model, test period (10 groups of 1,524 days)
        </li>
        <li>
          <span className="line-key ref" aria-hidden="true" />
          Perfect calibration
        </li>
      </ul>
      <svg viewBox={`0 0 ${S} ${S}`} width="100%" role="group" aria-label={label}>
        {ticks.map((t) => (
          <g key={t}>
            <line className="grid" x1={x(0)} x2={x(1)} y1={y(t)} y2={y(t)} />
            <line className="grid" x1={x(t)} x2={x(t)} y1={y(0)} y2={y(1)} />
            <text className="tick" x={x(0) - 6} y={y(t)} dy="0.32em" textAnchor="end">
              {pct(t)}
            </text>
            <text className="tick" x={x(t)} y={y(0) + 16} textAnchor="middle">
              {pct(t)}
            </text>
          </g>
        ))}
        <text className="axis-title" x={x(0.5)} y={S - 4} textAnchor="middle">
          Predicted probability of an accident
        </text>
        <text className="axis-title" transform={`translate(11 ${y(0.5)}) rotate(-90)`} textAnchor="middle">
          Days with an accident
        </text>
        <line className="diag" x1={x(0)} y1={y(0)} x2={x(1)} y2={y(1)} />
        <path className="series draw" d={d} stroke="#2f6f9f" pathLength={1} />
        {bins.map((b, i) => (
          <g key={i} className="calib-pt" style={{ animationDelay: `${300 + i * 90}ms` }}>
            <circle cx={x(b.pred)} cy={y(b.obs)} r={hover === i ? 6.5 : 5} fill="#2f6f9f" className="ring" />
            <circle
              cx={x(b.pred)}
              cy={y(b.obs)}
              r={13}
              className="hit-dot"
              tabIndex={0}
              role="img"
              aria-label={`Predicted ${pct(b.pred)}, observed ${pct(b.obs)}`}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
            />
          </g>
        ))}
      </svg>
      {hover !== null && (
        <div className="tooltip calib-tip" role="status">
          <span className="tip-row">
            <strong>{pct(bins[hover].obs)}</strong>
            <span>of days had an accident</span>
          </span>
          <span className="tip-row">
            <strong>{pct(bins[hover].pred)}</strong>
            <span>predicted on average</span>
          </span>
        </div>
      )}
    </div>
  )
}
