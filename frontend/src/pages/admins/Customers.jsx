import { useEffect, useState } from 'react'
import { Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faTrashCan, faRotate, faXmark } from '@fortawesome/free-solid-svg-icons'
import ConfirmDeleteModal from '../../components/admins/ConfirmDeleteModal'
import Pagination from '../../components/admins/Pagination'

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
  const [meta, setMeta] = useState({ currentPage: 1, lastPage: 1, total: 0, perPage: 15 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' }

  useEffect(() => {
    fetch(API_GOVERNORATES)
      .then(r => r.json())
      .then(data => setGovernorates(data.data ?? data ?? []))
      .catch(() => {})
  }, [])

  const load = async (page = 1, perPage = 15) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_CUSTOMERS}?page=${page}&per_page=${perPage}`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Failed to load')
      const json = await res.json()
      setItems(json.data ?? [])
      setMeta({
        currentPage: json.current_page ?? page,
        lastPage: json.last_page ?? 1,
        total: json.total ?? 0,
        perPage: json.per_page ?? perPage,
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(1, meta.perPage) }, [])

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.phone.trim()) {
      errs.phone = 'Phone is required'
    } else if (!/^(\+964|0)\d{10,12}$/.test(form.phone.trim())) {
      errs.phone = 'Invalid phone number'
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Invalid email address'
    }
    if (!form.governorate_id) errs.governorate_id = 'Governorate is required'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const openEdit = (item) => {
    setEditing(item)
    setFieldErrors({})
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
    setFieldErrors({})
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const body = {
        ...form,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        governorate_id: Number(form.governorate_id),
      }
      let res
      if (editing) {
        res = await fetch(`${API_CUSTOMERS}/${editing.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(body),
        })
      } else {
        res = await fetch(API_CUSTOMERS, {
          method: 'POST',
          headers,
          body: JSON.stringify({ ...body, password: 'password123' }),
        })
      }
      if (!res.ok) {
        if (res.status === 422) {
          const data = await res.json().catch(() => ({}))
          setFieldErrors(data.errors || {})
          return
        }
        throw new Error('Save failed')
      }
      setShowModal(false)
      setFieldErrors({})
      setSuccess(editing ? 'Customer updated' : 'Customer created')
      load(editing ? meta.currentPage : 1, meta.perPage)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`${API_CUSTOMERS}/${deleteTarget}`, { method: 'DELETE', headers })
      if (!res.ok) throw new Error('Delete failed')
      setDeleteTarget(null)
      setSuccess('Customer deleted')
      load(meta.currentPage, meta.perPage)
    } catch (e) { setError(e.message) }
    finally { setDeleting(false) }
  }

  const handlePageChange = (page) => load(page, meta.perPage)
  const handlePerPageChange = (perPage) => load(1, perPage)

  const getGovernorateName = (item) => item.governorate?.name_en ?? '-'

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Customers</h4>
        <div>
          <Button size="sm" className="me-2" onClick={openCreate}><FontAwesomeIcon icon={faPlus} className="me-1" /> Create</Button>
          <Button size="sm" variant="outline-secondary" onClick={() => load(meta.currentPage, meta.perPage)}><FontAwesomeIcon icon={faRotate} className="me-1" /> Refresh</Button>
        </div>
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
                  <Button variant="outline-danger" size="sm" onClick={() => setDeleteTarget(item.id)}><FontAwesomeIcon icon={faTrashCan} /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Pagination
        currentPage={meta.currentPage}
        lastPage={meta.lastPage}
        total={meta.total}
        perPage={meta.perPage}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header>
          <Modal.Title>{editing ? 'Edit Customer' : 'Create Customer'}</Modal.Title>
          <button className="modal-close-btn" onClick={() => setShowModal(false)}><FontAwesomeIcon icon={faXmark} /></button>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Name</Form.Label>
            <Form.Control value={form.name} isInvalid={!!fieldErrors.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Form.Control.Feedback type="invalid">{fieldErrors.name}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Phone</Form.Label>
            <Form.Control value={form.phone} isInvalid={!!fieldErrors.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <Form.Control.Feedback type="invalid">{fieldErrors.phone}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={form.email} isInvalid={!!fieldErrors.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <Form.Control.Feedback type="invalid">{fieldErrors.email}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Governorate</Form.Label>
            <Form.Select value={form.governorate_id} isInvalid={!!fieldErrors.governorate_id} onChange={e => setForm({ ...form, governorate_id: e.target.value })}>
              <option value="">Select governorate...</option>
              {governorates.map(g => (
                <option key={g.id} value={g.id}>{g.name_en} / {g.name_ar}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{fieldErrors.governorate_id}</Form.Control.Feedback>
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

      <ConfirmDeleteModal
        show={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        loading={deleting}
      />
    </>
  )
}

export default AdminCustomers
