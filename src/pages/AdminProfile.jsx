import { useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { combos, getProductsByCategory, products } from '../data'
import { useAuth, ROLES } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import {
  ORDER_STATUSES,
  formatOrderDate,
  getOrders,
  paymentLabel,
  updateOrderStatus,
} from '../lib/orders'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'customers', label: 'Customers' },
  { id: 'orders', label: 'Transactions' },
  { id: 'catalog', label: 'Catalog' },
]

export default function AdminProfile() {
  const { user, isAuthenticated, logout, getUsers } = useAuth()
  const { showToast } = useCart()
  const { format } = useCurrency()
  const [tab, setTab] = useState('overview')
  const [orders, setOrders] = useState(() => getOrders())
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const [customerQuery, setCustomerQuery] = useState('')

  const users = isAuthenticated && user?.role === ROLES.ADMIN ? getUsers() : []
  const customers = users.filter((u) => u.role !== ROLES.ADMIN)

  const menCount = getProductsByCategory('men').length
  const womenCount = getProductsByCategory('women').length
  const exclusiveCount = getProductsByCategory('unisex').length
  const catalogCount = products.length + combos.length

  const customerStats = useMemo(() => {
    return customers.map((customer) => {
      const theirs = orders.filter((o) => o.customer?.email === customer.email)
      const spent = theirs
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.totalAed || 0), 0)
      return {
        ...customer,
        orderCount: theirs.length,
        spentAed: spent,
        lastOrderAt: theirs[0]?.createdAt || null,
      }
    })
  }, [customers, orders])

  const filteredCustomers = useMemo(() => {
    const q = customerQuery.trim().toLowerCase()
    if (!q) return customerStats
    return customerStats.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
    )
  }, [customerStats, customerQuery])

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders
    return orders.filter((o) => o.status === statusFilter)
  }, [orders, statusFilter])

  const revenueAed = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.totalAed || 0), 0)
  const pendingCount = orders.filter((o) => o.status === 'pending').length
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/admin' }} replace />
  }

  if (user.role !== ROLES.ADMIN) {
    return <Navigate to="/profile" replace />
  }

  function handleLogout() {
    logout()
    showToast('Signed out')
  }

  function handleStatusChange(orderId, status) {
    const next = updateOrderStatus(orderId, status)
    setOrders(next)
    showToast(`Order ${orderId} marked ${status}`)
  }

  function refreshOrders() {
    setOrders(getOrders())
    showToast('Dashboard refreshed')
  }

  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="container page-hero__content page-hero__content--plain">
          <p className="eyebrow">Admin</p>
          <h1>Admin dashboard</h1>
          <p>
            Signed in as {user.name}. Manage customers, transactions, and store catalog.
          </p>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Admin</span>
          </nav>
        </div>
      </section>

      <section className="section">
        <div className="container admin">
          <div className="admin__toolbar">
            <div className="admin__tabs" role="tablist" aria-label="Admin sections">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.id}
                  className={tab === item.id ? 'is-active' : undefined}
                  onClick={() => setTab(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="admin__toolbar-actions">
              <button type="button" className="btn btn--line" onClick={refreshOrders}>
                Refresh
              </button>
              <button type="button" className="btn btn--line" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          </div>

          {tab === 'overview' ? (
            <div className="admin__panel">
              <div className="admin__stats">
                <div className="admin__stat">
                  <span>{format(revenueAed)}</span>
                  Gross sales
                </div>
                <div className="admin__stat">
                  <span>{orders.length}</span>
                  Transactions
                </div>
                <div className="admin__stat">
                  <span>{pendingCount}</span>
                  Pending
                </div>
                <div className="admin__stat">
                  <span>{deliveredCount}</span>
                  Delivered
                </div>
                <div className="admin__stat">
                  <span>{customers.length}</span>
                  Customers
                </div>
                <div className="admin__stat">
                  <span>{catalogCount}</span>
                  Catalog items
                </div>
              </div>

              <div className="admin__grid">
                <div className="admin__card">
                  <div className="admin__card-head">
                    <h2>Recent transactions</h2>
                    <button type="button" className="text-link" onClick={() => setTab('orders')}>
                      View all
                    </button>
                  </div>
                  {orders.length ? (
                    <div className="admin-table-wrap">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Order</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 6).map((order) => (
                            <tr key={order.id}>
                              <td>
                                <strong>{order.id}</strong>
                                <small>{formatOrderDate(order.createdAt)}</small>
                              </td>
                              <td>{order.customer?.fullName}</td>
                              <td>{format(order.totalAed)}</td>
                              <td>
                                <span className={`admin-badge admin-badge--${order.status}`}>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="admin__empty">
                      No orders yet. When customers checkout, transactions appear here.
                    </p>
                  )}
                </div>

                <div className="admin__card">
                  <div className="admin__card-head">
                    <h2>Account</h2>
                  </div>
                  <dl className="profile__meta">
                    <div>
                      <dt>Admin</dt>
                      <dd>{user.name}</dd>
                    </div>
                    <div>
                      <dt>Email</dt>
                      <dd>{user.email}</dd>
                    </div>
                    <div>
                      <dt>Role</dt>
                      <dd>Admin</dd>
                    </div>
                  </dl>
                  <div className="profile__actions">
                    <Link className="btn btn--primary" to="/">
                      View storefront
                    </Link>
                    <button type="button" className="btn btn--line" onClick={() => setTab('customers')}>
                      Customers
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {tab === 'customers' ? (
            <div className="admin__panel">
              <div className="admin__card">
                <div className="admin__card-head">
                  <h2>Registered customers</h2>
                  <input
                    className="admin__search"
                    type="search"
                    placeholder="Search name or email"
                    value={customerQuery}
                    onChange={(e) => setCustomerQuery(e.target.value)}
                    aria-label="Search customers"
                  />
                </div>
                {filteredCustomers.length ? (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Email</th>
                          <th>Orders</th>
                          <th>Spent</th>
                          <th>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomers.map((customer) => (
                          <tr key={customer.id}>
                            <td>
                              <strong>{customer.name}</strong>
                            </td>
                            <td>{customer.email}</td>
                            <td>{customer.orderCount}</td>
                            <td>{format(customer.spentAed)}</td>
                            <td>
                              {customer.createdAt
                                ? formatOrderDate(customer.createdAt)
                                : 'Seed account'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="admin__empty">No customers match your search.</p>
                )}
              </div>
            </div>
          ) : null}

          {tab === 'orders' ? (
            <div className="admin__panel">
              <div className="admin__card">
                <div className="admin__card-head">
                  <h2>All transactions</h2>
                  <select
                    className="admin__filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    aria-label="Filter by status"
                  >
                    <option value="all">All statuses</option>
                    {ORDER_STATUSES.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {filteredOrders.length ? (
                  <div className="admin-orders">
                    {filteredOrders.map((order) => {
                      const open = expandedId === order.id
                      return (
                        <article key={order.id} className="admin-order">
                          <button
                            type="button"
                            className="admin-order__summary"
                            onClick={() => setExpandedId(open ? null : order.id)}
                            aria-expanded={open}
                          >
                            <div>
                              <strong>{order.id}</strong>
                              <span>{formatOrderDate(order.createdAt)}</span>
                            </div>
                            <div>
                              <strong>{order.customer?.fullName}</strong>
                              <span>{order.customer?.email}</span>
                            </div>
                            <div>
                              <strong>{format(order.totalAed)}</strong>
                              <span>{paymentLabel(order.payment)}</span>
                            </div>
                            <span className={`admin-badge admin-badge--${order.status}`}>
                              {order.status}
                            </span>
                          </button>

                          {open ? (
                            <div className="admin-order__detail">
                              <div className="admin-order__meta">
                                <p>
                                  <strong>Phone:</strong> {order.customer?.phone}
                                </p>
                                <p>
                                  <strong>Address:</strong> {order.customer?.address},{' '}
                                  {order.customer?.city}, {order.customer?.emirate}
                                </p>
                                {order.promo ? (
                                  <p>
                                    <strong>Promo:</strong> {order.promo}
                                  </p>
                                ) : null}
                                {order.customer?.notes ? (
                                  <p>
                                    <strong>Notes:</strong> {order.customer.notes}
                                  </p>
                                ) : null}
                              </div>

                              <ul className="checkout-items checkout-items--plain">
                                {order.items.map((item) => (
                                  <li key={`${order.id}-${item.id}`}>
                                    <div>
                                      <strong>{item.name}</strong>
                                      <span>
                                        Qty {item.quantity} · {format(item.lineTotal)}
                                      </span>
                                    </div>
                                  </li>
                                ))}
                              </ul>

                              <label className="admin-order__status">
                                Update status
                                <select
                                  value={order.status || 'pending'}
                                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                >
                                  {ORDER_STATUSES.map((status) => (
                                    <option key={status.id} value={status.id}>
                                      {status.label}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            </div>
                          ) : null}
                        </article>
                      )
                    })}
                  </div>
                ) : (
                  <p className="admin__empty">
                    No transactions{statusFilter !== 'all' ? ` with status “${statusFilter}”` : ''}.
                    Place a customer order from checkout to populate this list.
                  </p>
                )}
              </div>
            </div>
          ) : null}

          {tab === 'catalog' ? (
            <div className="admin__panel">
              <div className="admin__stats">
                <div className="admin__stat">
                  <span>{menCount}</span>
                  Men
                </div>
                <div className="admin__stat">
                  <span>{womenCount}</span>
                  Women
                </div>
                <div className="admin__stat">
                  <span>{exclusiveCount}</span>
                  Exclusive
                </div>
                <div className="admin__stat">
                  <span>{combos.length}</span>
                  Combos
                </div>
              </div>
              <div className="admin__card">
                <h2>Catalog shortcuts</h2>
                <div className="profile__actions">
                  <Link className="btn btn--primary" to="/men-perfumes">
                    Men perfumes
                  </Link>
                  <Link className="btn btn--line" to="/women-perfumes">
                    Women perfumes
                  </Link>
                  <Link className="btn btn--line" to="/exclusive">
                    Exclusive
                  </Link>
                  <Link className="btn btn--line" to="/combos">
                    Combos
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
