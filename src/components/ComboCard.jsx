import { Link } from 'react-router-dom'
import { getDiscountPercent } from '../lib/currency'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import { usePromo } from '../context/PromoContext'

export default function ComboCard({ combo }) {
  const { addToCart } = useCart()
  const { format } = useCurrency()
  const { getFinalPrice, promo } = usePromo()
  const detailTo = `/product/${combo.id}`

  const salePrice = getFinalPrice(combo.price)
  const totalOff = Math.min(
    95,
    Math.round(((combo.compareAt - salePrice) / combo.compareAt) * 100),
  )
  const catalogOff = getDiscountPercent(combo.price, combo.compareAt)

  function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    addToCart(combo)
  }

  return (
    <article className="combo-card">
      <Link to={detailTo} className="combo-card__media">
        <img src={combo.image} alt={combo.name} loading="lazy" />
        {combo.badge ? <span className="combo-card__badge">{combo.badge}</span> : null}
        {totalOff > 0 ? <span className="product__badge">-{totalOff}%</span> : null}
      </Link>

      <div className="combo-card__body">
        <p className="combo-card__eyebrow">Special combo</p>
        <h3>
          <Link to={detailTo}>{combo.name}</Link>
        </h3>
        <p className="combo-card__size">{combo.size}</p>
        <ul className="combo-card__includes">
          {combo.includes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="product__price">
          <span>{format(salePrice)}</span>
          <s>{format(combo.compareAt)}</s>
          <em>{totalOff}% off</em>
        </div>
        {promo ? (
          <p className="product__promo">
            {promo.code}: extra {promo.percent}% off · combo was {format(combo.price)} (
            {catalogOff}% off)
          </p>
        ) : null}
        <div className="product__actions">
          <Link to={detailTo} className="btn btn--soft product__view">
            View details
          </Link>
          <button type="button" className="btn btn--primary" onClick={handleAdd}>
            Add combo to cart
          </button>
        </div>
      </div>
    </article>
  )
}
