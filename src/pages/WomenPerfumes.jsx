import { heroImages } from '../data'
import { useCatalog } from '../context/CatalogContext'
import CategoryPage from './CategoryPage'

export default function WomenPerfumes() {
  const { getByCategory } = useCatalog()
  return (
    <CategoryPage
      eyebrow="Women"
      title="Women’s Perfumes"
      description="Florals, soft musk, and luminous citrus — curated for every occasion."
      products={getByCategory('women')}
      heroImage={heroImages.women}
    />
  )
}
