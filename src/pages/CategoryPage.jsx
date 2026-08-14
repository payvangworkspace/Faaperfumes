import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

export default function CategoryPage({
  title,
  eyebrow,
  description,
  products,
  heroImage,
}) {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero__media" aria-hidden="true">
          <img src={heroImage} alt="" />
        </div>
        <div className="page-hero__veil" aria-hidden="true" />
        <div className="container page-hero__content">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>{title}</span>
          </nav>
        </div>
      </section>

      <section className="section featured">
        <div className="container">
          <div className="section__head section__head--row">
            <div>
              <h2>{products.length} fragrances</h2>
              <p>Authentic bottles, ready to ship across the UAE.</p>
            </div>
          </div>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
