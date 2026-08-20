import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { CURRENCIES, CURRENCY_CODES, formatMoney } from '../lib/currency'
import { readJson, writeJson } from '../lib/storage'

const CurrencyContext = createContext(null)
const KEY = 'faaperfume_currency'
const ALLOWED = new Set(CURRENCY_CODES)

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    const saved = readJson(KEY, 'AED')
    return ALLOWED.has(saved) ? saved : 'AED'
  })

  useEffect(() => {
    function onStorage(event) {
      if (event.key !== KEY || !event.newValue) return
      try {
        const next = JSON.parse(event.newValue)
        if (ALLOWED.has(next)) setCurrencyState(next)
      } catch {
        /* ignore malformed storage */
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  function setCurrency(code) {
    if (!ALLOWED.has(code)) return
    setCurrencyState(code)
    writeJson(KEY, code)
  }

  const value = useMemo(
    () => ({
      currency,
      currencies: CURRENCIES,
      setCurrency,
      format: (amountAed) => formatMoney(amountAed, currency),
    }),
    [currency],
  )

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider')
  return ctx
}
