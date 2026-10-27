import { Link, useParams } from 'react-router'
import { Diagram } from '../components/Diagram'
import { ProjectVisuals } from '../components/visuals/ProjectVisuals'
import { projects } from '../content/projects'
import NotFound from './NotFound'

function SourceLink({ href, label }: { href: string; label: string }) {
  const external = href.startsWith('http')
  return (
    <a href={href} {...(external ? { rel: 'noopener' } : { download: href.endsWith('.pdf') || undefined })}>
      {label}
      {external ? ' ↗' : ''}
    </a>
  )
}

export default function CaseStudy() {
  const { slug } = useParams()
  const i = projects.findIndex((p) => p.slug === slug)
  if (i === -1) return <NotFound />

  const p = projects[i]
  const c = p.caseStudy
  const prev = projects[i - 1]
  const next = projects[i + 1]

  return (
    <article className="wrap" aria-labelledby="case-title">
      <header className="case-head">
        <div className="title-block">
          <p className="kicker">
            {p.number} · {p.context}
          </p>
          <h1 id="case-title" className="case-title">
            {p.title}
          </h1>
          {p.status && (
            <p>
              <span className="status">{p.status}</span>
            </p>
          )}
        </div>
        <dl className="facts">
          {c.facts.map((f) => (
            <div key={f.term}>
              <dt>{f.term}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
          <div>
            <dt>Code</dt>
            <dd>
              {p.repo ? <SourceLink href={p.repo} label="Repository" /> : <span className="status pending">Link to be added</span>}
            </dd>
          </div>
          {p.demo && (
            <div>
              <dt>Demo</dt>
              <dd>
                <SourceLink href={p.demo} label="Live demo" />
              </dd>
            </div>
          )}
        </dl>
      </header>

      <section className="split section" aria-label="Problem and implementation">
        <div className="prose">
          <h2>The problem</h2>
          {c.problem.map((t) => (
            <p key={t}>{t}</p>
          ))}
          <h2>What I built</h2>
          <ul>
            {c.built.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        {c.notice && (
          <aside className="note" aria-label="Confidentiality note">
            <span className="mono">Note</span>
            <span>{c.notice}</span>
          </aside>
        )}
      </section>

      <Diagram data={c.diagram} id={`diagram-${p.slug}`} />

      {c.screenshot && (
        <figure className={`shot${c.screenshot.narrow ? ' narrow' : ''}`}>
          <picture>
            <source type="image/webp" srcSet={`${c.screenshot.src}.webp`} />
            <img
              src={`${c.screenshot.src}.jpg`}
              width={c.screenshot.width}
              height={c.screenshot.height}
              alt={c.screenshot.alt}
              loading="lazy"
              decoding="async"
            />
          </picture>
          <figcaption className="mono">{c.screenshot.caption}</figcaption>
        </figure>
      )}

      <ProjectVisuals slug={p.slug} />

      <section className="section" aria-labelledby="decisions-title">
        <h2 id="decisions-title" className="section-title small" style={{ marginBottom: 20 }}>
          Decisions
        </h2>
        <ol className="decisions">
          {c.decisions.map((d, n) => (
            <li key={d.title}>
              <span className="mono" aria-hidden="true">
                D{n + 1}
              </span>
              <h3>{d.title}</h3>
              <p>{d.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {c.results && (
        <section className="section" aria-labelledby="results-title">
          <h2 id="results-title" className="section-title small" style={{ marginBottom: 12 }}>
            Results so far
          </h2>
          <p className="muted" style={{ marginBottom: 12 }}>
            {c.results.intro}
          </p>
          {c.results.rows && (
            <table className="results">
              <caption className="visually-hidden">Test-set metrics</caption>
              <thead className="visually-hidden">
                <tr>
                  <th scope="col">Metric</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                {c.results.rows.map((r) => (
                  <tr key={r.label}>
                    <th scope="row">{r.label}</th>
                    <td>{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {c.results.note && (
            <p className="mono muted" style={{ marginTop: 12 }}>
              {c.results.note}
            </p>
          )}
        </section>
      )}

      <section className="section split" aria-label="Limits, stack and sources">
        <div className="limits">
          <h2 className="box-title">Limits, stated plainly</h2>
          <ul>
            {c.limits.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
        <div className="stack-box">
          <h2 className="box-title">Stack</h2>
          <ul className="stack-list">
            {c.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <h2 className="box-title" style={{ marginTop: 16 }}>
            Sources
          </h2>
          <ol className="sources">
            {c.sources.map((s) => (
              <li key={s.id}>
                <span className="mono">[{s.id}]</span>
                <span>
                  {s.text} {s.href && s.linkLabel && <SourceLink href={s.href} label={s.linkLabel} />}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <nav className="case-nav" aria-label="Other case studies">
        {prev ? (
          <Link to={`/work/${prev.slug}`}>
            <span className="mono">← Previous · {prev.number}</span>
            <strong>{prev.title}</strong>
          </Link>
        ) : (
          <Link to={{ pathname: '/', hash: '#work' }}>
            <span className="mono">← Back</span>
            <strong>All selected work</strong>
          </Link>
        )}
        {next ? (
          <Link className="next" to={`/work/${next.slug}`}>
            <span className="mono">Next · {next.number} →</span>
            <strong>{next.title}</strong>
          </Link>
        ) : (
          <Link className="next" to={{ pathname: '/', hash: '#work' }}>
            <span className="mono">Back →</span>
            <strong>All selected work</strong>
          </Link>
        )}
      </nav>
    </article>
  )
}
