import { useEffect, useState } from 'react'
import { Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrashCan, faRotate, faXmark } from '@fortawesome/free-solid-svg-icons'

const API_CUSTOMERS = '/api/customers'
const API_GOVERNORATES = '/api/governorates'
const TOKEN_KEY = 'authToken'

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  governorate_id: '',
  address: '',
  nearest_service_point: '',
}

function AdminCustomers() {
  const [items, setItems] = useState([])
  const [governorates, setGovernorates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' }

  useEffect(() => {
    fetch(API_GOVERNORATES)
      .then(r => r.json())
      .then(data => setGovernorates(data.data ?? data ?? []))
      .catch(() => {})
  }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_CUSTOMERS, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setItems(data.data ?? data ?? [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openEdit = (item) => {
    setEditing(item)
    setForm({
      name: item.name || '',
      phone: item.phone || '',
      email: item.email || '',
      governorate_id: item.governorate_id || '',
      address: item.address || '',
      nearest_service_point: item.nearest_service_point || '',
    })
    setShowModal(true)
  }

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      let res
      if (editing) {
        res = await fetch(`${API_CUSTOMERS}/${editing.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            ...form,
            governorate_id: form.governorate_id === '' ? undefined : Number(form.governorate_id),
          }),
        })
      } else {
        res = await fetch(API_CUSTOMERS, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            ...form,
            governorate_id: form.governorate_id === '' ? undefined : Number(form.governorate_id),
            password: form.password ?? 'password123'
          }),
        })
      }
      if (!res.ok) throw new Error('Save failed')
      setShowModal(false)
      setSuccess(editing ? 'Customer updated' : 'Customer created')
      load()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return
    try {
      const res = await fetch(`${API_CUSTOMERS}/${id}`, { method: 'DELETE', headers })
      if (!res.ok) throw new Error('Delete failed')
      load()
    } catch (e) { setError(e.message) }
  }

  const getGovernorateName = (item) => item.governorate?.name_en ?? '-'

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Customers</h4>
        <Button size="sm" variant="outline-secondary" onClick={load}><FontAwesomeIcon icon={faRotate} className="me-1" /> Refresh</Button>
      </div>
      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
      <div className="table-responsive">
        <Table striped hover className="bg-white rounded shadow-sm">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Governorate</th>
              <th>Address</th>
              <th>Registered</th>
              <th style={{ width: 100 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={8} className="text-center text-muted py-3">No customers found.</td></tr>
            )}
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.phone}</td>
                <td>{item.email || '-'}</td>
                <td>{getGovernorateName(item)}</td>
                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.address || '-'}</td>
                <td>{new Date(item.created_at).toLocaleDateString()}</td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-1" onClick={() => openEdit(item)}><FontAwesomeIcon icon={faPen} /></Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.id)}><FontAwesomeIcon icon={faTrashCan} /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header>
          <Modal.Title>Edit Customer</Modal.Title>
          <button className="modal-close-btn" onClick={() => setShowModal(false)}><FontAwesomeIcon icon={faXmark} /></button>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Name</Form.Label>
            <Form.Control value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Phone</Form.Label>
            <Form.Control value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Governorate</Form.Label>
            <Form.Select value={form.governorate_id} onChange={e => setForm({ ...form, governorate_id: e.target.value })}>
              <option value="">Select governorate...</option>
              {governorates.map(g => (
                <option key={g.id} value={g.id}>{g.name_en} / {g.name_ar}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Address</Form.Label>
            <Form.Control as="textarea" rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Nearest Service Point</Form.Label>
            <Form.Control value={form.nearest_service_point} onChange={e => setForm({ ...form, nearest_service_point: e.target.value })} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AdminCustomers
