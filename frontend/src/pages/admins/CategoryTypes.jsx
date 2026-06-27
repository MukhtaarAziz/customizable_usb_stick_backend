import { useEffect, useState, useCallback } from 'react'
import { Table, Button, Spinner, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import Pagination from '../../components/admins/Pagination'
import NameEditModal from '../../components/admins/NameEditModal'

const API_BASE = '/api/category-types'
const TOKEN_KEY = 'authToken'

function AdminCategoryTypes() {
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState({ currentPage: 1, lastPage: 1, total: 0, perPage: 15 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = { Authorization: `Bearer ${token}` }

  const load = useCallback(async (page = 1, perPage = 15) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}?page=${page}&per_page=${perPage}`, { headers })
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

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category type?')) return
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

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Category Types</h4>
        <Button size="sm" onClick={() => { setEditing(null); setShowModal(true) }}>
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
              <th style={{ width: 120 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={4} className="text-center text-muted py-3">No category types found.</td></tr>
            )}
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name_en}</td>
                <td>{item.name_ar}</td>
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

      <NameEditModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSaved={handleSaved}
        editing={editing}
        apiBase={API_BASE}
        title="Category Type"
      />
    </>
  )
}

export default AdminCategoryTypes
