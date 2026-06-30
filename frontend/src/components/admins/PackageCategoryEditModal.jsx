import { useEffect, useState } from 'react'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const TOKEN_KEY = 'authToken'

function PackageCategoryEditModal({ show, onHide, onSaved, editing, apiBase }) {
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

  const clearError = (field) => setErrors(prev => { const n = { ...prev }; delete n[field]; return n })

  const validateField = (name, value) => {
    switch (name) {
      case 'name_en':
        if (!value || !value.trim()) return 'English name is required'
        if (value.length > 255) return 'English name cannot exceed 255 characters'
        return null
      case 'name_ar':
        if (!value || !value.trim()) return 'Arabic name is required'
        if (value.length > 255) return 'Arabic name cannot exceed 255 characters'
        return null
      default:
        return null
    }
  }

  const handleFieldChange = (name, value) => {
    setForm({ ...form, [name]: value })
    const err = validateField(name, value)
    if (!err) clearError(name)
  }

  const handleSave = async () => {
    const errs = {}
    const nameEnErr = validateField('name_en', form.name_en)
    const nameArErr = validateField('name_ar', form.name_ar)
    if (nameEnErr) errs.name_en = nameEnErr
    if (nameArErr) errs.name_ar = nameArErr
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSaving(true)
    try {
      const url = editing ? `${apiBase}/${editing.id}` : apiBase
      const method = editing ? 'PUT' : 'POST'
      const body = {
        name_en: form.name_en.trim(),
        name_ar: form.name_ar.trim(),
        description_en: form.description_en,
        description_ar: form.description_ar,
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
        <Modal.Title>{editing ? 'Edit' : 'Create'} Package Category</Modal.Title>
        <button className="modal-close-btn" onClick={onHide}><FontAwesomeIcon icon={faXmark} /></button>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
        <Form.Group className="mb-3">
          <Form.Label>Name (EN)</Form.Label>
          <Form.Control value={form.name_en} isInvalid={!!errors.name_en} onChange={e => handleFieldChange('name_en', e.target.value)} maxLength="255" />
          {errors.name_en && <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>{errors.name_en}</Form.Control.Feedback>}
          <small className="text-muted d-block mt-1">{form.name_en.length}/255</small>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Name (AR)</Form.Label>
          <Form.Control value={form.name_ar} isInvalid={!!errors.name_ar} onChange={e => handleFieldChange('name_ar', e.target.value)} maxLength="255" />
          {errors.name_ar && <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>{errors.name_ar}</Form.Control.Feedback>}
          <small className="text-muted d-block mt-1">{form.name_ar.length}/255</small>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Description (EN)</Form.Label>
          <Form.Control as="textarea" rows={3} value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Description (AR)</Form.Label>
          <Form.Control as="textarea" rows={3} value={form.description_ar} onChange={e => setForm({ ...form, description_ar: e.target.value })} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" size="sm" onClick={onHide}>Cancel</Button>
        <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default PackageCategoryEditModal
