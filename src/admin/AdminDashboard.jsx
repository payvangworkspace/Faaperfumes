import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../context/CatalogContext'
import { useCurrency } from '../context/CurrencyContext'
import { getOrders } from '../lib/orders'
import { computeOrderStats } from '../lib/adminStats'
import { useCart } from '../context/CartContext'
import CurrencySwitch from '../components/CurrencySwitch'
import { initials } from './AdminLayout'
import { IconArrow, IconBottle, IconGift, IconUsers } from './icons'

function trendClass(value) {
  if (value > 0) return 'admin-trend--up'
  if (value < 0) return 'admin-trend--down'
  return 'admin-trend--flat'
}

function trendLabel(value) {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value}% vs yesterday`
}

export default function AdminDashboard() {
  const { user, users } = useAuth()
  const { products, combos, liveProducts } = useCatalog()
  const { format, currency, currencies } = useCurrency()
  const { showToast } = useCart()
  const selected = currencies.find((item) => item.code === currency) || currencies[0]
  const [orders] = useState(() => getOrders())
  const stats = useMemo(() => computeOrderStats(orders), [orders])
  const customers = users.filter((item) => item.role !== 'admin')
  const men = liveProducts.filter((item) => item.category === 'men').length
  const women = liveProducts.filter((item) => item.category === 'women').length
  const exclusive = liveProducts.filter((item) => item.category === 'unisex').length
  const maxWeekly = Math.max(...stats.weekly.map((day) => day.sales), 1)
  const statusRows = [
    { id: 'pending', label: 'Pending', count: stats.pendingCount, color: '#a88962' },
    { id: 'confirmed', label: 'Confirmed', count: stats.confirmedCount, color: '#5f746c' },
    { id: 'shipped', label: 'Shipped', count: stats.shippedCount, color: '#3a4a46' },
    { id: 'delivered', label: 'Delivered', count: stats.deliveredCount, color: '#1c2b28' },
    { id: 'cancelled', label: 'Cancelled', count: stats.cancelledCount, color: '#8b3a3a' },
  ]
  const rangeLabel = `${stats.weekly[0].dateLabel} – ${stats.weekly[6].dateLabel}`

  return (
    <>
      <section className="admin-card admin-welcome">
        <div className="admin-welcome__copy">
          <span className="admin-avatar">{initials(user.name)}</span>
          <div>
            <h2>Welcome Back, {user.name}!</h2>
            <p>
              Signed in as {user.email}. Catalog has {products.length} bottles and {combos.length}{' '}
              combos. {stats.todayCount} order{stats.todayCount === 1 ? '' : 's'} landed today.
            </p>
          </div>
        </div>
        <Link className="admin-btn admin-btn--gradient" to="/admin/orders">
          View Live Txns
          <IconArrow />
        </Link>
      </section>

      <section className="admin-card admin-currency-panel">
        <div className="admin-card__head">
          <div>
            <h2>Store currency</h2>
            <p>
              Change the display currency for the admin desk and the Faaperfume website. Prices stay
              stored in AED and convert live.
            </p>
          </div>
          <span className="admin-pill">
            Active: {selected.code} · {selected.name}
          </span>
        </div>
        <CurrencySwitch
          className="admin-currency-switch admin-currency-switch--dark"
          onSelect={(item) => showToast(`Website prices now show in ${item.code}`)}
        />
      </section>

      <section className="admin-kpi-grid">
        <article className="admin-card admin-kpi">
          <span className="admin-kpi__label">Today&apos;s sales</span>
          <span className={`admin-trend ${trendClass(stats.salesChange)}`}>
            {trendLabel(stats.salesChange)}
          </span>
          <strong className="admin-kpi__value">{format(stats.todaySales)}</strong>
          <p>Gross {currency} captured from today&apos;s checkouts.</p>
        </article>
        <article className="admin-card admin-kpi">
          <span className="admin-kpi__label">Orders today</span>
          <span className={`admin-trend ${trendClass(stats.countChange)}`}>
            {trendLabel(stats.countChange)}
          </span>
          <strong className="admin-kpi__value">{stats.todayCount}</strong>
          <p>Paid and pending checkout sessions created today.</p>
        </article>
        <article className="admin-card admin-kpi">
          <span className="admin-kpi__label">Average order value</span>
          <span className={`admin-trend ${trendClass(stats.aovChange)}`}>
            {trendLabel(stats.aovChange)}
          </span>
          <strong className="admin-kpi__value">{format(stats.todayAov)}</strong>
          <p>Today&apos;s sales divided by today&apos;s order count.</p>
        </article>
      </section>

      <section className="admin-entity-grid">
        <article className="admin-card admin-entity">
          <div>
            <span className="admin-entity__label">Men perfumes</span>
            <strong className="admin-entity__value">{men}</strong>
          </div>
          <span className="admin-entity__icon">
            <IconBottle />
          </span>
        </article>
        <article className="admin-card admin-entity">
          <div>
            <span className="admin-entity__label">Women perfumes</span>
            <strong className="admin-entity__value">{women}</strong>
          </div>
          <span className="admin-entity__icon">
            <IconBottle />
          </span>
        </article>
        <article className="admin-card admin-entity">
          <div>
            <span className="admin-entity__label">Exclusive</span>
            <strong className="admin-entity__value">{exclusive}</strong>
          </div>
          <span className="admin-entity__icon">
            <IconBottle />
          </span>
        </article>
        <article className="admin-card admin-entity">
          <div>
            <span className="admin-entity__label">Active combos</span>
            <strong className="admin-entity__value">{combos.length}</strong>
          </div>
          <span className="admin-entity__icon">
            <IconGift />
          </span>
        </article>
        <article className="admin-card admin-entity">
          <div>
            <span className="admin-entity__label">Customers</span>
            <strong className="admin-entity__value">{customers.length}</strong>
          </div>
          <span className="admin-entity__icon">
            <IconUsers />
          </span>
        </article>
      </section>

      <section className="admin-split-grid">
        <article className="admin-card">
          <div className="admin-card__head">
            <div>
              <h2>Weekly payout analysis</h2>
              <p>Sales from live checkout orders.</p>
            </div>
            <span className="admin-pill">{rangeLabel}</span>
          </div>
          <div className="admin-bars">
            {stats.weekly.map((day) => (
              <div key={day.key} className="admin-bar">
                <div className="admin-bar__track">
                  <div
                    className="admin-bar__fill"
                    style={{ height: `${Math.max(8, (day.sales / maxWeekly) * 100)}%` }}
                  />
                </div>
                <strong>{format(day.sales)}</strong>
                <span>{day.label}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-card">
          <div className="admin-card__head">
            <div>
              <h2>Total TXNs split</h2>
              <p>Realtime status breakdown.</p>
            </div>
          </div>
          <div className="admin-split-list">
            {statusRows.map((row) => (
              <div key={row.id} className="admin-split-row">
                <span>{row.label}</span>
                <div className="admin-split-track">
                  <div
                    className="admin-split-fill"
                    style={{
                      width: `${stats.totalOrders ? (row.count / stats.totalOrders) * 100 : 0}%`,
                      background: row.color,
                    }}
                  />
                </div>
                <b>{row.count}</b>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  )
}
