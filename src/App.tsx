import { HashRouter, Link, Navigate, Route, Routes } from 'react-router-dom'

function AppShell({ title, description }: { title: string; description: string }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-12 text-slate-100">
      <header className="glass-card">
        <p className="pixel-badge">Task 1 scaffold</p>
        <h1 className="mt-4 text-3xl font-bold">{title}</h1>
        <p className="mt-3 text-sm text-slate-300">{description}</p>
        <div className="pixel-divider" />
        <nav className="flex flex-wrap gap-3">
          <Link className="glass-button" to="/">
            Home placeholder
          </Link>
          <Link className="glass-button" to="/moon-throw">
            Moon throw placeholder
          </Link>
        </nav>
      </header>
    </main>
  )
}

function HomePlaceholder() {
  return <AppShell title="Owltree Portal Placeholder" description="Minimal HashRouter scaffold for the future portal route." />
}

function MoonThrowPlaceholder() {
  return <AppShell title="Moon Throw Placeholder" description="Minimal HashRouter scaffold for the future moon-throw route." />
}

export default function App() {
  return (
    <HashRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Routes>
        <Route path="/" element={<HomePlaceholder />} />
        <Route path="/moon-throw" element={<MoonThrowPlaceholder />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </HashRouter>
  )
}
