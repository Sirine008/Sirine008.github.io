import { useEffect, useRef, useState } from 'react'

/**
 * Plays an entrance animation once, when the element scrolls into view.
 *
 * - Server render / no JavaScript: state stays 'idle' → the final chart is shown, nothing is hidden.
 * - Reduced motion: stays 'idle' → no animation at all.
 * - Otherwise: 'armed' (hidden start state) until visible, then 'play'.
 */
export type RevealState = 'idle' | 'armed' | 'play'

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export function useReveal<T extends Element>(threshold = 0.15) {
  const ref = useRef<T>(null)
  const [state, setState] = useState<RevealState>('idle')

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState('play')
          io.disconnect()
        }
      },
      { threshold },
    )
    // Arm only if the element is not already on screen, so nothing visible ever disappears.
    const r = el.getBoundingClientRect()
    const onScreen = r.top < window.innerHeight && r.bottom > 0
    if (onScreen) setState('play')
    else {
      setState('armed')
      io.observe(el)
    }
    return () => io.disconnect()
  }, [threshold])

  return { ref, state, className: `reveal ${state}` }
}
