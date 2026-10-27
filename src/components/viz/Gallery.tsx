import { useState } from 'react'

export interface Shot {
  /** Path without extension; `.webp` and `.jpg` exist in /public. */
  src: string
  width: number
  height: number
  title: string
  alt: string
  caption: string
}

/** Real screenshots: one large view and a row of labelled thumbnails (buttons) to switch between them. */
export function Gallery({ shots, label }: { shots: Shot[]; label: string }) {
  const [i, setI] = useState(0)
  const s = shots[i]
  return (
    <div className="gallery">
      <figure className="gallery-main">
        <picture key={s.src}>
          <source type="image/webp" srcSet={`${s.src}.webp`} />
          <img src={`${s.src}.jpg`} width={s.width} height={s.height} alt={s.alt} loading="lazy" decoding="async" />
        </picture>
        <figcaption>
          <strong>{s.title}</strong>
          <span>{s.caption}</span>
        </figcaption>
      </figure>
      <ul className="gallery-thumbs" aria-label={label}>
        {shots.map((sh, n) => (
          <li key={sh.src}>
            <button type="button" aria-pressed={n === i} onClick={() => setI(n)}>
              <picture>
                <source type="image/webp" srcSet={`${sh.src}.webp`} />
                <img src={`${sh.src}.jpg`} alt="" width={sh.width} height={sh.height} loading="lazy" decoding="async" />
              </picture>
              <span>{sh.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
