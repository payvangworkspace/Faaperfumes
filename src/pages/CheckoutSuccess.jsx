import { Link, Navigate, useLocation } from 'react-router-dom'
import { useCurrency } from '../context/CurrencyContext'
import { LAST_ORDER_KEY, paymentLabel } from '../lib/orders'
import { readJson } from '../lib/storage'

export default function CheckoutSuccess() {
  const { format } = useCurrency()
  const location = useLocation()
  const order = location.state?.order || readJson(LAST_ORDER_KEY, null)

  if (!order) {
    return <Navigate to="/cart" replace />
  }

  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="container page-hero__content page-hero__content--plain">
          <p className="eyebrow">Confirmed</p>
          <h1>Thank you</h1>
          <p>
            Order <strong>{order.id}</strong> is confirmed. We will contact you on{' '}
            {order.customer.phone} before dispatch.
          </p>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Order confirmed</span>
          </nav>
        </div>
      </section>

      <section className="section featured">
        <div className="container checkout-success">
          <div className="checkout-card">
            <h2>Delivery</h2>
            <dl className="profile__meta">
              <div>
                <dt>Name</dt>
                <dd>{order.customer.fullName}</dd>
              </div>
              <div>
                <dt>Contact</dt>
                <dd>
                  {order.customer.email}
                  <br />
                  {order.customer.phone}
                </dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>
                  {order.customer.address}
                  <br />
                  {order.customer.city}, {order.customer.emirate}, UAE
                </dd>
              </div>
              <div>
                <dt>Payment</dt>
                <dd>{paymentLabel(order.payment)}</dd>
              </div>
            </dl>
          </div>

          <div className="checkout-card">
            <h2>Items</h2>
            <ul className="checkout-items checkout-items--plain">
              {order.items.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>
                      Qty {item.quantity} · {format(item.lineTotal)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="cart-summary__total">
              <span>Total paid at delivery</span>
              <strong>{format(order.totalAed)}</strong>
            </div>
            <div className="profile__actions">
              <Link className="btn btn--primary" to="/men-perfumes">
                Continue shopping
              </Link>
              <Link className="btn btn--line" to="/">
                Back home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
