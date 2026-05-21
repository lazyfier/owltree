import { lazy, Suspense } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Home } from '@/pages/Home'

const Games = lazy(() => import('@/pages/Games').then(m => ({ default: m.Games })))
const Notes = lazy(() => import('@/pages/Notes').then(m => ({ default: m.Notes })))
const Projects = lazy(() => import('@/pages/Projects').then(m => ({ default: m.Projects })))
const Tools = lazy(() => import('@/pages/Tools').then(m => ({ default: m.Tools })))
const Trends = lazy(() => import('@/pages/Trends').then(m => ({ default: m.Trends })))
const MoonThrow = lazy(() => import('@/pages/MoonThrow').then(m => ({ default: m.MoonThrow })))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>Loading...</span>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<Games />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/moon-throw" element={<MoonThrow />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </ThemeProvider>
  )
}
