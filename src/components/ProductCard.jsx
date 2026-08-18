import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatProductNote } from '../data'
import { getDiscountPercent } from '../lib/currency'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import { usePromo } from '../context/PromoContext'
import { useWishlist } from '../context/WishlistContext'

const FALLBACK = '/perfumes/bottles/lattafa-khamrah.jpg'

export default function ProductCard({ product }) {
  const { addToCart, showToast } = useCart()
  const { format } = useCurrency()
  const { getFinalPrice, promo } = usePromo()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const [src, setSrc] = useState(product.image)
  const detailTo = `/product/${product.id}`

  useEffect(() => {
    setSrc(product.image)
  }, [product.image])

  const salePrice = getFinalPrice(product.price)
  const catalogOff = getDiscountPercent(product.price, product.compareAt)
  const promoOff = promo ? promo.percent : 0
  const totalOff = Math.min(
    95,
    Math.round(((product.compareAt - salePrice) / product.compareAt) * 100),
  )
  const wishlisted = isWishlisted(product.id)

  function handleWishlist(e) {
    e.preventDefault()
    e.stopPropagation()
    const added = toggleWishlist(product.id)
    showToast(added ? `${product.name} saved to wishlist` : `${product.name} removed from wishlist`)
  }

  function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  return (
    <article className="product">
      <Link to={detailTo} className="product__media">
        <img
          src={src}
          alt={product.name}
          loading="lazy"
          onError={() => {
            if (src !== FALLBACK) setSrc(FALLBACK)
          }}
        />
        {totalOff > 0 ? <span className="product__badge">-{totalOff}%</span> : null}
        <button
          type="button"
          className={`wish-btn ${wishlisted ? 'wish-btn--on' : ''}`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          onClick={handleWishlist}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 20.2 10.7 19C5.4 14.2 2 11.1 2 7.5A4.5 4.5 0 0 1 6.5 3c1.7 0 3.4.9 4.5 2.3A5.7 5.7 0 0 1 15.5 3 4.5 4.5 0 0 1 20 7.5c0 3.6-3.4 6.7-8.7 11.5L12 20.2Z"
              fill={wishlisted ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
        </button>
      </Link>
      <div className="product__body">
        <h3>
          <Link to={detailTo}>{product.name}</Link>
        </h3>
        <p className="product__note">{formatProductNote(product)}</p>
        <div className="product__price">
          <span>{format(salePrice)}</span>
          <s>{format(product.compareAt)}</s>
          <em>{totalOff}% off</em>
        </div>
        {promoOff > 0 ? (
          <p className="product__promo">
            {promo.code}: extra {promoOff}% off · sale price was {format(product.price)} (
            {catalogOff}% off)
          </p>
        ) : null}
        <div className="product__actions">
          <Link to={detailTo} className="btn btn--soft product__view">
            View details
          </Link>
          <button type="button" className="btn btn--line" onClick={handleAdd}>
            Add to cart
          </button>
        </div>
      </div>
    </article>
  )
}
