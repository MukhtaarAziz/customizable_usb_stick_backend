import { Container, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faHome } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

function NotFoundPage({ locale, t, onNavigate }) {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <Container className="py-5">
      <div className="text-center py-5">
        <FontAwesomeIcon 
          icon={faExclamationTriangle} 
          style={{ fontSize: '6rem', color: '#ff6b35', marginBottom: '2rem' }}
        />
        
        <h1 className="display-1 fw-bold mb-3">404</h1>
        <h2 className="mb-4">
          {locale === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </h2>
        <p className="text-muted mb-5" style={{ maxWidth: '500px', margin: '0 auto' }}>
          {locale === 'ar'
            ? 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم حذفها.'
            : 'Sorry, the page you are looking for does not exist or has been removed.'}
        </p>

        <Button 
          variant="primary" 
          size="lg"
          onClick={handleGoHome}
        >
          <FontAwesomeIcon icon={faHome} className="me-2" />
          {locale === 'ar' ? 'العودة للرئيسية' : 'Go to Home'}
        </Button>
      </div>
    </Container>
  )
}

export default NotFoundPage