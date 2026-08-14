const img = (n) => `/perfumes/p${String(n).padStart(2, '0')}.jpg`

/** 36 local perfume bottle photos, cycled across the catalog. */
const IMAGE_COUNT = 36

const menNames = [
  'Noir Cedar Intense',
  'Santal Whisper',
  'Atlas Vetiver EDP',
  'Marine Steel Cologne',
  'Tobacco Ember Parfum',
  'Oud Leather Reserve',
  'Citrus Grove EDT',
  'Black Pepper Night',
  'Amber Wood Forge',
  'Desert Smoke Extrait',
  'Ink & Iris Intense',
  'Cedar Harbor EDT',
  'Blue Medusa EDT',
  'Shadow Oak Parfum',
  'Spiced Bergamot',
  'Carbon Mist Intense',
  'Iron Sage Cologne',
  'Midnight Vetiver',
  'Copper Drift EDP',
  'Raw Patchouli',
  'Graphite Oud',
  'Alpine Fir EDT',
  'Burnt Honey Parfum',
  'Saffron Leather',
  'Northwind Cologne',
  'Obsidian Musk',
  'Teak & Tonka',
  'Harbor Smoke',
  'Volt Citrus Intense',
  'Royal Sandal',
  'Ember Cardamom',
  'Stone Pine EDP',
  'Noir Absinthe',
  'Driftwood Intense',
  'Golden Pepper',
  'Kashmir Cedar',
  'Arctic Ink EDT',
  'Velvet Smoke Men',
  'Falcon Oud',
  'Steel Magnolia',
  'Desert Ironwood',
  'Clan Vetiver',
  'Bold Juniper',
  'Night Forge Parfum',
  'Cinder Oak',
  'Marine Oud',
  'Spire Amber',
  'Carbon Cedar',
  'Wild Tobacco',
  'Aether Leather',
]

const womenNames = [
  'Rose Smoke Parfum',
  'Ivory Bloom EDP',
  'Citrus Atelier',
  'Velvet Peony Intense',
  'Jasmine Rain Parfum',
  'Soft Musk Veil',
  'Orchid Nocturne',
  'Pearl Gardenia EDP',
  'Saffron Silk Intense',
  'Blush Vanilla Couture',
  'Wild Fig & Iris',
  'Linen Rose Atelier',
  'Nude Bouquet EDP',
  'Pink Light Parfum',
  'Marble Cap Intense',
  'Fields at Nightfall',
  'Cherry Blossom Veil',
  'White Tea Petal',
  'Amber Magnolia',
  'Silk Neroli',
  'Moonlit Tuberose',
  'Cashmere Rose',
  'Peach Nectar EDP',
  'Lavender Mirage',
  'Golden Ylang',
  'Soft Iris Couture',
  'Crimson Peony',
  'Honey Orchid',
  'Sea Salt Bloom',
  'Porcelain Lily',
  'Velvet Tiare',
  'Dawn Mimosa',
  'Rouge Fleur',
  'Ivory Sandal',
  'Plum Blossom Intense',
  'Crystal Gardenia',
  'Blush Oud Femme',
  'Santal Petal',
  'Noir Rose Absolute',
  'Sunlit Magnolia',
  'Freesia Mist',
  'Coral Musk',
  'White Amber Silk',
  'Night Jasmine',
  'Powdered Violet',
  'Ruby Tuberose',
  'Soft Saffron Veil',
  'Lotus Atelier',
  'Champagne Rose',
  'Ivory Smoke',
]

