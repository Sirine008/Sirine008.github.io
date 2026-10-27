import { useEffect, useRef, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { profile } from '../content/links'
import { metaFor } from '../content/site'

function Header() {
  // Section links always target the homepage; the router handles scrolling to the section.
  const to = (hash: string) => ({ pathname: '/', hash })

  return (
    <header className="site-header">
      <div className="wrap">
        <Link to="/" className="brand">
          S. Tiouajni — Portfolio
        </Link>
        <nav className="site-nav" aria-label="Primary">
          <ul>
            <li>
              <Link to={to('#work')}>Work</Link>
            </li>
            <li>
              <Link to={to('#notebook')}>Notebook</Link>
            </li>
            <li>
              <Link to={to('#about')}>About</Link>
            </li>
            <li>
              <Link to={to('#contact')}>Contact</Link>
            </li>
            <li>
              <a className="nav-cv" href={profile.cv} download>
                CV ↓<span className="visually-hidden"> (PDF, French)</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export function Contact() {
  return (
    <footer id="contact" className="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="contact-grid">
          <div className="contact-main">
            <p className="kicker">Contact · PFE 2027</p>
            <h2 id="contact-title" className="contact-title">
              Have an internship in AI or data engineering? Let’s talk.
            </h2>
            <a className="contact-email" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <a className="contact-email secondary" href={`mailto:${profile.universityEmail}`}>
              {profile.universityEmail} <span>(university)</span>
            </a>
          </div>
          <ul className="contact-links">
            <li>
              <a href={profile.cv} download>
                Download {profile.cvLabel} ↓
              </a>
            </li>
            <li>
              <a href={profile.github} rel="me noopener">
                GitHub · {profile.githubHandle} ↗
              </a>
            </li>
            <li>
              <a href={profile.linkedin} rel="me noopener">
                LinkedIn ↗
              </a>
            </li>
          </ul>
        </div>
        <div className="contact-foot">
          <span>Every claim on this site points to its evidence.</span>
          <span>© 2026 Sirine Tiouajni · Tunis, Tunisia</span>
        </div>
      </div>
    </footer>
  )
}

/** Keeps the document title in sync and handles scrolling on navigation. */
function RouteEffects() {
  const { pathname, hash } = useLocation()
  const firstRun = useRef(true)

  useEffect(() => {
    document.title = metaFor(pathname).title
  }, [pathname])

  useEffect(() => {
    // On the first load the browser already handles scroll position and focus.
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    // A new page starts at the top immediately (no smooth-scroll animation).
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    // Move focus to the main landmark so keyboard and screen-reader users start at the new page.
    const main = document.getElementById('main')
    main?.focus({ preventScroll: true })
  }, [pathname, hash])

  return null
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <RouteEffects />
      <Header />
      <main id="main" tabIndex={-1} style={{ outline: 'none' }}>
        {children}
      </main>
      <Contact />
    </>
  )
}
