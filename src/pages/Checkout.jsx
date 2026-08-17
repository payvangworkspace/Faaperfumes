import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { formatProductNote } from '../data'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import { usePromo } from '../context/PromoContext'
import { saveOrder } from '../lib/orders'

const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain']

export default function Checkout() {
  const { items, cartCount, clearCart, showToast } = useCart()
  const { user, isAuthenticated } = useAuth()
  const { format } = useCurrency()
  const { getFinalPrice, promo } = usePromo()
  const navigate = useNavigate()

  const [form, setForm] = useState(() => ({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: 'Business Bay',
    emirate: 'Dubai',
    notes: '',
    payment: 'card',
  }))
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const lines = useMemo(
    () =>
      items.map(({ product, quantity }) => {
        const unit = getFinalPrice(product.price)
        return {
          id: product.id,
          name: product.name,
          image: product.image,
          note: formatProductNote(product),
          quantity,
          unit,
          lineTotal: unit * quantity,
          compareAt: product.compareAt * quantity,
        }
      }),
    [items, getFinalPrice],
  )

  const subtotalAed = lines.reduce((sum, line) => sum + line.lineTotal, 0)
  const shippingAed = 0
  const totalAed = subtotalAed + shippingAed

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: '/checkout' }} />
  }

  if (!items.length) {
    return <Navigate to="/cart" replace />
  }

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('Please fill in your name, email, phone, and delivery address.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Enter a valid email address.')
      return
    }

    if (form.phone.replace(/\D/g, '').length < 9) {
      setError('Enter a valid UAE phone number.')
      return
    }

    setSubmitting(true)

    const order = {
      id: `FAA-${Date.now().toString(36).toUpperCase()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'pending',
      userId: user?.id || null,
      customer: {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        emirate: form.emirate,
        notes: form.notes.trim(),
      },
      payment: form.payment,
      promo: promo?.code || null,
      items: lines.map(({ id, name, quantity, unit, lineTotal }) => ({
        id,
        name,
        quantity,
        unit,
        lineTotal,
      })),
      subtotalAed,
      shippingAed,
      totalAed,
      itemCount: cartCount,
    }

    saveOrder(order)
    clearCart()
    showToast('Order placed — thank you')
    navigate('/checkout/success', { replace: true, state: { order } })
  }

  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="container page-hero__content page-hero__content--plain">
          <p className="eyebrow">Checkout</p>
          <h1>Secure checkout</h1>
          <p>
            {cartCount} item{cartCount === 1 ? '' : 's'} · complimentary express delivery across the
            UAE.
          </p>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/cart">Cart</Link>
            <span>/</span>
            <span>Checkout</span>
          </nav>
        </div>
      </section>

      <section className="section featured">
        <div className="container">
          <form className="checkout-layout" onSubmit={handleSubmit}>
            <div className="checkout-main">
              <div className="checkout-card">
                <h2>Delivery details</h2>
                {error ? <p className="auth__error">{error}</p> : null}

                <div className="checkout-grid">
                  <label>
                    Full name
                    <input
                      type="text"
                      autoComplete="name"
                      value={form.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Email
                    <input
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Phone
                    <input
                      type="tel"
                      autoComplete="tel"
                      placeholder="05X XXX XXXX"
                      value={form.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Emirate
                    <select
                      value={form.emirate}
                      onChange={(e) => updateField('emirate', e.target.value)}
                    >
                      {EMIRATES.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="checkout-grid__full">
                    Street address
                    <input
                      type="text"
                      autoComplete="street-address"
                      placeholder="Building, street, area"
                      value={form.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      required
                    />
                  </label>
                  <label className="checkout-grid__full">
                    City / area
                    <input
                      type="text"
                      autoComplete="address-level2"
                      value={form.city}
                      onChange={(e) => updateField('city', e.target.value)}
                    />
                  </label>
                  <label className="checkout-grid__full">
                    Order notes <span>(optional)</span>
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={(e) => updateField('notes', e.target.value)}
                      placeholder="Delivery instructions, gift message…"
                    />
                  </label>
                </div>
              </div>

              <div className="checkout-card">
                <h2>Payment</h2>
                <div className="checkout-pay" role="radiogroup" aria-label="Payment method">
                  <label className={form.payment === 'card' ? 'is-active' : undefined}>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={form.payment === 'card'}
                      onChange={() => updateField('payment', 'card')}
                    />
                    <span>
                      <strong>Card on delivery</strong>
                      <small>Pay securely when your order arrives</small>
                    </span>
                  </label>
                  <label className={form.payment === 'cod' ? 'is-active' : undefined}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={form.payment === 'cod'}
                      onChange={() => updateField('payment', 'cod')}
                    />
                    <span>
                      <strong>Cash on delivery</strong>
                      <small>Pay in cash to the courier</small>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <aside className="cart-summary checkout-summary">
              <h2>Order summary</h2>
              <ul className="checkout-items">
                {lines.map((line) => (
                  <li key={line.id}>
                    <img src={line.image} alt="" />
                    <div>
                      <strong>{line.name}</strong>
                      <span>
                        Qty {line.quantity} · {format(line.lineTotal)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              {promo ? (
                <p className="cart-summary__promo">
                  {promo.code} applied — extra {promo.percent}% off
                </p>
              ) : null}

              <div className="cart-summary__row">
                <span>Subtotal</span>
                <strong>{format(subtotalAed)}</strong>
              </div>
              <div className="cart-summary__row">
                <span>Shipping</span>
                <span>Complimentary</span>
              </div>
              <div className="cart-summary__total">
                <span>Total</span>
                <strong>{format(totalAed)}</strong>
              </div>

              <button type="submit" className="btn btn--primary" disabled={submitting}>
                {submitting ? 'Placing order…' : 'Place order'}
              </button>
              <Link className="text-link" to="/cart">
                Back to cart
              </Link>
            </aside>
          </form>
        </div>
      </section>
    </>
  )
}
