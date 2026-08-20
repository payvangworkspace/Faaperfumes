import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { brandNames } from '../data'
import { useCatalog } from '../context/CatalogContext'
import { useCart } from '../context/CartContext'
import { IconBack } from './icons'

const emptyForm = {
  name: '',
  brand: 'Lattafa',
  category: 'men',
  size: '100ml',
  concentration: 'EDP',
  family: 'Oriental',
  price: '',
  compareAt: '',
  image: '',
  description: '',
  featured: true,
  status: 'active',
}

export default function AdminProductForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const { findItem, addProduct, updateProduct, bottleImages } = useCatalog()
  const { showToast } = useCart()
  const navigate = useNavigate()
  const existing = isEdit ? findItem(id) : null
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const brands =
    existing?.brand && !brandNames.includes(existing.brand)
      ? [existing.brand, ...brandNames]
      : brandNames

  useEffect(() => {
    if (!existing) return
    setForm({
      name: existing.name,
      brand: existing.brand,
      category: existing.category,
      size: existing.size || '100ml',
      concentration: existing.concentration || 'EDP',
      family: existing.family || 'Oriental',
      price: existing.price,
      compareAt: existing.compareAt,
      image: existing.image,
      description: existing.description || '',
      featured: Boolean(existing.featured),
      status: existing.status || 'active',
    })
  }, [existing])

  if (isEdit && (!existing || existing.category === 'combo')) {
    return <Navigate to="/admin/inventory" replace />
  }

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.image || !form.price) {
      setError('Name, bottle image, and price are required.')
      return
    }
    const payload = {
      ...form,
      compareAt: form.compareAt || form.price,
    }
    if (isEdit) {
      updateProduct(id, payload)
      showToast(`${form.name} updated`)
    } else {
      addProduct(payload)
      showToast(`${form.name} added to catalog`)
    }
    navigate('/admin/inventory')
  }

  return (
    <section className="admin-card">
      <div className="admin-card__head">
        <Link className="admin-link" to="/admin/inventory">
          ← Back to perfume list
        </Link>
        <span className="admin-pill">{isEdit ? 'EDIT LISTING' : 'NEW LISTING'}</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-section__title">
          <div>
            <h3>Fragrance profile</h3>
            <p>These fields publish to the live store immediately.</p>
          </div>
        </div>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Perfume name <b className="admin-req">*</b></span>
            <input value={form.name} onChange={(e) => update('name', e.target.value)} required />
          </label>
          <label className="admin-field">
            <span>Brand</span>
            <select value={form.brand} onChange={(e) => update('brand', e.target.value)}>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span>Category</span>
            <select value={form.category} onChange={(e) => update('category', e.target.value)}>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Exclusive / Unisex</option>
            </select>
          </label>
          <label className="admin-field">
            <span>Size</span>
            <input value={form.size} onChange={(e) => update('size', e.target.value)} />
          </label>
          <label className="admin-field">
            <span>Concentration</span>
            <select
              value={form.concentration}
              onChange={(e) => update('concentration', e.target.value)}
            >
              <option value="EDT">EDT</option>
              <option value="EDP">EDP</option>
              <option value="Parfum">Parfum</option>
            </select>
          </label>
          <label className="admin-field">
            <span>Family</span>
            <input value={form.family} onChange={(e) => update('family', e.target.value)} />
          </label>
          <label className="admin-field">
            <span>Price (AED) <b className="admin-req">*</b></span>
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
              <option value="draft">Draft</option>
            </select>
          </label>
          <label className="admin-field admin-field--wide">
            <span>Bottle image <b className="admin-req">*</b></span>
            <select value={form.image} onChange={(e) => update('image', e.target.value)} required>
              <option value="">Select a real bottle photo</option>
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
              placeholder="Short storefront copy"
            />
          </label>
          <label className="admin-field">
            <span>Featured</span>
            <select
              value={form.featured ? 'yes' : 'no'}
              onChange={(e) => update('featured', e.target.value === 'yes')}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
        </div>

        {form.image ? (
          <img
            src={form.image}
            alt=""
            style={{ width: 96, height: 96, objectFit: 'contain', marginTop: '1rem' }}
          />
        ) : null}

        {error ? <p className="admin-error">{error}</p> : null}

        <div className="admin-form-actions">
          <Link className="admin-btn admin-btn--line" to="/admin/inventory">
            <IconBack />
            Back
          </Link>
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() => setForm(isEdit && existing ? form : emptyForm)}
          >
            Clear
          </button>
          <button type="submit" className="admin-btn admin-btn--gradient">
            {isEdit ? 'Save perfume' : 'Submit & publish perfume'}
          </button>
        </div>
      </form>
    </section>
  )
}
