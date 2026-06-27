import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faRedo, faUser } from '@fortawesome/free-solid-svg-icons'
import './SuccessScreen.css'

function SuccessScreen({ locale, langText, user, onReset, onGoToProfile }) {
  return (
    <div className="success-screen">
      <div className="success-screen__icon">
        <FontAwesomeIcon icon={faCheckCircle} />
      </div>
      
      <h2 className="success-screen__title fw-bold mb-3">
        {langText.successTitle}
      </h2>
      <p className="success-screen__desc text-muted mx-auto mb-4">
        {langText.successDesc}
      </p>

      <div className="success-screen__actions d-flex justify-content-center gap-3">
        <Button variant="primary" size="lg" onClick={onReset}>
          <FontAwesomeIcon icon={faRedo} className={locale === 'ar' ? 'ms-2' : 'me-2'} />
          {langText.designNew}
        </Button>
        {user && onGoToProfile && (
          <Button href="/profile" variant="outline-secondary" size="lg" onClick={onGoToProfile}>
            <FontAwesomeIcon icon={faUser} className={locale === 'ar' ? 'ms-2' : 'me-2'} />
            {langText.goProfile}
          </Button>
        )}
      </div>
    </div>
  )
}

export default SuccessScreen