const unisexNames = [
  'Amber Vale EDP',
  'Desert Oud Extrait',
  'Velvet Musk',
  'Smoke & Salt Niche',
  'Crystal Atelier',
  'Midnight Glass EDP',
  'Fig & Cedar',
  'Mineral Rose',
  'Quiet Oud',
  'Sunlit Woods',
  'Ink Bloom',
  'Coastal Amber',
  'Pale Santal',
  'Noir Citrus',
  'Soft Graphite',
  'Temple Smoke',
  'Glass Orchid',
  'Drift Musk',
  'Golden Dust',
  'Rain Vetiver',
  'Silk Pepper',
  'Ash & Honey',
  'White Oud Soft',
  'Copper Bloom',
  'Still Water EDP',
  'Raw Iris',
  'Canyon Musk',
  'Night Air Parfum',
  'Saffron Mist',
  'Olive Leaf',
  'Pale Smoke',
  'River Cedar',
  'Moon Salt',
  'Velvet Citrus',
  'Stone Flower',
  'Linen Oud',
  'Soft Ember',
  'Clear Resin',
  'Dune Iris',
  'Haze Santal',
  'Ivory Pepper',
  'Quiet Magnolia',
  'Blue Amber',
  'Faded Rosewood',
  'Silver Tea',
  'Warm Mineral',
  'Soft Lacquer',
  'Open Sky EDP',
  'Pale Tobacco',
  'Echo Musk',
]

const sizes = ['50ml', '75ml', '80ml', '90ml', '100ml']

const notePools = {
  men: {
    top: [
      'Bergamot',
      'Black Pepper',
      'Grapefruit',
      'Cardamom',
      'Lemon',
      'Juniper',
      'Apple',
      'Mint',
      'Ginger',
      'Elemi',
    ],
    heart: [
      'Cedar',
      'Lavender',
      'Geranium',
      'Vetiver',
      'Nutmeg',
      'Cypress',
      'Pine',
      'Clary Sage',
      'Cinnamon',
      'Olive Leaf',
    ],
    base: [
      'Oud',
      'Amber',
      'Leather',
      'Tonka',
      'Sandalwood',
      'Musk',
      'Tobacco',
      'Oakmoss',
      'Guaiac Wood',
      'Benzoin',
    ],
  },
  women: {
    top: [
      'Rose',
      'Pear',
      'Bergamot',
      'Pink Pepper',
      'Mandarin',
      'Lychee',
      'Aldehyde',
      'Peach',
      'Raspberry',
      'Freesia',
    ],
    heart: [
      'Jasmine',
      'Peony',
      'Iris',
      'Orange Blossom',
      'Tuberose',
      'Magnolia',
      'Gardenia',
      'Ylang-Ylang',
      'Lily',
      'Heliotrope',
    ],
    base: [
      'Vanilla',
      'Musk',
      'Sandalwood',
      'Amber',
      'Patchouli',
      'White Woods',
      'Cashmere',
      'Benzoin',
      'Praline',
      'Soft Oud',
    ],
  },
  unisex: {
    top: [
      'Bergamot',
      'Tea',
      'Fig Leaf',
      'Pink Pepper',
      'Sea Salt',
      'Citrus Zest',
      'Cardamom',
      'Mate',
      'Petitgrain',
      'Juniper Berry',
    ],
    heart: [
      'Iris',
      'Rose',
      'Cedar',
      'Orris',
      'Lavender',
      'Neroli',
      'Geranium',
      'Incense',
      'Hedione',
      'Magnolia',
    ],
    base: [
      'Musk',
      'Ambergris',
      'Sandalwood',
      'Oud',
      'Vetiver',
      'Soft Amber',
      'Iso E Super',
      'Moss',
      'Labdanum',
      'Cedarwood',
    ],
  },
}

const concentrations = ['EDT', 'EDP', 'Parfum', 'Extrait']
const longevities = ['4–6 hours', '6–8 hours', '8–10 hours', '10+ hours']
const occasions = ['Daytime', 'Evening', 'Office', 'Weekend', 'Special occasion', 'All day']
const families = {
  men: ['Woody', 'Aromatic', 'Oriental', 'Fresh Spicy', 'Leather', 'Fougère'],
  women: ['Floral', 'Fruity Floral', 'Oriental Floral', 'Powdery', 'Gourmand', 'Chypre'],
  unisex: ['Woody Floral', 'Aromatic Woody', 'Mineral', 'Soft Oriental', 'Citrus Woody', 'Musky'],
}

function hashName(name) {
  return [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0)
}

function pick(list, seed, offset = 0) {
  return list[Math.abs(seed + offset) % list.length]
}

