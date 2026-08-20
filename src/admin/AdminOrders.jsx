import { useMemo, useState } from 'react'
import { CURRENCIES } from '../lib/currency'
import { useAuth } from '../context/AuthContext'
import { useCurrency } from '../context/CurrencyContext'
import {
  ORDER_STATUSES,
  formatOrderDate,
  getOrders,
  ordersToCsv,
  paymentLabel,
  updateOrderStatus,
} from '../lib/orders'
import { computeOrderStats } from '../lib/adminStats'
import { IconCard, IconDownload } from './icons'

export default function AdminOrders() {
  const { users } = useAuth()
  const { format } = useCurrency()
  const [orders, setOrders] = useState(() => getOrders())
  const [filters, setFilters] = useState({
    customer: 'all',
    currency: 'all',
    from: '',
    to: '',
    status: 'all',
  })

  const customers = users.filter((user) => user.role !== 'admin')

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      if (filters.customer !== 'all' && order.customer?.email !== filters.customer) return false
      if (filters.currency !== 'all' && (order.currency || 'AED') !== filters.currency) return false
      if (filters.status !== 'all' && order.status !== filters.status) return false
      if (filters.from) {
        const start = new Date(filters.from).setHours(0, 0, 0, 0)
        if (order.createdAt < start) return false
      }
      if (filters.to) {
        const end = new Date(filters.to).setHours(23, 59, 59, 999)
        if (order.createdAt > end) return false
      }
      return true
    })
  }, [orders, filters])

  const stats = useMemo(() => computeOrderStats(filtered), [filtered])

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function handleStatus(orderId, status) {
    setOrders(updateOrderStatus(orderId, status))
  }

  function handleExport() {
    const csv = ordersToCsv(filtered)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `faaperfume-orders-${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <section className="admin-card" style={{ marginBottom: '1rem' }}>
        <div className="admin-card__head">
          <div>
            <h2>Payin ledger filters</h2>
            <p>Filter the live checkout book by shopper, date, and status.</p>
          </div>
        </div>
        <div className="admin-filter-grid">
          <label className="admin-field">
            <span>Customer</span>
            <select value={filters.customer} onChange={(e) => setFilter('customer', e.target.value)}>
              <option value="all">All customers</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.email}>
                  {customer.name}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span>Currency</span>
            <select value={filters.currency} onChange={(e) => setFilter('currency', e.target.value)}>
              <option value="all">All currencies</option>
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} — {currency.name}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span>Date from</span>
            <input type="date" value={filters.from} onChange={(e) => setFilter('from', e.target.value)} />
          </label>
          <label className="admin-field">
            <span>Date to</span>
            <input type="date" value={filters.to} onChange={(e) => setFilter('to', e.target.value)} />
          </label>
          <label className="admin-field">
            <span>Status</span>
            <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)}>
              <option value="all">All statuses</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="admin-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        <article className="admin-card admin-kpi">
          <span className="admin-kpi__label">Total transactions</span>
          <strong className="admin-kpi__value">{stats.totalOrders}</strong>
          <p>Gross acquiring volume {format(stats.grossSales)}</p>
        </article>
        <article className="admin-card admin-kpi">
          <span className="admin-kpi__label">Success TXNs</span>
          <strong className="admin-kpi__value">{stats.successCount}</strong>
          <p>Captured & settled {format(stats.successSales)}</p>
        </article>
        <article className="admin-card admin-kpi">
          <span className="admin-kpi__label">Failed TXNs</span>
          <strong className="admin-kpi__value">{stats.cancelledCount}</strong>
          <p>Declined or cancelled {format(stats.cancelledSales)}</p>
        </article>
        <article className="admin-card admin-kpi">
          <span className="admin-kpi__label">Pending TXNs</span>
          <strong className="admin-kpi__value">{stats.pendingCount}</strong>
          <p>Awaiting confirmation {format(stats.pendingSales)}</p>
        </article>
      </section>

      <section className="admin-card">
        <div className="admin-card__head">
          <div>
            <h2>Acquiring transaction records</h2>
            <p>Checkout sessions, amounts and settlement status.</p>
          </div>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={handleExport}>
            <IconDownload />
            Export to Excel
          </button>
        </div>

        {filtered.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Payment</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.id}</strong>
                      <small>{formatOrderDate(order.createdAt)}</small>
                    </td>
                    <td>
                      <strong>{order.customer?.fullName}</strong>
                      <small>{order.customer?.email}</small>
                    </td>
                    <td>
                      <span className="admin-badge admin-badge--method">
                        {paymentLabel(order.payment)}
                      </span>
                    </td>
                    <td>{order.itemCount || order.items?.length || 0}</td>
                    <td>{format(order.totalAed)}</td>
                    <td>
                      <span className={`admin-badge admin-badge--${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="admin-status-select"
                        value={order.status}
                        onChange={(e) => handleStatus(order.id, e.target.value)}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status.id} value={status.id}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty">
            <IconCard />
            <strong>No data found.</strong>
            <p>No transaction logs match the selected filter criteria.</p>
          </div>
        )}
      </section>
    </>
  )
}
