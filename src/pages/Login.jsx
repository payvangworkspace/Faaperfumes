import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const { showToast } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/wishlist'
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  function handleSubmit(e) {
    e.preventDefault()
    const result = login(form)
    if (!result.ok) {
      setError(result.error)
      return
    }
    showToast(`Welcome back, ${result.user.name}`)
    navigate(redirectTo)
  }

  return (
    <section className="section auth">
      <div className="container auth__card">
        <p className="eyebrow">Account</p>
        <h1>Log in</h1>
        <p className="auth__lead">Access your wishlist and saved preferences.</p>

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
            Log in
          </button>
        </form>

        <p className="auth__switch">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </section>
  )
}
