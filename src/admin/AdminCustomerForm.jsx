import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROLES, useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { IconBack } from './icons'

const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain']

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  city: '',
  emirate: 'Dubai',
  notes: '',
  password: '',
}

function passwordChecks(password) {
  return [
    { id: 'len', label: 'At least 8 characters long', ok: password.length >= 8 },
    { id: 'upper', label: 'At least 1 uppercase letter (A–Z)', ok: /[A-Z]/.test(password) },
    { id: 'lower', label: 'At least 1 lowercase letter (a–z)', ok: /[a-z]/.test(password) },
    { id: 'digit', label: 'At least 1 digit (0–9)', ok: /\d/.test(password) },
    { id: 'special', label: 'At least 1 special character (!@#$%...)', ok: /[^A-Za-z0-9]/.test(password) },
  ]
}

export default function AdminCustomerForm() {
  const { createAccount } = useAuth()
  const { showToast } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const checks = useMemo(() => passwordChecks(form.password), [form.password])

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleClear() {
    setForm(emptyForm)
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (checks.some((item) => !item.ok)) {
      setError('Password does not meet the required checklist.')
      return
    }
    const result = createAccount(
      {
        ...form,
        role: ROLES.CUSTOMER,
      },
      { signIn: false },
    )
    if (!result.ok) {
      setError(result.error)
      return
    }
    showToast(`${result.user.name} added to customers`)
    navigate('/admin/customers')
  }

  return (
    <section className="admin-card">
      <div className="admin-card__head">
        <Link className="admin-link" to="/admin/customers">
          ← Back to customers list
        </Link>
        <span className="admin-pill">CUSTOMER FORM</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-section__title">
          <div>
            <h3>Customer profile</h3>
            <p>Shopper identity and account credentials.</p>
          </div>
        </div>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Customer name <b className="admin-req">*</b></span>
            <input
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="e.g. Priyanshu Nigam"
              required
            />
          </label>
          <label className="admin-field">
            <span>Username / email <b className="admin-req">*</b></span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="e.g. priyanshu@email.com"
              required
            />
          </label>
          <label className="admin-field">
            <span>Phone number</span>
            <input
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="e.g. 055 238 3144"
            />
          </label>
          <label className="admin-field">
            <span>City</span>
            <input
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              placeholder="e.g. Business Bay"
            />
          </label>
          <label className="admin-field">
            <span>Emirate</span>
            <select value={form.emirate} onChange={(e) => update('emirate', e.target.value)}>
              {EMIRATES.map((emirate) => (
                <option key={emirate} value={emirate}>
                  {emirate}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span>Notes</span>
            <input
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Preferred delivery notes"
            />
          </label>
        </div>

        <div className="admin-split-grid admin-section">
          <div>
            <div className="admin-section__title">
              <div>
                <h3>Delivery details</h3>
                <p>Used when this shopper places an order.</p>
              </div>
            </div>
            <p className="admin-note">
              The new account can sign in on the storefront immediately. Orders they place will
              attach to this email automatically.
            </p>
          </div>
          <div className="admin-card" style={{ boxShadow: 'none' }}>
            <label className="admin-field">
              <span>Initial password <b className="admin-req">*</b></span>
              <div className="admin-verify">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  onClick={() => setShowPassword((open) => !open)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>
            <ul className="admin-checks">
              {checks.map((item) => (
                <li key={item.id} className={item.ok ? 'is-ok' : undefined}>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {error ? <p className="admin-error" style={{ marginTop: '1rem' }}>{error}</p> : null}

        <div className="admin-form-actions">
          <Link className="admin-btn admin-btn--line" to="/admin/customers">
            <IconBack />
            Back
          </Link>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={handleClear}>
            Clear form
          </button>
          <button type="submit" className="admin-btn admin-btn--gradient">
            Submit & create customer
          </button>
        </div>
      </form>
    </section>
  )
}
