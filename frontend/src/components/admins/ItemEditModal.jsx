import { useEffect, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const TOKEN_KEY = 'authToken'

const EMPTY_FORM = { name_en: '', name_ar: '', platform_id: '', category_id: '', tags: [], size_gb: '', downloads: '', date_release: '', active: true }

function ItemEditModal({ show, onHide, onSaved, editing, apiBase, categoriesApi, title }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [platforms, setPlatforms] = useState([])
  const [categories, setCategories] = useState([])
  const [tagsInput, setTagsInput] = useState('')
  const [saving, setSaving] = useState(false)
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' }

  const loadDependencies = () => {
    fetch('/api/platforms?per_page=100', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setPlatforms(data.data ?? data ?? []))
      .catch(() => {})
    fetch(`${categoriesApi}?per_page=100`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setCategories(data.data ?? data ?? []))
      .catch(() => {})
  }

  useEffect(() => {
    if (!show) return
    setErrors({})
    loadDependencies()
    if (editing) {
      const tags = Array.isArray(editing.tags) ? editing.tags : []
      setForm({
        name_en: editing.name_en || '',
        name_ar: editing.name_ar || '',
        platform_id: editing.platform_id ?? '',
        category_id: editing.category_id ?? '',
        tags: [],
        size_gb: editing.size_gb ?? '',
        downloads: editing.downloads ?? '',
        date_release: editing.date_release ?? '',
        active: editing.active ?? true,
      })
      setTagsInput(tags.join(', '))
    } else {
      setForm(EMPTY_FORM)
      setTagsInput('')
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
      case 'platform_id':
        if (!value) return 'Platform is required'
        return null
      case 'category_id':
        if (!value) return 'Category is required'
        return null
      case 'size_gb':
        if (value === '' || value == null) return 'Size is required'
        if (isNaN(Number(value))) return 'Size must be a valid number'
        if (Number(value) < 0) return 'Size cannot be negative'
        return null
      case 'downloads':
        if (value !== '' && value != null && (isNaN(Number(value)) || Number(value) < 0)) return 'Downloads must be a non-negative number'
        return null
      default:
        return null
    }
  }

  const validate = () => {
    const errs = {}
    for (const field of ['name_en', 'name_ar', 'platform_id', 'category_id', 'size_gb']) {
      const err = validateField(field, form[field])
      if (err) errs[field] = err
    }
    const downloadsErr = validateField('downloads', form.downloads)
    if (downloadsErr) errs.downloads = downloadsErr
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleFieldChange = (name, value) => {
    setForm({ ...form, [name]: value })
    const err = validateField(name, value)
    if (!err) clearError(name)
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const url = editing ? `${apiBase}/${editing.id}` : apiBase
      const method = editing ? 'PUT' : 'POST'
      const body = {
        ...form,
        name_en: form.name_en.trim(),
        name_ar: form.name_ar.trim(),
        size_gb: form.size_gb === '' ? 0 : Number(form.size_gb),
        downloads: form.downloads === '' ? 0 : Number(form.downloads),
        tags: tagsInput
          ? tagsInput.split(',').map(t => t.trim()).filter(Boolean)
          : [],
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
      alert(e.message)
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
        <Form.Group className="mb-3">
          <Form.Label>Platform</Form.Label>
          <Form.Select value={form.platform_id} isInvalid={!!errors.platform_id} onChange={e => handleFieldChange('platform_id', e.target.value)}>
            <option value="">-- Select Platform --</option>
            {platforms.map(p => (
              <option key={p.id} value={p.id}>{p.name_en} {p.name_ar ? `(${p.name_ar})` : ''}</option>
            ))}
          </Form.Select>
          {errors.platform_id && <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>{errors.platform_id}</Form.Control.Feedback>}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select value={form.category_id} isInvalid={!!errors.category_id} onChange={e => handleFieldChange('category_id', e.target.value)}>
            <option value="">-- Select Category --</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name_en} {c.name_ar ? `(${c.name_ar})` : ''}</option>
            ))}
          </Form.Select>
          {errors.category_id && <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>{errors.category_id}</Form.Control.Feedback>}
        </Form.Group>
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
        <Form.Group className="mb-3">
          <Form.Label>Size (GB)</Form.Label>
          <Form.Control type="number" step="0.01" value={form.size_gb} isInvalid={!!errors.size_gb} onChange={e => handleFieldChange('size_gb', e.target.value)} />
          {errors.size_gb && <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>{errors.size_gb}</Form.Control.Feedback>}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Downloads</Form.Label>
          <Form.Control type="number" value={form.downloads} isInvalid={!!errors.downloads} onChange={e => handleFieldChange('downloads', e.target.value)} />
          {errors.downloads && <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>{errors.downloads}</Form.Control.Feedback>}
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Release Date</Form.Label>
          <Form.Control type="date" value={form.date_release} onChange={e => setForm({ ...form, date_release: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Check
            type="switch"
            label="Active"
            checked={form.active}
            onChange={e => setForm({ ...form, active: e.target.checked })}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Tags (comma separated)</Form.Label>
          <Form.Control
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
            placeholder="e.g. action, adventure, rpg"
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" size="sm" onClick={onHide}>Cancel</Button>
        <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ItemEditModal