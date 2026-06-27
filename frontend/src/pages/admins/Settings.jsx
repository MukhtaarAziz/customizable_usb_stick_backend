import { useEffect, useState } from 'react'
import { Card, Form, Button, Spinner, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'

const API_SETTINGS = '/api/admin/settings'
const TOKEN_KEY = 'authToken'
const METHODS = { PUT: 'PUT' }
const DEFAULT_FORM = { locale: 'en', theme: 'light', min_password_length: 8 }

const LOCALE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
]

const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

function AdminSettings() {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(API_SETTINGS, { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) {
          const data = await res.json()
          const s = data.data ?? data
          setForm({
            locale: s.locale || DEFAULT_FORM.locale,
            theme: s.theme || DEFAULT_FORM.theme,
            min_password_length: s.min_password_length || DEFAULT_FORM.min_password_length,
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
    setSaving(true); setSuccess(false)
    try {
      const res = await fetch(API_SETTINGS, { method: METHODS.PUT, headers, body: JSON.stringify(form) })
      if (!res.ok) throw new Error('Save failed')
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
      <h4 className="fw-bold mb-4">Settings</h4>
      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess(false)}>Settings saved.</Alert>}
      <Card className="border-0 shadow-sm" style={{ maxWidth: 600 }}>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Default Locale</Form.Label>
            <Form.Select value={form.locale} onChange={e => setForm({ ...form, locale: e.target.value })}>
              {LOCALE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Default Theme</Form.Label>
            <Form.Select value={form.theme} onChange={e => setForm({ ...form, theme: e.target.value })}>
              {THEME_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Min Password Length</Form.Label>
            <Form.Control type="number" value={form.min_password_length} onChange={e => setForm({ ...form, min_password_length: Number(e.target.value) })} />
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