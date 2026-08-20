import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useCatalog } from '../context/CatalogContext'
import { usePromo } from '../context/PromoContext'

export default function PromoBar() {
  const { promo, applyPromo, clearPromo, codes } = usePromo()
  const { showToast } = useCart()
  const { getFeaturedCombos } = useCatalog()
  const [code, setCode] = useState('')
  const featuredCombos = getFeaturedCombos().slice(0, 3)

  function handleApply(raw) {
    const result = applyPromo(raw)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    setCode('')
    showToast(`${result.promo.code} applied — ${result.promo.label}`)
  }

  function handleSubmit(e) {
    e.preventDefault()
    handleApply(code)
  }

  return (
    <section className="promo-bar" aria-label="Discounts and combo offers">
      <div className="container promo-bar__inner">
        <div className="promo-bar__copy">
          <div className="promo-bar__heading">
            <span className="promo-bar__icon" aria-hidden="true">
              %
            </span>
            <div>
              <p className="promo-bar__title">Seasonal discounts</p>
              <p className="promo-bar__hint">Tap a code or enter your own below</p>
            </div>
          </div>

          <div className="promo-bar__chips" role="list">
            {codes.map((item) => (
              <button
                key={item.code}
                type="button"
                role="listitem"
                className={`promo-chip ${promo?.code === item.code ? 'promo-chip--active' : ''}`}
                onClick={() => handleApply(item.code)}
                aria-pressed={promo?.code === item.code}
              >
                <span className="promo-chip__code">{item.code}</span>
                <span className="promo-chip__off">−{item.percent}%</span>
              </button>
            ))}
          </div>
        </div>

        {promo ? (
          <div className="promo-bar__active">
            <div className="promo-bar__active-text">
              <strong>{promo.code}</strong>
              <span>Extra {promo.percent}% off applied to sale prices</span>
            </div>
            <button type="button" className="btn btn--soft" onClick={clearPromo}>
              Remove
            </button>
          </div>
        ) : (
          <form className="promo-bar__form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="promo-code">
              Discount code
            </label>
            <input
              id="promo-code"
              type="text"
              placeholder="Enter code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button type="submit" className="btn btn--primary">
              Apply
            </button>
          </form>
        )}
      </div>

      <div className="promo-bar__combos">
        <div className="container promo-bar__combos-inner">
          <div className="promo-bar__combos-copy">
            <p className="promo-bar__combos-title">Special combo offers</p>
            <p>Bundles priced lower than buying each bottle alone.</p>
          </div>
          <div className="promo-bar__combo-list">
            {featuredCombos.map((combo) => (
              <Link key={combo.id} to="/combos" className="promo-combo-chip">
                <span className="promo-combo-chip__name">{combo.name}</span>
                <span className="promo-combo-chip__save">{combo.badge}</span>
              </Link>
            ))}
            <Link to="/combos" className="promo-combo-chip promo-combo-chip--all">
              View all combos
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
