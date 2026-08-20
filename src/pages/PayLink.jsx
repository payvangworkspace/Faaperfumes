import { Link, Navigate, useParams } from 'react-router-dom'
import { getOrders } from '../lib/orders'
import { useCurrency } from '../context/CurrencyContext'

export default function PayLink() {
  const { orderId } = useParams()
  const { format } = useCurrency()
  const order = getOrders().find((item) => item.id === orderId)

  if (!order) {
    return <Navigate to="/" replace />
  }

  return (
    <section className="section auth">
      <div className="container auth__card">
        <p className="eyebrow">Secure checkout</p>
        <h1>Complete your payment</h1>
        <p>Order {order.id}</p>
        <dl className="profile__meta">
          <div>
            <dt>Customer</dt>
            <dd>{order.customer?.fullName}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{order.customer?.email}</dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd>{format(order.totalAed)}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{order.status}</dd>
          </div>
        </dl>
        <p>
          This payment session was created from the Faaperfume admin desk. The order is already in
          the live ledger as pending.
        </p>
        <Link className="btn btn--primary" to="/">
          Back to store
        </Link>
      </div>
    </section>
  )
}
