import { createContext, useContext, useMemo, useState } from 'react'
import { readJson, writeJson } from '../lib/storage'

const AuthContext = createContext(null)
const USERS_KEY = 'faaperfumes_users'
const SESSION_KEY = 'faaperfumes_session'

function encodePassword(password) {
  return btoa(`faaperfumes:${password}`)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJson(SESSION_KEY, null))

  function getUsers() {
    return readJson(USERS_KEY, [])
  }

  function persistSession(nextUser) {
    setUser(nextUser)
    if (nextUser) writeJson(SESSION_KEY, nextUser)
    else localStorage.removeItem(SESSION_KEY)
  }

  function signup({ name, email, password }) {
    const normalised = email.trim().toLowerCase()
    const users = getUsers()

    if (!name.trim() || !normalised || password.length < 6) {
      return { ok: false, error: 'Enter your name, email, and a password (6+ characters).' }
    }

    if (users.some((u) => u.email === normalised)) {
      return { ok: false, error: 'An account with this email already exists.' }
    }

    const nextUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalised,
      password: encodePassword(password),
      createdAt: Date.now(),
    }

    writeJson(USERS_KEY, [...users, nextUser])
    const session = { id: nextUser.id, name: nextUser.name, email: nextUser.email }
    persistSession(session)
    return { ok: true, user: session }
  }

  function login({ email, password }) {
    const normalised = email.trim().toLowerCase()
    const users = getUsers()
    const match = users.find(
      (u) => u.email === normalised && u.password === encodePassword(password),
    )

    if (!match) {
      return { ok: false, error: 'Incorrect email or password.' }
    }

    const session = { id: match.id, name: match.name, email: match.email }
    persistSession(session)
    return { ok: true, user: session }
  }

  function logout() {
    persistSession(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signup,
      login,
      logout,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
