import { Link, Navigate } from 'react-router-dom'
import { useAuth, ROLES } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function CustomerProfile() {
  const { user, isAuthenticated, logout } = useAuth()
  const { cartCount, showToast } = useCart()
  const { count: wishCount } = useWishlist()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/profile' }} replace />
  }

  if (user.role === ROLES.ADMIN) {
    return <Navigate to="/admin" replace />
  }

  function handleLogout() {
    logout()
    showToast('Signed out')
  }

  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="container page-hero__content page-hero__content--plain">
          <p className="eyebrow">Customer</p>
          <h1>Customer profile</h1>
          <p>Manage your Faaperfume shopping account.</p>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Profile</span>
          </nav>
        </div>
      </section>

      <section className="section">
        <div className="container profile">
          <div className="profile__card">
            <h2>{user.name}</h2>
            <dl className="profile__meta">
              <div>
                <dt>Email</dt>
                <dd>{user.email}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>Customer</dd>
              </div>
            </dl>

            <div className="profile__stats">
              <Link to="/wishlist" className="profile__stat">
                <span>{wishCount}</span>
                Wishlist
              </Link>
              <Link to="/cart" className="profile__stat">
                <span>{cartCount}</span>
                Cart
              </Link>
            </div>

            <div className="profile__actions">
              <Link className="btn btn--primary" to="/men-perfumes">
                Continue shopping
              </Link>
              <button type="button" className="btn btn--line" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
