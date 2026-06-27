import { useEffect, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const TOKEN_KEY = 'authToken'

const EMPTY_FORM = { name_en: '', name_ar: '', platform_id: '', category_id: '', tags: [], size_gb: '', downloads: '', date_release: '' }

function ItemEditModal({ show, onHide, onSaved, editing, apiBase, categoriesApi, title }) {
  const [form, setForm] = useState(EMPTY_FORM)
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
      })
      setTagsInput(tags.join(', '))
    } else {
      setForm(EMPTY_FORM)
      setTagsInput('')
    }
  }, [show, editing])

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = editing ? `${apiBase}/${editing.id}` : apiBase
      const method = editing ? 'PUT' : 'POST'
      const body = {
        ...form,
        size_gb: form.size_gb === '' ? 0 : Number(form.size_gb),
        downloads: form.downloads === '' ? 0 : Number(form.downloads),
        tags: tagsInput
          ? tagsInput.split(',').map(t => t.trim()).filter(Boolean)
          : [],
      }
      const res = await fetch(url, { method, headers, body: JSON.stringify(body) })
      if (!res.ok) throw new Error('Save failed')
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
        <Form.Group className="mb-2">
          <Form.Label>Platform</Form.Label>
          <Form.Select value={form.platform_id} onChange={e => setForm({ ...form, platform_id: e.target.value })}>
            <option value="">-- Select Platform --</option>
            {platforms.map(p => (
              <option key={p.id} value={p.id}>{p.name_en} {p.name_ar ? `(${p.name_ar})` : ''}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Category</Form.Label>
          <Form.Select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
            <option value="">-- Select Category --</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name_en} {c.name_ar ? `(${c.name_ar})` : ''}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Name (EN)</Form.Label>
          <Form.Control value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Name (AR)</Form.Label>
          <Form.Control value={form.name_ar} onChange={e => setForm({ ...form, name_ar: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Size (GB)</Form.Label>
          <Form.Control type="number" step="0.01" value={form.size_gb} onChange={e => setForm({ ...form, size_gb: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Downloads</Form.Label>
          <Form.Control type="number" value={form.downloads} onChange={e => setForm({ ...form, downloads: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Release Date</Form.Label>
          <Form.Control type="date" value={form.date_release} onChange={e => setForm({ ...form, date_release: e.target.value })} />
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