import { getProductsByCategory, heroImages } from '../data'
import CategoryPage from './CategoryPage'

export default function Exclusive() {
  return (
    <CategoryPage
      eyebrow="Online exclusive"
      title="Exclusive Edit"
      description="Niche finds, limited drops, and house favorites you won’t see everywhere."
      products={getProductsByCategory('unisex')}
      heroImage={heroImages.exclusive}
    />
  )
}
