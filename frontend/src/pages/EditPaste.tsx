import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const LANGUAGES = ['text','python','javascript','typescript','html','css','bash','json','rust','go']

interface Paste {
  id: string
  title: string
  language: string
  content: string
  created_at: string
  updated_at: string
}

export default function EditPaste() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('text')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/pastes/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then((data: Paste) => {
        setTitle(data.title)
        setLanguage(data.language)
        setContent(data.content)
        setLoading(false)
      })
      .catch(() => { setError('Failed to load paste.'); setLoading(false) })
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/pastes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, language, content })
      })
      if (!res.ok) throw new Error('Failed to update')
      navigate(`/paste/${id}`)
    } catch {
      setError('Failed to save changes.')
      setSaving(false)
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
        <div className="page-header">
          <h1>EDIT PASTE</h1>
          <p>MODIFY DATA FRAGMENT // ID: {id}</p>
        </div>
        {loading && <div className="status-message">LOADING...</div>}
        {error && <div className="status-message error" style={{ marginBottom: '1rem' }}>{error}</div>}
        {!loading && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">Title</label>
              <input
                id="title"
                className="form-input"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter paste title..."
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="language">Language</label>
              <select
                id="language"
                className="form-select"
                value={language}
                onChange={e => setLanguage(e.target.value)}
              >
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="content">Content</label>
              <textarea
                id="content"
                className="form-textarea"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Paste your code or text here..."
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
              <Link to={`/paste/${id}`} className="btn">CANCEL</Link>
            </div>
          </form>
        )}
      </div>
    </>
  )
}
