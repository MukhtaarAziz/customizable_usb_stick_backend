import { useEffect, useState, useCallback } from 'react'
import { Table, Button, Spinner, Alert, Modal, Form, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons'
import Pagination from '../../components/admins/Pagination'

const API_BASE = '/api/packages'
const PLATFORMS_API = '/api/game-platforms?per_page=100'
const CATEGORY_TYPES_API = '/api/package-category-types?per_page=100'
const TOKEN_KEY = 'authToken'
const CURRENCY = 'IQD'

const EMPTY_FORM = {
  name_en: '', name_ar: '',
  description_en: '', description_ar: '',
  platform_id: '', package_category_type_id: '',
  price_iqd: '', discount: '', active: true,
}

function AdminPackages() {
  const [items, setItems] = useState([])
  const [platforms, setPlatforms] = useState([])
  const [categoryTypes, setCategoryTypes] = useState([])
  const [meta, setMeta] = useState({ currentPage: 1, lastPage: 1, total: 0, perPage: 15 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' }

  useEffect(() => {
    const auth = { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` }
    Promise.all([
      fetch(PLATFORMS_API, { headers: auth }).then(r => r.json()),
      fetch(CATEGORY_TYPES_API, { headers: auth }).then(r => r.json()),
    ]).then(([pData, ctData]) => {
      setPlatforms(pData.data ?? [])
      setCategoryTypes(ctData.data ?? [])
    }).catch(() => {})
  }, [])

  const load = useCallback(async (page = 1, perPage = 15) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}?page=${page}&per_page=${perPage}&show_all=1`, { headers })
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
  }, [])

  useEffect(() => { load(1, meta.perPage) }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({
      name_en: item.name_en || '',
      name_ar: item.name_ar || '',
      description_en: item.description_en || '',
      description_ar: item.description_ar || '',
      platform_id: item.platform_id || '',
      package_category_type_id: item.package_category_type_id || '',
      price_iqd: item.price_iqd ?? '',
      discount: item.discount ?? '',
      active: item.active ?? true,
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = editing ? `${API_BASE}/${editing.id}` : API_BASE
      const method = editing ? 'PUT' : 'POST'
      const body = {
        ...form,
        price_iqd: form.price_iqd === '' ? 0 : Number(form.price_iqd),
        discount: form.discount === '' ? 0 : Number(form.discount),
        active: Boolean(form.active),
      }
      const res = await fetch(url, { method, headers, body: JSON.stringify(body) })
      if (!res.ok) throw new Error('Save failed')
      setShowModal(false)
      load(meta.currentPage, meta.perPage)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this package?')) return
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE', headers })
      if (!res.ok) throw new Error('Delete failed')
      load(meta.currentPage, meta.perPage)
    } catch (e) { setError(e.message) }
  }

  const handlePageChange = (page) => load(page, meta.perPage)
  const handlePerPageChange = (perPage) => load(1, perPage)

  const getPlatformName = (item) => item.platform?.name_en ?? item.platform_id
  const getCategoryTypeName = (item) => item.package_category_type?.name_en ?? item.package_category_type_id
  const finalPrice = (item) => {
    const price = Number(item.price_iqd) || 0
    const disc = Number(item.discount) || 0
    return (price * (1 - disc)).toFixed(2)
  }

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Packages</h4>
        <Button size="sm" onClick={openCreate}><FontAwesomeIcon icon={faPlus} className="me-1" /> Create</Button>
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
              <th>Platform</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Final</th>
              <th>Active</th>
              <th>Views</th>
              <th>Orders</th>
              <th style={{ width: 120 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={12} className="text-center text-muted py-3">No packages found.</td></tr>
            )}
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name_en}</td>
                <td>{item.name_ar}</td>
                <td><Badge bg="info">{getCategoryTypeName(item)}</Badge></td>
                <td><Badge bg="secondary">{getPlatformName(item)}</Badge></td>
                <td>{Number(item.price_iqd).toLocaleString()} {CURRENCY}</td>
                <td>{item.discount > 0 ? `${(item.discount * 100).toFixed(0)}%` : '-'}</td>
                <td>{Number(finalPrice(item)).toLocaleString()} {CURRENCY}</td>
                <td>{item.active ? <Badge bg="success">Active</Badge> : <Badge bg="danger">Inactive</Badge>}</td>
                <td>{item.views ?? 0}</td>
                <td>{item.order_count ?? 0}</td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-1" onClick={() => openEdit(item)}><FontAwesomeIcon icon={faPen} /></Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.id)}><FontAwesomeIcon icon={faTrashCan} /></Button>
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
          <Modal.Title>{editing ? 'Edit Package' : 'Create Package'}</Modal.Title>
          <button className="modal-close-btn" onClick={() => setShowModal(false)}><FontAwesomeIcon icon={faXmark} /></button>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-2">
                <Form.Label>Name (EN)</Form.Label>
                <Form.Control value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })} />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-2">
                <Form.Label>Name (AR)</Form.Label>
                <Form.Control value={form.name_ar} onChange={e => setForm({ ...form, name_ar: e.target.value })} />
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
            <div className="col-md-6">
              <Form.Group className="mb-2">
                <Form.Label>Category Type</Form.Label>
                <Form.Select value={form.package_category_type_id} onChange={e => setForm({ ...form, package_category_type_id: e.target.value })}>
                  <option value="">Select type...</option>
                  {categoryTypes.map(ct => (
                    <option key={ct.id} value={ct.id}>{ct.name_en} / {ct.name_ar}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-2">
                <Form.Label>Platform</Form.Label>
                <Form.Select value={form.platform_id} onChange={e => setForm({ ...form, platform_id: e.target.value })}>
                  <option value="">Select platform...</option>
                  {platforms.map(p => (
                    <option key={p.id} value={p.id}>{p.name_en} / {p.name_ar}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <Form.Group className="mb-2">
                <Form.Label>Price ({CURRENCY})</Form.Label>
                <Form.Control type="number" min="0" step="0.01" value={form.price_iqd} onChange={e => setForm({ ...form, price_iqd: e.target.value })} />
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group className="mb-2">
                <Form.Label>Discount</Form.Label>
                <Form.Control type="number" min="0" max="1" step="0.01" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} />
                <Form.Text className="text-muted">Value between 0 and 1 (e.g. 0.2 = 20%)</Form.Text>
              </Form.Group>
            </div>
            <div className="col-md-4 d-flex align-items-center">
              <Form.Group className="mb-2">
                <Form.Check type="switch" label="Active" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
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

export default AdminPackages
