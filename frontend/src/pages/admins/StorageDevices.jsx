import { useEffect, useState, useCallback } from 'react'
import { Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons'
import Pagination from '../../components/admins/Pagination'

const API_BASE = '/api/storage-devices'
const API_TYPES = '/api/storage-device-types'
const TOKEN_KEY = 'authToken'

const EMPTY_FORM = {
  name_en: '',
  name_ar: '',
  description_en: '',
  description_ar: '',
  storage_type_id: '',
  size_mb: '',
  real_size_mb: '',
  price_iqd: '',
  marka: '',
  interface: '',
}

function AdminStorageDevices() {
  const [items, setItems] = useState([])
  const [types, setTypes] = useState([])
  const [meta, setMeta] = useState({ currentPage: 1, lastPage: 1, total: 0, perPage: 15 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' }

  useEffect(() => {
    fetch(API_TYPES)
      .then(r => r.json())
      .then(data => setTypes(data.data ?? data ?? []))
      .catch(() => {})
  }, [])

  const load = useCallback(async (page = 1, perPage = 15) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}?page=${page}&per_page=${perPage}`, { headers })
      if (!res.ok) throw new Error('Failed to load')
      const json = await res.json()
      setItems(json.data ?? [])
      setMeta({
        currentPage: json.meta?.current_page ?? json.current_page ?? page,
        lastPage: json.meta?.last_page ?? json.last_page ?? 1,
        total: json.meta?.total ?? json.total ?? 0,
        perPage: json.meta?.per_page ?? json.per_page ?? perPage,
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(1, meta.perPage) }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setShowModal(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({
      name_en: item.name_en || '',
      name_ar: item.name_ar || '',
      description_en: item.description_en || '',
      description_ar: item.description_ar || '',
      storage_type_id: item.storage_type_id || '',
      size_mb: item.size_mb ?? '',
      real_size_mb: item.real_size_mb ?? '',
      price_iqd: item.price_iqd ?? '',
      marka: item.marka || '',
      interface: item.interface || '',
    })
    setErrors({})
    setShowModal(true)
  }

  const validate = () => {
    const errs = {}
    if (!form.name_en.trim()) errs.name_en = 'English name is required'
    if (!form.name_ar.trim()) errs.name_ar = 'Arabic name is required'
    if (!form.storage_type_id) errs.storage_type_id = 'Type is required'
    if (form.size_mb === '' || form.size_mb == null) errs.size_mb = 'Size is required'
    if (form.price_iqd === '' || form.price_iqd == null) errs.price_iqd = 'Price is required'
    if (!form.marka.trim()) errs.marka = 'Brand is required'
    if (!form.interface.trim()) errs.interface = 'Interface is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    setError(null)
    try {
      const body = {
        ...form,
        name_en: form.name_en.trim(),
        name_ar: form.name_ar.trim(),
        marka: form.marka.trim(),
        interface: form.interface.trim(),
        size_mb: Number(form.size_mb),
        real_size_mb: form.real_size_mb === '' ? null : Number(form.real_size_mb),
        price_iqd: Number(form.price_iqd),
        storage_type_id: Number(form.storage_type_id),
      }
      const url = editing ? `${API_BASE}/${editing.id}` : API_BASE
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers, body: JSON.stringify(body) })
      if (!res.ok) {
        if (res.status === 422) {
          const data = await res.json().catch(() => ({}))
          setErrors(data.errors || {})
          return
        }
        throw new Error('Save failed')
      }
      setShowModal(false)
      load(editing ? meta.currentPage : 1, meta.perPage)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this storage device?')) return
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE', headers })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || 'Delete failed')
      }
      await load(meta.currentPage, meta.perPage)
    } catch (e) { setError(e.message) }
  }

  const handlePageChange = (page) => load(page, meta.perPage)
  const handlePerPageChange = (perPage) => load(1, perPage)

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Storage Devices</h4>
        <Button size="sm" onClick={openCreate}>
          <FontAwesomeIcon icon={faPlus} className="me-1" /> Create
        </Button>
      </div>
      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
      <div className="table-responsive">
        <Table striped hover className="bg-white rounded shadow-sm">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Name (EN)</th>
              <th>Name (AR)</th>
              <th>Type</th>
              <th>Size</th>
              <th>Brand</th>
              <th>Interface</th>
              <th>Price (IQD)</th>
              <th style={{ width: 100 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={9} className="text-center text-muted py-3">No storage devices found.</td></tr>
            )}
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name_en}</td>
                <td>{item.name_ar}</td>
                <td>{item.storage_type?.name_en ?? '-'}</td>
                <td>{item.size_mb ? `${item.size_mb} MB` : '-'}</td>
                <td>{item.marka}</td>
                <td>{item.interface}</td>
                <td>{Number(item.price_iqd).toLocaleString()}</td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-1" onClick={() => openEdit(item)}>
                    <FontAwesomeIcon icon={faPen} />
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.id)}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </Button>
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

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header>
          <Modal.Title>{editing ? 'Edit' : 'Create'} Storage Device</Modal.Title>
          <button className="modal-close-btn" onClick={() => setShowModal(false)}><FontAwesomeIcon icon={faXmark} /></button>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-2">
                <Form.Label>Name (EN)</Form.Label>
                <Form.Control value={form.name_en} onChange={e => { setForm({ ...form, name_en: e.target.value }); setErrors(prev => { const n = { ...prev }; delete n.name_en; return n }) }} isInvalid={!!errors.name_en} />
                <Form.Control.Feedback type="invalid">{errors.name_en}</Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-2">
                <Form.Label>Name (AR)</Form.Label>
                <Form.Control value={form.name_ar} onChange={e => { setForm({ ...form, name_ar: e.target.value }); setErrors(prev => { const n = { ...prev }; delete n.name_ar; return n }) }} isInvalid={!!errors.name_ar} />
                <Form.Control.Feedback type="invalid">{errors.name_ar}</Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-2">
                <Form.Label>Description (EN)</Form.Label>
                <Form.Control as="textarea" rows={2} value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })} />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-2">
                <Form.Label>Description (AR)</Form.Label>
                <Form.Control as="textarea" rows={2} value={form.description_ar} onChange={e => setForm({ ...form, description_ar: e.target.value })} />
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <Form.Group className="mb-2">
                <Form.Label>Type</Form.Label>
                <Form.Select value={form.storage_type_id} onChange={e => { setForm({ ...form, storage_type_id: e.target.value }); setErrors(prev => { const n = { ...prev }; delete n.storage_type_id; return n }) }} isInvalid={!!errors.storage_type_id}>
                  <option value="">Select type...</option>
                  {types.map(t => (
                    <option key={t.id} value={t.id}>{t.name_en} / {t.name_ar}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.storage_type_id}</Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group className="mb-2">
                <Form.Label>Brand</Form.Label>
                <Form.Control value={form.marka} onChange={e => { setForm({ ...form, marka: e.target.value }); setErrors(prev => { const n = { ...prev }; delete n.marka; return n }) }} isInvalid={!!errors.marka} />
                <Form.Control.Feedback type="invalid">{errors.marka}</Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group className="mb-2">
                <Form.Label>Interface</Form.Label>
                <Form.Control value={form.interface} onChange={e => { setForm({ ...form, interface: e.target.value }); setErrors(prev => { const n = { ...prev }; delete n.interface; return n }) }} isInvalid={!!errors.interface} />
                <Form.Control.Feedback type="invalid">{errors.interface}</Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <Form.Group className="mb-2">
                <Form.Label>Size (MB)</Form.Label>
                <Form.Control type="number" min="1" value={form.size_mb} onChange={e => { setForm({ ...form, size_mb: e.target.value }); setErrors(prev => { const n = { ...prev }; delete n.size_mb; return n }) }} isInvalid={!!errors.size_mb} />
                <Form.Control.Feedback type="invalid">{errors.size_mb}</Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group className="mb-2">
                <Form.Label>Real Size (MB)</Form.Label>
                <Form.Control type="number" min="1" value={form.real_size_mb} onChange={e => setForm({ ...form, real_size_mb: e.target.value })} placeholder="Optional" />
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group className="mb-2">
                <Form.Label>Price (IQD)</Form.Label>
                <Form.Control type="number" min="0" step="0.01" value={form.price_iqd} onChange={e => { setForm({ ...form, price_iqd: e.target.value }); setErrors(prev => { const n = { ...prev }; delete n.price_iqd; return n }) }} isInvalid={!!errors.price_iqd} />
                <Form.Control.Feedback type="invalid">{errors.price_iqd}</Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AdminStorageDevices
