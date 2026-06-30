import { useState, useEffect } from 'react'
import { API_BASE, AUTH_CONFIG } from '../../config'
import { Modal, Button, Form, Nav } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import './AuthModal.css'

function AuthModal({ show, onClose, onAuth, locale }) {
  const [activeTab, setActiveTab] = useState('login')
  const [loginData, setLoginData] = useState({ identifier: '', password: '' })
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    email: '',
    identifier: '', 
    password: '', 
    confirmPassword: '', 
    governorate_id: '',
    address: '',
    nearest_service_point: ''
  })
  const [governorates, setGovernorates] = useState([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const translations = {
    en: {
      phone: 'Phone',
      login: 'Login',
      register: 'Register',
      emailOrPhone: 'Email or phone',
      password: 'Password',
      name: 'Full Name',
      email: 'Email (optional)',
      address: 'Address (optional)',
      nearestServicePoint: 'Nearest Service Point (optional)',
      confirmPassword: 'Confirm Password',
      governorate: 'Governorate',
      enterEmail: 'Enter email or phone',
      enterName: 'Enter your full name',
      enterPassword: 'Enter password',
      enterEmailAddr: 'Enter your email address',
      enterAddress: 'Enter your delivery address',
      enterServicePoint: 'e.g. Al-Mansour Mall, Korek branch',
      confirmPasswordPlaceholder: 'Confirm your password',
      selectGovernorate: '-- Select governorate --',
      close: 'Close',
      submit: 'Login',
      submitRegister: 'Register',
      // Validation errors
      passwordMinLength: 'Password must be at least 8 characters.',
      passwordNoSpaces: 'Password cannot contain spaces.',
      passwordsMismatch: 'Passwords do not match.',
      fillAllFields: 'Please fill all required fields.',
      invalidPhoneNumber: 'Please enter a valid Iraqi phone number (e.g., 07701234567, 07801234567).',
      invalidEmail: 'Please enter a valid email address.',
      nameTooLong: 'Name cannot exceed 255 characters.',
      emailTooLong: 'Email cannot exceed 255 characters.',
      addressTooLong: 'Address cannot exceed 255 characters.',
      phoneAlreadyRegistered: 'This phone number is already registered.',
      emailAlreadyRegistered: 'This email is already registered.',
      phoneUnique: 'This phone number is already in use.',
      emailUnique: 'This email is already in use.',
      noAccount: "Don't have an account?",
      registerNow: 'Register now',
      haveAccount: 'Already have an account?',
      loginNow: 'Login now',
    },
    ar: {
      phone: 'رقم الهاتف',
      login: 'تسجيل الدخول',
      register: 'تسجيل',
      emailOrPhone: 'البريد الإلكتروني أو رقم الهاتف',
      password: 'كلمة المرور',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني (اختياري)',
      address: 'العنوان (اختياري)',
      nearestServicePoint: 'أقرب نقطة خدمة (اختياري)',
      confirmPassword: 'تأكيد كلمة المرور',
      governorate: 'المحافظة',
      enterEmail: 'ادخل البريد الإلكتروني أو رقم الهاتف',
      enterName: 'ادخل اسمك الكامل',
      enterPassword: 'ادخل كلمة المرور',
      enterEmailAddr: 'ادخل بريدك الإلكتروني',
      enterAddress: 'ادخل عنوان التوصيل الخاص بك',
      enterServicePoint: 'مثلاً: مول المنصور، فرع كورك',
      confirmPasswordPlaceholder: 'أكد كلمة المرور',
      selectGovernorate: '-- اختر المحافظة --',
      close: 'إغلاق',
      submit: 'دخول',
      submitRegister: 'تسجيل',
      // Validation errors
      passwordMinLength: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل.',
      passwordNoSpaces: 'كلمة المرور لا يمكن أن تحتوي على فراغات.',
      passwordsMismatch: 'كلمات المرور غير متطابقة.',
      fillAllFields: 'يرجى ملء جميع الحقول المطلوبة.',
      invalidPhoneNumber: 'يرجى إدخال رقم هاتف عراقي صحيح (مثل: 07701234567، 07801234567).',
      invalidEmail: 'يرجى إدخال عنوان بريد إلكتروني صحيح.',
      nameTooLong: 'الاسم لا يمكن أن يتجاوز 255 حرف.',
      emailTooLong: 'البريد الإلكتروني لا يمكن أن يتجاوز 255 حرف.',
      addressTooLong: 'العنوان لا يمكن أن يتجاوز 255 حرف.',
      phoneAlreadyRegistered: 'رقم الهاتف هذا مسجل بالفعل.',
      emailAlreadyRegistered: 'هذا البريد الإلكتروني مسجل بالفعل.',
      phoneUnique: 'رقم الهاتف قيد الاستخدام بالفعل.',
      emailUnique: 'هذا البريد الإلكتروني قيد الاستخدام بالفعل.',
      noAccount: 'ليس لديك حساب؟',
      registerNow: 'سجل الآن',
      haveAccount: 'هل لديك حساب بالفعل؟',
      loginNow: 'ادخل الآن',
    },
  }


  const labels = (translations && translations[locale]) ? translations[locale] : (translations.en || {})

  useEffect(() => {
    if (!show) return
    fetch(`${API_BASE}/governorates`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setGovernorates(data.data ?? data ?? []))
      .catch(() => setGovernorates([]))
  }, [show])

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

  const validateEmail = (email) => {
    if (!email) return true // email is optional
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      setError(labels.invalidEmail)
      return false
    }
    if (email.length > 255) {
      setError(labels.emailTooLong)
      return false
    }
    return true
  }

  const validateName = (name) => {
    if (!name.trim()) {
      setError(labels.fillAllFields)
      return false
    }
    if (name.length > 255) {
      setError(labels.nameTooLong)
      return false
    }
    return true
  }

  const validatePhoneNumber = (phone) => {
    const cleanPhone = phone.replace(/[\s-]/g, '')
    const iraqiPhonePattern = /^(\+964|0)(770|771|772|773|790|791|792|793|794|780|781|782|783|784)\d{7}$/
    if (!iraqiPhonePattern.test(cleanPhone)) {
      setError(labels.invalidPhoneNumber)
      return false
    }
    return true
  }

  const validateAddress = (address) => {
    if (address && address.length > 255) {
      setError(labels.addressTooLong)
      return false
    }
    return true
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setError('')
    setNotice('')

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
    setNotice('')

    // Validate required fields
    if (!registerData.name.trim() || !registerData.identifier.trim() || !registerData.password || !registerData.confirmPassword || !registerData.governorate_id) {
      setError(labels.fillAllFields)
      return
    }

    // Validate name
    if (!validateName(registerData.name)) {
      return
    }

    // Validate email if provided
    if (!validateEmail(registerData.email)) {
      return
    }

    // Validate phone
    if (!validatePhoneNumber(registerData.identifier)) {
      return
    }

    // Validate password
    if (!validatePassword(registerData.password)) {
      return
    }

    // Check passwords match
    if (registerData.password !== registerData.confirmPassword) {
      setError(labels.passwordsMismatch)
      return
    }

    // Validate address if provided
    if (!validateAddress(registerData.address)) {
      return
    }

    const cleanPhone = registerData.identifier.replace(/[\s-]/g, '')
    setIsLoading(true)

    ;(async () => {
      try {
        // 1) Register customer account
        const registerPayload = {
          name: registerData.name.trim(),
          phone: cleanPhone,
          password: registerData.password,
          governorate_id: Number(registerData.governorate_id),
        }

        // Add optional fields if provided
        if (registerData.email.trim()) {
          registerPayload.email = registerData.email.trim()
        }
        if (registerData.address.trim()) {
          registerPayload.address = registerData.address.trim()
        }
        if (registerData.nearest_service_point.trim()) {
          registerPayload.nearest_service_point = registerData.nearest_service_point.trim()
        }

        const registerRes = await fetch(`${API_BASE}/customers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(registerPayload),
        })

        const registerDataRes = await registerRes.json().catch(() => ({}))
        if (!registerRes.ok) {
          if (registerDataRes && registerDataRes.errors) {
            const firstKey = Object.keys(registerDataRes.errors)[0]
            const errorMessage = registerDataRes.errors[firstKey][0]
            // Map server error messages to user-friendly messages
            if (errorMessage.includes('unique') || errorMessage.includes('already')) {
              if (firstKey === 'phone') {
                setError(labels.phoneAlreadyRegistered)
              } else if (firstKey === 'email') {
                setError(labels.emailAlreadyRegistered)
              } else {
                setError(errorMessage)
              }
            } else {
              setError(errorMessage)
            }
          } else {
            setError(registerDataRes.message || (locale === 'ar' ? 'فشل إنشاء الحساب.' : 'Registration failed.'))
          }
          return
        }

        // Registration success: require explicit login before continuing.
        setActiveTab('login')
        setLoginData({ identifier: cleanPhone, password: '' })
        setNotice(locale === 'ar' ? 'تم إنشاء الحساب بنجاح. يرجى تسجيل الدخول للمتابعة.' : 'Account created successfully. Please log in to continue.')
        setRegisterData({ name: '', email: '', identifier: '', password: '', confirmPassword: '', governorate_id: '', address: '', nearest_service_point: '' })
      } catch (err) {
        console.error(err)
        setError(locale === 'ar' ? 'حدث خطأ أثناء التسجيل.' : 'An error occurred during registration.')
      } finally {
        setIsLoading(false)
      }
    })()
  }

  const handleClose = () => {
    setError('')
    setNotice('')
    setLoginData({ identifier: '', password: '' })
    setRegisterData({ name: '', email: '', identifier: '', password: '', confirmPassword: '', governorate_id: '', address: '', nearest_service_point: '' })
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
        {notice && <div className="alert alert-success mb-3">{notice}</div>}

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
                maxLength="255"
                required
              />
              <small className="text-muted">{registerData.name.length}/255</small>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{labels.phone}</Form.Label>
              <Form.Control
                type="text"
                value={registerData.identifier}
                onChange={(e) => setRegisterData({ ...registerData, identifier: e.target.value })}
                placeholder={locale === 'ar' ? 'ادخل رقم الهاتف العراقي (مثل: 07701234567)' : 'Enter Iraqi phone number (e.g., 07701234567)'}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{labels.email}</Form.Label>
              <Form.Control
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                placeholder={labels.enterEmailAddr}
                maxLength="255"
              />
              <small className="text-muted">{registerData.email.length}/255</small>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{labels.governorate}</Form.Label>
              <Form.Select
                value={registerData.governorate_id}
                onChange={(e) => setRegisterData({ ...registerData, governorate_id: e.target.value })}
                required
              >
                <option value="">{labels.selectGovernorate}</option>
                {governorates.map((gov) => (
                  <option key={gov.id} value={gov.id}>
                    {locale === 'ar' ? gov.name_ar || gov.name_en : gov.name_en || gov.name_ar}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{labels.address}</Form.Label>
              <Form.Control
                type="text"
                as="textarea"
                rows={2}
                value={registerData.address}
                onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                placeholder={labels.enterAddress}
                maxLength="255"
              />
              <small className="text-muted">{registerData.address.length}/255</small>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{labels.nearestServicePoint}</Form.Label>
              <Form.Control
                type="text"
                value={registerData.nearest_service_point}
                onChange={(e) => setRegisterData({ ...registerData, nearest_service_point: e.target.value })}
                placeholder={labels.enterServicePoint}
                maxLength="255"
              />
              <small className="text-muted">{registerData.nearest_service_point.length}/255</small>
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
              <small className="text-muted d-block mt-1">
                {locale === 'ar' 
                  ? '• الحد الأدنى: 8 أحرف • لا توجد مسافات'
                  : '• Minimum: 8 characters • No spaces'
                }
              </small>
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
