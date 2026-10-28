import { Link } from 'react-router'
import { profile } from '../content/links'
import { notebook, projects } from '../content/projects'
import { evidence, expertise, path } from '../content/site'

function Cite({ n }: { n: number }) {
  return (
    <a className="cite" href={`#evidence-${n}`} aria-label={`Evidence ${n}`}>
      [{n}]
    </a>
  )
}

function Hero() {
  return (
    <section className="hero wrap" aria-labelledby="hero-name">
      <div className="hero-text">
        <p className="kicker">Software Engineering &amp; Data Engineering student · Tunis, Tunisia</p>
        <h1 id="hero-name" className="hero-name">
          Sirine <span className="second">Tiouajni</span>
        </h1>
        <p className="hero-headline">
          I build AI systems that stay grounded in real data.
          <Cite n={1} />
        </p>
        <p className="hero-value">
          LLM and RAG assistants, multi-agent systems, ETL pipelines and computer vision — built so that the language model
          formulates the answer, but the database or the document decides what is true.
          <Cite n={2} /> I am looking for a final-year engineering internship (PFE) for 2027.
          <Cite n={3} />
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#work">
            Read the selected work ↓
          </a>
          <a className="btn btn-secondary" href={profile.cv} download>
            Download {profile.cvLabel}
          </a>
          <span className="links">
            <a className="text-link" href={profile.github} rel="me noopener">
              GitHub
            </a>
            <a className="text-link" href={profile.linkedin} rel="me noopener">
              LinkedIn
            </a>
            <a className="text-link" href={`mailto:${profile.email}`}>
              Email
            </a>
          </span>
        </div>
      </div>
      <figure className="portrait">
        <picture>
          <source type="image/webp" srcSet="/images/sirine-400.webp 400w, /images/sirine-779.webp 779w" sizes="(max-width: 700px) 46vw, 420px" />
          <img
            src="/images/sirine-779.jpg"
            srcSet="/images/sirine-400.jpg 400w, /images/sirine-779.jpg 779w"
            sizes="(max-width: 700px) 46vw, 420px"
            width={779}
            height={973}
            alt="Portrait of Sirine Tiouajni, smiling, against a warm ochre background"
            fetchPriority="high"
          />
        </picture>
        <figcaption>Fig. 0 — Sirine Tiouajni. Engineering cycle, Faculté des Sciences de Bizerte, Université de Carthage.</figcaption>
      </figure>
    </section>
  )
}

function Evidence() {
  return (
    <section className="wrap" aria-labelledby="evidence-title">
      <h2 id="evidence-title" className="visually-hidden">
        Evidence for the claims above
      </h2>
      <ol className="evidence">
        {evidence.map((e) => (
          <li id={`evidence-${e.id}`} key={e.id}>
            <span className="mono">
              [{e.id}] {e.label}
            </span>
            <span>{e.text}</span>
            {e.href.startsWith('/') ? (
              <Link className="mono" to={e.href}>
                → {e.linkLabel}
              </Link>
            ) : (
              <a className="mono" href={e.href}>
                → {e.linkLabel}
              </a>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}

function SelectedWork() {
  return (
    <section id="work" className="section wrap" aria-labelledby="work-title">
      <div className="section-head">
        <h2 id="work-title" className="section-title">
          Selected work
        </h2>
        <p className="mono muted">Five case studies · each with its decisions and its limits</p>
      </div>
      <ol className="work-list">
        {projects.map((p) => (
          <li className="work-item" key={p.slug}>
            <span className="work-num" aria-hidden="true">
              {p.number}
            </span>
            <div className="work-main">
              <p className="meta-line mono">
                <span>{p.context}</span>
                {p.status && <span className="status">{p.status}</span>}
                {!p.repo && <span className="status pending">Repository link to be added</span>}
              </p>
              <h3 className="work-title">
                <Link to={`/work/${p.slug}`}>
                  <span className="visually-hidden">Case study {p.number}: </span>
                  {p.title}
                </Link>
              </h3>
              <p className="work-summary">{p.summary}</p>
              <p className="mono">{p.stackLine}</p>
            </div>
            <div className="work-side">
              <p className="pull">
                <span className="visually-hidden">Key decision: </span>
                {p.decision}
              </p>
              <Link className="text-link" to={`/work/${p.slug}`} aria-hidden="true" tabIndex={-1} style={{ paddingInline: 0, fontWeight: 600 }}>
                Read case study →
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Notebook() {
  return (
    <section id="notebook" className="section wrap split" aria-labelledby="notebook-title">
      <div className="aside">
        <h2 id="notebook-title" className="section-title small">
          Notebook
        </h2>
        <p className="muted">
          Smaller and earlier work, each labelled with what it is — an internship project, an academic project, an experiment
          on synthetic data.
        </p>
      </div>
      <div className="main">
        <ul className="notebook">
          {notebook.map((n) => (
            <li key={n.slug}>
              <span className="year mono">{n.year}</span>
              <div className="entry">
                <strong>{n.title}</strong>
                <p>{n.detail}</p>
              </div>
              <span className="labels">
                <span className="status">{n.label}</span>
                {n.repo ? (
                  <a className="mono text-link" href={n.repo}>
                    Code ↗<span className="visually-hidden"> for {n.title}</span>
                  </a>
                ) : (
                  <span className="status pending">Link to be added</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="section wrap split" aria-label="Path and expertise">
      <div className="aside" style={{ flexBasis: '340px' }}>
        <h2 className="section-title small">Path</h2>
        <ol className="rows">
          {path.map((p) => (
            <li key={p.when}>
              <span className="mono">{p.when}</span>
              {p.what}
            </li>
          ))}
        </ol>
      </div>
      <div className="main" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 className="section-title small">Expertise, by where it was used</h2>
        <dl className="expertise">
          {expertise.map((e) => (
            <div key={e.domain}>
              <dt>{e.domain}</dt>
              <dd>
                {e.items}
                {e.usedIn && <span className="mono">used in {e.usedIn}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Evidence />
      <SelectedWork />
      <Notebook />
      <About />
    </>
  )
}
