import { getProductsByCategory, heroImages } from '../data'
import CategoryPage from './CategoryPage'

export default function WomenPerfumes() {
  return (
    <CategoryPage
      eyebrow="Women"
      title="Women’s Perfumes"
      description="Florals, soft musk, and luminous citrus — curated for every occasion."
      products={getProductsByCategory('women')}
      heroImage={heroImages.women}
    />
  )
}
