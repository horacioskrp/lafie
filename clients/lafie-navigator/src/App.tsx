import { useEffect, useState } from 'react'
import './App.css'

type Health = { status: string; phase: string }

function App() {
  const [api, setApi] = useState<string>('…')
  const [db, setDb] = useState<string>('…')

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json() as Promise<Health>)
      .then((h) => setApi(`ok (${h.phase})`))
      .catch(() => setApi('injoignable'))

    fetch('/api/health/db')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { database: string }) => setDb(d.database))
      .catch(() => setDb('injoignable'))
  }, [])

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: 640, margin: '0 auto' }}>
      <h1>Lafie</h1>
      <p>Plateforme HIS/EMR — front React + TypeScript (Vite).</p>

      <section style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '.05em', opacity: 0.7 }}>
          État du backend
        </h2>
        <ul style={{ lineHeight: 1.9 }}>
          <li>API (<code>/api/health</code>) : <strong>{api}</strong></li>
          <li>Base de données (<code>/api/health/db</code>) : <strong>{db}</strong></li>
        </ul>
      </section>
    </main>
  )
}

export default App
