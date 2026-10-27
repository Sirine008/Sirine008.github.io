import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'

export interface LineSeries {
  key: string
  label: string
  color: string
  values: number[]
}

const PAD = { top: 16, right: 64, bottom: 30, left: 56 }

function niceTicks(min: number, max: number, count = 4) {
  const span = max - min || 1
  const step0 = span / count
  const mag = 10 ** Math.floor(Math.log10(step0))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= step0) ?? step0
  const start = Math.ceil(min / step) * step
  const ticks: number[] = []
  for (let v = start; v <= max + 1e-9; v += step) ticks.push(+v.toFixed(6))
  return ticks
}

/**
 * Multi-series line chart in SVG with a snapping crosshair and tooltip (pointer and keyboard).
 * Lines draw themselves when `animKey` changes and the chart is in its 'play' state.
 */
export function LineChart({
  dates,
  series,
  format,
  label,
  animKey,
  reveal,
}: {
  dates: string[]
  series: LineSeries[]
  format: (v: number) => string
  label: string
  animKey: string
  reveal: string
}) {
  const box = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(760)
  const [hover, setHover] = useState<number | null>(null)

  useEffect(() => {
    const el = box.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const h = w < 520 ? 240 : 300
  const n = dates.length
  const all = series.flatMap((s) => s.values)
  const lo = Math.min(...all)
  const hi = Math.max(...all)
  const padY = (hi - lo) * 0.08 || 1
  const y0 = lo - padY
  const y1 = hi + padY
  const iw = w - PAD.left - PAD.right
  const ih = h - PAD.top - PAD.bottom
  const x = (i: number) => PAD.left + (n <= 1 ? 0 : (i / (n - 1)) * iw)
  const y = (v: number) => PAD.top + (1 - (v - y0) / (y1 - y0)) * ih
  const ticks = useMemo(() => niceTicks(y0, y1, 5), [y0, y1])

  const paths = series.map((s) => ({
    ...s,
    d: s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(''),
  }))

  // Month labels on the x axis, thinned to fit.
  const xTicks = useMemo(() => {
    const out: { i: number; text: string }[] = []
    let last = ''
    dates.forEach((d, i) => {
      const m = d.slice(0, 7)
      if (m !== last) {
        out.push({ i, text: new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { month: 'short', year: '2-digit', timeZone: 'UTC' }) })
        last = m
      }
    })
    const maxLabels = Math.max(2, Math.floor(iw / 70))
    const every = Math.ceil(out.length / maxLabels)
    return out.filter((_, k) => k % every === 0)
  }, [dates, iw])

  const pick = (clientX: number) => {
    const r = box.current?.getBoundingClientRect()
    if (!r) return
    const px = clientX - r.left - PAD.left
    setHover(Math.max(0, Math.min(n - 1, Math.round((px / iw) * (n - 1)))))
  }
  const onKey = (e: KeyboardEvent) => {
    const cur = hover ?? n - 1
    if (e.key === 'ArrowLeft') setHover(Math.max(0, cur - 1))
    else if (e.key === 'ArrowRight') setHover(Math.min(n - 1, cur + 1))
    else if (e.key === 'Home') setHover(0)
    else if (e.key === 'End') setHover(n - 1)
    else return
    e.preventDefault()
  }

  const last = n - 1
  return (
    <div className={`line-chart ${reveal}`} ref={box}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" role="group" aria-label={label}>
        {ticks.map((t) => (
          <g key={t}>
            <line className="grid" x1={PAD.left} x2={w - PAD.right} y1={y(t)} y2={y(t)} />
            <text className="tick" x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end">
              {format(t)}
            </text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={t.i} className="tick" x={x(t.i)} y={h - 8} textAnchor="middle">
            {t.text}
          </text>
        ))}
        {paths.map((p) => (
          <path key={`${p.key}-${animKey}`} className="series draw" d={p.d} stroke={p.color} pathLength={1} />
        ))}
        {paths.map((p) => (
          <g key={`end-${p.key}-${animKey}`} className="end-mark">
            <circle cx={x(last)} cy={y(p.values[last])} r={4.5} fill={p.color} />
          </g>
        ))}
        {hover !== null && (
          <g aria-hidden="true">
            <line className="crosshair" x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + ih} />
            {paths.map((p) => (
              <circle key={p.key} className="hover-dot" cx={x(hover)} cy={y(p.values[hover])} r={4.5} fill={p.color} />
            ))}
          </g>
        )}
        <rect
          className="hit"
          x={PAD.left}
          y={PAD.top}
          width={iw}
          height={ih}
          tabIndex={0}
          role="slider"
          aria-label="Explore values by day: use the left and right arrow keys"
          aria-valuemin={0}
          aria-valuemax={n - 1}
          aria-valuenow={hover ?? last}
          aria-valuetext={`${dates[hover ?? last]}: ${series.map((s) => `${s.label} ${format(s.values[hover ?? last])}`).join(', ')}`}
          onPointerMove={(e: PointerEvent) => pick(e.clientX)}
          onPointerDown={(e: PointerEvent) => pick(e.clientX)}
          onPointerLeave={() => setHover(null)}
          onFocus={() => setHover(hover ?? last)}
          onBlur={() => setHover(null)}
          onKeyDown={onKey}
        />
      </svg>
      {hover !== null && (
        <div
          className="tooltip"
          role="status"
          style={{
            left: Math.min(Math.max(x(hover), 90), w - 90),
            top: 4,
          }}
        >
          <span className="mono tip-date">{dates[hover]}</span>
          {series.map((s) => (
            <span className="tip-row" key={s.key}>
              <span className="tip-key" style={{ background: s.color }} aria-hidden="true" />
              <strong>{format(s.values[hover])}</strong>
              <span>{s.label}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
