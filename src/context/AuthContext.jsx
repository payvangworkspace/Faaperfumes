import { createContext, useContext, useMemo, useState } from 'react'
import { readJson, writeJson } from '../lib/storage'

const AuthContext = createContext(null)
const USERS_KEY = 'faaperfumes_users'
const SESSION_KEY = 'faaperfumes_session'

export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
}

function encodePassword(password) {
  return btoa(`faaperfumes:${password}`)
}

const SEED_ADMIN = {
  id: 'seed-admin',
  name: 'Store Admin',
  email: 'admin@faaperfumes.com',
  password: encodePassword('Admin@123'),
  role: ROLES.ADMIN,
  createdAt: 0,
}

const SEED_CUSTOMER = {
  id: 'seed-customer',
  name: 'Demo Customer',
  email: 'customer@faaperfumes.com',
  password: encodePassword('Customer@123'),
  role: ROLES.CUSTOMER,
  createdAt: 0,
}

function withRole(user, role = ROLES.CUSTOMER) {
  if (!user) return null
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role === ROLES.ADMIN ? ROLES.ADMIN : role,
  }
}

function ensureSeedUsers(users) {
  const normalised = users.map((u) => ({
    ...u,
    role: u.role === ROLES.ADMIN ? ROLES.ADMIN : ROLES.CUSTOMER,
  }))

  const next = [...normalised]
  if (!next.some((u) => u.email === SEED_ADMIN.email)) next.unshift(SEED_ADMIN)
  if (!next.some((u) => u.email === SEED_CUSTOMER.email)) next.push(SEED_CUSTOMER)
  return next
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const users = ensureSeedUsers(readJson(USERS_KEY, []))
    writeJson(USERS_KEY, users)
    return withRole(readJson(SESSION_KEY, null))
  })

  function getUsers() {
    const users = ensureSeedUsers(readJson(USERS_KEY, []))
    writeJson(USERS_KEY, users)
    return users
  }

  function persistSession(nextUser) {
    const session = withRole(nextUser)
    setUser(session)
    if (session) writeJson(SESSION_KEY, session)
    else localStorage.removeItem(SESSION_KEY)
  }

  function signup({ name, email, password, role = ROLES.CUSTOMER }) {
    const normalised = email.trim().toLowerCase()
    const users = getUsers()
    const nextRole = role === ROLES.ADMIN ? ROLES.ADMIN : ROLES.CUSTOMER

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
      role: nextRole,
      createdAt: Date.now(),
    }

    writeJson(USERS_KEY, [...users, nextUser])
    const session = withRole(nextUser)
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

    const session = withRole(match)
    persistSession(session)
    return { ok: true, user: session }
  }

  function logout() {
    persistSession(null)
  }

  const isAdmin = user?.role === ROLES.ADMIN
  const isCustomer = user?.role === ROLES.CUSTOMER

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin,
      isCustomer,
      role: user?.role ?? null,
      signup,
      login,
      logout,
      getUsers,
    }),
    [user, isAdmin, isCustomer],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function profilePathFor(user) {
  if (!user) return '/login'
  return user.role === ROLES.ADMIN ? '/admin' : '/profile'
}
