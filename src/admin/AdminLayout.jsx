import { useMemo, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth, ROLES } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import Logo from '../components/Logo'
import './admin.css'
import {
  ICONS,
  IconExternal,
  IconLogout,
  IconMenu,
} from './icons'

const NAV = [
  {
    label: 'Dashboard',
    items: [
      { to: '/admin', label: 'Dashboard', icon: 'grid', end: true },
      { to: '/admin/overview', label: 'Super-Admin Dashboard', icon: 'layers' },
    ],
  },
  {
    label: 'User Management',
    items: [
      { to: '/admin/customers', label: 'Customers', icon: 'users', end: true },
      { to: '/admin/customers/new', label: 'Add Customer', icon: 'userPlus' },
      { to: '/admin/acquirers', label: 'Acquirers', icon: 'switch', end: true },
      { to: '/admin/acquirers/new', label: 'Add Acquirer', icon: 'plus' },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { to: '/admin/inventory', label: 'Perfumes', icon: 'bottle', end: true },
      { to: '/admin/inventory/new', label: 'Add Perfume', icon: 'plus' },
      { to: '/admin/combos', label: 'Combos', icon: 'gift' },
      { to: '/admin/promos', label: 'Promo Codes', icon: 'percent' },
    ],
  },
  {
    label: 'Payin',
    items: [
      { to: '/admin/orders', label: 'Transactions', icon: 'list' },
      { to: '/admin/payment-link', label: 'Get Payment Link', icon: 'link' },
    ],
  },
]

const PAGE_META = [
  { test: (path) => path === '/admin', title: 'Dashboard', subtitle: 'Live sales, catalog counts, and order movement from the Faaperfume store.' },
  { test: (path) => path === '/admin/overview', title: 'Super-Admin Dashboard', subtitle: 'Catalog health, top-selling bottles, and customer activity from live records.' },
  { test: (path) => path === '/admin/customers/new', title: 'Add Customer Account', subtitle: 'Register a shopper with contact details and a sign-in password.' },
  { test: (path) => path.startsWith('/admin/customers'), title: 'User Management — Customers', subtitle: 'Registered shopper accounts, order history, and spend from checkout.' },
  { test: (path) => path === '/admin/acquirers/new', title: 'Add Acquirer Gateway API', subtitle: 'Configure connector endpoints, credentials, headers and request template.' },
  { test: (path) => path.startsWith('/admin/acquirers/'), title: 'Edit Acquirer Gateway API', subtitle: 'Update connector endpoints, credentials, currency and request template.' },
  { test: (path) => path.startsWith('/admin/acquirers'), title: 'User Management — Acquirers', subtitle: 'Acquiring gateway integrations, bank switches & payout routes.' },
  { test: (path) => path === '/admin/inventory/new', title: 'Add Perfume', subtitle: 'Create a live catalog listing with price, bottle photo, and category.' },
  { test: (path) => path.startsWith('/admin/inventory/'), title: 'Edit Perfume', subtitle: 'Update a live catalog listing. Changes appear on the storefront immediately.' },
  { test: (path) => path.startsWith('/admin/inventory'), title: 'Catalog — Perfumes', subtitle: 'Men, women, and exclusive bottles currently on the store, with live AED prices.' },
  { test: (path) => path === '/admin/combos/new', title: 'Add Combo', subtitle: 'Create a bundle offer that shoppers can buy on the storefront.' },
  { test: (path) => path.startsWith('/admin/combos/'), title: 'Edit Combo', subtitle: 'Update a live combo offer and storefront price.' },
  { test: (path) => path.startsWith('/admin/combos'), title: 'Catalog — Combos', subtitle: 'Exclusive bundle prices generated from the live combo catalog.' },
  { test: (path) => path.startsWith('/admin/promos'), title: 'Promo Codes', subtitle: 'Discount codes shoppers can apply at checkout.' },
  { test: (path) => path.startsWith('/admin/orders'), title: 'Payin — Transactions', subtitle: 'Live checkout ledger, payment method, and fulfilment status.' },
  { test: (path) => path.startsWith('/admin/payment-link'), title: 'Get Payment Link', subtitle: 'Create a checkout order, then share the secure payment page.' },
]

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export default function AdminLayout() {
  const { user, isAuthenticated, logout } = useAuth()
  const { showToast, toast } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [navOpen, setNavOpen] = useState(false)

  const meta = useMemo(
    () => PAGE_META.find((item) => item.test(location.pathname)) || PAGE_META[0],
    [location.pathname],
  )

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (user.role !== ROLES.ADMIN) {
    return <Navigate to="/profile" replace />
  }

  function handleLogout() {
    logout()
    showToast('Signed out')
    navigate('/login')
  }

  return (
    <div className={`admin-portal ${navOpen ? 'is-nav-open' : ''}`}>
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <Logo to="/admin" compact />
        </div>
        <nav className="admin-sidebar__nav" aria-label="Admin">
          {NAV.map((group) => (
            <div key={group.label} className="admin-sidebar__group">
              <h3>{group.label}</h3>
              {group.items.map((item) => {
                const Icon = ICONS[item.icon]
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => `admin-nav-link ${isActive ? 'is-active' : ''}`}
                    onClick={() => setNavOpen(false)}
                  >
                    <Icon />
                    {item.label}
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>
        <div className="admin-sidebar__user">
          <span className="admin-avatar">{initials(user.name)}</span>
          <div>
            <strong>{user.name}</strong>
            <span>Administrator</span>
          </div>
          <button type="button" className="admin-sidebar__logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar__copy">
            <h1>{meta.title}</h1>
            <p>{meta.subtitle}</p>
          </div>
          <div className="admin-topbar__actions">
            <button
              type="button"
              className="admin-btn admin-btn--ghost admin-menu-btn"
              onClick={() => setNavOpen((open) => !open)}
            >
              <IconMenu />
              Menu
            </button>
            <span className="admin-pill admin-pill--live">Live Admin Mode</span>
            <Link className="admin-btn admin-btn--ghost" to="/" target="_blank" rel="noreferrer">
              <IconExternal />
              Faaperfume Site
            </Link>
            <button
              type="button"
              className="admin-btn admin-btn--maroon admin-topbar__logout"
              onClick={handleLogout}
            >
              <IconLogout />
              Log Out
            </button>
          </div>
        </header>
        <Outlet />
      </div>

      <div className={`toast ${toast.visible ? 'toast--show' : ''}`} role="status">
        {toast.message}
      </div>
    </div>
  )
}

export { initials }
