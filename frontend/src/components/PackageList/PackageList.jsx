import { Row, Col, Spinner, Alert } from 'react-bootstrap'
import PackageCard from '../PackageCard/PackageCard.jsx'
import './PackageList.css'

function PackageList({ packages, loading, error, locale, t, onViewPackage }) {
  if (loading) {
    return (
      <div className="package-list__loading text-center py-5">
        <Spinner animation="border" role="status" className="me-2" />
        <span>{t.loading}</span>
      </div>
    )
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>
  }

  if (!packages.length) {
    return <Alert variant="info">{t.noPackages}</Alert>
  }

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {packages.map((pkg) => (
        <Col key={pkg.id}>
          <PackageCard pkg={pkg} locale={locale} t={t} onView={onViewPackage} />
        </Col>
      ))}
    </Row>
  )
}

export default PackageList
