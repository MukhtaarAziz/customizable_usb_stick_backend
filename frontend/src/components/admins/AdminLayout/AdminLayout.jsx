import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGauge, faBox, faGamepad, faCode, faMicrochip, faTag, faLayerGroup, faList, faShoppingCart, faUsers, faUserGroup, faGear, faArrowRightFromBracket, faBars, faXmark, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import './AdminLayout.css'

const sidebarLinks = [
  { path: '/admin', icon: faGauge, label: 'Dashboard', end: true },
  { path: '/admin/packages', icon: faBox, label: 'Packages' },
  { path: '/admin/games', icon: faGamepad, label: 'Games' },
  { path: '/admin/programs', icon: faCode, label: 'Programs' },
  { path: '/admin/platforms', icon: faMicrochip, label: 'Platforms' },
  { path: '/admin/category-types', icon: faList, label: 'Category Types' },
  { path: '/admin/content-categories', icon: faTag, label: 'Content Categories' },
  { path: '/admin/package-categories', icon: faLayerGroup, label: 'Package Categories' },
  {
    icon: faShoppingCart,
    label: 'Orders',
    children: [
      { path: '/admin/orders/packages', label: 'Packages' },
      { path: '/admin/orders/usb-sticks', label: 'USB Sticks' },
    ],
  },
  { path: '/admin/users', icon: faUsers, label: 'Users' },
  { path: '/admin/customers', icon: faUserGroup, label: 'Customers' },
  { path: '/admin/settings', icon: faGear, label: 'Settings' },
]

function AdminLayout({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    try {
      const userJson = localStorage.getItem('user')
      if (!userJson) {
        navigate('/', { replace: true })
        return
      }
      const user = JSON.parse(userJson)
      if (user.role !== 'admin') {
        navigate('/', { replace: true })
      }
    } catch {
      navigate('/', { replace: true })
    }
  }, [navigate])

  const handleLogout = () => {
    onLogout?.()
    navigate('/')
  }

  return (
    <div className="admin-layout">
      <button className="admin-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <FontAwesomeIcon icon={sidebarOpen ? faXmark : faBars} />
      </button>

      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__logo">A</span>
          <span className="admin-sidebar__title">Admin Panel</span>
        </div>

        <nav className="admin-sidebar__nav">
          {sidebarLinks.map((link) => {
            if (link.children) {
              const isActive = link.children.some((child) => location.pathname === child.path || location.pathname.startsWith(`${child.path}/`))

              return (
                <div key={link.label} className="admin-sidebar__group">
                  <NavLink
                    to={link.children[0].path}
                    className={({ isActive: childActive }) => `admin-sidebar__link ${isActive || childActive ? 'admin-sidebar__link--active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FontAwesomeIcon icon={link.icon} className="admin-sidebar__link-icon" />
                    <span>{link.label}</span>
                    <FontAwesomeIcon icon={faChevronDown} className="admin-sidebar__link-caret" />
                  </NavLink>

                  <div className="admin-sidebar__submenu">
                    {link.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive: childActive }) => `admin-sidebar__sublink ${childActive ? 'admin-sidebar__sublink--active' : ''}`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span>{child.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              )
            }

            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) => `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <FontAwesomeIcon icon={link.icon} className="admin-sidebar__link-icon" />
                <span>{link.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <button className="admin-sidebar__link admin-sidebar__link--logout" onClick={handleLogout}>
            <FontAwesomeIcon icon={faArrowRightFromBracket} className="admin-sidebar__link-icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