function uniqueTrio(list, seed) {
  const a = pick(list, seed, 0)
  let b = pick(list, seed, 3)
  let c = pick(list, seed, 7)
  if (b === a) b = pick(list, seed, 5)
  if (c === a || c === b) c = pick(list, seed, 9)
  return [a, b, c]
}

function makeProducts(names, category, idPrefix, imageOffset = 0) {
  const notes = notePools[category] || notePools.unisex
  const familyList = families[category] || families.unisex

  return names.map((name, index) => {
    const seed = hashName(name) + index * 17
    const compareAt = 280 + ((seed * 13) % 500)
    const discount = 0.4 + ((seed % 9) * 0.03)
    const price = Math.round(compareAt * (1 - Math.min(discount, 0.72)))
    const imageIndex = ((index + imageOffset) % IMAGE_COUNT) + 1
    const concentration = pick(concentrations, seed)
    const longevity = pick(longevities, seed, 2)
    const occasion = pick(occasions, seed, 4)
    const family = pick(familyList, seed, 1)
    const top = uniqueTrio(notes.top, seed).slice(0, 2)
    const heart = uniqueTrio(notes.heart, seed + 11).slice(0, 2)
    const base = uniqueTrio(notes.base, seed + 23)
    const size = sizes[Math.abs(seed) % sizes.length]
    const brand = pick(
      ['Maison Vale', 'Arabian Eagle', 'Essenza', 'Atelier Noor', 'Studio Faaperfumes', 'Faiz Niche'],
      seed,
      6,
    )

    return {
      id: `${idPrefix}${index + 1}`,
      name,
      category,
      size,
      price,
      compareAt,
      featured: index < 8 || index % 9 === 0,
      image: img(imageIndex),
      // One image only — avoids other bottles looking like different products
      gallery: [img(imageIndex)],
      brand,
      concentration,
      longevity,
      occasion,
      family,
      sku: `FAA-${idPrefix.toUpperCase()}${String(index + 1).padStart(3, '0')}`,
      notes: { top, heart, base },
      description: `${name} by ${brand} is a ${family.toLowerCase()} ${concentration} for ${
        category === 'unisex' ? 'everyone' : category
      }. Opening with ${top.join(' and ').toLowerCase()}, it settles into ${heart
        .join(' and ')
        .toLowerCase()} before a lasting trail of ${base
        .slice(0, 2)
        .join(' and ')
        .toLowerCase()}. Chosen for ${occasion.toLowerCase()} wear in warm climates, with about ${longevity} on skin.`,
      details: [
        `SKU ${`FAA-${idPrefix.toUpperCase()}${String(index + 1).padStart(3, '0')}`}`,
        `${size} ${concentration} · ${family} family`,
        `Sillage built around ${heart[0].toLowerCase()} and ${base[0].toLowerCase()}`,
        '100% authentic sealed bottle from Faaperfumes',
        'Same-day delivery available in Dubai',
        'Returns within 7 days if unopened',
      ],
    }
  })
}

export const products = [
  ...makeProducts(menNames, 'men', 'm', 0),
  ...makeProducts(womenNames, 'women', 'w', 8),
  ...makeProducts(unisexNames, 'unisex', 'u', 16),
]

