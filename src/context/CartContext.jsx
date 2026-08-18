import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { findCatalogItem } from '../data'
import { readJson, writeJson } from '../lib/storage'

const CartContext = createContext(null)
const CART_KEY = 'faaperfume_cart'

export function CartProvider({ children }) {
  const [lines, setLines] = useState(() => readJson(CART_KEY, []))
  const [toast, setToast] = useState({ message: '', visible: false })
  const toastTimer = useRef(0)

  useEffect(() => {
    writeJson(CART_KEY, lines)
  }, [lines])

  useEffect(() => {
    return () => window.clearTimeout(toastTimer.current)
  }, [])

  function showToast(message) {
    setToast({ message, visible: true })
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }))
    }, 2200)
  }

  function addToCart(product) {
    setLines((prev) => {
      const existing = prev.find((line) => line.productId === product.id)
      if (existing) {
        return prev.map((line) =>
          line.productId === product.id
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        )
      }
      return [...prev, { productId: product.id, quantity: 1 }]
    })
    showToast(`${product.name} added to cart`)
  }

  function updateQuantity(productId, quantity) {
    const next = Math.max(0, Math.min(20, quantity))
    setLines((prev) => {
      if (next === 0) return prev.filter((line) => line.productId !== productId)
      return prev.map((line) =>
        line.productId === productId ? { ...line, quantity: next } : line,
      )
    })
  }

  function removeFromCart(productId) {
    setLines((prev) => prev.filter((line) => line.productId !== productId))
  }

  function clearCart() {
    setLines([])
  }

  const items = useMemo(
    () =>
      lines
        .map((line) => {
          const product = findCatalogItem(line.productId)
          if (!product) return null
          return { ...line, product }
        })
        .filter(Boolean),
    [lines],
  )

  const cartCount = useMemo(
    () => items.reduce((sum, line) => sum + line.quantity, 0),
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      cartCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toast,
      showToast,
    }),
    [items, cartCount, toast],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
