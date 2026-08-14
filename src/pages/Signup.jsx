import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { usePromo } from '../context/PromoContext'

export default function Signup() {
  const { signup, isAuthenticated } = useAuth()
  const { showToast } = useCart()
  const { applyPromo } = usePromo()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/wishlist" replace />
  }

  function handleSubmit(e) {
    e.preventDefault()
    const result = signup(form)
    if (!result.ok) {
      setError(result.error)
      return
    }
    applyPromo('WELCOME15')
    showToast(`Welcome, ${result.user.name} — WELCOME15 applied`)
    navigate('/wishlist')
  }

  return (
    <section className="section auth">
      <div className="container auth__card">
        <p className="eyebrow">Account</p>
        <h1>Sign up</h1>
        <p className="auth__lead">
          Create an account to save your wishlist. New members get code WELCOME15.
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

          <button type="submit" className="btn btn--primary">
            Create account
          </button>
        </form>

        <p className="auth__switch">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  )
}
