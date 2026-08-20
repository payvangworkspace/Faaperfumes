import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../context/CatalogContext'
import { useCurrency } from '../context/CurrencyContext'
import { getOrders, formatOrderDate } from '../lib/orders'
import { computeOrderStats, topSellingItems } from '../lib/adminStats'
import { getPaymentLinks } from '../lib/paymentLinks'

export default function AdminSuperDashboard() {
  const { users } = useAuth()
  const { products, combos, liveProducts, findItem } = useCatalog()
  const { format } = useCurrency()
  const [orders] = useState(() => getOrders())
  const [links] = useState(() => getPaymentLinks())
  const stats = useMemo(() => computeOrderStats(orders), [orders])
  const topItems = useMemo(() => topSellingItems(orders), [orders])
  const customers = users.filter((item) => item.role !== 'admin')
  const newestCustomers = [...customers]
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 6)

  const categorySales = useMemo(() => {
    const buckets = { men: 0, women: 0, unisex: 0, combo: 0, other: 0 }
    orders
      .filter((order) => order.status !== 'cancelled')
      .forEach((order) => {
        ;(order.items || []).forEach((item) => {
          const product = findItem(item.id)
          const key = product?.category || 'other'
          buckets[key] = (buckets[key] || 0) + (item.lineTotal || 0)
        })
      })
    return buckets
  }, [orders, findItem])

  return (
    <>
      <section className="admin-kpi-grid">
        <article className="admin-card admin-kpi">
          <span className="admin-kpi__label">Gross sales</span>
          <strong className="admin-kpi__value">{format(stats.grossSales)}</strong>
          <p>All non-cancelled checkout totals.</p>
        </article>
        <article className="admin-card admin-kpi">
          <span className="admin-kpi__label">All transactions</span>
          <strong className="admin-kpi__value">{stats.totalOrders}</strong>
          <p>{stats.successCount} captured · {stats.pendingCount} pending.</p>
        </article>
        <article className="admin-card admin-kpi">
          <span className="admin-kpi__label">Payment links</span>
          <strong className="admin-kpi__value">{links.length}</strong>
          <p>Admin-created payin sessions stored locally.</p>
        </article>
      </section>

      <section className="admin-entity-grid">
        <article className="admin-card admin-entity">
          <div>
            <span className="admin-entity__label">Live bottles</span>
            <strong className="admin-entity__value">{liveProducts.length}</strong>
            <p>{products.length} including hidden drafts.</p>
          </div>
        </article>
        <article className="admin-card admin-entity">
          <div>
            <span className="admin-entity__label">Combos</span>
            <strong className="admin-entity__value">{combos.length}</strong>
          </div>
        </article>
        <article className="admin-card admin-entity">
          <div>
            <span className="admin-entity__label">Customers</span>
            <strong className="admin-entity__value">{customers.length}</strong>
          </div>
        </article>
        <article className="admin-card admin-entity">
          <div>
            <span className="admin-entity__label">Men sales</span>
            <strong className="admin-entity__value">{format(categorySales.men)}</strong>
          </div>
        </article>
        <article className="admin-card admin-entity">
          <div>
            <span className="admin-entity__label">Women sales</span>
            <strong className="admin-entity__value">{format(categorySales.women)}</strong>
          </div>
        </article>
      </section>

      <section className="admin-split-grid">
        <article className="admin-card">
          <div className="admin-card__head">
            <div>
              <h2>Top selling bottles</h2>
              <p>Ranked from real order line items.</p>
            </div>
            <Link className="admin-link" to="/admin/orders">
              Open ledger
            </Link>
          </div>
          {topItems.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.name}</strong>
                      </td>
                      <td>{item.quantity}</td>
                      <td>{format(item.sales)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="admin-empty">No paid line items yet. Sales rank fills as customers checkout.</p>
          )}
        </article>

        <article className="admin-card">
          <div className="admin-card__head">
            <div>
              <h2>Newest customers</h2>
              <p>Accounts created from signup or admin.</p>
            </div>
            <Link className="admin-link" to="/admin/customers">
              All customers
            </Link>
          </div>
          {newestCustomers.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {newestCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <strong>{customer.name}</strong>
                        <small>{customer.email}</small>
                      </td>
                      <td>{customer.createdAt ? formatOrderDate(customer.createdAt) : 'Seed account'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="admin-empty">No customer accounts yet.</p>
          )}
        </article>
      </section>
    </>
  )
}
