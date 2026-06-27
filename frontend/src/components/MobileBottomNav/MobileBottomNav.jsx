import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Modal, Button, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUser, faGamepad, faHeadset, faBox, faShoppingCart, faArrowRight, faArrowLeft, faXmark } from '@fortawesome/free-solid-svg-icons'
import CartItem from '../CartItem/CartItem.jsx'
import './MobileBottomNav.css'

function MobileBottomNav({ locale, onProfileClick }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [showCartModal, setShowCartModal] = useState(false)

  const loadCart = () => {
    try {
      const saved = localStorage.getItem('package_cart')
      setCartItems(saved ? JSON.parse(saved) : [])
    } catch {
      setCartItems([])
    }
  }

  useEffect(() => {
    loadCart()
    window.addEventListener('cart-updated', loadCart)
    return () => window.removeEventListener('cart-updated', loadCart)
  }, [])

  const cartCount = cartItems.length
  const total = cartItems.reduce((sum, item) => sum + Number(item.final_price_iqd ?? item.price_iqd ?? 0) * (item.quantity || 1), 0)

  const handleRemove = (pkgId) => {
    const updated = cartItems.filter(item => item.id !== pkgId)
    setCartItems(updated)
    localStorage.setItem('package_cart', JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent('cart-updated'))
  }

  const handleUpdateQuantity = (pkgId, delta) => {
    const updated = cartItems.map(item =>
      item.id === pkgId
        ? { ...item, quantity: Math.max(1, Math.min(10, (item.quantity || 1) + delta)) }
        : item
    )
    setCartItems(updated)
    localStorage.setItem('package_cart', JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent('cart-updated'))
  }

  const handleCheckout = () => {
    setShowCartModal(false)
    navigate('/packages/checkout')
  }

  const isOnPackages = location.pathname === '/packages'

  const navItems = [
    { path: '/', icon: faHome, label: locale === 'ar' ? 'الرئيسية' : 'Home' },
    {
      key: isOnPackages ? 'cart' : 'packages',
      icon: isOnPackages ? faShoppingCart : faBox,
      label: isOnPackages
        ? (locale === 'ar' ? 'السلة' : 'Cart')
        : (locale === 'ar' ? 'الباقات' : 'Packages'),
      isCart: isOnPackages,
      path: isOnPackages ? undefined : '/packages'
    },
    { path: '/design', icon: faGamepad, label: locale === 'ar' ? 'تصميم' : 'Design', isCenter: true },
    { key: 'profile', icon: faUser, label: locale === 'ar' ? 'حسابي' : 'Profile', isProfile: true },
    { path: '/support', icon: faHeadset, label: locale === 'ar' ? 'الدعم' : 'Support' }
  ]

  const handleItemClick = (item) => {
    if (item.isProfile) {
      onProfileClick?.()
    } else if (item.isCart) {
      setShowCartModal(true)
    } else if (item.path) {
      navigate(item.path)
    }
  }

  return (
    <>
      <nav className={`mobile-bottom-nav ${showCartModal ? 'd-none' : ''}`}>
        <div className="mobile-bottom-nav__inner">
          {navItems.map((item) => {
            const isCenter = item.isCenter
            const isActive = item.isProfile
              ? location.pathname === '/profile'
              : item.path
                ? location.pathname === item.path
                : false
            return (
              <button
                key={item.key || item.path}
                onClick={() => handleItemClick(item)}
                className={`
                  mbn-item
                  ${isCenter ? 'mbn-item--center' : ''}
                  ${isActive ? 'mbn-item--active' : ''}
                `}
              >
                <span className={`mbn-icon ${isCenter ? 'mbn-icon--center' : ''}`}>
                  <FontAwesomeIcon icon={item.icon} />
                  {item.isCart && cartCount > 0 && (
                    <Badge bg="danger" className="mbn-cart-badge">
                      {cartCount}
                    </Badge>
                  )}
                </span>
                <span className={`mbn-text ${isCenter ? 'mbn-text--center' : ''}`}>{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      <Modal
        show={showCartModal}
        onHide={() => setShowCartModal(false)}
        centered
        className="mbn-cart-modal"
      >
        <Modal.Header>
          <Modal.Title className="mbn-cart-modal__title">
            <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
            {locale === 'ar' ? 'السلة' : 'Cart'}
            <span className="text-muted ms-2 small">
              ({cartItems.length} {locale === 'ar' ? 'عناصر' : 'items'})
            </span>
          </Modal.Title>
          <button
            className="modal-close-btn"
            onClick={() => setShowCartModal(false)}
            aria-label={locale === 'ar' ? 'إغلاق' : 'Close'}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </Modal.Header>

        <Modal.Body className="mbn-cart-modal__body">
          {cartItems.length === 0 ? (
            <p className="text-muted text-center py-4 mb-0">
              {locale === 'ar' ? 'سلتك فارغة' : 'Your cart is empty'}
            </p>
          ) : (
            cartItems.map(item => (
              <CartItem key={item.id} item={item} locale={locale} onRemove={handleRemove} onUpdateQuantity={handleUpdateQuantity} />
            ))
          )}
        </Modal.Body>

        {cartItems.length > 0 && (
          <Modal.Footer>
            <div className="mbn-cart-modal__total w-100">
              <span className="text-muted">{locale === 'ar' ? 'المجموع' : 'Total'}:</span>
              <span className="fw-bold fs-5 ms-2">{total.toLocaleString()} IQD</span>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="mbn-cart-modal__checkout w-100"
              onClick={handleCheckout}
            >
              {locale === 'ar' ? 'إتمام الطلب' : 'Proceed to Checkout'}
              <FontAwesomeIcon icon={locale === 'ar' ? faArrowLeft : faArrowRight} className="ms-2" />
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  )
}

export default MobileBottomNav