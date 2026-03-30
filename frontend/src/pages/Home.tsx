import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface PasteSummary {
  id: string
  title: string
  language: string
  created_at: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

export default function Home() {
  const [pastes, setPastes] = useState<PasteSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/pastes')
      .then(r => r.json())
      .then(data => { setPastes(data); setLoading(false) })
      .catch(() => { setError('Failed to load pastes'); setLoading(false) })
  }, [])

  return (
    <>
      <div className="top-accent-bar" />
      <nav>
        <Link to="/" className="nav-brand">PASTER <span>// TERMINAL v1.0</span></Link>
        <div className="nav-links">
          <Link to="/">INDEX</Link>
          <Link to="/new">NEW PASTE</Link>
        </div>
      </nav>
      <div className="page-container">
        <div className="page-header">
          <h1>PASTE INDEX</h1>
          <p>ALL STORED DATA FRAGMENTS // {pastes.length} RECORD(S)</p>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/new" className="btn btn-primary">+ NEW PASTE</Link>
        </div>
        {loading && <div className="status-message">LOADING DATA...</div>}
        {error && <div className="status-message error">{error}</div>}
        {!loading && !error && pastes.length === 0 && (
          <div className="empty-state">
            <p>Paste repository is empty. Create the first entry.</p>
            <Link to="/new" className="btn">CREATE PASTE</Link>
          </div>
        )}
        {!loading && !error && pastes.length > 0 && (
          <div className="paste-list">
            {pastes.map(p => (
              <Link key={p.id} to={`/paste/${p.id}`} className="paste-card">
                <div className="lang-badge">{p.language}</div>
                <div className="paste-card-title">{p.title || '(untitled)'}</div>
                <div className="paste-card-meta">
                  <span>ID: {p.id.slice(0, 8)}...</span>
                  <span>{formatDate(p.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
