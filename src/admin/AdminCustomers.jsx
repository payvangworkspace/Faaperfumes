import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, ROLES } from '../context/AuthContext'
import { useCurrency } from '../context/CurrencyContext'
import { formatOrderDate, getOrders } from '../lib/orders'
import { customerSpendMap } from '../lib/adminStats'
import { initials } from './AdminLayout'
import { IconCalendar, IconMail, IconPhone, IconPlus, IconSearch } from './icons'

export default function AdminCustomers() {
  const { users } = useAuth()
  const { format } = useCurrency()
  const [query, setQuery] = useState('')
  const [orders] = useState(() => getOrders())
  const spend = useMemo(() => customerSpendMap(orders), [orders])

  const rows = useMemo(() => {
    return users
      .filter((user) => user.role !== ROLES.ADMIN)
      .map((user) => ({
        ...user,
        orderCount: spend[user.email]?.orderCount || 0,
        spentAed: spend[user.email]?.spentAed || 0,
        lastOrderAt: spend[user.email]?.lastOrderAt || null,
      }))
      .filter((user) => {
        const q = query.trim().toLowerCase()
        if (!q) return true
        return [user.name, user.email, user.phone, user.city]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(q))
      })
  }, [users, spend, query])

  return (
    <section className="admin-card">
      <div className="admin-card__head">
        <div>
          <h2>Customer accounts</h2>
          <p>Search, review, and onboard shopper profiles.</p>
        </div>
        <Link className="admin-btn admin-btn--gradient" to="/admin/customers/new">
          <IconPlus />
          Add Customer
        </Link>
      </div>

      <div className="admin-search" style={{ marginBottom: '1rem' }}>
        <IconSearch />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email or phone..."
          aria-label="Search customers"
        />
      </div>

      {rows.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer name</th>
                <th>Contact number</th>
                <th>Email</th>
                <th>City</th>
                <th>Orders</th>
                <th>Spent</th>
                <th>Registration date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="admin-person">
                      <span className="admin-avatar">{initials(customer.name)}</span>
                      <div>
                        <strong>{customer.name}</strong>
                        <span>{customer.emirate || 'UAE'}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="admin-cell-icon">
                      <IconPhone />
                      {customer.phone || '—'}
                    </span>
                  </td>
                  <td>
                    <span className="admin-cell-icon">
                      <IconMail />
                      {customer.email}
                    </span>
                  </td>
                  <td className="admin-accent">{customer.city || '—'}</td>
                  <td>{customer.orderCount}</td>
                  <td>{format(customer.spentAed)}</td>
                  <td>
                    <span className="admin-cell-icon">
                      <IconCalendar />
                      {customer.createdAt ? formatOrderDate(customer.createdAt) : 'Seed account'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-empty">
          <p>No customers match the current search.</p>
        </div>
      )}
    </section>
  )
}
