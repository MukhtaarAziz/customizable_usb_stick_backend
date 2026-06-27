import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import './CartItem.css'

function CartItem({ item, locale, onRemove, onUpdateQuantity }) {
  const name = locale === 'ar' ? item.name_ar || item.name_en : item.name_en || item.name_ar
  const unitPrice = item.final_price_iqd ?? item.price_iqd ?? 0
  const qty = item.quantity || 1
  const lineTotal = unitPrice * qty
  const platformName = locale === 'ar'
    ? item.platform?.name_ar || item.platform?.name_en
    : item.platform?.name_en || item.platform?.name_ar

  return (
    <div className="cart-item d-flex justify-content-between align-items-center py-3 border-bottom">
      <div className="cart-item__info">
        <div className="cart-item__name fw-semibold">{name}</div>
        <div className="cart-item__platform text-muted small">{platformName}</div>
        {item.discount > 0 && (
          <div className="cart-item__original text-decoration-line-through text-muted small">
            {item.price_iqd} IQD
          </div>
        )}
      </div>
      <div className="cart-item__actions d-flex align-items-center gap-2">
        <div className="cart-item__quantity d-flex align-items-center gap-1">
          <Button
            variant="outline-secondary"
            size="sm"
            className="px-1"
            disabled={qty <= 1}
            onClick={() => onUpdateQuantity(item.id, -1)}
          >
            <FontAwesomeIcon icon={faMinus} />
          </Button>
          <span className="fw-bold px-2">{qty}</span>
          <Button
            variant="outline-secondary"
            size="sm"
            className="px-1"
            disabled={qty >= 10}
            onClick={() => onUpdateQuantity(item.id, 1)}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </div>
        <span className="cart-item__price fw-bold">{lineTotal.toLocaleString()} IQD</span>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => onRemove(item.id)}
          className="cart-item__remove"
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </Button>
      </div>
    </div>
  )
}

export default CartItem
