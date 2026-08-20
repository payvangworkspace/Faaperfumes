import { Link } from 'react-router-dom'
import { brandNames, collections, heroImages, trusts } from '../data'
import { useCatalog } from '../context/CatalogContext'
import ProductCard from '../components/ProductCard'
import ComboCard from '../components/ComboCard'

function Hero() {
  return (
    <section className="hero" aria-label="Hero">
      <div className="hero__media" aria-hidden="true">
        <img src={heroImages.home} alt="" />
      </div>
      <div className="hero__veil" aria-hidden="true" />
      <div className="container hero__content">
        <p className="hero__brand">Faaperfume</p>
        <h1>Fragrance with quiet confidence.</h1>
        <p className="hero__lead">
          Designer, niche, and Arabian scents — authentic bottles, curated for
          every mood and climate.
        </p>
        <div className="hero__cta">
          <Link className="btn btn--primary" to="/men-perfumes">
            Shop men
          </Link>
          <Link className="btn btn--ghost" to="/women-perfumes">
            Shop women
          </Link>
        </div>
      </div>
    </section>
  )
}

function Collections() {
  return (
    <section className="section collections" id="collections">
      <div className="container">
        <div className="section__head">
          <h2>Shop by collection</h2>
          <p>One path into the scents people return for.</p>
        </div>
        <div className="collections__grid">
          {collections.map((item, index) => (
            <Link
              key={item.id}
              to={item.to}
              className="collection"
              style={{ '--delay': `${index * 60}ms` }}
            >
              <img src={item.image} alt="" loading="lazy" />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function Featured() {
  const { getFeaturedProducts } = useCatalog()
  const featured = getFeaturedProducts().slice(0, 8)

  return (
    <section className="section featured" id="featured">
      <div className="container">
        <div className="section__head section__head--row">
          <div>
            <h2>Bestsellers this season</h2>
            <p>Warm woods, soft florals, and oud — priced to discover.</p>
          </div>
          <Link className="text-link" to="/exclusive">
            View exclusive
          </Link>
        </div>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CombosPreview() {
  const { getFeaturedCombos } = useCatalog()
  const featured = getFeaturedCombos().slice(0, 3)

  return (
    <section className="section combos-preview" id="combos">
      <div className="container">
        <div className="section__head section__head--row">
          <div>
            <h2>Special combo offers</h2>
            <p>His & hers duos, oud trios, and gift-ready sets — priced as bundles.</p>
          </div>
          <Link className="text-link" to="/combos">
            All combos
          </Link>
        </div>
        <div className="combo-grid">
          {featured.map((combo) => (
            <ComboCard key={combo.id} combo={combo} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Story() {
  return (
    <section className="story" id="story">
      <div className="story__image" aria-hidden="true">
        <img src={heroImages.story} alt="" />
      </div>
      <div className="story__copy">
        <p className="eyebrow">About Faaperfume</p>
        <h2>A fragrance destination built on authenticity.</h2>
        <p>
          From designer classics to rare niche finds and traditional oud, every
          bottle is genuine. Order online for same-day delivery in Dubai, or
          visit us across the Emirates — your next signature scent is close.
        </p>
        <Link className="btn btn--primary" to="/women-perfumes">
          Explore the edit
        </Link>
      </div>
    </section>
  )
}

function Trust() {
  return (
    <section className="trust" id="trust" aria-label="Customer promises">
      <div className="container trust__grid">
        {trusts.map((item) => (
          <div key={item.title} className="trust__item">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function BrandsPreview() {
  return (
    <section className="section brands">
      <div className="container">
        <div className="section__head section__head--row">
          <div>
            <h2>House marks we carry</h2>
            <p>A focused edit of names worth knowing.</p>
          </div>
          <Link className="text-link" to="/brands">
            All brands
          </Link>
        </div>
        <ul className="brands__list">
          {brandNames.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Newsletter() {
  return (
    <section className="newsletter">
      <div className="container newsletter__inner">
        <div>
          <h2>Stay close to new arrivals</h2>
          <p>Seasonal edits and private drops — no noise.</p>
        </div>
        <form
          className="newsletter__form"
          onSubmit={(e) => {
            e.preventDefault()
            e.currentTarget.reset()
          }}
        >
          <label className="sr-only" htmlFor="home-email">
            Email address
          </label>
          <input
            id="home-email"
            type="email"
            name="email"
            placeholder="Email address"
            required
          />
          <button type="submit" className="btn btn--primary">
            Join
          </button>
        </form>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Collections />
      <CombosPreview />
      <Featured />
      <Story />
      <Trust />
      <BrandsPreview />
      <Newsletter />
    </>
  )
}
