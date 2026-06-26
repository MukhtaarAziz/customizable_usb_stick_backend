import { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

function LoginModal({ show, onClose, onLogin, locale }) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()

    if (password.length < 8) {
      setError(locale === 'ar' ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل.' : 'Password must be at least 8 characters.')
      return
    }

    if (/\s/.test(password)) {
      setError(locale === 'ar' ? 'كلمة المرور لا يمكن أن تحتوي على فراغات.' : 'Password cannot contain spaces.')
      return
    }

    setError('')

    const payload = {
      id: 1,
      name: 'Demo User',
      password,
    }

    if (identifier.includes('@')) {
      payload.email = identifier
    } else {
      payload.phone = identifier
    }

    onLogin(payload)
    onClose()
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Form onSubmit={submit}>
        <Modal.Header closeButton>
          <Modal.Title>{locale === 'ar' ? 'تسجيل الدخول' : 'Login'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>{locale === 'ar' ? 'البريد الإلكتروني أو رقم الهاتف' : 'Email or phone'}</Form.Label>
            <Form.Control
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={locale === 'ar' ? 'ادخل البريد الإلكتروني أو رقم الهاتف' : 'Enter email or phone'}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{locale === 'ar' ? 'كلمة المرور' : 'Password'}</Form.Label>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <div className="text-danger mt-2">{error}</div>}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>{locale === 'ar' ? 'إغلاق' : 'Close'}</Button>
          <Button type="submit" variant="primary">{locale === 'ar' ? 'دخول' : 'Login'}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default LoginModal
