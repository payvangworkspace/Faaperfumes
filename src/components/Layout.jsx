import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth, ROLES } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import CurrencySwitch from './CurrencySwitch'
import Logo from './Logo'
import PromoBar from './PromoBar'

function TopBar() {
  return (
    <div className="topbar">
      <div className="container topbar__inner">
        <p>Complimentary express delivery across the UAE</p>
        <div className="topbar__links">
          <CurrencySwitch />
          <Link to="/#stores">Store locator</Link>
          <Link to="/#collections">Shop collections</Link>
        </div>
      </div>
    </div>
  )
}

function Header({ menuOpen, onToggleMenu, onCloseMenu }) {
  const { cartCount } = useCart()
  const { count: wishCount } = useWishlist()
  const { isAuthenticated, user, logout } = useAuth()
  const { showToast } = useCart()

  function handleLogout() {
    logout()
    showToast('Signed out')
    onCloseMenu()
  }

  return (
    <header className="header">
      <div className="container header__inner">
        <button
          className="header__menu"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={onToggleMenu}
        >
          <span />
          <span />
        </button>

        <nav className={`nav ${menuOpen ? 'nav--open' : ''}`} aria-label="Primary">
          <NavLink to="/men-perfumes" onClick={onCloseMenu}>
            Men
          </NavLink>
          <NavLink to="/women-perfumes" onClick={onCloseMenu}>
            Women
          </NavLink>
          <NavLink to="/exclusive" onClick={onCloseMenu}>
            Exclusive
          </NavLink>
          <NavLink to="/combos" onClick={onCloseMenu}>
            Combos
          </NavLink>
          <NavLink to="/brands" onClick={onCloseMenu}>
            Brands
          </NavLink>
          {menuOpen ? (
            <>
              <NavLink to="/wishlist" onClick={onCloseMenu}>
                Wishlist ({wishCount})
              </NavLink>
              <NavLink to="/cart" onClick={onCloseMenu}>
                Cart ({cartCount})
              </NavLink>
              {isAuthenticated ? (
                <>
                  <NavLink
                    to={user.role === ROLES.ADMIN ? '/admin' : '/profile'}
                    onClick={onCloseMenu}
                  >
                    {user.role === ROLES.ADMIN ? 'Admin dashboard' : 'Customer profile'}
                  </NavLink>
                  <button type="button" className="nav__button" onClick={handleLogout}>
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" onClick={onCloseMenu}>
                    Log in
                  </NavLink>
                  <NavLink to="/signup" onClick={onCloseMenu}>
                    Sign up
                  </NavLink>
                </>
              )}
            </>
          ) : null}
        </nav>

        <Logo onClick={onCloseMenu} />

        <div className="header__actions">
          {isAuthenticated ? (
            <Link
              to={user.role === ROLES.ADMIN ? '/admin' : '/profile'}
              className="header__link"
              onClick={onCloseMenu}
            >
              {user.role === ROLES.ADMIN ? 'Admin dashboard' : 'Customer profile'}
            </Link>
          ) : (
            <Link to="/login" className="header__link" onClick={onCloseMenu}>
              Log in
            </Link>
          )}
          <Link to="/wishlist" className="header__link" onClick={onCloseMenu}>
            Wishlist <span className="header__count">{wishCount}</span>
          </Link>
          <Link to="/cart" className="cart-link" onClick={onCloseMenu}>
            Cart <span>{cartCount}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer" id="stores">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo />
          <p>
            Established fragrance retail with boutiques across the UAE and
            delivery to every Emirate.
          </p>
          <p className="footer__contact">
            <a href="mailto:faaperfumess@gmail.com">faaperfumess@gmail.com</a>
            <br />
            <a href="tel:+971552383144">055 238 3144</a>
          </p>
        </div>

        <div>
          <h3>Explore</h3>
          <ul>
            <li>
              <Link to="/#collections">Collections</Link>
            </li>
            <li>
              <Link to="/men-perfumes">Men</Link>
            </li>
            <li>
              <Link to="/women-perfumes">Women</Link>
            </li>
            <li>
              <Link to="/exclusive">Exclusive</Link>
            </li>
            <li>
              <Link to="/combos">Combos</Link>
            </li>
            <li>
              <Link to="/brands">Brands</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3>Support</h3>
          <ul>
            <li>
              <Link to="/wishlist">Wishlist</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <Link to="/login">Account</Link>
            </li>
            <li>
              <Link to="/refund-policy">Refund Policy</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3>Visit</h3>
          <ul>
            <li>THE BINARY BY OMNIYAT</li>
            <li>Office 1912-191, Business Bay</li>
            <li>Dubai, United Arab Emirates</li>
            <li>Currencies: AED · USD · EUR</li>
          </ul>
        </div>
      </div>
      <div className="container footer__base">
        <p>© {new Date().getFullYear()} Faaperfume. All rights reserved.</p>
        <div className="footer__legal">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/refund-policy">Refund Policy</Link>
        </div>
      </div>
    </footer>
  )
}

function Toast() {
  const { toast } = useCart()
  return (
    <div className={`toast ${toast.visible ? 'toast--show' : ''}`} role="status">
      {toast.message}
    </div>
  )
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
    if (location.hash) {
      const id = location.hash.slice(1)
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      })
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <div className="site">
      <TopBar />
      <Header
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        onCloseMenu={() => setMenuOpen(false)}
      />
      <PromoBar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Toast />
    </div>
  )
}
