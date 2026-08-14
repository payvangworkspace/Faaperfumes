import { Link } from 'react-router-dom'
import { combos, heroImages } from '../data'
import ComboCard from '../components/ComboCard'

export default function Combos() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero__media" aria-hidden="true">
          <img src={heroImages.combos} alt="" />
        </div>
        <div className="page-hero__veil" aria-hidden="true" />
        <div className="container page-hero__content">
          <p className="eyebrow">Offers</p>
          <h1>Special Combos</h1>
          <p>Curated sets at better-than-single prices — ready to gift or keep.</p>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Combos</span>
          </nav>
        </div>
      </section>

      <section className="section featured">
        <div className="container">
          <div className="section__head">
            <h2>{combos.length} combo offers</h2>
            <p>Layering pairs, discovery sets, and gift-ready bundles.</p>
          </div>
          <div className="combo-grid">
            {combos.map((combo) => (
              <ComboCard key={combo.id} combo={combo} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
