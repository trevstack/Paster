import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const LANGUAGES = ['text','python','javascript','typescript','html','css','bash','json','rust','go']

export default function CreatePaste() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('text')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, language, content })
      })
      if (!res.ok) throw new Error('Failed to create paste')
      const data = await res.json()
      navigate(`/paste/${data.id}`)
    } catch {
      setError('Failed to save paste. Check connection.')
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
          <h1>NEW PASTE</h1>
          <p>ENTER DATA FRAGMENT FOR STORAGE</p>
        </div>
        {error && <div className="status-message error" style={{ marginBottom: '1rem' }}>{error}</div>}
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
              {saving ? 'SAVING...' : 'SAVE PASTE'}
            </button>
            <Link to="/" className="btn">CANCEL</Link>
          </div>
        </form>
      </div>
    </>
  )
}
