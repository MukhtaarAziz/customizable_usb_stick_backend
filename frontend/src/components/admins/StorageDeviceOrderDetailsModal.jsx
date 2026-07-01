import { Modal, Badge } from 'react-bootstrap'
import OrderStatusBadge from './OrderStatusBadge.jsx'

const CURRENCY = 'IQD'

function StorageDeviceOrderDetailsModal({ show, onHide, order }) {
  if (!order) return null

  const games = Array.isArray(order.games) ? order.games : []
  const programs = Array.isArray(order.programs) ? order.programs : []

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Storage Device Order #{order.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 d-flex flex-wrap gap-2">
          <Badge bg="dark">Customer: {order.customer?.name || '-'}</Badge>
          <Badge bg="secondary">Phone: {order.phone || '-'}</Badge>
          <Badge bg="secondary">Device: {order.storage_device?.name_en || order.storage_device?.name_ar || '-'}</Badge>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="mb-2">
          <strong>Address:</strong> {order.delivery_address || '-'}
        </div>

        <div className="mb-3 d-flex flex-wrap gap-3">
          <div><strong>Quantity:</strong> {order.quantity}</div>
          <div><strong>Unit price:</strong> {Number(order.unit_price || 0).toLocaleString()} {CURRENCY}</div>
          <div><strong>Total:</strong> {Number(order.total_price || 0).toLocaleString()} {CURRENCY}</div>
        </div>

        {games.length > 0 && (
          <div className="mb-3">
            <strong>Games ({games.length})</strong>
            <ul className="mb-0 mt-1">
              {games.map((g, i) => (
                <li key={g.id ?? i}>{g.name_en || g.name_ar || `#${g.id}`}</li>
              ))}
            </ul>
          </div>
        )}

        {programs.length > 0 && (
          <div className="mb-3">
            <strong>Programs ({programs.length})</strong>
            <ul className="mb-0 mt-1">
              {programs.map((p, i) => (
                <li key={p.id ?? i}>{p.name_en || p.name_ar || `#${p.id}`}</li>
              ))}
            </ul>
          </div>
        )}

        {order.notes && (
          <div className="mb-2"><strong>Notes:</strong> {order.notes}</div>
        )}

        {order.custom_message && (
          <div className="mb-2"><strong>Custom message:</strong> {order.custom_message}</div>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default StorageDeviceOrderDetailsModal
