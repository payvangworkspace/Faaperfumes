import { useCurrency } from '../context/CurrencyContext'

export default function CurrencySwitch({ className = '', onSelect }) {
  const { currency, currencies, setCurrency } = useCurrency()

  return (
    <div className={`currency-switch ${className}`.trim()} role="group" aria-label="Currency">
      {currencies.map((item) => (
        <button
          key={item.code}
          type="button"
          className={currency === item.code ? 'is-active' : undefined}
          onClick={() => {
            setCurrency(item.code)
            onSelect?.(item)
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
