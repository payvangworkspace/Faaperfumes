import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { profilePathFor, useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Login() {
  const { login, isAuthenticated, user } = useAuth()
  const { showToast } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || null
  const fromCheckout = redirectTo === '/checkout'
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to={redirectTo || profilePathFor(user)} replace />
  }

  function handleSubmit(e) {
    e.preventDefault()
    const result = login(form)
    if (!result.ok) {
      setError(result.error)
      return
    }
    showToast(
      fromCheckout
        ? `Welcome back, ${result.user.name} — continue to checkout`
        : `Welcome back, ${result.user.name}`,
    )
    navigate(redirectTo || profilePathFor(result.user))
  }

  return (
    <section className="section auth">
      <div className="container auth__card">
        <p className="eyebrow">Account</p>
        <h1>Log in</h1>
        <p className="auth__lead">
          {fromCheckout
            ? 'Sign in to complete your order. Your cart items will still be waiting.'
            : 'Sign in as a customer to shop, or as admin to open the admin profile.'}
        </p>

        <form className="auth__form" onSubmit={handleSubmit}>
          {error ? <p className="auth__error">{error}</p> : null}

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
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
            />
          </label>

          <button type="submit" className="btn btn--primary">
            {fromCheckout ? 'Log in & checkout' : 'Log in'}
          </button>
        </form>

        <p className="auth__hint">
          Demo customer: <code>customer@faaperfumes.com</code> / <code>Customer@123</code>
          <br />
          Demo admin: <code>admin@faaperfumes.com</code> / <code>Admin@123</code>
        </p>

        <p className="auth__switch">
          New here?{' '}
          <Link to="/signup" state={redirectTo ? { from: redirectTo } : undefined}>
            Create a customer account
          </Link>
        </p>
      </div>
    </section>
  )
}
