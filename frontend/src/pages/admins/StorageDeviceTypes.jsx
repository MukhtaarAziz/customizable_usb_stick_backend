import { useEffect, useState, useCallback } from 'react'
import { Table, Button, Spinner, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import Pagination from '../../components/admins/Pagination'
import ConfirmDeleteModal from '../../components/admins/ConfirmDeleteModal'
import NameEditModal from '../../components/admins/NameEditModal'

const API_BASE = '/api/storage-device-types'
const TOKEN_KEY = 'authToken'
const DEFAULT_PER_PAGE = 15

function AdminStorageDeviceTypes() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = { Authorization: `Bearer ${token}` }

  const load = useCallback(async (p = page, pp = perPage) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}?page=${p}&per_page=${pp}`, { headers })
      if (!res.ok) throw new Error('Failed to load')
      const json = await res.json()
      setItems(json.data ?? json ?? [])
      setPage(json.current_page ?? p)
      setLastPage(json.last_page ?? 1)
      setTotal(json.total ?? 0)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(1, DEFAULT_PER_PAGE) }, [])

  const handlePageChange = (p) => { setPage(p); load(p, perPage) }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/${deleteTarget}`, { method: 'DELETE', headers })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || 'Delete failed')
      }
      setDeleteTarget(null)
      await load(page, perPage)
    } catch (e) { setError(e.message) }
    finally { setDeleting(false) }
  }

  const handleSaved = () => {
    setShowModal(false)
    load(page, perPage)
  }

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Storage Device Types</h4>
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
              <th>Description (EN)</th>
              <th>Description (AR)</th>
              <th style={{ width: 120 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={6} className="text-center text-muted py-3">No storage device types found.</td></tr>
            )}
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name_en}</td>
                <td>{item.name_ar}</td>
                <td className="text-truncate" style={{ maxWidth: 200 }}>{item.description_en}</td>
                <td className="text-truncate" style={{ maxWidth: 200 }}>{item.description_ar}</td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-1" onClick={() => { setEditing(item); setShowModal(true) }}>
                    <FontAwesomeIcon icon={faPen} />
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => setDeleteTarget(item.id)}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Pagination
        currentPage={page}
        lastPage={lastPage}
        total={total}
        perPage={perPage}
        onPageChange={handlePageChange}
        onPerPageChange={(n) => { setPerPage(n); setPage(1); load(1, n) }}
      />

      <NameEditModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSaved={handleSaved}
        editing={editing}
        apiBase={API_BASE}
        title="Storage Device Type"
        withDescription
      />

      <ConfirmDeleteModal
        show={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Storage Device Type"
        message="Are you sure you want to delete this storage device type? This action cannot be undone."
        loading={deleting}
      />
    </>
  )
}

export default AdminStorageDeviceTypes
