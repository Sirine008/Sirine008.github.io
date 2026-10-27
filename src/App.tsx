import { Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import CaseStudy from './pages/CaseStudy'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
