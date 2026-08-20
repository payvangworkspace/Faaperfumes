import { createContext, useContext, useMemo, useState } from 'react'
import { readJson, writeJson } from '../lib/storage'

const AuthContext = createContext(null)
const USERS_KEY = 'faaperfume_users'
const SESSION_KEY = 'faaperfume_session'

export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
}

function encodePassword(password) {
  return btoa(`faaperfume:${password}`)
}

const SEED_ADMIN = {
  id: 'seed-admin',
  name: 'Store Admin',
  email: 'admin@faaperfume.com',
  password: encodePassword('Admin@123'),
  role: ROLES.ADMIN,
  phone: '055 238 3144',
  city: 'Dubai',
  emirate: 'Dubai',
  createdAt: 0,
}

const SEED_CUSTOMER = {
  id: 'seed-customer',
  name: 'Demo Customer',
  email: 'customer@faaperfume.com',
  password: encodePassword('Customer@123'),
  role: ROLES.CUSTOMER,
  phone: '050 000 0000',
  city: 'Dubai',
  emirate: 'Dubai',
  createdAt: 0,
}

function withRole(user, role = ROLES.CUSTOMER) {
  if (!user) return null
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role === ROLES.ADMIN ? ROLES.ADMIN : role,
    phone: user.phone || '',
    city: user.city || '',
    emirate: user.emirate || '',
  }
}

function publicUser(user) {
  if (!user) return null
  const { password, ...rest } = user
  return rest
}

function ensureSeedUsers(users) {
  const normalised = users.map((user) => ({
    ...user,
    role: user.role === ROLES.ADMIN ? ROLES.ADMIN : ROLES.CUSTOMER,
  }))

  const next = [...normalised]
  if (!next.some((user) => user.email === SEED_ADMIN.email)) next.unshift(SEED_ADMIN)
  if (!next.some((user) => user.email === SEED_CUSTOMER.email)) next.push(SEED_CUSTOMER)
  return next
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const next = ensureSeedUsers(readJson(USERS_KEY, []))
    writeJson(USERS_KEY, next)
    return next
  })
  const [user, setUser] = useState(() => withRole(readJson(SESSION_KEY, null)))

  function persistUsers(next) {
    setUsers(next)
    writeJson(USERS_KEY, next)
  }

  function persistSession(nextUser) {
    const session = withRole(nextUser)
    setUser(session)
    if (session) writeJson(SESSION_KEY, session)
    else localStorage.removeItem(SESSION_KEY)
  }

  function getUsers() {
    return users
  }

  function createAccount(
    { name, email, password, role = ROLES.CUSTOMER, phone = '', city = '', emirate = '', notes = '' },
    { signIn = true } = {},
  ) {
    const normalised = email.trim().toLowerCase()
    const nextRole = role === ROLES.ADMIN ? ROLES.ADMIN : ROLES.CUSTOMER

    if (!name.trim() || !normalised || password.length < 6) {
      return { ok: false, error: 'Enter a name, email, and a password (6+ characters).' }
    }

    if (users.some((item) => item.email === normalised)) {
      return { ok: false, error: 'An account with this email already exists.' }
    }

    const nextUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalised,
      password: encodePassword(password),
      role: nextRole,
      phone: phone.trim(),
      city: city.trim(),
      emirate: emirate.trim(),
      notes: notes.trim(),
      createdAt: Date.now(),
    }

    persistUsers([...users, nextUser])
    const session = withRole(nextUser)
    if (signIn) persistSession(session)
    return { ok: true, user: publicUser(nextUser) }
  }

  function signup(payload) {
    return createAccount(payload, { signIn: true })
  }

  function login({ email, password }) {
    const normalised = email.trim().toLowerCase()
    const match = users.find(
      (item) => item.email === normalised && item.password === encodePassword(password),
    )

    if (!match) {
      return { ok: false, error: 'Incorrect email or password.' }
    }

    persistSession(withRole(match))
    return { ok: true, user: withRole(match) }
  }

  function logout() {
    persistSession(null)
  }

  function updateAccount(id, patch) {
    const next = users.map((item) =>
      item.id === id
        ? {
            ...item,
            ...patch,
            email: patch.email ? patch.email.trim().toLowerCase() : item.email,
            password: patch.password ? encodePassword(patch.password) : item.password,
          }
        : item,
    )
    persistUsers(next)
    if (user?.id === id) persistSession(next.find((item) => item.id === id))
    return publicUser(next.find((item) => item.id === id))
  }

  const isAdmin = user?.role === ROLES.ADMIN
  const isCustomer = user?.role === ROLES.CUSTOMER

  const value = useMemo(
    () => ({
      user,
      users: users.map(publicUser),
      isAuthenticated: Boolean(user),
      isAdmin,
      isCustomer,
      role: user?.role ?? null,
      signup,
      createAccount,
      login,
      logout,
      getUsers,
      updateAccount,
    }),
    [user, users, isAdmin, isCustomer],
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
