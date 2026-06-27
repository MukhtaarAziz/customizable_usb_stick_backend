import { useEffect, useState } from 'react'
import { Row, Col, Card, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faShoppingCart, faUsers, faDollarSign } from '@fortawesome/free-solid-svg-icons'

const API_URL = '/api/admin/dashboard'
const TOKEN_KEY = 'authToken'
const CURRENCY = 'IQD'

const cardsConfig = [
  { icon: faBox, label: 'Total Packages', key: 'total_packages', color: '#6366f1' },
  { icon: faShoppingCart, label: 'Total Orders', key: 'total_orders', color: '#f59e0b' },
  { icon: faUsers, label: 'Total Users', key: 'total_users', color: '#22c55e' },
  { icon: faDollarSign, label: 'Revenue', key: 'total_revenue', color: '#ef4444' },
]

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem(TOKEN_KEY)
        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setStats(data.data ?? data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return <div className="text-center py-5"><Spinner animation="border" /></div>
  }

  const cards = cardsConfig.map(c => ({
    ...c,
    value: c.key === 'total_revenue'
      ? `${(stats?.[c.key] ?? 0).toLocaleString()} ${CURRENCY}`
      : (stats?.[c.key] ?? 0),
  }))

  return (
    <>
      <h4 className="fw-bold mb-4">Dashboard</h4>
      <Row className="g-4">
        {cards.map((card, i) => (
          <Col key={i} xs={12} sm={6} xl={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: 48, height: 48, background: `${card.color}15`, color: card.color, fontSize: '1.3rem' }}>
                  <FontAwesomeIcon icon={card.icon} />
                </div>
                <div>
                  <div className="text-muted small">{card.label}</div>
                  <div className="fw-bold fs-5">{card.value}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default Dashboard