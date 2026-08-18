import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { readJson, writeJson } from '../lib/storage'
import { products } from '../data'

const WishlistContext = createContext(null)
const GUEST_KEY = 'faaperfume_wishlist_guest'

function userKey(email) {
  return `faaperfume_wishlist_${email}`
}

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [ids, setIds] = useState(() => readJson(GUEST_KEY, []))

  useEffect(() => {
    if (user?.email) {
      const saved = readJson(userKey(user.email), [])
      const guest = readJson(GUEST_KEY, [])
      const merged = [...new Set([...saved, ...guest])]
      setIds(merged)
      writeJson(userKey(user.email), merged)
      writeJson(GUEST_KEY, [])
    } else {
      setIds(readJson(GUEST_KEY, []))
    }
  }, [user?.email])

  function persist(next) {
    setIds(next)
    if (user?.email) writeJson(userKey(user.email), next)
    else writeJson(GUEST_KEY, next)
  }

  function isWishlisted(productId) {
    return ids.includes(productId)
  }

  function toggleWishlist(productId) {
    const exists = ids.includes(productId)
    const next = exists ? ids.filter((id) => id !== productId) : [...ids, productId]
    persist(next)
    return !exists
  }

  function removeFromWishlist(productId) {
    persist(ids.filter((id) => id !== productId))
  }

  const items = useMemo(
    () => ids.map((id) => products.find((p) => p.id === id)).filter(Boolean),
    [ids],
  )

  const value = useMemo(
    () => ({
      ids,
      items,
      count: ids.length,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
    }),
    [ids, items],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
