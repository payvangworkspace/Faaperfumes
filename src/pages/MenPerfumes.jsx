import { heroImages } from '../data'
import { useCatalog } from '../context/CatalogContext'
import CategoryPage from './CategoryPage'

export default function MenPerfumes() {
  const { getByCategory } = useCatalog()
  return (
    <CategoryPage
      eyebrow="Men"
      title="Men’s Perfumes"
      description="Woods, oud, citrus, and leather — a modern edit of men’s fragrance."
      products={getByCategory('men')}
      heroImage={heroImages.men}
    />
  )
}
