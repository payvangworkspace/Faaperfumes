import { createContext, useContext, useMemo, useState } from 'react'
import { readJson, writeJson } from '../lib/storage'

const PromoContext = createContext(null)
const KEY = 'faaperfumes_promo'

export const PROMO_CODES = {
  FAA10: {
    code: 'FAA10',
    label: 'Extra 10% off',
    percent: 10,
    description: 'Sitewide extra 10% on sale prices',
  },
  WELCOME15: {
    code: 'WELCOME15',
    label: 'Welcome 15% off',
    percent: 15,
    description: 'New member extra 15% off',
  },
  OUD20: {
    code: 'OUD20',
    label: 'Oud edit 20% off',
    percent: 20,
    description: 'Extra 20% on featured fragrances',
  },
  COMBO25: {
    code: 'COMBO25',
    label: 'Combo boost 25%',
    percent: 25,
    description: 'Extra 25% on sale and combo prices',
  },
}

export function PromoProvider({ children }) {
  const [promoCode, setPromoCode] = useState(() => {
    const saved = readJson(KEY, null)
    return saved && PROMO_CODES[saved] ? saved : null
  })

  function applyPromo(rawCode) {
    const code = rawCode.trim().toUpperCase()
    if (!PROMO_CODES[code]) {
      return { ok: false, error: 'Invalid code. Try FAA10, WELCOME15, OUD20, or COMBO25.' }
    }
    setPromoCode(code)
    writeJson(KEY, code)
    return { ok: true, promo: PROMO_CODES[code] }
  }

  function clearPromo() {
    setPromoCode(null)
    localStorage.removeItem(KEY)
  }

  const promo = promoCode ? PROMO_CODES[promoCode] : null

  function getFinalPrice(priceAed) {
    if (!promo) return priceAed
    return Math.round(priceAed * (1 - promo.percent / 100))
  }

  const value = useMemo(
    () => ({
      promo,
      promoCode,
      applyPromo,
      clearPromo,
      getFinalPrice,
      codes: Object.values(PROMO_CODES),
    }),
    [promo, promoCode],
  )

  return <PromoContext.Provider value={value}>{children}</PromoContext.Provider>
}

export function usePromo() {
  const ctx = useContext(PromoContext)
  if (!ctx) throw new Error('usePromo must be used within PromoProvider')
  return ctx
}
