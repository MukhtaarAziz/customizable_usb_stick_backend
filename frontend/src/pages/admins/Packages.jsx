import { useEffect, useState, useCallback } from 'react'
import { Table, Button, Spinner, Alert, Modal, Form, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons'
import Pagination from '../../components/admins/Pagination'
import ConfirmDeleteModal from '../../components/admins/ConfirmDeleteModal'
import PackageItemsModal from '../../components/admins/PackageItemsModal.jsx'

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
  const [showItemsModal, setShowItemsModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [managingItems, setManagingItems] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' }

  // Validation functions
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
      case 'description_en':
        if (value && value.length > 5000) return 'English description cannot exceed 5000 characters'
        return null
      case 'description_ar':
        if (value && value.length > 5000) return 'Arabic description cannot exceed 5000 characters'
        return null
      case 'platform_id':
        if (!value) return 'Platform is required'
        return null
      case 'package_category_type_id':
        if (!value) return 'Category type is required'
        return null
      case 'price_iqd':
        if (value === '' || value == null) return 'Price is required'
        if (isNaN(Number(value))) return 'Price must be a valid number'
        if (Number(value) < 0) return 'Price cannot be negative'
        return null
      case 'discount':
        if (value !== '' && isNaN(Number(value))) return 'Discount must be a valid number'
        if (value !== '' && (Number(value) < 0 || Number(value) > 1)) return 'Discount must be between 0 and 1'
        return null
      default:
        return null
    }
  }

  const validateForm = () => {
    const errors = {}
    
    errors.name_en = validateField('name_en', form.name_en)
    errors.name_ar = validateField('name_ar', form.name_ar)
    errors.description_en = validateField('description_en', form.description_en)
    errors.description_ar = validateField('description_ar', form.description_ar)
    errors.platform_id = validateField('platform_id', form.platform_id)
    errors.package_category_type_id = validateField('package_category_type_id', form.package_category_type_id)
    errors.price_iqd = validateField('price_iqd', form.price_iqd)
    errors.discount = validateField('discount', form.discount)

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
    setFieldErrors({})
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
    setFieldErrors({})
    setShowModal(true)
  }

  const handleSave = async () => {
    const errors = validateForm()
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setSaving(true)
    setError(null)
    try {
      const url = editing ? `${API_BASE}/${editing.id}` : API_BASE
      const method = editing ? 'PUT' : 'POST'
      const body = {
        ...form,
        name_en: form.name_en.trim(),
        name_ar: form.name_ar.trim(),
        price_iqd: form.price_iqd === '' ? 0 : Number(form.price_iqd),
        discount: form.discount === '' ? 0 : Number(form.discount),
        active: Boolean(form.active),
      }
      const res = await fetch(url, { method, headers, body: JSON.stringify(body) })
      if (!res.ok) {
        if (res.status === 422) {
          const data = await res.json().catch(() => ({}))
          setFieldErrors(data.errors || {})
          return
        }
        throw new Error('Save failed')
      }
      setShowModal(false)
      load(meta.currentPage, meta.perPage)
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
      const res = await fetch(`${API_BASE}/${deleteTarget}`, { method: 'DELETE', headers })
      if (!res.ok) throw new Error('Delete failed')
      setDeleteTarget(null)
      load(meta.currentPage, meta.perPage)
    } catch (e) { setError(e.message) }
    finally { setDeleting(false) }
  }

  const handleToggleActive = async (item) => {
    try {
      const res = await fetch(`${API_BASE}/${item.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ active: !item.active }),
      })
      if (!res.ok) throw new Error('Toggle active failed')
      load(meta.currentPage, meta.perPage)
    } catch (e) {
      setError(e.message)
    }
  }

  const handlePageChange = (page) => load(page, meta.perPage)
  const handlePerPageChange = (perPage) => load(1, perPage)
  const openManageItems = (item) => {
    setManagingItems(item)
    setShowItemsModal(true)
  }

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
              <th style={{ width: 300 }}>Actions</th>
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
                  <Button variant="outline-dark" size="sm" className="me-1" onClick={() => openManageItems(item)}>Items</Button>
                  <Button
                    variant={item.active ? 'outline-warning' : 'outline-success'}
                    size="sm"
                    className="me-1"
                    onClick={() => handleToggleActive(item)}
                  >
                    {item.active ? 'Deactivate' : 'Activate'}
                  </Button>
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

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header>
          <Modal.Title>{editing ? 'Edit Package' : 'Create Package'}</Modal.Title>
          <button className="modal-close-btn" onClick={() => setShowModal(false)}><FontAwesomeIcon icon={faXmark} /></button>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
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
            </div>
            <div className="col-md-6">
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
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
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
            </div>
            <div className="col-md-6">
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
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Category Type</Form.Label>
                <Form.Select 
                  isInvalid={!!fieldErrors.package_category_type_id}
                  value={form.package_category_type_id} 
                  onChange={e => handleFieldChange('package_category_type_id', e.target.value)}
                >
                  <option value="">Select type...</option>
                  {categoryTypes.map(ct => (
                    <option key={ct.id} value={ct.id}>{ct.name_en} / {ct.name_ar}</option>
                  ))}
                </Form.Select>
                {fieldErrors.package_category_type_id && (
                  <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                    {fieldErrors.package_category_type_id}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Platform</Form.Label>
                <Form.Select 
                  isInvalid={!!fieldErrors.platform_id}
                  value={form.platform_id} 
                  onChange={e => handleFieldChange('platform_id', e.target.value)}
                >
                  <option value="">Select platform...</option>
                  {platforms.map(p => (
                    <option key={p.id} value={p.id}>{p.name_en} / {p.name_ar}</option>
                  ))}
                </Form.Select>
                {fieldErrors.platform_id && (
                  <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                    {fieldErrors.platform_id}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>Price ({CURRENCY})</Form.Label>
                <Form.Control 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  isInvalid={!!fieldErrors.price_iqd}
                  value={form.price_iqd} 
                  onChange={e => handleFieldChange('price_iqd', e.target.value)}
                />
                {fieldErrors.price_iqd && (
                  <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                    {fieldErrors.price_iqd}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>Discount</Form.Label>
                <Form.Control 
                  type="number" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  isInvalid={!!fieldErrors.discount}
                  value={form.discount} 
                  onChange={e => handleFieldChange('discount', e.target.value)}
                />
                {fieldErrors.discount && (
                  <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                    {fieldErrors.discount}
                  </Form.Control.Feedback>
                )}
                <Form.Text className="text-muted">Value between 0 and 1 (e.g. 0.2 = 20%)</Form.Text>
              </Form.Group>
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <Form.Group className="mb-3">
                <Form.Check 
                  type="switch" 
                  label="Active" 
                  checked={form.active} 
                  onChange={e => handleFieldChange('active', e.target.checked)}
                />
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </Modal.Footer>
      </Modal>

      <PackageItemsModal
        show={showItemsModal}
        onHide={() => setShowItemsModal(false)}
        pkg={managingItems}
        onChanged={() => load(meta.currentPage, meta.perPage)}
      />

      <ConfirmDeleteModal
        show={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Package"
        message="Are you sure you want to delete this package? This action cannot be undone."
        loading={deleting}
      />
    </>
  )
}

export default AdminPackages
