/** Base prices in the catalog are stored in AED. */
export const CURRENCIES = [
  { code: 'AED', label: 'AED', symbol: 'AED ', name: 'UAE Dirham' },
  { code: 'USD', label: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', label: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'INR', label: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'GBP', label: 'GBP', symbol: '£', name: 'British Pound' },
]

/** Approximate conversion rates from AED. */
export const RATES_FROM_AED = {
  AED: 1,
  USD: 0.2723,
  EUR: 0.2495,
  INR: 22.7,
  GBP: 0.214,
}

/** Approximate conversion into AED. */
export const RATES_TO_AED = {
  AED: 1,
  USD: 3.67,
  EUR: 4.01,
  INR: 0.044,
  GBP: 4.67,
}

export const CURRENCY_CODES = CURRENCIES.map((item) => item.code)

export function convertFromAed(amountAed, currencyCode) {
  const rate = RATES_FROM_AED[currencyCode] ?? 1
  return amountAed * rate
}

export function convertToAed(amount, currencyCode) {
  const rate = RATES_TO_AED[currencyCode] ?? 1
  return amount * rate
}

export function formatMoney(amountAed, currencyCode) {
  const currency = CURRENCIES.find((item) => item.code === currencyCode) ?? CURRENCIES[0]
  const value = convertFromAed(amountAed, currency.code)
  const rounded = currency.code === 'AED' ? Math.round(value) : Math.round(value * 100) / 100

  if (currency.code === 'AED') {
    return `AED ${rounded}`
  }

  return `${currency.symbol}${rounded.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function getDiscountPercent(price, compareAt) {
  if (!compareAt || compareAt <= price) return 0
  return Math.round(((compareAt - price) / compareAt) * 100)
}
