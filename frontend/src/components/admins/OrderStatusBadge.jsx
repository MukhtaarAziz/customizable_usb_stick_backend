import { Badge } from 'react-bootstrap'

const STATUS_COLORS = {
  pending: 'warning',
  processing: 'primary',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'danger',
}

function OrderStatusBadge({ status }) {
  const value = String(status || 'pending').toLowerCase()
  return <Badge bg={STATUS_COLORS[value] || 'secondary'}>{value}</Badge>
}

export default OrderStatusBadge
