import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'

export default function Wishlist() {
  const { items, count } = useWishlist()
  const { isAuthenticated, user } = useAuth()

  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="container page-hero__content page-hero__content--plain">
          <p className="eyebrow">Saved</p>
          <h1>Wishlist</h1>
          <p>
            {count
              ? `${count} fragrance${count === 1 ? '' : 's'} saved${
                  isAuthenticated ? ` for ${user.name}` : ' on this device'
                }.`
              : 'Save scents you love — tap the heart on any product.'}
          </p>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Wishlist</span>
          </nav>
        </div>
      </section>

      <section className="section featured">
        <div className="container">
          {!isAuthenticated ? (
            <div className="wishlist-banner">
              <p>
                <Link to="/login" state={{ from: '/wishlist' }}>
                  Log in
                </Link>{' '}
                or{' '}
                <Link to="/signup">sign up</Link> to keep your wishlist across devices.
              </p>
            </div>
          ) : null}

          {items.length ? (
            <div className="product-grid">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>Your wishlist is empty</h2>
              <p>Browse the edit and heart the bottles you want to revisit.</p>
              <div className="brands__cta">
                <Link className="btn btn--primary" to="/men-perfumes">
                  Shop men
                </Link>
                <Link className="btn btn--line" to="/women-perfumes">
                  Shop women
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
