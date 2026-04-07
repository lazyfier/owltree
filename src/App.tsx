import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Home } from '@/pages/Home'
import { MoonThrow } from '@/pages/MoonThrow'

export default function App() {
  return (
    <HashRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/moon-throw" element={<MoonThrow />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </HashRouter>
  )
}
