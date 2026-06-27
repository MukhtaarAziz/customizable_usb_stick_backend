import { useEffect, useState, useCallback } from 'react'
import { Table, Button, Spinner, Alert, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import Pagination from '../../components/admins/Pagination'
import ContentCategoryEditModal from '../../components/admins/ContentCategoryEditModal'

const API_BASE = '/api/categories'
const CATEGORY_TYPES_API = '/api/category-types'
const TOKEN_KEY = 'authToken'

function AdminContentCategories() {
  const [items, setItems] = useState([])
  const [categoryTypes, setCategoryTypes] = useState([])
  const [meta, setMeta] = useState({ currentPage: 1, lastPage: 1, total: 0, perPage: 15 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filterType, setFilterType] = useState('')
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const headersAuth = { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` }
    fetch(CATEGORY_TYPES_API, { headers: headersAuth })
      .then(res => res.json())
      .then(data => setCategoryTypes(data.data ?? data))
      .catch(() => {})
  }, [])

  const load = useCallback(async (page = 1, perPage = 15) => {
    setLoading(true)
    try {
      let url = `${API_BASE}?page=${page}&per_page=${perPage}`
      if (filterType) url += `&category_type_id=${filterType}`
      const res = await fetch(url, { headers })
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
  }, [filterType])

  useEffect(() => { load(1, meta.perPage) }, [load])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE', headers })
      if (!res.ok) throw new Error('Delete failed')
      load(meta.currentPage, meta.perPage)
    } catch (e) { setError(e.message) }
  }

  const handleSaved = () => {
    setShowModal(false)
    load(meta.currentPage, meta.perPage)
  }

  const handlePageChange = (page) => load(page, meta.perPage)
  const handlePerPageChange = (perPage) => load(1, perPage)

  const getTypeName = (item) => {
    return item.category_type?.name_en ?? item.category_type_id
  }

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Content Categories</h4>
        <div className="d-flex gap-2">
          <Form.Select size="sm" value={filterType} onChange={e => setFilterType(e.target.value)} style={{ minWidth: 160 }}>
            <option value="">All types</option>
            {categoryTypes.map(ct => (
              <option key={ct.id} value={ct.id}>{ct.name_en}</option>
            ))}
          </Form.Select>
          <Button size="sm" onClick={() => { setEditing(null); setShowModal(true) }}>
            <FontAwesomeIcon icon={faPlus} className="me-1" /> Create
          </Button>
        </div>
      </div>
      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
      <div className="table-responsive">
        <Table striped hover className="bg-white rounded shadow-sm">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Name (EN)</th>
              <th>Name (AR)</th>
              <th>Description (EN)</th>
              <th>Description (AR)</th>
              <th style={{ width: 120 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td><span className="badge bg-secondary">{getTypeName(item)}</span></td>
                <td>{item.name_en}</td>
                <td>{item.name_ar}</td>
                <td className="text-truncate" style={{ maxWidth: 180 }}>{item.description_en}</td>
                <td className="text-truncate" style={{ maxWidth: 180 }}>{item.description_ar}</td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-1" onClick={() => { setEditing(item); setShowModal(true) }}>
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

      <ContentCategoryEditModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSaved={handleSaved}
        editing={editing}
        apiBase={API_BASE}
        categoryTypes={categoryTypes}
      />
    </>
  )
}

export default AdminContentCategories
