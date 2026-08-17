import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ROLES, profilePathFor, useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { usePromo } from '../context/PromoContext'

export default function Signup() {
  const { signup, isAuthenticated, user } = useAuth()
  const { showToast } = useCart()
  const { applyPromo } = usePromo()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || null
  const fromCheckout = redirectTo === '/checkout'
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: ROLES.CUSTOMER,
  })
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to={redirectTo || profilePathFor(user)} replace />
  }

  function handleSubmit(e) {
    e.preventDefault()
    const result = signup(form)
    if (!result.ok) {
      setError(result.error)
      return
    }
    if (result.user.role === ROLES.CUSTOMER) {
      applyPromo('WELCOME15')
      showToast(
        fromCheckout
          ? `Welcome, ${result.user.name} — WELCOME15 applied. Continue to checkout`
          : `Welcome, ${result.user.name} — WELCOME15 applied`,
      )
    } else {
      showToast(`Welcome, ${result.user.name}`)
    }
    navigate(redirectTo || profilePathFor(result.user))
  }

  return (
    <section className="section auth">
      <div className="container auth__card">
        <p className="eyebrow">Account</p>
        <h1>Sign up</h1>
        <p className="auth__lead">
          {fromCheckout
            ? 'Create an account to checkout. Your cart will stay saved.'
            : 'Create a customer account to shop, or an admin account for store management.'}
        </p>

        <form className="auth__form" onSubmit={handleSubmit}>
          {error ? <p className="auth__error">{error}</p> : null}

          <label>
            Full name
            <input
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              autoComplete="new-password"
              minLength={6}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
            />
          </label>

          <label>
            Account type
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            >
              <option value={ROLES.CUSTOMER}>Customer — shop perfumes</option>
              <option value={ROLES.ADMIN}>Admin — manage store</option>
            </select>
          </label>

          <button type="submit" className="btn btn--primary">
            {fromCheckout ? 'Create account & checkout' : 'Create account'}
          </button>
        </form>

        <p className="auth__switch">
          Already registered?{' '}
          <Link to="/login" state={redirectTo ? { from: redirectTo } : undefined}>
            Log in
          </Link>
        </p>
      </div>
    </section>
  )
}
