import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

interface Paste {
  id: string
  title: string
  language: string
  content: string
  created_at: string
  updated_at: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

export default function ViewPaste() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [paste, setPaste] = useState<Paste | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch(`/api/pastes/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then(data => { setPaste(data); setLoading(false) })
      .catch(() => { setError('Paste not found or failed to load.'); setLoading(false) })
  }, [id])

  async function handleDelete() {
    if (!window.confirm('Delete this paste?')) return
    setDeleting(true)
    try {
      await fetch(`/api/pastes/${id}`, { method: 'DELETE' })
      navigate('/')
    } catch {
      setError('Failed to delete paste.')
      setDeleting(false)
    }
  }

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
        {loading && <div className="status-message">LOADING DATA...</div>}
        {error && <div className="status-message error">{error}</div>}
        {paste && (
          <div className="paste-view">
            <div className="paste-view-header">
              <div>
                <div className="lang-badge">{paste.language}</div>
                <div className="paste-view-title">{paste.title || '(untitled)'}</div>
              </div>
              <div className="paste-view-actions">
                <Link to={`/paste/${paste.id}/edit`} className="btn btn-sm">EDIT</Link>
                <button onClick={handleDelete} disabled={deleting} className="btn btn-sm btn-danger">
                  {deleting ? 'DELETING...' : 'DELETE'}
                </button>
              </div>
            </div>
            <div className="paste-meta-bar">
              <span>ID: {paste.id}</span>
              <span>CREATED: {formatDate(paste.created_at)}</span>
              <span>UPDATED: {formatDate(paste.updated_at)}</span>
            </div>
            <div className="paste-content-wrapper">
              <pre className="paste-content">{paste.content}</pre>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
