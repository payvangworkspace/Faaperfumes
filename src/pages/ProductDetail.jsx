import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  findCatalogItem,
  formatProductNote,
  getProductsByCategory,
  products,
} from '../data'
import { getDiscountPercent } from '../lib/currency'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import { usePromo } from '../context/PromoContext'
import { useWishlist } from '../context/WishlistContext'
import ProductCard from '../components/ProductCard'

const FALLBACK = '/perfumes/p07.jpg'

function categoryPath(category) {
  if (category === 'men') return '/men-perfumes'
  if (category === 'women') return '/women-perfumes'
  if (category === 'combo') return '/combos'
  return '/exclusive'
}

function categoryLabel(category) {
  if (category === 'men') return 'Men'
  if (category === 'women') return 'Women'
  if (category === 'combo') return 'Combos'
  return 'Exclusive'
}

export default function ProductDetail() {
  const { id } = useParams()
  const product = findCatalogItem(id)
  const { addToCart, showToast } = useCart()
  const { format } = useCurrency()
  const { getFinalPrice, promo } = usePromo()
  const { isWishlisted, toggleWishlist } = useWishlist()

  const gallery = useMemo(() => {
    if (!product?.image) return []
    // Only this product/combo image — never mix in other bottles
    return [product.image]
  }, [product])

  const [activeImage, setActiveImage] = useState(gallery[0] || FALLBACK)

  useEffect(() => {
    setActiveImage(gallery[0] || FALLBACK)
  }, [gallery, id])

  if (!product) {
    return <Navigate to="/" replace />
  }

  const salePrice = getFinalPrice(product.price)
  const catalogOff = getDiscountPercent(product.price, product.compareAt)
  const totalOff = Math.min(
    95,
    Math.round(((product.compareAt - salePrice) / product.compareAt) * 100),
  )
  const wishlisted = isWishlisted(product.id)
  const isCombo = product.category === 'combo'

  const related = (
    isCombo
      ? products.filter((p) => p.featured).slice(0, 4)
      : getProductsByCategory(product.category)
          .filter((p) => p.id !== product.id)
          .slice(0, 4)
  )

  function handleWishlist() {
    const added = toggleWishlist(product.id)
    showToast(
      added ? `${product.name} saved to wishlist` : `${product.name} removed from wishlist`,
    )
  }

  return (
    <>
      <section className="section product-detail">
        <div className="container">
          <nav className="breadcrumbs product-detail__crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to={categoryPath(product.category)}>{categoryLabel(product.category)}</Link>
            <span>/</span>
            <span>{product.name}</span>
          </nav>

          <div className="product-detail__layout">
            <div className="product-detail__gallery">
              <div className="product-detail__stage">
                <img
                  src={activeImage}
                  alt={product.name}
                  onError={(e) => {
                    if (e.currentTarget.src !== FALLBACK) e.currentTarget.src = FALLBACK
                  }}
                />
                {totalOff > 0 ? (
                  <span className="product__badge">-{totalOff}%</span>
                ) : null}
                {product.badge ? (
                  <span className="combo-card__badge">{product.badge}</span>
                ) : null}
              </div>
              {gallery.length > 1 ? (
                <div className="product-detail__thumbs" role="list">
                  {gallery.map((src) => (
                    <button
                      key={src}
                      type="button"
                      role="listitem"
                      className={`product-detail__thumb ${
                        activeImage === src ? 'is-active' : ''
                      }`}
                      onClick={() => setActiveImage(src)}
                    >
                      <img src={src} alt="" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="product-detail__info">
              <p className="eyebrow">
                {isCombo ? 'Special combo' : product.brand || 'Faaperfumes'}
              </p>
              <h1>{product.name}</h1>
              <p className="product-detail__meta">{formatProductNote(product)}</p>
              <p className="product-detail__desc">
                {product.description ||
                  `${product.name} — authentic fragrance from Faaperfumes.`}
              </p>

              <div className="product__price product-detail__price">
                <span>{format(salePrice)}</span>
                <s>{format(product.compareAt)}</s>
                <em>{totalOff}% off</em>
              </div>
              {promo ? (
                <p className="product__promo">
                  {promo.code}: extra {promo.percent}% off · was {format(product.price)} (
                  {catalogOff}% sale)
                </p>
              ) : null}

              <div className="product-detail__actions">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => addToCart(product)}
                >
                  {isCombo ? 'Add combo to cart' : 'Add to cart'}
                </button>
                {!isCombo ? (
                  <button
                    type="button"
                    className={`btn btn--line ${wishlisted ? 'is-wish' : ''}`}
                    onClick={handleWishlist}
                  >
                    {wishlisted ? 'Saved to wishlist' : 'Add to wishlist'}
                  </button>
                ) : null}
              </div>

              {isCombo && product.includes ? (
                <div className="product-detail__block">
                  <h2>What’s included</h2>
                  <ul>
                    {product.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {!isCombo && product.notes ? (
                <div className="product-detail__notes">
                  <h2>Fragrance notes</h2>
                  <div className="notes-grid">
                    <div>
                      <h3>Top</h3>
                      <p>{product.notes.top.join(' · ')}</p>
                    </div>
                    <div>
                      <h3>Heart</h3>
                      <p>{product.notes.heart.join(' · ')}</p>
                    </div>
                    <div>
                      <h3>Base</h3>
                      <p>{product.notes.base.join(' · ')}</p>
                    </div>
                  </div>
                </div>
              ) : null}

              {!isCombo ? (
                <dl className="product-detail__specs">
                  <div>
                    <dt>Family</dt>
                    <dd>{product.family}</dd>
                  </div>
                  <div>
                    <dt>Concentration</dt>
                    <dd>{product.concentration}</dd>
                  </div>
                  <div>
                    <dt>Longevity</dt>
                    <dd>{product.longevity}</dd>
                  </div>
                  <div>
                    <dt>Best for</dt>
                    <dd>{product.occasion}</dd>
                  </div>
                  <div>
                    <dt>Size</dt>
                    <dd>{product.size}</dd>
                  </div>
                  <div>
                    <dt>SKU</dt>
                    <dd>{product.sku}</dd>
                  </div>
                </dl>
              ) : null}

              {product.details?.length ? (
                <div className="product-detail__block">
                  <h2>Details</h2>
                  <ul>
                    {product.details.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="section featured">
          <div className="container">
            <div className="section__head section__head--row">
              <div>
                <h2>{isCombo ? 'You may also like' : 'More from this edit'}</h2>
                <p>Continue exploring Faaperfumes.</p>
              </div>
              <Link className="text-link" to={categoryPath(product.category)}>
                View all
              </Link>
            </div>
            <div className="product-grid">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
