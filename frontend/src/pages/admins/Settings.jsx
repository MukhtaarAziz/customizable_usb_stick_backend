import { useEffect, useState } from 'react'
import { Card, Form, Button, Spinner, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { useAdminTheme } from '../../contexts/AdminThemeContext'

const API_SETTINGS = '/api/admin/settings'
const TOKEN_KEY = 'authToken'
const DEFAULT_FORM = { language: 'en', pagination_per_page: 15, darkmode: false }

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
]

const PER_PAGE_OPTIONS = [10, 15, 25, 50, 100]

function AdminSettings() {
  const { setDarkMode } = useAdminTheme()
  const [form, setForm] = useState(DEFAULT_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' }

  const raw = localStorage.getItem('user')
  const admin = raw ? JSON.parse(raw) : null

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(API_SETTINGS, { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) {
          const json = await res.json()
          const s = json.data ?? json
          setForm({
            language: s.language || DEFAULT_FORM.language,
            pagination_per_page: s.pagination_per_page ?? DEFAULT_FORM.pagination_per_page,
            darkmode: s.darkmode ?? DEFAULT_FORM.darkmode,
          })
        }
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true); setSuccess(false); setError(null)
    try {
      const res = await fetch(API_SETTINGS, { method: 'PUT', headers, body: JSON.stringify(form) })
      if (!res.ok) throw new Error('Save failed')
      const json = await res.json()
      const s = json.data ?? json
      setForm({
        language: s.language || DEFAULT_FORM.language,
        pagination_per_page: s.pagination_per_page ?? DEFAULT_FORM.pagination_per_page,
        darkmode: s.darkmode ?? DEFAULT_FORM.darkmode,
      })
      localStorage.setItem('adminSettings', JSON.stringify(s))
      setDarkMode(s.darkmode ?? false)
      setSuccess(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>

  return (
    <>
      <h4 className="fw-bold mb-1">Settings</h4>
      <p className="text-muted mb-4">
        Personal preferences for <strong>{admin?.name || 'Admin'}</strong>
        {admin?.email ? <span className="ms-2 text-secondary">({admin.email})</span> : null}
      </p>
      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess(false)}>Settings saved.</Alert>}
      <Card className="border-0 shadow-sm" style={{ maxWidth: 600 }}>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Language</Form.Label>
            <Form.Select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}>
              {LANGUAGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Pagination Per Page</Form.Label>
            <Form.Select value={form.pagination_per_page} onChange={e => setForm({ ...form, pagination_per_page: Number(e.target.value) })}>
              {PER_PAGE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="darkmode-switch"
              label="Dark Mode"
              checked={form.darkmode}
              onChange={e => setForm({ ...form, darkmode: e.target.checked })}
            />
          </Form.Group>
          <Button onClick={handleSave} disabled={saving}>
            <FontAwesomeIcon icon={faSave} className="me-1" /> {saving ? 'Saving...' : 'Save'}
          </Button>
        </Card.Body>
      </Card>
    </>
  )
}

export default AdminSettings
