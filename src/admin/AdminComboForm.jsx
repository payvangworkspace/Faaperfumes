import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import { useCart } from '../context/CartContext'
import { IconBack } from './icons'

const emptyForm = {
  name: '',
  includes: '',
  size: '2 bottles',
  price: '',
  compareAt: '',
  badge: 'Bundle',
  image: '',
  description: '',
  featured: true,
  status: 'active',
}

export default function AdminComboForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const { findItem, addCombo, updateCombo, bottleImages } = useCatalog()
  const { showToast } = useCart()
  const navigate = useNavigate()
  const existing = isEdit ? findItem(id) : null
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!existing) return
    setForm({
      name: existing.name,
      includes: (existing.includes || []).join(', '),
      size: existing.size || '2 bottles',
      price: existing.price,
      compareAt: existing.compareAt,
      badge: existing.badge || 'Bundle',
      image: existing.image,
      description: existing.description || '',
      featured: existing.featured !== false,
      status: existing.status || 'active',
    })
  }, [existing])

  if (isEdit && (!existing || existing.category !== 'combo')) {
    return <Navigate to="/admin/combos" replace />
  }

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.price || !form.image) {
      setError('Name, price, and image are required.')
      return
    }
    const payload = { ...form, compareAt: form.compareAt || form.price }
    if (isEdit) {
      updateCombo(id, payload)
      showToast(`${form.name} updated`)
    } else {
      addCombo(payload)
      showToast(`${form.name} published`)
    }
    navigate('/admin/combos')
  }

  return (
    <section className="admin-card">
      <div className="admin-card__head">
        <Link className="admin-link" to="/admin/combos">
          ← Back to combos
        </Link>
        <span className="admin-pill">{isEdit ? 'EDIT COMBO' : 'NEW COMBO'}</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Combo name <b className="admin-req">*</b></span>
            <input value={form.name} onChange={(e) => update('name', e.target.value)} required />
          </label>
          <label className="admin-field">
            <span>Size</span>
            <input value={form.size} onChange={(e) => update('size', e.target.value)} />
          </label>
          <label className="admin-field">
            <span>Badge</span>
            <input value={form.badge} onChange={(e) => update('badge', e.target.value)} />
          </label>
          <label className="admin-field admin-field--wide">
            <span>Includes</span>
            <input
              value={form.includes}
              onChange={(e) => update('includes', e.target.value)}
              placeholder="Bottle one, Bottle two"
            />
          </label>
          <label className="admin-field">
            <span>Price (AED)</span>
            <input
              type="number"
              min="1"
              value={form.price}
              onChange={(e) => update('price', e.target.value)}
              required
            />
          </label>
          <label className="admin-field">
            <span>Compare-at (AED)</span>
            <input
              type="number"
              min="1"
              value={form.compareAt}
              onChange={(e) => update('compareAt', e.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>Status</span>
            <select value={form.status} onChange={(e) => update('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </select>
          </label>
          <label className="admin-field admin-field--wide">
            <span>Image</span>
            <select value={form.image} onChange={(e) => update('image', e.target.value)} required>
              <option value="">Select a bottle photo</option>
              {bottleImages.map((src) => (
                <option key={src} value={src}>
                  {src.replace('/perfumes/bottles/', '')}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field admin-field--wide">
            <span>Description</span>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
            />
          </label>
        </div>
        {error ? <p className="admin-error">{error}</p> : null}
        <div className="admin-form-actions">
          <Link className="admin-btn admin-btn--line" to="/admin/combos">
            <IconBack />
            Back
          </Link>
          <button type="submit" className="admin-btn admin-btn--gradient">
            {isEdit ? 'Save combo' : 'Submit & publish combo'}
          </button>
        </div>
      </form>
    </section>
  )
}
