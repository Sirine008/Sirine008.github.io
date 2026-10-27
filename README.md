# Sirine Tiouajni — Portfolio

Personal portfolio of Sirine Tiouajni, software & data engineering student (AI, RAG, data engineering).

Design direction: **"Grounded"** — a citation-first technical publication. Main claims link to their evidence,
each case study states its decisions and its limits, and unfinished or synthetic-data work is labelled as such.

## Stack

- React 19 + TypeScript + Vite
- React Router (homepage, four case-study pages, 404)
- Pages pre-rendered to static HTML at build time (`scripts/prerender.mjs`), then hydrated in the browser
- Plain CSS with design tokens (`src/styles.css`), self-hosted fonts (Fraunces, Instrument Sans, IBM Plex Mono)
- No backend, no tracking, no secrets

## Run it locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Type-check, build, pre-render every page into `dist/` |
| `npm run preview` | Serve the built `dist/` folder locally |
| `npm run typecheck` | TypeScript check only |
| `npm run lint` | ESLint, including accessibility rules (jsx-a11y) |

## Editing content

| What | Where |
| --- | --- |
| Repository / demo links (Attijari dashboard, agricultural analytics…) | `src/content/links.ts` — replace `null` with the URL |
| Email, LinkedIn, GitHub, CV path | `src/content/links.ts` → `profile` |
| Projects, case studies, notebook entries | `src/content/projects.ts` |
| Hero evidence notes, path, expertise, page titles | `src/content/site.ts` |
| CV file | `public/cv/` (update `profile.cv` if you rename it) |
| Photo | `public/images/` (400 px and 779 px, JPEG + WebP, 4:5) |
| Project screenshots (real, from the repositories) | `public/images/work/` (JPEG + WebP) |
| Chart data — stock backtests | `public/data/stock-*.json` (from `reports/backtest_*.csv` of stock-market-prediction) |
| Chart data — stock metrics | `src/content/data-stock-metrics.json` (from `reports/metrics_*.json`) |
| Chart data — THNIYETNA | inline in `src/components/visuals/ThniyetnaVisuals.tsx` (from `reports/m2/*.csv`, `docs/RAG_EVALUATION.md`) |
| Per-project visuals (walkthroughs, charts, gallery, router) | `src/components/visuals/`, building blocks in `src/components/viz/` |

While a link is `null`, the site shows **"Link to be added"** instead of a broken button.

## Deploy on GitHub Pages (free) → `https://sirine008.github.io`

The workflow in `.github/workflows/deploy.yml` builds and publishes the site automatically.

1. On GitHub, create a new **public** repository named exactly **`Sirine008.github.io`** (empty, no README).
2. Push this folder to it:
   ```bash
   git init
   git add .
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/Sirine008/Sirine008.github.io.git
   git push -u origin main
   ```
3. In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Open the **Actions** tab, wait for "Deploy to GitHub Pages" to turn green (about 1–2 minutes; if it ran before step 3, click **Re-run all jobs**).
5. The site is live at `https://sirine008.github.io`. Every later push to `main` updates it.

The repository name matters: with any other name the site would live under a sub-path (`/portfolio/`) and the images, CV and pages would not load.

## Deploy on Vercel (free, alternative)

1. Create a new GitHub repository (for example `Sirine008/portfolio`) and push this folder to it:
   ```bash
   git init
   git add .
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/Sirine008/portfolio.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, click **Add New → Project**, and import the repository.
3. Set the **Project Name** to `sirine-tiouajni` (this gives `https://sirine-tiouajni.vercel.app`). Vercel detects Vite; `vercel.json` already sets the build command and output folder. Click **Deploy**.
4. If that name is taken and you get a different address, open **Settings → Environment Variables**, add
   `VITE_SITE_URL` = your real address (for example `https://sirine-tiouajni-portfolio.vercel.app`), then
   **Deployments → Redeploy**. This keeps the canonical URLs, sitemap and LinkedIn previews correct.

Every later `git push` to `main` redeploys automatically.

## Quality checks performed

- `npm run typecheck`, `npm run lint`, `npm run build` — pass.
- axe-core (WCAG 2.1 A/AA + best practices) on every page at 390 px and 1440 px — no violations.
- No horizontal overflow at 390, 768, 1280 and 1440 px.
- Keyboard: skip link, visible focus states, all actions reachable by Tab.
- Reduced-motion preference disables animations; pages are fully readable without JavaScript.
- Internal links, CV download, favicons, social image, sitemap and robots.txt verified.
