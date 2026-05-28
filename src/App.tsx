import { lazy, Suspense } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ShortcutHelp } from '@/components/layout/ShortcutHelp'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts'
import { Home } from '@/pages/Home'

const Notes = lazy(() => import('@/pages/Notes').then(m => ({ default: m.Notes })))
const NoteDetail = lazy(() => import('@/pages/NoteDetail').then(m => ({ default: m.NoteDetail })))
const Projects = lazy(() => import('@/pages/Projects').then(m => ({ default: m.Projects })))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>Loading...</span>
    </div>
  )
}

function AppShell() {
  const { isShortcutHelpOpen, openShortcutHelp, closeShortcutHelp } = useGlobalShortcuts()

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/*" element={<NoteDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Suspense>
      <ShortcutHelp
        isOpen={isShortcutHelpOpen}
        onOpen={openShortcutHelp}
        onClose={closeShortcutHelp}
      />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <AppShell />
      </HashRouter>
    </ThemeProvider>
  )
}
