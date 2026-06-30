import { useEffect, useState } from 'react'
import { Row, Col, Spinner } from 'react-bootstrap'
import StatCard from '../../components/admins/StatCard'
import { faBox, faClipboardList, faShoppingCart, faUsers, faUserFriends, faGamepad, faMicrochip, faDollarSign } from '@fortawesome/free-solid-svg-icons'

const API_URL = '/api/admin/dashboard'
const TOKEN_KEY = 'authToken'
const CURRENCY = 'IQD'

const cardsConfig = [
  { icon: faBox, label: 'Total Packages', key: 'total_packages', color: '#6366f1' },
  { icon: faClipboardList, label: 'Package Orders', key: 'total_package_orders', color: '#8b5cf6' },
  { icon: faShoppingCart, label: 'Total Orders', key: 'total_orders', color: '#f59e0b' },
  { icon: faDollarSign, label: 'Revenue', key: 'total_revenue', color: '#ef4444' },
]

const secondaryCardsConfig = [
  { icon: faUsers, label: 'Total Users', key: 'total_users', color: '#22c55e' },
  { icon: faUserFriends, label: 'Total Customers', key: 'total_customers', color: '#14b8a6' },
  { icon: faGamepad, label: 'Games & Programs', key: 'total_games_programs', color: '#f97316' },
  { icon: faMicrochip, label: 'Storage Device Types', key: 'total_storage_device_types', color: '#06b6d4' },
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

  const buildCards = config =>
    config.map(c => ({
      ...c,
      value: c.key === 'total_revenue'
        ? `${(stats?.[c.key] ?? 0).toLocaleString()} ${CURRENCY}`
        : c.key === 'total_games_programs'
          ? ((stats?.total_games ?? 0) + (stats?.total_programs ?? 0)).toLocaleString()
          : (stats?.[c.key] ?? 0),
    }))

  const primaryCards = buildCards(cardsConfig)
  const secondaryCards = buildCards(secondaryCardsConfig)

  return (
    <>
      <h4 className="fw-bold mb-4">Dashboard</h4>
      <Row className="g-4 mb-4">
        {primaryCards.map((card, i) => (
          <Col key={i} xs={12} sm={6} xl={3}>
            <StatCard icon={card.icon} label={card.label} value={card.value} color={card.color} />
          </Col>
        ))}
      </Row>
      <Row className="g-4">
        {secondaryCards.map((card, i) => (
          <Col key={i} xs={12} sm={6} xl={3}>
            <StatCard icon={card.icon} label={card.label} value={card.value} color={card.color} />
          </Col>
        ))}
      </Row>
    </>
  )
}

export default Dashboard
