import { useEffect, useMemo, useState } from 'react'
import { Table, Button, Spinner, Alert, Form, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate, faSearch, faEye } from '@fortawesome/free-solid-svg-icons'
import OrderStatusBadge from '../../components/admins/OrderStatusBadge.jsx'
import OrderStatusSelect from '../../components/admins/OrderStatusSelect.jsx'
import PackageOrderDetailsModal from '../../components/admins/PackageOrderDetailsModal.jsx'
import PackageDetailsModal from '../../components/PackageDetailsModal/PackageDetailsModal.jsx'

const API_ORDERS = '/api/admin/package-orders'
const TOKEN_KEY = 'authToken'
const METHODS = { PATCH: 'PATCH' }
const CURRENCY = 'IQD'

const ALL_STATUSES = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

function AdminOrders() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [showPackageModal, setShowPackageModal] = useState(false)
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

  const handleOpenPackageDetails = (pkg) => {
    setSelectedPackage(pkg)
    setShowPackageModal(true)
  }

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Package Orders</h4>
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
              <th style={{ minWidth: 260 }}>Ordered Packages</th>
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
                  <div className="d-flex flex-column gap-2">
                    {(item.items || []).length === 0 && <span className="text-muted small">No packages</span>}
                    {(item.items || []).slice(0, 3).map((orderItem) => {
                      const pkg = orderItem.package
                      const packageName = pkg?.name_en || pkg?.name_ar || `#${orderItem.package_id}`
                      const qty = Number(orderItem.quantity || 0)
                      const contentSummary = (pkg?.games || []).slice(0, 2).map((game) => game.name_en || game.name_ar || '').filter(Boolean)
                      const programSummary = (pkg?.programs || []).slice(0, 2).map((program) => program.name_en || program.name_ar || '').filter(Boolean)
                      const summaryParts = [...contentSummary, ...programSummary]
                      const detailsText = summaryParts.length > 0 ? summaryParts.join(', ') : 'Package contents not available'

                      return (
                        <div key={orderItem.id || `${item.id}-${orderItem.package_id}`} className="d-flex flex-column gap-1 border rounded p-2">
                          <div className="d-flex align-items-center justify-content-between gap-2">
                            <span className="small fw-semibold">
                              {packageName} <span className="text-muted">× {qty}</span>
                            </span>
                            {pkg && (
                              <Button size="sm" variant="outline-primary" onClick={() => handleOpenPackageDetails(pkg)}>
                                View
                              </Button>
                            )}
                          </div>
                          <span className="small text-muted">{detailsText}</span>
                        </div>
                      )
                    })}
                    {(item.items || []).length > 3 && <span className="small text-muted">+ {(item.items || []).length - 3} more</span>}
                  </div>
                </td>
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

      <PackageDetailsModal
        pkg={selectedPackage}
        show={showPackageModal}
        onClose={() => {
          setShowPackageModal(false)
          setSelectedPackage(null)
        }}
        onOrder={() => {
          setShowPackageModal(false)
          setSelectedPackage(null)
        }}
        locale="en"
        t={{}}
      />
    </>
  )
}

export default AdminOrders