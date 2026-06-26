import { useState } from 'react'
import { Form, InputGroup, Button, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUser, 
  faPhone, 
  faEnvelope, 
  faMapMarkerAlt, 
  faBuilding,
  faExclamationTriangle,
  faSpinner,
  faCheck
} from '@fortawesome/free-solid-svg-icons'
import './CheckoutForm.css'

function CheckoutForm({
  checkoutForm,
  validationError,
  isSubmitting,
  governorates,
  locale,
  langText,
  user,
  onFormChange,
  onSubmit,
  onBack
}) {
  const validateIraqiPhone = (number) => {
    const cleanNumber = number.replace(/[\s-]/g, '')
    const pattern = /^(\+964|0)(770|771|772|773|790|791|792|793|794|780|781|782|783|784)\d{7}$/
    return pattern.test(cleanNumber)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className="checkout-form">
      {validationError && (
        <Alert variant="danger" className="py-2.5 small">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {validationError}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <div className="checkout-form__grid">
          <div className="checkout-form__field">
            <Form.Label className="fw-semibold small">{langText.customerName} *</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-transparent text-muted">
                <FontAwesomeIcon icon={faUser} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                name="name"
                value={checkoutForm.name}
                onChange={onFormChange}
                placeholder={locale === 'ar' ? 'أدخل اسمك الثلاثي الكامل' : 'Enter your full name'}
                required
                disabled={user !== null}
              />
            </InputGroup>
          </div>

          <div className="checkout-form__field">
            <Form.Label className="fw-semibold small">{langText.customerPhone} *</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-transparent text-muted">
                <FontAwesomeIcon icon={faPhone} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                name="phone"
                value={checkoutForm.phone}
                onChange={onFormChange}
                placeholder="e.g. 07701234567"
                required
                disabled={user !== null}
                isInvalid={checkoutForm.phone && !validateIraqiPhone(checkoutForm.phone)}
              />
              {checkoutForm.phone && !validateIraqiPhone(checkoutForm.phone) && (
                <Form.Control.Feedback type="invalid" className="small">
                  {langText.invalidPhone}
                </Form.Control.Feedback>
              )}
            </InputGroup>
          </div>

          <div className="checkout-form__field">
            <Form.Label className="fw-semibold small">{langText.customerEmail}</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-transparent text-muted">
                <FontAwesomeIcon icon={faEnvelope} />
              </InputGroup.Text>
              <Form.Control
                type="email"
                name="email"
                value={checkoutForm.email}
                onChange={onFormChange}
                placeholder="name@example.com"
                disabled={user !== null}
              />
            </InputGroup>
          </div>

          <div className="checkout-form__field">
            <Form.Label className="fw-semibold small">{langText.customerGov} *</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-transparent text-muted">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </InputGroup.Text>
              <Form.Select
                name="governorate_id"
                value={checkoutForm.governorate_id}
                onChange={onFormChange}
                required
              >
                <option value="">{langText.govPlaceholder}</option>
                {governorates.map((gov) => (
                  <option key={gov.id} value={gov.id}>
                    {locale === 'ar' ? gov.name_ar || gov.name_en : gov.name_en || gov.name_ar}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </div>

          <div className="checkout-form__field checkout-form__field--full">
            <Form.Label className="fw-semibold small">{langText.customerAddress} *</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-transparent text-muted">
                <FontAwesomeIcon icon={faBuilding} />
              </InputGroup.Text>
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                value={checkoutForm.address}
                onChange={onFormChange}
                placeholder={langText.addressPlaceholder}
                required
              />
            </InputGroup>
          </div>

          <div className="checkout-form__field checkout-form__field--full">
            <Form.Label className="fw-semibold small">{langText.customerPoint}</Form.Label>
            <Form.Control
              type="text"
              name="nearest_service_point"
              value={checkoutForm.nearest_service_point}
              onChange={onFormChange}
              placeholder={langText.pointPlaceholder}
            />
          </div>
        </div>

        <div className="checkout-form__actions mt-4">
          <Button
            variant="outline-secondary"
            onClick={onBack}
            className="checkout-form__btn-back"
          >
            <FontAwesomeIcon icon={locale === 'ar' ? faCheck : faUser} className={locale === 'ar' ? 'ms-2' : 'me-2'} />
            <span className="checkout-form__btn-text">{langText.backToGames}</span>
          </Button>

          <Button
            type="submit"
            variant="success"
            className="checkout-form__btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                <span className="checkout-form__btn-text">{langText.submitLoading}</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCheck} />
                <span className="checkout-form__btn-text">{langText.confirmOrder}</span>
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default CheckoutForm