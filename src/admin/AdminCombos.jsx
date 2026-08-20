import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import { useCurrency } from '../context/CurrencyContext'
import { IconPlus, IconSearch } from './icons'

export default function AdminCombos() {
  const { combos, removeCombo } = useCatalog()
  const { format } = useCurrency()
  const [query, setQuery] = useState('')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return combos
    return combos.filter((combo) =>
      [combo.name, ...(combo.includes || [])].some((value) =>
        String(value).toLowerCase().includes(q),
      ),
    )
  }, [combos, query])

  return (
    <section className="admin-card">
      <div className="admin-card__head">
        <div>
          <h2>Combo offers</h2>
          <p>Exclusive bundles priced below buying the bottles separately.</p>
        </div>
        <Link className="admin-btn admin-btn--gradient" to="/admin/combos/new">
          <IconPlus />
          Add Combo
        </Link>
      </div>
      <div className="admin-search" style={{ marginBottom: '1rem' }}>
        <IconSearch />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search combo name or included bottles..."
        />
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Combo</th>
              <th>Includes</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((combo) => (
              <tr key={combo.id}>
                <td>
                  <img className="admin-thumb" src={combo.image} alt="" />
                </td>
                <td>
                  <strong>{combo.name}</strong>
                  <small>{combo.badge}</small>
                </td>
                <td>{(combo.includes || []).join(', ')}</td>
                <td>{format(combo.price)}</td>
                <td>
                  <span className={`admin-badge admin-badge--${combo.status || 'active'}`}>
                    {combo.status || 'active'}
                  </span>
                </td>
                <td>
                  <Link className="admin-link" to={`/admin/combos/${combo.id}`}>
                    Edit
                  </Link>
                  {combo.createdAt ? (
                    <button
                      type="button"
                      className="admin-link"
                      style={{ marginLeft: '0.8rem' }}
                      onClick={() => removeCombo(combo.id)}
                    >
                      Delete
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
