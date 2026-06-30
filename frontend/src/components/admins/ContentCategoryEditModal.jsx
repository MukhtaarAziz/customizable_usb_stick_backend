import { useEffect, useState } from 'react'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const TOKEN_KEY = 'authToken'

function ContentCategoryEditModal({ show, onHide, onSaved, editing, apiBase, categoryTypes }) {
  const [form, setForm] = useState({ category_type_id: '', name_en: '', name_ar: '', description_en: '', description_ar: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState(null)
  const [saving, setSaving] = useState(false)
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' }

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'category_type_id':
        if (!value) return 'Category type is required'
        return null
      case 'name_en':
        if (!value || !value.trim()) return 'English name is required'
        if (value.length > 255) return 'English name cannot exceed 255 characters'
        return null
      case 'name_ar':
        if (!value || !value.trim()) return 'Arabic name is required'
        if (value.length > 255) return 'Arabic name cannot exceed 255 characters'
        return null
      case 'description_en':
        // Optional field, just check length if provided
        if (value && value.length > 5000) return 'English description cannot exceed 5000 characters'
        return null
      case 'description_ar':
        // Optional field, just check length if provided
        if (value && value.length > 5000) return 'Arabic description cannot exceed 5000 characters'
        return null
      default:
        return null
    }
  }

  const validateForm = () => {
    const errors = {}
    errors.category_type_id = validateField('category_type_id', form.category_type_id)
    errors.name_en = validateField('name_en', form.name_en)
    errors.name_ar = validateField('name_ar', form.name_ar)
    errors.description_en = validateField('description_en', form.description_en)
    errors.description_ar = validateField('description_ar', form.description_ar)
    
    // Remove null errors
    Object.keys(errors).forEach(key => !errors[key] && delete errors[key])
    return errors
  }

  const handleFieldChange = (name, value) => {
    setForm({ ...form, [name]: value })
    // Clear error for this field if it's being fixed
    const error = validateField(name, value)
    if (!error && fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: null })
    }
  }

  useEffect(() => {
    if (!show) return
    if (editing) {
      setForm({
        category_type_id: editing.category_type_id ?? editing.category_type?.id ?? '',
        name_en: editing.name_en || '',
        name_ar: editing.name_ar || '',
        description_en: editing.description_en || '',
        description_ar: editing.description_ar || '',
      })
    } else {
      setForm({ category_type_id: '', name_en: '', name_ar: '', description_en: '', description_ar: '' })
    }
    setFieldErrors({})
    setServerError(null)
  }, [show, editing])

  const handleSave = async () => {
    const errors = validateForm()
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setSaving(true)
    setServerError(null)
    try {
      const url = editing ? `${apiBase}/${editing.id}` : apiBase
      const method = editing ? 'PUT' : 'POST'
      const body = {
        category_type_id: form.category_type_id,
        name_en: form.name_en,
        name_ar: form.name_ar,
        description_en: form.description_en,
        description_ar: form.description_ar,
      }
      const res = await fetch(url, { method, headers, body: JSON.stringify(body) })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        if (errData.errors && typeof errData.errors === 'object') {
          // Map server validation errors to field errors
          const mappedErrors = {}
          Object.keys(errData.errors).forEach(key => {
            mappedErrors[key] = errData.errors[key][0] || 'Validation error'
          })
          setFieldErrors(mappedErrors)
        } else {
          setServerError(errData.message || 'Save failed')
        }
        return
      }
      onSaved()
    } catch (e) {
      setServerError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>{editing ? 'Edit' : 'Create'} Content Category</Modal.Title>
        <button className="modal-close-btn" onClick={onHide}><FontAwesomeIcon icon={faXmark} /></button>
      </Modal.Header>
      <Modal.Body>
        {serverError && <Alert variant="danger" dismissible onClose={() => setServerError(null)}>{serverError}</Alert>}
        <Form.Group className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Select 
            isInvalid={!!fieldErrors.category_type_id}
            value={form.category_type_id} 
            onChange={e => handleFieldChange('category_type_id', e.target.value)}
          >
            <option value="">Select type...</option>
            {categoryTypes.map(ct => (
              <option key={ct.id} value={ct.id}>{ct.name_en} / {ct.name_ar}</option>
            ))}
          </Form.Select>
          {fieldErrors.category_type_id && (
            <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
              {fieldErrors.category_type_id}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Name (EN)</Form.Label>
          <Form.Control 
            isInvalid={!!fieldErrors.name_en}
            value={form.name_en} 
            onChange={e => handleFieldChange('name_en', e.target.value)}
            maxLength="255"
          />
          {fieldErrors.name_en && (
            <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
              {fieldErrors.name_en}
            </Form.Control.Feedback>
          )}
          <small className="text-muted d-block mt-1">{form.name_en.length}/255</small>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Name (AR)</Form.Label>
          <Form.Control 
            isInvalid={!!fieldErrors.name_ar}
            value={form.name_ar} 
            onChange={e => handleFieldChange('name_ar', e.target.value)}
            maxLength="255"
          />
          {fieldErrors.name_ar && (
            <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
              {fieldErrors.name_ar}
            </Form.Control.Feedback>
          )}
          <small className="text-muted d-block mt-1">{form.name_ar.length}/255</small>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description (EN)</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={2} 
            isInvalid={!!fieldErrors.description_en}
            value={form.description_en} 
            onChange={e => handleFieldChange('description_en', e.target.value)}
            maxLength="5000"
          />
          {fieldErrors.description_en && (
            <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
              {fieldErrors.description_en}
            </Form.Control.Feedback>
          )}
          <small className="text-muted d-block mt-1">{form.description_en.length}/5000</small>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description (AR)</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={2} 
            isInvalid={!!fieldErrors.description_ar}
            value={form.description_ar} 
            onChange={e => handleFieldChange('description_ar', e.target.value)}
            maxLength="5000"
          />
          {fieldErrors.description_ar && (
            <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
              {fieldErrors.description_ar}
            </Form.Control.Feedback>
          )}
          <small className="text-muted d-block mt-1">{form.description_ar.length}/5000</small>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" size="sm" onClick={onHide}>Cancel</Button>
        <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ContentCategoryEditModal