export const collections = [
  {
    id: 'best-sellers',
    title: 'Best Sellers',
    to: '/men-perfumes',
    image: img(1),
  },
  {
    id: 'oud',
    title: 'Oud & Bakhoor',
    to: '/exclusive',
    image: img(2),
  },
  {
    id: 'gift-sets',
    title: 'Gift Sets',
    to: '/combos',
    image: img(3),
  },
  {
    id: 'niche',
    title: 'Niche Perfumes',
    to: '/exclusive',
    image: img(16),
  },
  {
    id: 'men',
    title: 'Men',
    to: '/men-perfumes',
    image: img(10),
  },
  {
    id: 'women',
    title: 'Women',
    to: '/women-perfumes',
    image: img(7),
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

export const brandNames = [
  'Maison Vale',
  'Arabian Eagle',
  'Essenza',
  'Bottega Le',
  'Faiz Niche',
  'Atelier Noor',
  'Gift of Plant',
  'Studio Faaperfumes',
]

export const combos = [
  {
    id: 'c1',
    name: 'His & Hers Duo',
    category: 'combo',
    size: '2 × 100ml',
    includes: ['Noir Cedar Intense', 'Rose Smoke Parfum'],
    price: 299,
    compareAt: 560,
    featured: true,
    badge: 'Save 46%',
    image: img(15),
    gallery: [img(15)],
    description:
      'A paired edit for shared spaces — woods for him, soft rose for her. Gift-ready packaging with two full-size bottles.',
    details: [
      'Two sealed 100ml bottles',
      'Better value than buying separately',
      'Ideal anniversary or couple gift',
      'Authentic Faaperfumes sourcing',
    ],
  },
  {
    id: 'c2',
    name: 'Oud Ritual Trio',
    category: 'combo',
    size: '3 bottles',
    includes: ['Desert Oud Extrait', 'Oud Leather Reserve', 'Quiet Oud'],
    price: 549,
    compareAt: 980,
    featured: true,
    badge: 'Best value',
    image: img(18),
    gallery: [img(18)],
    description:
      'Three strengths of oud for layering through the evening — from soft smoke to deep leather resin.',
    details: [
      'Three complementary oud profiles',
      'Built for Gulf evenings',
      'Layer together or wear alone',
      'Limited seasonal pricing',
    ],
  },
  {
    id: 'c3',
    name: 'Travel Discovery Set',
    category: 'combo',
    size: '5 × 10ml',
    includes: ['Atlas Vetiver', 'Ivory Bloom', 'Amber Vale', 'Santal Whisper', 'Jasmine Rain'],
    price: 189,
    compareAt: 350,
    featured: true,
    badge: 'New',
    image: img(23),
    gallery: [img(23)],
    description:
      'Five travel sprays to find your next signature before committing to a full bottle.',
    details: [
      'Five 10ml atomizers',
      'Men, women, and unisex picks',
      'Cabin-bag friendly',
      'Redeemable toward full sizes in store',
    ],
  },
  {
    id: 'c4',
    name: 'Evening Layering Pair',
    category: 'combo',
    size: '2 × 80ml',
    includes: ['Tobacco Ember Parfum', 'Orchid Nocturne'],
    price: 329,
    compareAt: 620,
    featured: true,
    badge: 'Limited',
    image: img(34),
    gallery: [img(34)],
    description:
      'Warm tobacco smoke over nocturnal florals — a night-out layering duo with presence.',
    details: [
      'Two 80ml bottles',
      'Designed to layer',
      'Limited edition pricing',
      'Gift box included',
    ],
  },
  {
    id: 'c5',
    name: 'Fresh Day Combo',
    category: 'combo',
    size: '2 × 100ml',
    includes: ['Citrus Grove EDT', 'Citrus Atelier'],
    price: 219,
    compareAt: 420,
    featured: false,
    badge: 'Summer edit',
    image: img(4),
    gallery: [img(4)],
    description:
      'Bright citrus for heat — one crisp EDT and one softer atelier take for day rotation.',
    details: [
      'Two 100ml bottles',
      'Light and office-friendly',
      'Summer seasonal offer',
      'Authentic sealed stock',
    ],
  },
  {
    id: 'c6',
    name: 'Gift Ready Couples Set',
    category: 'combo',
    size: 'Gift box',
    includes: ['Blue Medusa EDT', 'Nude Bouquet EDP', 'Mini bakhoor'],
    price: 399,
    compareAt: 750,
    featured: true,
    badge: 'Gift set',
    image: img(16),
    gallery: [img(16)],
    description:
      'A complete gift moment — two signature scents plus a mini bakhoor for the home.',
    details: [
      'Two full-size fragrances',
      'Mini bakhoor included',
      'Ribbon-ready gift box',
      'Perfect for celebrations',
    ],
  },
]

export const heroImages = {
  home: img(7),
  men: img(10),
  women: img(5),
  exclusive: img(16),
  story: img(3),
  combos: img(3),
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
    product.category === 'men'
      ? 'Men'
      : product.category === 'women'
        ? 'Women'
        : 'Unisex'
  return `${label} · ${product.size}`
}
