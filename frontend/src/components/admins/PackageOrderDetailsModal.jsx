import { Modal, Table, Badge } from 'react-bootstrap'
import OrderStatusBadge from './OrderStatusBadge.jsx'

const CURRENCY = 'IQD'

function PackageOrderDetailsModal({ show, onHide, order }) {
  if (!order) return null

  const items = Array.isArray(order.items) ? order.items : []

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Package Order #{order.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 d-flex flex-wrap gap-2">
          <Badge bg="dark">Customer: {order.customer?.name || order.customer_name || '-'}</Badge>
          <Badge bg="secondary">Phone: {order.phone || '-'}</Badge>
          <Badge bg="secondary">Governorate: {order.governorate?.name_en || '-'}</Badge>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="mb-3">
          <strong>Address:</strong> {order.delivery_address || '-'}
        </div>

        <div className="table-responsive">
          <Table striped bordered hover size="sm" className="mb-0">
            <thead>
              <tr>
                <th>Package</th>
                <th style={{ width: 90 }}>Qty</th>
                <th style={{ width: 140 }}>Unit Price</th>
                <th style={{ width: 140 }}>Line Total</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={5} className="text-center text-muted py-3">No items.</td></tr>
              )}
              {items.map((item) => {
                const qty = Number(item.quantity || 0)
                const unit = Number(item.unit_price || 0)
                const line = qty * unit
                return (
                  <tr key={item.id}>
                    <td>{item.package?.name_en || item.package?.name_ar || `#${item.package_id}`}</td>
                    <td>{qty}</td>
                    <td>{unit.toLocaleString()} {CURRENCY}</td>
                    <td>{line.toLocaleString()} {CURRENCY}</td>
                    <td>{item.notes || '-'}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default PackageOrderDetailsModal
