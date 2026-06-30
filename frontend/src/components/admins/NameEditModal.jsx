import { useEffect, useState } from 'react'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const TOKEN_KEY = 'authToken'

function NameEditModal({ show, onHide, onSaved, editing, apiBase, title, withDescription }) {
  const [form, setForm] = useState({ name_en: '', name_ar: '', description_en: '', description_ar: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' }

  useEffect(() => {
    if (!show) return
    setErrors({})
    if (editing) {
      setForm({
        name_en: editing.name_en || '',
        name_ar: editing.name_ar || '',
        description_en: editing.description_en || '',
        description_ar: editing.description_ar || '',
      })
    } else {
      setForm({ name_en: '', name_ar: '', description_en: '', description_ar: '' })
    }
  }, [show, editing])

  const validate = () => {
    const errs = {}
    if (!form.name_en.trim()) errs.name_en = 'English name is required'
    if (!form.name_ar.trim()) errs.name_ar = 'Arabic name is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const url = editing ? `${apiBase}/${editing.id}` : apiBase
      const method = editing ? 'PUT' : 'POST'
      const body = { name_en: form.name_en.trim(), name_ar: form.name_ar.trim() }
      if (withDescription) {
        body.description_en = form.description_en
        body.description_ar = form.description_ar
      }
      const res = await fetch(url, { method, headers, body: JSON.stringify(body) })
      if (!res.ok) {
        if (res.status === 422) {
          const data = await res.json().catch(() => ({}))
          setErrors(data.errors || {})
          return
        }
        throw new Error('Save failed')
      }
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
        <Modal.Title>{editing ? 'Edit' : 'Create'} {title}</Modal.Title>
        <button className="modal-close-btn" onClick={onHide}><FontAwesomeIcon icon={faXmark} /></button>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
        <Form.Group className="mb-2">
          <Form.Label>Name (EN)</Form.Label>
          <Form.Control
            value={form.name_en}
            onChange={e => { setForm({ ...form, name_en: e.target.value }); setErrors(prev => { const n = { ...prev }; delete n.name_en; return n }) }}
            isInvalid={!!errors.name_en}
          />
          <Form.Control.Feedback type="invalid">{errors.name_en}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Name (AR)</Form.Label>
          <Form.Control
            value={form.name_ar}
            onChange={e => { setForm({ ...form, name_ar: e.target.value }); setErrors(prev => { const n = { ...prev }; delete n.name_ar; return n }) }}
            isInvalid={!!errors.name_ar}
          />
          <Form.Control.Feedback type="invalid">{errors.name_ar}</Form.Control.Feedback>
        </Form.Group>
        {withDescription && (
          <>
            <Form.Group className="mb-2">
              <Form.Label>Description (EN)</Form.Label>
              <Form.Control as="textarea" rows={3} value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description (AR)</Form.Label>
              <Form.Control as="textarea" rows={3} value={form.description_ar} onChange={e => setForm({ ...form, description_ar: e.target.value })} />
            </Form.Group>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" size="sm" onClick={onHide}>Cancel</Button>
        <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default NameEditModal
