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

        <div className="mb-3">
          <strong>Package details</strong>
          <div className="d-flex flex-column gap-2 mt-2">
            {items.length === 0 && (
              <div className="text-center text-muted py-3 border rounded">No items.</div>
            )}
            {items.map((item) => {
              const qty = Number(item.quantity || 0)
              const unit = Number(item.unit_price || 0)
              const line = qty * unit
              const pkg = item.package
              const games = Array.isArray(pkg?.games) ? pkg.games : []
              const programs = Array.isArray(pkg?.programs) ? pkg.programs : []
              const gamesText = games.length > 0
                ? games.slice(0, 4).map((game) => game.name_en || game.name_ar || '').filter(Boolean).join(', ') + (games.length > 4 ? '...' : '')
                : 'None'
              const programsText = programs.length > 0
                ? programs.slice(0, 4).map((program) => program.name_en || program.name_ar || '').filter(Boolean).join(', ') + (programs.length > 4 ? '...' : '')
                : 'None'
              const packageName = pkg?.name_en || pkg?.name_ar || `#${item.package_id}`
              const description = pkg?.description_en || pkg?.description_ar || '-'
              const platform = pkg?.platform?.name_en || pkg?.platform?.name_ar || '-'

              return (
                <div key={item.id} className="border rounded p-3">
                  <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
                    <div>
                      <div className="fw-semibold">{packageName}</div>
                      <div className="small text-muted">{description}</div>
                    </div>
                    <Badge bg="primary">Qty: {qty}</Badge>
                  </div>

                  <div className="mt-2 small">
                    <div><strong>Platform:</strong> {platform}</div>
                    <div><strong>Games:</strong> {gamesText}</div>
                    <div><strong>Programs:</strong> {programsText}</div>
                    <div><strong>Unit price:</strong> {unit.toLocaleString()} {CURRENCY}</div>
                    <div><strong>Line total:</strong> {line.toLocaleString()} {CURRENCY}</div>
                    {item.notes ? <div><strong>Notes:</strong> {item.notes}</div> : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default PackageOrderDetailsModal
