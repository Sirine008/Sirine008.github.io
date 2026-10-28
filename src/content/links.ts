/**
 * All external links live here.
 *
 * To add a repository or demo later, replace `null` with the full URL.
 * The site then shows the link automatically; while a value is `null`,
 * the site shows "Link to be added" instead of a broken button.
 */

export const profile = {
  name: 'Sirine Tiouajni',
  email: 'sirinetiouajni1@gmail.com',
  universityEmail: 'sirine.tiouajni@fsb.ucar.tn',
  github: 'https://github.com/Sirine008',
  githubHandle: 'Sirine008',
  linkedin: 'https://www.linkedin.com/in/sirine-tiouajni-a24400276/',
  cv: '/cv/Sirine_Tiouajni_CV_FR.pdf',
  cvLabel: 'CV · PDF (French)',
} as const

export const projectLinks: Record<string, { repo: string | null; demo: string | null }> = {
  'grounded-quality-assistant': {
    repo: 'https://github.com/Sirine008/dashboard-fpy-rag-assistant',
    demo: null,
  },
  thniyetna: { repo: 'https://github.com/Sirine008/thniyetna', demo: null },
  'faculty-administration': { repo: 'https://github.com/Sirine008/Faculty-Administration-System-', demo: null },
  'stock-forecasting': { repo: 'https://github.com/Sirine008/stock-market-prediction', demo: null },
  'attendance-dashboard': { repo: 'https://github.com/Sirine008/attendance-dashboard-ml', demo: null },
  // Notebook entries
  'agri-analytics': { repo: null, demo: null },
  'semantic-matching': { repo: 'https://github.com/Sirine008/NLP-Semantic-Matching', demo: null },
}
