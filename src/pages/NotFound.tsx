import { Link } from 'react-router'
import { projects } from '../content/projects'

export default function NotFound() {
  return (
    <section className="wrap not-found" aria-labelledby="nf-title">
      <p className="kicker">Error 404</p>
      <h1 id="nf-title">
        No evidence <em>for this page.</em>
      </h1>
      <p className="muted">The address may be mistyped, or the page has moved. These are the pages that do exist:</p>
      <ul className="rows" style={{ maxWidth: 640 }}>
        <li>
          <Link to="/">Homepage</Link>
        </li>
        {projects.map((p) => (
          <li key={p.slug}>
            <span className="mono">Case study {p.number}</span>
            <Link to={`/work/${p.slug}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
