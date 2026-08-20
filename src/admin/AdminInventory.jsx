import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import { useCurrency } from '../context/CurrencyContext'
import { IconPlus, IconSearch } from './icons'

const CATEGORIES = [
  { id: 'all', label: 'All categories' },
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' },
  { id: 'unisex', label: 'Exclusive' },
]

export default function AdminInventory() {
  const { products, removeProduct } = useCatalog()
  const { format } = useCurrency()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((item) => {
      if (category !== 'all' && item.category !== category) return false
      if (!q) return true
      return [item.name, item.brand, item.sku, item.family]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    })
  }, [products, query, category])

  return (
    <section className="admin-card">
      <div className="admin-card__head">
        <div>
          <h2>Perfume inventory</h2>
          <p>Search bottles, review live AED prices, and add new listings.</p>
        </div>
        <Link className="admin-btn admin-btn--gradient" to="/admin/inventory/new">
          <IconPlus />
          Add Perfume
        </Link>
      </div>

      <div className="admin-search" style={{ marginBottom: '0.8rem' }}>
        <IconSearch />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search perfume name, brand or SKU..."
        />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`admin-btn ${category === item.id ? 'admin-btn--maroon' : 'admin-btn--ghost'}`}
            onClick={() => setCategory(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product name</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((product) => (
              <tr key={product.id}>
                <td>
                  <img className="admin-thumb" src={product.image} alt="" />
                </td>
                <td>
                  <strong>{product.name}</strong>
                  <small>{product.sku}</small>
                </td>
                <td className="admin-accent">{product.brand}</td>
                <td>{format(product.price)}</td>
                <td>
                  <span className="admin-badge admin-badge--method">
                    {product.category === 'unisex' ? 'Exclusive' : product.category}
                  </span>
                </td>
                <td>
                  <span className={`admin-badge admin-badge--${product.status || 'active'}`}>
                    {product.status || 'active'}
                  </span>
                </td>
                <td>
                  <Link className="admin-link" to={`/admin/inventory/${product.id}`}>
                    Edit
                  </Link>
                  {product.createdAt ? (
                    <button
                      type="button"
                      className="admin-link"
                      style={{ marginLeft: '0.8rem' }}
                      onClick={() => removeProduct(product.id)}
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
      {!rows.length ? <div className="admin-empty">No perfumes match this filter.</div> : null}
    </section>
  )
}
