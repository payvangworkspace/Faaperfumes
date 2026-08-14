import { Link } from 'react-router-dom'
import { formatProductNote } from '../data'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import { usePromo } from '../context/PromoContext'

export default function Cart() {
  const { items, cartCount, updateQuantity, removeFromCart, clearCart, showToast } =
    useCart()
  const { isAuthenticated, user } = useAuth()
  const { format } = useCurrency()
  const { getFinalPrice, promo } = usePromo()

  const subtotalAed = items.reduce(
    (sum, line) => sum + getFinalPrice(line.product.price) * line.quantity,
    0,
  )

  function handleCheckout() {
    showToast('Checkout is a demo — your bag is ready to review')
  }

  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="container page-hero__content page-hero__content--plain">
          <p className="eyebrow">Order</p>
          <h1>Your Cart</h1>
          <p>
            {cartCount
              ? `${cartCount} item${cartCount === 1 ? '' : 's'}${
                  isAuthenticated ? ` for ${user.name}` : ' in your bag'
                }.`
              : 'Your cart is currently empty.'}
          </p>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Cart</span>
          </nav>
        </div>
      </section>

      <section className="section featured">
        <div className="container">
          {!isAuthenticated ? (
            <div className="wishlist-banner">
              <p>
                <Link to="/login" state={{ from: '/cart' }}>
                  Log in
                </Link>{' '}
                or{' '}
                <Link to="/signup">sign up</Link> to keep your cart across devices.
              </p>
            </div>
          ) : null}

          {items.length ? (
            <div className="cart-layout">
              <div className="cart-lines">
                {items.map(({ product, quantity }) => {
                  const unit = getFinalPrice(product.price)
                  return (
                    <article key={product.id} className="cart-line">
                      <div className="cart-line__media">
                        <img src={product.image} alt={product.name} />
                      </div>
                      <div className="cart-line__body">
                        <div className="cart-line__top">
                          <div>
                            <h2>
                              <Link to={`/product/${product.id}`}>{product.name}</Link>
                            </h2>
                            <p>{formatProductNote(product)}</p>
                          </div>
                          <button
                            type="button"
                            className="cart-line__remove"
                            onClick={() => {
                              removeFromCart(product.id)
                              showToast(`${product.name} removed`)
                            }}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="cart-line__bottom">
                          <div className="qty" aria-label={`Quantity for ${product.name}`}>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span>{quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <div className="cart-line__price">
                            <span>{format(unit * quantity)}</span>
                            <s>{format(product.compareAt * quantity)}</s>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>

              <aside className="cart-summary">
                <h2>Order summary</h2>
                {promo ? (
                  <p className="cart-summary__promo">
                    {promo.code} applied — extra {promo.percent}% off
                  </p>
                ) : (
                  <p className="cart-summary__promo">Add a code in the bar above for extra off</p>
                )}
                <div className="cart-summary__row">
                  <span>Subtotal</span>
                  <strong>{format(subtotalAed)}</strong>
                </div>
                <div className="cart-summary__row">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="cart-summary__total">
                  <span>Total</span>
                  <strong>{format(subtotalAed)}</strong>
                </div>
                <button type="button" className="btn btn--primary" onClick={handleCheckout}>
                  Checkout
                </button>
                <button
                  type="button"
                  className="btn btn--line"
                  onClick={() => {
                    clearCart()
                    showToast('Cart cleared')
                  }}
                >
                  Clear cart
                </button>
                <Link className="text-link" to="/men-perfumes">
                  Continue shopping
                </Link>
              </aside>
            </div>
          ) : (
            <div className="empty-state">
              <h2>Your cart is currently empty</h2>
              <p>Browse the edit and add the bottles you want to wear next.</p>
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
