import { useEffect, useMemo, useState } from 'react'
import { Table, Button, Spinner, Alert, Form, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate, faSearch, faEye } from '@fortawesome/free-solid-svg-icons'
import OrderStatusBadge from '../../components/admins/OrderStatusBadge.jsx'
import OrderStatusSelect from '../../components/admins/OrderStatusSelect.jsx'
import PackageOrderDetailsModal from '../../components/admins/PackageOrderDetailsModal.jsx'

const API_ORDERS = '/api/admin/orders'
const TOKEN_KEY = 'authToken'
const METHODS = { PATCH: 'PATCH' }
const CURRENCY = 'IQD'

const ALL_STATUSES = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

function AdminSubOrders() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' }

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_ORDERS, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setItems(data.data ?? [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id)
    try {
      const res = await fetch(`${API_ORDERS}/${id}/status`, { method: METHODS.PATCH, headers, body: JSON.stringify({ status }) })
      if (!res.ok) throw new Error('Update failed')
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))
    } catch (e) { setError(e.message) }
    finally { setUpdatingId(null) }
  }

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase()

    return items.filter((item) => {
      if (statusFilter !== 'all' && String(item.status || '').toLowerCase() !== statusFilter) {
        return false
      }

      if (!q) return true

      const customerName = String(item.customer?.name || item.customer_name || '').toLowerCase()
      const phone = String(item.phone || '').toLowerCase()
      const id = String(item.id || '').toLowerCase()
      const uuid = String(item.uuid || '').toLowerCase()

      return customerName.includes(q) || phone.includes(q) || id.includes(q) || uuid.includes(q)
    })
  }, [items, search, statusFilter])

  const handleOpenDetails = (order) => {
    setSelectedOrder(order)
    setShowDetails(true)
  }

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Sub Orders</h4>
        <Button size="sm" variant="outline-secondary" onClick={load}><FontAwesomeIcon icon={faRotate} className="me-1" /> Refresh</Button>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-8">
          <InputGroup>
            <InputGroup.Text><FontAwesomeIcon icon={faSearch} /></InputGroup.Text>
            <Form.Control
              placeholder="Search by order id, uuid, customer, or phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </div>
        <div className="col-md-4">
          <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{s === 'all' ? 'All statuses' : s}</option>
            ))}
          </Form.Select>
        </div>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
      <div className="table-responsive">
        <Table striped hover className="bg-white rounded shadow-sm">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th style={{ width: 240 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 && (
              <tr><td colSpan={7} className="text-center text-muted py-3">No package orders found.</td></tr>
            )}
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.customer?.name || item.customer_name || '-'}</td>
                <td>{item.phone || '-'}</td>
                <td>{Number(item.total_price ?? 0).toLocaleString()} {CURRENCY}</td>
                <td><OrderStatusBadge status={item.status} /></td>
                <td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="outline-dark" onClick={() => handleOpenDetails(item)}>
                      <FontAwesomeIcon icon={faEye} className="me-1" /> Details
                    </Button>
                    <OrderStatusSelect
                      value={String(item.status || 'pending').toLowerCase()}
                      disabled={updatingId === item.id}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <PackageOrderDetailsModal
        show={showDetails}
        onHide={() => setShowDetails(false)}
        order={selectedOrder}
      />
    </>
  )
}

export default AdminSubOrders
