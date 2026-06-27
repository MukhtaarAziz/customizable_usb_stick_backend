import { useEffect, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const TOKEN_KEY = 'authToken'

function NameEditModal({ show, onHide, onSaved, editing, apiBase, title, withDescription }) {
  const [form, setForm] = useState({ name_en: '', name_ar: '', description_en: '', description_ar: '' })
  const [saving, setSaving] = useState(false)
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' }

  useEffect(() => {
    if (!show) return
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

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = editing ? `${apiBase}/${editing.id}` : apiBase
      const method = editing ? 'PUT' : 'POST'
      const body = { name_en: form.name_en, name_ar: form.name_ar }
      if (withDescription) {
        body.description_en = form.description_en
        body.description_ar = form.description_ar
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
          <Form.Label>Name (EN)</Form.Label>
          <Form.Control value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Name (AR)</Form.Label>
          <Form.Control value={form.name_ar} onChange={e => setForm({ ...form, name_ar: e.target.value })} />
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
