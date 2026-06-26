import { Container, Row, Col, Button } from 'react-bootstrap'
import './HeroSection.css'

function HeroSection({ onBrowse, t }) {
  return (
    <section className="landing-hero py-5 bg-primary text-white">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} className="text-center">
            <p className="text-uppercase fw-semibold mb-2 opacity-75">{t.heroSmall}</p>
            <h1 className="display-5 fw-bold mb-4">{t.heroTitle}</h1>
            <p className="lead mb-4">{t.heroCopy}</p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Button variant="light" size="lg" onClick={onBrowse}>
                {t.browsePackages}
              </Button>
              <Button variant="outline-light" size="lg" href="#packages-section">
                {t.learnMore}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default HeroSection
