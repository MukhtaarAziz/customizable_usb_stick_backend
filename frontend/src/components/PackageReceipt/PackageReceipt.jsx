import { Card, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faGamepad, faCode, faTag, faTimes } from '@fortawesome/free-solid-svg-icons'
import './PackageReceipt.css'

function PackageReceipt({ packages, locale, langText }) {
  const total = packages.reduce((sum, pkg) => {
    const qty = pkg.quantity || 1
    return sum + Number(pkg.final_price_iqd ?? pkg.price_iqd ?? 0) * qty
  }, 0)

  return (
    <Card className="package-receipt-card h-100">
      <Card.Body className="p-4">
        <h5 className="fw-bold mb-3 pb-2 border-bottom">
          {langText.receiptTitle || (locale === 'ar' ? 'ملخص الطلب' : 'Order Summary')}
        </h5>

        {packages.map((pkg) => {
          const name = locale === 'ar' ? pkg.name_ar || pkg.name_en : pkg.name_en || pkg.name_ar
          const platformName = locale === 'ar'
            ? pkg.platform?.name_ar || pkg.platform?.name_en
            : pkg.platform?.name_en || pkg.platform?.name_ar
          const games = pkg.games ?? []
          const programs = pkg.programs ?? []
          const hasDiscount = pkg.discount > 0
          const unitPrice = pkg.final_price_iqd ?? pkg.price_iqd ?? 0
          const qty = pkg.quantity || 1
          const lineTotal = unitPrice * qty

          return (
            <div key={pkg.id} className="mb-3 pb-3 border-bottom">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <strong className="fs-6">{name}</strong>
                  <div className="text-muted small">{platformName}</div>
                </div>
                <div className="text-end">
                  {hasDiscount && (
                    <div className="text-decoration-line-through text-muted small">
                      {(pkg.price_iqd * qty)?.toLocaleString()} IQD
                    </div>
                  )}
                  <div className="fw-bold fs-6">{lineTotal.toLocaleString()} IQD</div>
                  <span className="text-muted small">
                    {qty} <FontAwesomeIcon icon={faTimes} className="mx-1" />{unitPrice.toLocaleString()} IQD
                  </span>
                  {hasDiscount && (
                    <Badge bg="danger" className="mt-1 d-block">
                      <FontAwesomeIcon icon={faTag} className="me-1" />-{Math.round(pkg.discount * 100)}%
                    </Badge>
                  )}
                </div>
              </div>

              {games.length > 0 && (
                <div className="small text-muted mb-1">
                  <FontAwesomeIcon icon={faGamepad} className="me-1" />
                  {locale === 'ar' ? 'الألعاب' : 'Games'}: {games.map(g => locale === 'ar' ? g.name_ar || g.name_en : g.name_en || g.name_ar).join(', ')}
                </div>
              )}

              {programs.length > 0 && (
                <div className="small text-muted">
                  <FontAwesomeIcon icon={faCode} className="me-1" />
                  {locale === 'ar' ? 'البرامج' : 'Programs'}: {programs.map(p => locale === 'ar' ? p.name_ar || p.name_en : p.name_en || p.name_ar).join(', ')}
                </div>
              )}
            </div>
          )
        })}

        <div className="d-flex justify-content-between align-items-center pt-2">
          <span className="fw-bold fs-5">{locale === 'ar' ? 'المجموع الكلي' : 'Total'}:</span>
          <span className="fw-bold fs-5">{total.toLocaleString()} IQD</span>
        </div>
      </Card.Body>
    </Card>
  )
}

export default PackageReceipt
