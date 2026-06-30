import { useEffect, useState } from 'react'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const TOKEN_KEY = 'authToken'

const ROLES = [
  { value: 'client', label: 'client' },
  { value: 'admin', label: 'admin' },
]

const EMPTY_FORM = { name: '', email: '', password: '', role: 'client' }

function UserEditModal({ show, onHide, onSaved, editing }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' }

  useEffect(() => {
    if (!show) return
    if (editing) {
      setForm({
        name: editing.name || '',
        email: editing.email || '',
        password: '',
        role: editing.role || 'client',
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [show, editing])

  const handleSave = async () => {
    setSaving(true)
    try {
      const isEdit = !!editing
      const url = isEdit ? `/api/users/${editing.id}` : '/api/users'
      const method = isEdit ? 'PATCH' : 'POST'
      const body = { name: form.name, email: form.email, role: form.role }
      if (form.password) body.password = form.password
      const res = await fetch(url, { method, headers, body: JSON.stringify(body) })
      if (!res.ok) throw new Error('Save failed')
      onSaved()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>{editing ? 'Edit User' : 'Create User'}</Modal.Title>
        <button className="modal-close-btn" onClick={onHide}><FontAwesomeIcon icon={faXmark} /></button>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
        <Form.Group className="mb-2">
          <Form.Label>Name</Form.Label>
          <Form.Control value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Password {editing && <span className="text-muted">(leave blank to keep current)</span>}</Form.Label>
          <Form.Control type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder={editing ? 'Leave blank to keep current' : ''} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Role</Form.Label>
          <Form.Select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" size="sm" onClick={onHide}>Cancel</Button>
        <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default UserEditModal
