import { useState } from 'react'
import { usePromo } from '../context/PromoContext'
import { useCart } from '../context/CartContext'
import { IconPlus } from './icons'

export default function AdminPromos() {
  const { codes, addPromo, removePromo } = usePromo()
  const { showToast } = useCart()
  const [form, setForm] = useState({ code: '', label: '', percent: '', description: '' })
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const result = addPromo(form)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setForm({ code: '', label: '', percent: '', description: '' })
    setError('')
    showToast(`${result.promo.code} is live on the storefront`)
  }

  return (
    <section className="admin-card">
      <div className="admin-card__head">
        <div>
          <h2>Promo codes</h2>
          <p>Codes persist locally and are usable on the storefront promo bar.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form-grid" style={{ marginBottom: '1.2rem' }}>
        <label className="admin-field">
          <span>Code</span>
          <input
            value={form.code}
            onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
            placeholder="EID20"
            required
          />
        </label>
        <label className="admin-field">
          <span>Label</span>
          <input
            value={form.label}
            onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
            placeholder="Eid extra 20%"
          />
        </label>
        <label className="admin-field">
          <span>Percent</span>
          <input
            type="number"
            min="1"
            max="89"
            value={form.percent}
            onChange={(e) => setForm((prev) => ({ ...prev, percent: e.target.value }))}
            required
          />
        </label>
        <label className="admin-field admin-field--wide">
          <span>Description</span>
          <input
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
        </label>
        {error ? <p className="admin-error" style={{ gridColumn: '1 / -1' }}>{error}</p> : null}
        <div>
          <button type="submit" className="admin-btn admin-btn--gradient">
            <IconPlus />
            Add promo
          </button>
        </div>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Label</th>
              <th>Discount</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((promo) => (
              <tr key={promo.code}>
                <td>
                  <strong>{promo.code}</strong>
                </td>
                <td>{promo.label}</td>
                <td>{promo.percent}%</td>
                <td>{promo.description}</td>
                <td>
                  <button type="button" className="admin-link" onClick={() => removePromo(promo.code)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
