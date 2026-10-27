import { useEffect, useRef, useState } from 'react'
import type { StepKind } from '../../content/projects'
import { prefersReducedMotion } from './useReveal'

export interface WalkStep {
  kind: StepKind
  tag: string
  title: string
  body: string
  /** Optional short example of what the step produces (monospace). */
  payload?: string
}

const STEP_MS = 3600

/**
 * Step-by-step animated walkthrough. It starts playing once when it scrolls into view,
 * stops as soon as the reader uses a control, and never auto-plays under reduced motion.
 * Every step is reachable with the Previous / Next buttons and the numbered step buttons.
 */
export function Walkthrough({ id, steps, note }: { id: string; steps: WalkStep[]; note?: string }) {
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [touched, setTouched] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  // Start once when visible.
  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setPlaying(true)
          io.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Advance while playing; stop at the last step.
  useEffect(() => {
    if (!playing) return
    const t = window.setTimeout(() => {
      if (i < steps.length - 1) setI(i + 1)
      else setPlaying(false)
    }, STEP_MS)
    return () => window.clearTimeout(t)
  }, [playing, i, steps.length])

  const go = (n: number) => {
    setTouched(true)
    setPlaying(false)
    setI(Math.max(0, Math.min(steps.length - 1, n)))
  }
  const togglePlay = () => {
    setTouched(true)
    if (!playing && i === steps.length - 1) setI(0)
    setPlaying(!playing)
  }

  const s = steps[i]
  return (
    <div className="walk" ref={root}>
      <ol className="walk-track" aria-label="Steps">
        {steps.map((st, n) => (
          <li key={st.title} className={n === i ? 'current' : n < i ? 'done' : ''}>
            <button
              type="button"
              className={`walk-dot ${st.kind}`}
              aria-current={n === i ? 'step' : undefined}
              aria-label={`Step ${n + 1}: ${st.title}`}
              onClick={() => go(n)}
            >
              <span aria-hidden="true">{n + 1}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="walk-progress" aria-hidden="true">
        <span style={{ width: `${(i / Math.max(1, steps.length - 1)) * 100}%` }} />
      </div>

      <div className="walk-panel" id={`${id}-panel`} aria-live={touched ? 'polite' : 'off'}>
        <div className={`walk-card ${s.kind}`} key={i}>
          <p className="mono walk-tag">
            Step {i + 1} of {steps.length} · {s.tag}
          </p>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
          {s.payload && <pre className="walk-payload">{s.payload}</pre>}
        </div>
      </div>

      <div className="walk-controls">
        <button type="button" className="btn btn-secondary" onClick={() => go(i - 1)} disabled={i === 0}>
          ← Previous
        </button>
        <button type="button" className="btn btn-secondary" onClick={togglePlay} aria-controls={`${id}-panel`}>
          {playing ? 'Pause' : i === steps.length - 1 ? 'Replay' : 'Play'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => go(i + 1)} disabled={i === steps.length - 1}>
          Next →
        </button>
      </div>
      {note && <p className="mono walk-note">{note}</p>}
    </div>
  )
}
