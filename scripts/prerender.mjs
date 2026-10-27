// Pre-renders every route to static HTML after `vite build`.
// Each page gets its own <title>, description, canonical URL and social-preview tags,
// so links shared on LinkedIn or by email show the right preview and search engines see full content.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const serverEntry = join(root, 'dist-server', 'entry-server.js')
const SITE_URL = (process.env.VITE_SITE_URL || 'https://sirine008.github.io').replace(/\/$/, '')

const { render, routes } = await import(pathToFileURL(serverEntry).href)
const template = readFileSync(join(dist, 'index.html'), 'utf8')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Sirine Tiouajni',
  url: SITE_URL,
  image: `${SITE_URL}/images/sirine-779.jpg`,
  jobTitle: 'Software Engineering & Data Engineering student',
  email: 'mailto:sirinetiouajni1@gmail.com',
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Faculté des Sciences de Bizerte, Université de Carthage' },
  address: { '@type': 'PostalAddress', addressLocality: 'Tunis', addressCountry: 'TN' },
  sameAs: ['https://github.com/Sirine008', 'https://www.linkedin.com/in/sirine-tiouajni-a24400276/'],
  knowsAbout: ['Large language models', 'Retrieval-augmented generation', 'Multi-agent systems', 'Data engineering', 'ETL', 'PostgreSQL', 'Machine learning', 'Computer vision'],
}

function head(route) {
  const isNotFound = route.path === '/404'
  const url = `${SITE_URL}${route.path === '/' ? '/' : route.path}`
  const tags = [
    `<title>${esc(route.title)}</title>`,
    `<meta name="description" content="${esc(route.description)}" />`,
    isNotFound ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${route.path === '/' ? 'profile' : 'article'}" />`,
    `<meta property="og:site_name" content="Sirine Tiouajni" />`,
    `<meta property="og:title" content="${esc(route.title)}" />`,
    `<meta property="og:description" content="${esc(route.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE_URL}/og-image.png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Sirine Tiouajni — AI &amp; Data Engineering portfolio" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ]
  if (route.path === '/') {
    tags.push(`<script type="application/ld+json">${JSON.stringify(personJsonLd).replace(/</g, '\\u003c')}</script>`)
  }
  return tags.join('\n    ')
}

for (const route of routes) {
  const html = template.replace('<!--app-head-->', head(route)).replace('<!--app-html-->', render(route.path))
  const file = route.path === '/' ? join(dist, 'index.html') : route.path === '/404' ? join(dist, '404.html') : join(dist, route.path, 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
  console.log(`  prerendered ${route.path.padEnd(42)} → ${file.replace(root + '/', '')}`)
}

const pages = routes.filter((r) => r.path !== '/404')
const today = new Date().toISOString().slice(0, 10)
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((r) => `  <url><loc>${SITE_URL}${r.path}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`,
)
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)

rmSync(join(root, 'dist-server'), { recursive: true, force: true })
console.log(`  sitemap.xml and robots.txt written for ${SITE_URL}`)
