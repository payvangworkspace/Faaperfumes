import { createContext, useContext, useMemo, useState } from 'react'
import { readJson, writeJson } from '../lib/storage'

const PromoContext = createContext(null)
const ACTIVE_KEY = 'faaperfume_promo'
const CODES_KEY = 'faaperfume_promo_codes'

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

function loadCodes() {
  const saved = readJson(CODES_KEY, null)
  if (!saved || typeof saved !== 'object') return { ...PROMO_CODES }
  return { ...PROMO_CODES, ...saved }
}

export function PromoProvider({ children }) {
  const [codesMap, setCodesMap] = useState(loadCodes)
  const [promoCode, setPromoCode] = useState(() => {
    const saved = readJson(ACTIVE_KEY, null)
    const codes = loadCodes()
    return saved && codes[saved] ? saved : null
  })

  function persistCodes(next) {
    setCodesMap(next)
    writeJson(CODES_KEY, next)
  }

  function applyPromo(rawCode) {
    const code = rawCode.trim().toUpperCase()
    if (!codesMap[code]) {
      return { ok: false, error: 'Invalid promo code.' }
    }
    setPromoCode(code)
    writeJson(ACTIVE_KEY, code)
    return { ok: true, promo: codesMap[code] }
  }

  function clearPromo() {
    setPromoCode(null)
    localStorage.removeItem(ACTIVE_KEY)
  }

  function addPromo({ code, label, percent, description }) {
    const normalised = code.trim().toUpperCase()
    if (!normalised || Number(percent) <= 0 || Number(percent) >= 90) {
      return { ok: false, error: 'Enter a code and a discount between 1 and 89%.' }
    }
    const next = {
      ...codesMap,
      [normalised]: {
        code: normalised,
        label: label.trim() || `${percent}% off`,
        percent: Number(percent),
        description: description.trim() || `${percent}% off sitewide`,
        custom: true,
      },
    }
    persistCodes(next)
    return { ok: true, promo: next[normalised] }
  }

  function removePromo(code) {
    const next = { ...codesMap }
    delete next[code]
    persistCodes(next)
    if (promoCode === code) clearPromo()
  }

  const promo = promoCode ? codesMap[promoCode] : null

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
      addPromo,
      removePromo,
      getFinalPrice,
      codes: Object.values(codesMap),
    }),
    [promo, promoCode, codesMap],
  )

  return <PromoContext.Provider value={value}>{children}</PromoContext.Provider>
}

export function usePromo() {
  const ctx = useContext(PromoContext)
  if (!ctx) throw new Error('usePromo must be used within PromoProvider')
  return ctx
}
