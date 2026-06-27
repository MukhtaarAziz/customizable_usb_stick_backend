import { useEffect, useState } from 'react'
import { Table, Button, Spinner, Alert, Badge, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate } from '@fortawesome/free-solid-svg-icons'

const API_ORDERS = '/api/admin/orders'
const TOKEN_KEY = 'authToken'
const METHODS = { PUT: 'PUT' }
const CURRENCY = 'IQD'

const statusColors = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'primary',
  shipped: 'secondary',
  delivered: 'success',
  cancelled: 'danger',
}

function AdminOrders() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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
    try {
      const res = await fetch(`${API_ORDERS}/${id}/status`, { method: METHODS.PUT, headers, body: JSON.stringify({ status }) })
      if (!res.ok) throw new Error('Update failed')
      load()
    } catch (e) { setError(e.message) }
  }

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Orders</h4>
        <Button size="sm" variant="outline-secondary" onClick={load}><FontAwesomeIcon icon={faRotate} className="me-1" /> Refresh</Button>
      </div>
      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
      <div className="table-responsive">
        <Table striped hover className="bg-white rounded shadow-sm">
          <thead className="table-light">
            <tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th><th style={{ width: 160 }}>Actions</th></tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.customer?.name || item.name || '-'}</td>
                <td>{(item.total ?? item.total_amount ?? 0).toLocaleString()} {CURRENCY}</td>
                <td><Badge bg={statusColors[item.status] || 'secondary'}>{item.status}</Badge></td>
                <td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</td>
                <td>
                  <Form.Select size="sm" value={item.status} onChange={e => handleStatusChange(item.id, e.target.value)}>
                    {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                  </Form.Select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  )
}

export default AdminOrders