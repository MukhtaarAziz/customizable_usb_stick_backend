import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faPhone, faArrowLeft, faArrowRightFromBracket, faBox, faLocationDot, faMapLocation } from '@fortawesome/free-solid-svg-icons'
import OrderList from '../components/OrderList/OrderList.jsx'
import CustomPagination from '../components/CustomPagination/CustomPagination.jsx'
import './ProfilePage.css'

function ProfilePage({ user, onLogout, locale, t }) {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const ordersPerPage = 5

  useEffect(() => {
    async function loadOrders(page = 1) {
      try {
        setLoading(true)
        setError(null)

        if (!user) {
          setError(locale === 'ar' ? 'يرجى تسجيل الدخول' : 'Please login')
          setLoading(false)
          return
        }

        const token = user?.token || localStorage.getItem('authToken')

        if (!token) {
          setError(locale === 'ar' ? 'يرجى تسجيل الدخول' : 'Please login')
          setLoading(false)
          return
        }

        const response = await fetch(`/api/usb-stick-orders?page=${page}&per_page=${ordersPerPage}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(locale === 'ar' ? 'فشل تحميل الطلبات' : 'Failed to load orders')
        }

        const data = await response.json()

        let ordersArray = []
        if (Array.isArray(data)) {
          ordersArray = data
          setLastPage(1)
        } else if (data.data && Array.isArray(data.data)) {
          ordersArray = data.data
          setLastPage(data.meta?.last_page || 1)
        } else if (data.data && typeof data.data === 'object') {
          ordersArray = [data.data]
          setLastPage(1)
        }

        setOrders(ordersArray)
        setCurrentPage(page)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadOrders(1)
  }, [user, locale])

  const handlePageChange = (page) => {
    loadOrders(page)
  }

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  if (!user) {
    return (
      <div className="profile-page">
        <Container className="py-5">
          <div className="text-center">
            <p>{locale === 'ar' ? 'يرجى تسجيل الدخول أولاً' : 'Please login first'}</p>
            <Button onClick={() => navigate('/')} variant="primary">
              {locale === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
            </Button>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <Container className="py-4 py-md-5">
        <Row className="mb-3 mb-md-4">
          <Col>
            <Button
              variant="outline-secondary"
              onClick={() => navigate(-1)}
              size="sm"
              className="rounded-pill px-3"
            >
              <FontAwesomeIcon icon={faArrowLeft} className={locale === 'ar' ? '' : 'me-1'} />
              <span className={locale === 'ar' ? 'me-1' : ''}>{locale === 'ar' ? 'رجوع' : 'Back'}</span>
            </Button>
          </Col>
        </Row>

        <Row>
          <Col xl={10} className="mx-auto">
            <Card className="profile-header-card shadow-sm mb-4">
              <Card.Body className="p-3 p-md-4">
                <div className="d-flex align-items-center flex-wrap gap-3">
                  <div className="profile-avatar-lg">
                    <FontAwesomeIcon icon={faUser} size="3x" />
                  </div>
                  <div className="flex-grow-1 text-center text-md-start">
                    <h2 className="fw-bold mb-1">{user.name}</h2>
                    <p className="mb-0" style={{ opacity: 0.8 }}>
                      {locale === 'ar' ? 'الملف الشخصي' : 'Profile'}
                    </p>
                  </div>
                  <Button
                    variant="outline-danger"
                    onClick={handleLogout}
                    size="sm"
                    className="rounded-pill px-3"
                  >
                    <FontAwesomeIcon icon={faArrowRightFromBracket} className={locale === 'ar' ? 'ms-1' : 'me-1'} />
                    {locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                  </Button>
                </div>
              </Card.Body>
            </Card>

            <Row className="g-3 g-md-4">
              <Col xs={12} lg={5}>
                <Card className="profile-panel shadow-sm h-100">
                  <Card.Body className="p-3 p-md-4">
                    <div className="d-flex align-items-center gap-3 mb-3 mb-md-4">
                      <div className="panel-icon">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                      <h5 className="fw-bold mb-0">
                        {locale === 'ar' ? 'المعلومات الشخصية' : 'Personal Info'}
                      </h5>
                    </div>

                    <div className="d-flex flex-column gap-2 gap-md-3">
                      <div className="info-row">
                        <div className="info-icon">
                          <FontAwesomeIcon icon={faUser} />
                        </div>
                        <div className="info-content">
                          <span className="info-label">{locale === 'ar' ? 'الاسم الكامل' : 'Full Name'}</span>
                          <p className="info-value">{user.name}</p>
                        </div>
                      </div>

                      {user.email && (
                        <div className="info-row">
                          <div className="info-icon">
                            <FontAwesomeIcon icon={faEnvelope} />
                          </div>
                          <div className="info-content">
                            <span className="info-label">{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</span>
                            <p className="info-value">{user.email}</p>
                          </div>
                        </div>
                      )}

                      {user.phone && (
                        <div className="info-row">
                          <div className="info-icon">
                            <FontAwesomeIcon icon={faPhone} />
                          </div>
                          <div className="info-content">
                            <span className="info-label">{locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</span>
                            <p className="info-value" dir="ltr">{user.phone}</p>
                          </div>
                        </div>
                      )}

                      {user.governorate && (
                        <div className="info-row">
                          <div className="info-icon">
                            <FontAwesomeIcon icon={faLocationDot} />
                          </div>
                          <div className="info-content">
                            <span className="info-label">{locale === 'ar' ? 'المحافظة' : 'Governorate'}</span>
                            <p className="info-value">
                              {locale === 'ar' ? user.governorate.name_ar : user.governorate.name_en}
                            </p>
                          </div>
                        </div>
                      )}

                      {user.address && (
                        <div className="info-row">
                          <div className="info-icon">
                            <FontAwesomeIcon icon={faMapLocation} />
                          </div>
                          <div className="info-content">
                            <span className="info-label">{locale === 'ar' ? 'العنوان' : 'Address'}</span>
                            <p className="info-value">{user.address}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} lg={7}>
                <Card className="profile-panel shadow-sm h-100">
                  <Card.Body className="p-3 p-md-4">
                    <div className="d-flex align-items-center gap-3 mb-3 mb-md-4">
                      <div className="panel-icon panel-icon--orders">
                        <FontAwesomeIcon icon={faBox} />
                      </div>
                      <div>
                        <h5 className="fw-bold mb-0">
                          {locale === 'ar' ? 'طلباتي' : 'My Orders'}
                        </h5>
                        <p className="text-muted small mb-0">
                          {locale === 'ar' ? 'سجل طلباتك المخصصة لفلاشات USB' : 'Your customized USB stick orders'}
                        </p>
                      </div>
                    </div>

                    <div className="orders-content-wrapper">
                      <OrderList
                        orders={orders}
                        locale={locale}
                        loading={loading}
                        error={error}
                      />

                      {!loading && !error && orders.length > 0 && (
                        <div className="orders-pagination mt-3 mt-md-4">
                          <CustomPagination
                            page={currentPage}
                            lastPage={lastPage}
                            onPageChange={handlePageChange}
                            locale={locale}
                          />
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ProfilePage
