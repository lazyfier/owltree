import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Home } from '@/pages/Home'
import { Games } from '@/pages/Games'
import { Notes } from '@/pages/Notes'
import { Tools } from '@/pages/Tools'
import { Trends } from '@/pages/Trends'
import { MoonThrow } from '@/pages/MoonThrow'

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <ThemeToggle />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/moon-throw" element={<MoonThrow />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  )
}
