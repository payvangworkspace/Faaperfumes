import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAcquirers } from '../lib/acquirers'
import { IconPencil, IconPlus, IconSearch } from './icons'

export default function AdminAcquirers() {
  const [acquirers] = useState(() => getAcquirers())
  const [query, setQuery] = useState('')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return acquirers
    return acquirers.filter((item) =>
      [item.aggregatorCode, item.apiName, item.httpMethod, item.type, item.environment]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q)),
    )
  }, [acquirers, query])

  return (
    <section className="admin-card admin-acquirer-card">
      <div className="admin-card__head">
        <div>
          <h2>Acquirer Switches & Connectors</h2>
          <p>Search, review and manage acquiring gateway integrations.</p>
        </div>
        <Link className="admin-btn admin-btn--gradient" to="/admin/acquirers/new">
          <IconPlus />
          Add Acquirer
        </Link>
      </div>

      <div className="admin-search admin-acquirer-search">
        <IconSearch />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search acquirer code or name..."
        />
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table admin-acquirer-table">
          <thead>
            <tr>
              <th>Aggregator code</th>
              <th>API name</th>
              <th>HTTP method</th>
              <th>Type</th>
              <th>Environment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="admin-acquirer-code">
                      <span className="admin-acquirer-dot" aria-hidden="true" />
                      <strong>{item.aggregatorCode}</strong>
                    </div>
                  </td>
                  <td>{item.apiName}</td>
                  <td>
                    <span className="admin-badge admin-badge--method">{item.httpMethod}</span>
                  </td>
                  <td>{item.type}</td>
                  <td>{item.environment}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${item.status || 'active'}`}>
                      {item.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <Link className="admin-link" to={`/admin/acquirers/${item.id}`}>
                      <IconPencil /> Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="admin-acquirer-empty">
                  No acquirers match this search. Use Add Acquirer to create a connector.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
