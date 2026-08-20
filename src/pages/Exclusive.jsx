import { heroImages } from '../data'
import { useCatalog } from '../context/CatalogContext'
import CategoryPage from './CategoryPage'

export default function Exclusive() {
  const { getByCategory } = useCatalog()
  return (
    <CategoryPage
      eyebrow="Online exclusive"
      title="Exclusive Edit"
      description="Niche finds, limited drops, and house favorites you won’t see everywhere."
      products={getByCategory('unisex')}
      heroImage={heroImages.exclusive}
    />
  )
}
