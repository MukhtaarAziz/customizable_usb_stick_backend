import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeadset, faEnvelope, faPhone, faClock, faMapLocation } from '@fortawesome/free-solid-svg-icons'
import './SupportPage.css'

export default function SupportPage({ locale, t }) {
  const handleContactSubmit = (e) => {
    e.preventDefault()
    // Handle contact form submission later
    alert(locale === 'ar' ? 'شكراً على تواصلك معنا!' : 'Thank you for contacting us!')
  }

  return (
    <Container className="support-page py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-3">
          <FontAwesomeIcon icon={faHeadset} className="me-2" />
          {locale === 'ar' ? 'الدعم الفني' : 'Technical Support'}
        </h1>
        <p className="text-muted lead">
          {locale === 'ar'
            ? 'نحن هنا للمساعدة. اتصل بنا عبر أي من القنوات أدناه'
            : 'We are here to help. Contact us through any of the channels below'}
        </p>
      </div>

      {/* Contact Methods */}
      <Row className="g-4 mb-5">
        <Col md={6} lg={3}>
          <Card className="support-card h-100 text-center">
            <Card.Body>
              <div className="support-icon mb-3">
                <FontAwesomeIcon icon={faEnvelope} size="2x" />
              </div>
              <h5>{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</h5>
              <p className="text-muted mb-0">support@customusb.com</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="support-card h-100 text-center">
            <Card.Body>
              <div className="support-icon mb-3">
                <FontAwesomeIcon icon={faPhone} size="2x" />
              </div>
              <h5>{locale === 'ar' ? 'الهاتف' : 'Phone'}</h5>
              <p className="text-muted mb-0">+964 (0) 123 456 789</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="support-card h-100 text-center">
            <Card.Body>
              <div className="support-icon mb-3">
                <FontAwesomeIcon icon={faClock} size="2x" />
              </div>
              <h5>{locale === 'ar' ? 'ساعات العمل' : 'Business Hours'}</h5>
              <p className="text-muted mb-0">24/7 {locale === 'ar' ? 'طوال الأسبوع' : 'Support'}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="support-card h-100 text-center">
            <Card.Body>
              <div className="support-icon mb-3">
                <FontAwesomeIcon icon={faMapLocation} size="2x" />
              </div>
              <h5>{locale === 'ar' ? 'الموقع' : 'Location'}</h5>
              <p className="text-muted mb-0">{locale === 'ar' ? 'بغداد، العراق' : 'Baghdad, Iraq'}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* FAQ Section */}
      <div className="mb-5">
        <h3 className="fw-bold mb-4">{locale === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</h3>
        <Row className="g-4">
          <Col lg={6}>
            <div className="faq-item">
              <h6 className="fw-bold mb-2">{locale === 'ar' ? 'كيف أطلب فلاش USB مخصص؟' : 'How do I order a custom USB?'}</h6>
              <p className="text-muted">
                {locale === 'ar'
                  ? 'يمكنك الذهاب إلى قسم "صمم USB" واختيار الألعاب التي تريدها، ثم متابعة عملية الشراء.'
                  : 'Go to the "Design Your USB" section, select your desired games, and proceed with checkout.'}
              </p>
            </div>
          </Col>
          <Col lg={6}>
            <div className="faq-item">
              <h6 className="fw-bold mb-2">{locale === 'ar' ? 'كم يستغرق الشحن؟' : 'How long is shipping?'}</h6>
              <p className="text-muted">
                {locale === 'ar'
                  ? 'يتم الشحن عادة خلال 3-5 أيام عمل من تأكيد الطلب.'
                  : 'Shipping typically takes 3-5 business days from order confirmation.'}
              </p>
            </div>
          </Col>
          <Col lg={6}>
            <div className="faq-item">
              <h6 className="fw-bold mb-2">{locale === 'ar' ? 'هل يمكن تعديل الطلب بعد إرساله؟' : 'Can I modify my order after sending?'}</h6>
              <p className="text-muted">
                {locale === 'ar'
                  ? 'يمكنك تعديل الطلب خلال 24 ساعة من الإرسال. اتصل بنا فوراً للمساعدة.'
                  : 'You can modify your order within 24 hours. Contact us immediately for assistance.'}
              </p>
            </div>
          </Col>
          <Col lg={6}>
            <div className="faq-item">
              <h6 className="fw-bold mb-2">{locale === 'ar' ? 'ما الألعاب المتاحة؟' : 'What games are available?'}</h6>
              <p className="text-muted">
                {locale === 'ar'
                  ? 'نقدم مجموعة واسعة من الألعاب المحسّنة على عدة منصات. اعرض قسم "صمم USB" لجميع الخيارات.'
                  : 'We offer a wide range of optimized games across multiple platforms. View the "Design Your USB" section for all options.'}
              </p>
            </div>
          </Col>
        </Row>
      </div>

      {/* Contact Form */}
      <div className="contact-form-section">
        <h3 className="fw-bold mb-4">{locale === 'ar' ? 'أرسل لنا رسالة' : 'Send us a Message'}</h3>
        <Row>
          <Col lg={8} className="mx-auto">
            <Card className="p-4">
              <Form onSubmit={handleContactSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>{locale === 'ar' ? 'الاسم' : 'Name'}</Form.Label>
                  <Form.Control type="text" placeholder={locale === 'ar' ? 'أدخل اسمك' : 'Enter your name'} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Form.Label>
                  <Form.Control type="email" placeholder={locale === 'ar' ? 'أدخل بريدك' : 'Enter your email'} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{locale === 'ar' ? 'الموضوع' : 'Subject'}</Form.Label>
                  <Form.Control type="text" placeholder={locale === 'ar' ? 'موضوع رسالتك' : 'Message subject'} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{locale === 'ar' ? 'الرسالة' : 'Message'}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder={locale === 'ar' ? 'أدخل رسالتك' : 'Enter your message'}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  {locale === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  )
}
