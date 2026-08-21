import perfumeEntries from './catalog/perfumes.json'
import comboEntries from './catalog/combos.json'

function namedProduct(entry, index) {
  const image = entry.image
  const sku = entry.sku || `FAA-N${String(index + 1).padStart(3, '0')}`
  const { top, heart, base } = entry.notes

  return {
    id: entry.id || `n${index + 1}`,
    name: entry.name,
    category: entry.category,
    size: entry.size || '100ml',
    price: entry.price,
    compareAt: entry.compareAt,
    featured: entry.featured !== false,
    image,
    gallery: entry.gallery || [image],
    brand: entry.brand,
    concentration: entry.concentration,
    longevity: entry.longevity,
    occasion: entry.occasion,
    family: entry.family,
    sku,
    notes: { top, heart, base },
    description: entry.description,
    details: entry.details || [
      `SKU ${sku}`,
      `${entry.size || '100ml'} ${entry.concentration} · ${entry.family} family`,
      `Sillage built around ${heart[0].toLowerCase()} and ${base[0].toLowerCase()}`,
      '100% authentic sealed bottle from Faaperfume',
      'Same-day delivery available in Dubai',
      'Returns within 7 days if unopened',
    ],
  }
}

export const products = perfumeEntries.map(namedProduct)
export const combos = comboEntries

export const collections = [
  {
    id: 'best-sellers',
    title: 'Best Sellers',
    to: '/men-perfumes',
    image: '/perfumes/bottles/armaf-club-de-nuit-intense-man.jpg',
  },
  {
    id: 'oud',
    title: 'Oud & Bakhoor',
    to: '/exclusive',
    image: '/perfumes/bottles/oud-arabia-jannat-e-zuhur.jpg',
  },
  {
    id: 'gift-sets',
    title: 'Gift Sets',
    to: '/combos',
    image: '/perfumes/bottles/lattafa-khamrah.jpg',
  },
  {
    id: 'niche',
    title: 'Niche Perfumes',
    to: '/exclusive',
    image: '/perfumes/bottles/arabiyat-al-noor.jpg',
  },
  {
    id: 'men',
    title: 'Men',
    to: '/men-perfumes',
    image: '/perfumes/bottles/dior-sauvage.jpg',
  },
  {
    id: 'women',
    title: 'Women',
    to: '/women-perfumes',
    image: '/perfumes/bottles/lattafa-eclaire.jpg',
  },
]

export const trusts = [
  {
    title: 'Free Shipping',
    text: 'On orders above AED 200',
  },
  {
    title: 'Cash on Delivery',
    text: 'Available on selected items',
  },
  {
    title: 'Authenticity Promise',
    text: '100% genuine bottles only',
  },
  {
    title: 'Easy Returns',
    text: 'Refund within 7 days',
  },
]

export const brandNames = [...new Set(products.map((item) => item.brand))].sort()

export const heroImages = {
  home: '/perfumes/bottles/lattafa-khamrah.jpg',
  men: '/perfumes/bottles/dior-sauvage.jpg',
  women: '/perfumes/bottles/elie-saab-le-parfum.jpg',
  exclusive: '/perfumes/bottles/oud-arabia-zainab.jpg',
  story: '/perfumes/bottles/french-avenue-liquid-brun.jpg',
  combos: '/perfumes/bottles/valentino-born-in-roma.jpg',
}

export function getProductsByCategory(category) {
  return products.filter((p) => p.category === category)
}

export function getFeaturedProducts() {
  return products.filter((p) => p.featured)
}

export function getFeaturedCombos() {
  return combos.filter((c) => c.featured)
}

export function findCatalogItem(id) {
  return products.find((p) => p.id === id) || combos.find((c) => c.id === id) || null
}

export function formatProductNote(product) {
  if (product.category === 'combo') {
    return `Combo · ${product.size}`
  }
  const label =
    product.category === 'men' ? 'Men' : product.category === 'women' ? 'Women' : 'Unisex'
  return `${label} · ${product.size}`
}
