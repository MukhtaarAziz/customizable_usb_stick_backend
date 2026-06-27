import { Form } from 'react-bootstrap'

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

function OrderStatusSelect({ value, disabled, onChange }) {
  return (
    <Form.Select size="sm" value={value} onChange={onChange} disabled={disabled}>
      {STATUS_OPTIONS.map((status) => (
        <option key={status} value={status}>{status}</option>
      ))}
    </Form.Select>
  )
}

export default OrderStatusSelect
