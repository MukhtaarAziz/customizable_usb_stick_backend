import { useState, useEffect } from 'react'
import { API_BASE, AUTH_CONFIG } from '../../config'
import { Modal, Button, Form, Nav } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import './AuthModal.css'

function AuthModal({ show, onClose, onAuth, locale }) {
  const [activeTab, setActiveTab] = useState('login')
  const [loginData, setLoginData] = useState({ identifier: '', password: '' })
  const [registerData, setRegisterData] = useState({ name: '', identifier: '', password: '', confirmPassword: '', governorate_id: '' })
  const [governorates, setGovernorates] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const translations = {
    en: {
      phone: 'Phone',
      login: 'Login',
      register: 'Register',
      emailOrPhone: 'Email or phone',
      password: 'Password',
      name: 'Name',
      confirmPassword: 'Confirm Password',
      enterEmail: 'Enter email or phone',
      enterName: 'Enter your name',
      enterPassword: 'Enter password',
      confirmPasswordPlaceholder: 'Confirm your password',
      close: 'Close',
      submit: 'Login',
      submitRegister: 'Register',
      passwordMinLength: 'Password must be at least 8 characters.',
      passwordNoSpaces: 'Password cannot contain spaces.',
      passwordsMismatch: 'Passwords do not match.',
      fillAllFields: 'Please fill all fields.',
      noAccount: "Don't have an account?",
      registerNow: 'Register now',
      haveAccount: 'Already have an account?',
      loginNow: 'Login now',
    },
    ar: {
      login: 'تسجيل الدخول',
      register: 'تسجيل',
      emailOrPhone: 'البريد الإلكتروني أو رقم الهاتف',
      password: 'كلمة المرور',
      name: 'الاسم',
      confirmPassword: 'تأكيد كلمة المرور',
      enterEmail: 'ادخل البريد الإلكتروني أو رقم الهاتف',
      enterName: 'ادخل اسمك',
      enterPassword: 'ادخل كلمة المرور',
      confirmPasswordPlaceholder: 'أكد كلمة المرور',
      close: 'إغلاق',
      submit: 'دخول',
      submitRegister: 'تسجيل',
      passwordMinLength: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل.',
      passwordNoSpaces: 'كلمة المرور لا يمكن أن تحتوي على فراغات.',
      passwordsMismatch: 'كلمات المرور غير متطابقة.',
      fillAllFields: 'يرجى ملء جميع الحقول.',
      noAccount: 'ليس لديك حساب؟',
      registerNow: 'سجل الآن',
      haveAccount: 'هل لديك حساب بالفعل؟',
      loginNow: 'ادخل الآن',
    },
  }


  const labels = (translations && translations[locale]) ? translations[locale] : (translations.en || {})

  const validatePassword = (password) => {
    if (password.length < (AUTH_CONFIG?.minPasswordLength ?? 8)) {
      setError(labels.passwordMinLength)
      return false
    }
    if (/\s/.test(password)) {
      setError(labels.passwordNoSpaces)
      return false
    }
    return true
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!loginData.identifier || !loginData.password) {
      setError(labels.fillAllFields)
      return
    }

    if (!validatePassword(loginData.password)) {
      return
    }

    setIsLoading(true)

    ;(async () => {
      try {
        const payload = loginData.identifier.includes('@')
          ? { email: loginData.identifier, password: loginData.password }
          : { phone: loginData.identifier, password: loginData.password }

        const response = await fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          // Handle validation errors (Laravel returns errors object) or message
          if (data && data.errors) {
            const firstKey = Object.keys(data.errors)[0]
            setError(data.errors[firstKey][0])
          } else if (data && data.message) {
            setError(data.message)
          } else {
            setError(locale === 'ar' ? 'فشل تسجيل الدخول.' : 'Login failed.')
          }
          setIsLoading(false)
          return
        }

        // Normalize response: token/access_token, user, settings
        const token = data.token ?? data.access_token ?? (data.data && data.data.token) ?? null
        const user = data.user ?? data.data ?? data
        const settings = data.settings ?? data.site_settings ?? null

        if (token) localStorage.setItem('authToken', token)
        if (user) localStorage.setItem('user', JSON.stringify(user))
        if (settings) localStorage.setItem('siteSettings', JSON.stringify(settings))

        if (typeof onAuth === 'function') onAuth({ user, token, settings })
        setLoginData({ identifier: '', password: '' })
      } catch (err) {
        console.error(err)
        setError(locale === 'ar' ? 'حدث خطأ أثناء الاتصال بالخادم.' : 'An error occurred contacting the server.')
      } finally {
        setIsLoading(false)
      }
    })()
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!registerData.name || !registerData.identifier || !registerData.password || !registerData.confirmPassword) {
      setError(labels.fillAllFields)
      return
    }

    if (!validatePassword(registerData.password)) {
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError(labels.passwordsMismatch)
      return
    }

    setIsLoading(true)
    const payload = {
      id: Math.random(),
      name: registerData.name,
      email: registerData.identifier.includes('@') ? registerData.identifier : undefined,
      phone: !registerData.identifier.includes('@') ? registerData.identifier : undefined,
    }

    setTimeout(() => {
      if (typeof onAuth === 'function') onAuth(payload)
      setRegisterData({ name: '', identifier: '', password: '', confirmPassword: '' })
      setIsLoading(false)
    }, 500)
  }

  const handleClose = () => {
    setError('')
    setLoginData({ identifier: '', password: '' })
    setRegisterData({ name: '', identifier: '', password: '', confirmPassword: '' })
    if (typeof onClose === 'function') onClose()
  }

  return (
    <Modal show={show} onHide={handleClose} centered className="auth-modal">
      <Modal.Header>
        <Modal.Title>{activeTab === 'login' ? labels.login : labels.register}</Modal.Title>
        <button className="modal-close-btn" onClick={handleClose} aria-label={labels.close}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </Modal.Header>

      <Modal.Body>
        {/* Tabs */}
        <Nav variant="tabs" className="mb-4" activeKey={activeTab} onSelect={(k) => { setError(''); if (k) setActiveTab(k) }}>
          <Nav.Item>
            <Nav.Link eventKey="login" className={activeTab === 'login' ? 'active' : ''}>
              {labels.login}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="register" className={activeTab === 'register' ? 'active' : ''}>
              {labels.register}
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {/* Error Message */}
        {error && <div className="alert alert-danger mb-3">{error}</div>}

        {/* Login Form */}
        {activeTab === 'login' && (
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>{labels.emailOrPhone}</Form.Label>
              <Form.Control
                type="text"
                value={loginData.identifier}
                onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
                placeholder={labels.enterEmail}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{labels.password}</Form.Label>
              <Form.Control
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder={labels.enterPassword}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100" disabled={isLoading}>
              {isLoading ? '...' : labels.submit}
            </Button>
            <div className="mt-3 text-center">
              <small className="text-muted">
                {labels.noAccount}{' '}
                <button
                  type="button"
                  className="btn-link-auth"
                  onClick={() => { setError(''); setActiveTab('register') }}
                >
                  {labels.registerNow}
                </button>
              </small>
            </div>
          </Form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <Form onSubmit={handleRegisterSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>{labels.name}</Form.Label>
              <Form.Control
                type="text"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                placeholder={labels.enterName}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{labels.emailOrPhone}</Form.Label>
              <Form.Control
                type="text"
                value={registerData.identifier}
                onChange={(e) => setRegisterData({ ...registerData, identifier: e.target.value })}
                placeholder={labels.enterEmail}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{labels.password}</Form.Label>
              <Form.Control
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                placeholder={labels.enterPassword}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{labels.confirmPassword}</Form.Label>
              <Form.Control
                type="password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                placeholder={labels.confirmPasswordPlaceholder}
                required
              />
            </Form.Group>
            <Button type="submit" variant="success" className="w-100" disabled={isLoading}>
              {isLoading ? '...' : labels.submitRegister}
            </Button>
            <div className="mt-3 text-center">
              <small className="text-muted">
                {labels.haveAccount}{' '}
                <button
                  type="button"
                  className="btn-link-auth"
                  onClick={() => { setError(''); setActiveTab('login') }}
                >
                  {labels.loginNow}
                </button>
              </small>
            </div>
          </Form>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {labels.close}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AuthModal
