import { useEffect, useState, useCallback } from 'react'
import { Table, Button, Spinner, Alert, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import Pagination from '../../components/admins/Pagination.jsx'
import ItemEditModal from '../../components/admins/ItemEditModal.jsx'
import SearchBar from '../../components/admins/SearchBar.jsx'

const API_BASE = '/api/games'
const PLATFORMS_API = '/api/game-platforms?per_page=100'
const TOKEN_KEY = 'authToken'
const CONFIRM_DELETE = 'Delete this game?'
const DEFAULT_PER_PAGE = 15

function AdminGames() {
  const [items, setItems] = useState([])
  const [platforms, setPlatforms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)
  const [search, setSearch] = useState('')
  const [filterPlatform, setFilterPlatform] = useState('')
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' }

  useEffect(() => {
    const auth = { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` }
    fetch(PLATFORMS_API, { headers: auth })
      .then(r => r.json())
      .then(data => setPlatforms(data.data ?? []))
      .catch(() => {})
  }, [])

  const buildUrl = useCallback((p = page, pp = perPage, q = search, pf = filterPlatform) => {
    let url = `${API_BASE}?per_page=${pp}&page=${p}`
    if (q) url += `&search=${encodeURIComponent(q)}`
    if (pf) url += `&platform_id=${pf}`
    return url
  }, [page, perPage, search, filterPlatform])

  const load = async (p = page, pp = perPage, q = search, pf = filterPlatform) => {
    setLoading(true)
    try {
      const res = await fetch(buildUrl(p, pp, q, pf), { headers })
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

  useEffect(() => { setPage(1); load(1, perPage, search, filterPlatform) }, [search, filterPlatform])

  const handlePageChange = (p) => { setPage(p); load(p, perPage, search, filterPlatform) }

  const openCreate = () => { setEditing(null); setShowModal(true) }
  const openEdit = (item) => { setEditing(item); setShowModal(true) }
  const handleSaved = () => { setShowModal(false); load() }

  const handleDelete = async (id) => {
    if (!window.confirm(CONFIRM_DELETE)) return
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE', headers: { ...headers, 'Content-Type': 'application/json' } })
      if (!res.ok) throw new Error('Delete failed')
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  const handleToggleActive = async (item) => {
    try {
      const res = await fetch(`${API_BASE}/${item.id}/active`, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !item.active }),
      })
      if (!res.ok) throw new Error('Toggle active failed')
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h4 className="fw-bold mb-0">Games</h4>
        <div className="d-flex gap-2 align-items-center">
          <Form.Select size="sm" value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)} style={{ minWidth: 140 }}>
            <option value="">All platforms</option>
            {platforms.map(p => (
              <option key={p.id} value={p.id}>{p.name_en}</option>
            ))}
          </Form.Select>
          <SearchBar value={search} onChange={setSearch} placeholder="Search games..." />
          <Button size="sm" onClick={openCreate}><FontAwesomeIcon icon={faPlus} className="me-1" /> Create</Button>
        </div>
      </div>
      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
      <div className="table-responsive">
        <Table striped hover className="bg-white rounded shadow-sm">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Name (EN)</th>
              <th>Name (AR)</th>
              <th>Platform</th>
              <th>Category</th>
              <th>Size (GB)</th>
              <th>Tags</th>
              <th>Active</th>
              <th style={{ width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name_en}</td>
                <td>{item.name_ar}</td>
                <td>{item.platform?.name_en || '-'}</td>
                <td>{item.category?.name_en || '-'}</td>
                <td>{item.size_gb ?? '-'}</td>
                <td>{Array.isArray(item.tags) ? item.tags.join(', ') : '-'}</td>
                <td className={item.active ? 'text-success' : 'text-danger'}>{item.active ? 'Active' : 'Inactive'}</td>
                <td>
                  <Button
                    variant={item.active ? 'outline-warning' : 'outline-success'}
                    size="sm"
                    className="me-1"
                    onClick={() => handleToggleActive(item)}
                  >
                    {item.active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button variant="outline-primary" size="sm" className="me-1" onClick={() => openEdit(item)}><FontAwesomeIcon icon={faPen} /></Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.id)}><FontAwesomeIcon icon={faTrashCan} /></Button>
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
        onPerPageChange={(n) => { setPerPage(n); setPage(1); load(1, n, search, filterPlatform) }}
      />

      <ItemEditModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSaved={handleSaved}
        editing={editing}
        apiBase={API_BASE}
        categoriesApi="/api/game-categories"
        title="Game"
      />
    </>
  )
}

export default AdminGames