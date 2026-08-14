import { getProductsByCategory, heroImages } from '../data'
import CategoryPage from './CategoryPage'

export default function MenPerfumes() {
  return (
    <CategoryPage
      eyebrow="Men"
      title="Men’s Perfumes"
      description="Woods, oud, citrus, and leather — a modern edit of men’s fragrance."
      products={getProductsByCategory('men')}
      heroImage={heroImages.men}
    />
  )
}
