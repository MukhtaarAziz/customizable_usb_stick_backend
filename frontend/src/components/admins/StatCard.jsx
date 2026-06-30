import { Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function StatCard({ icon, label, value, color }) {
  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body className="d-flex align-items-center gap-3">
        <div
          className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
          style={{
            width: 48,
            height: 48,
            background: `${color}15`,
            color: color,
            fontSize: '1.3rem',
          }}
        >
          <FontAwesomeIcon icon={icon} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div className="text-muted small text-nowrap">{label}</div>
          <div className="fw-bold fs-5 text-truncate">{value}</div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default StatCard
