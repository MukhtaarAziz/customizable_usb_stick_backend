import { Card, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowLeft, faShoppingCart, faBoxOpen } from '@fortawesome/free-solid-svg-icons'
import CartItem from '../CartItem/CartItem.jsx'
import './Cart.css'

function Cart({ items, locale, onCheckout, onRemove, onUpdateQuantity }) {
  const total = items.reduce(
    (sum, item) => sum + Number(item.final_price_iqd ?? item.price_iqd ?? 0) * (item.quantity || 1),
    0
  )

  return (
    <Card className="cart shadow-sm border-0 mb-4">
      <Card.Body className="cart__body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="cart__title mb-0">
            <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
            {locale === 'ar' ? 'السلة' : 'Shopping Cart'}
            <span className="cart__count ms-2 text-muted">
              ({items.length} {locale === 'ar' ? 'عناصر' : 'items'})
            </span>
          </h5>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <FontAwesomeIcon icon={faBoxOpen} className="mb-2" style={{ fontSize: '2.5rem' }} />
            <p className="mb-0">{locale === 'ar' ? 'سلتك فارغة، أضف بعض الحزم' : 'Your cart is empty, add some packages'}</p>
          </div>
        ) : (
          <>
            <div className="cart__items">
              {items.map(item => (
                <CartItem key={item.id} item={item} locale={locale} onRemove={onRemove} onUpdateQuantity={onUpdateQuantity} />
              ))}
            </div>

            <div className="cart__footer d-flex justify-content-between align-items-center pt-3 mt-2 border-top">
              <div className="cart__total">
                <span className="text-muted">{locale === 'ar' ? 'المجموع:' : 'Total:'}</span>
                <span className="cart__total-amount fs-5 fw-bold ms-2">{total.toLocaleString()} IQD</span>
              </div>
              <Button variant="primary" onClick={onCheckout} className="cart__checkout-btn">
                {locale === 'ar' ? 'إتمام الطلب' : 'Proceed to Checkout'}
                <FontAwesomeIcon icon={locale === 'ar' ? faArrowLeft : faArrowRight} className="ms-2" />
              </Button>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  )
}

export default Cart
