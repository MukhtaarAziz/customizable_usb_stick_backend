import { useEffect, useState, useCallback } from 'react'
import { Table, Button, Spinner, Alert, Form, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faTrashCan, faRotate } from '@fortawesome/free-solid-svg-icons'
import UserEditModal from '../../components/admins/UserEditModal'
import ConfirmDeleteModal from '../../components/admins/ConfirmDeleteModal'
import Pagination from '../../components/admins/Pagination'

const API_USERS = '/api/users'
const TOKEN_KEY = 'authToken'
const DEFAULT_PER_PAGE = 15

const ROLES = [
  { value: 'client', label: 'client', badgeBg: 'secondary' },
  { value: 'admin', label: 'admin', badgeBg: 'danger' },
]

function AdminUsers() {
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
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' }

  const buildUrl = useCallback((p = page, pp = perPage) => {
    return `${API_USERS}?per_page=${pp}&page=${p}`
  }, [page, perPage])

  const load = async (p = page, pp = perPage) => {
    setLoading(true)
    try {
      const res = await fetch(buildUrl(p, pp), { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setItems(data.data ?? [])
      setPage(data.current_page ?? 1)
      setLastPage(data.last_page ?? 1)
      setTotal(data.total ?? 0)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(1) }, [])

  const handlePageChange = (p) => { setPage(p); load(p, perPage) }

  const openCreate = () => {
    setEditing(null)
    setShowModal(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setShowModal(true)
  }

  const handleSaved = () => {
    setShowModal(false)
    load()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`${API_USERS}/${deleteTarget}`, { method: 'DELETE', headers })
      if (!res.ok) throw new Error('Delete failed')
      setDeleteTarget(null)
      load()
    } catch (e) { setError(e.message) }
    finally { setDeleting(false) }
  }

  const handleRoleChange = async (id, role) => {
    try {
      const res = await fetch(`${API_USERS}/${id}/role`, { method: 'PATCH', headers, body: JSON.stringify({ role }) })
      if (!res.ok) throw new Error('Update failed')
      load()
    } catch (e) { setError(e.message) }
  }

  const getRoleConfig = (role) => ROLES.find(r => r.value === role) || ROLES[0]

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Users</h4>
        <div>
          <Button size="sm" variant="outline-secondary" className="me-2" onClick={() => load(1)}><FontAwesomeIcon icon={faRotate} className="me-1" /> Refresh</Button>
          <Button size="sm" onClick={openCreate}><FontAwesomeIcon icon={faPlus} className="me-1" /> Create</Button>
        </div>
      </div>
      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
      <div className="table-responsive">
        <Table striped hover className="bg-white rounded shadow-sm">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th style={{ width: 200 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={6} className="text-center text-muted py-3">No users found.</td></tr>
            )}
            {items.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><Badge bg={getRoleConfig(u.role).badgeBg}>{u.role}</Badge></td>
                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <Form.Select size="sm" value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)} style={{ width: 120 }}>
                      {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </Form.Select>
                    <Button variant="outline-primary" size="sm" onClick={() => openEdit(u)}><FontAwesomeIcon icon={faPen} /></Button>
                    <Button variant="outline-danger" size="sm" onClick={() => setDeleteTarget(u.id)}><FontAwesomeIcon icon={faTrashCan} /></Button>
                  </div>
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

      <UserEditModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSaved={handleSaved}
        editing={editing}
      />

      <ConfirmDeleteModal
        show={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        loading={deleting}
      />
    </>
  )
}

export default AdminUsers
