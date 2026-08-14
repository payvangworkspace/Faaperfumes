import { Link } from 'react-router-dom'
import { brandNames } from '../data'

export default function Brands() {
  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="container page-hero__content page-hero__content--plain">
          <p className="eyebrow">Directory</p>
          <h1>Brands</h1>
          <p>House marks we stock online and in store.</p>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Brands</span>
          </nav>
        </div>
      </section>

      <section className="section brands">
        <div className="container">
          <ul className="brands__list">
            {brandNames.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <div className="brands__cta">
            <Link className="btn btn--primary" to="/men-perfumes">
              Shop men
            </Link>
            <Link className="btn btn--line" to="/women-perfumes">
              Shop women
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
