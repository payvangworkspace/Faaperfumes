import { createContext, useContext, useMemo, useState } from 'react'
import { combos as seedCombos, products as seedProducts } from '../data'
import { readJson, writeJson } from '../lib/storage'

const CatalogContext = createContext(null)
const CATALOG_KEY = 'faaperfume_catalog_overrides'

function emptyOverrides() {
  return {
    extraProducts: [],
    productUpdates: {},
    deletedProductIds: [],
    extraCombos: [],
    comboUpdates: {},
    deletedComboIds: [],
  }
}

function loadOverrides() {
  const saved = readJson(CATALOG_KEY, emptyOverrides())
  return { ...emptyOverrides(), ...saved }
}

function mergeList(seed, extras, updates, deletedIds) {
  const deleted = new Set(deletedIds)
  const patchedSeed = seed
    .filter((item) => !deleted.has(item.id))
    .map((item) => ({ ...item, status: item.status || 'active', ...updates[item.id] }))
  const patchedExtras = extras
    .filter((item) => !deleted.has(item.id))
    .map((item) => ({ ...item, status: item.status || 'active', ...updates[item.id] }))
  return [...patchedSeed, ...patchedExtras]
}

function slugId(prefix) {
  return `${prefix}${Date.now().toString(36)}`
}

export function CatalogProvider({ children }) {
  const [overrides, setOverrides] = useState(loadOverrides)

  function persist(updater) {
    setOverrides((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      writeJson(CATALOG_KEY, next)
      return next
    })
  }

  const products = useMemo(
    () =>
      mergeList(
        seedProducts,
        overrides.extraProducts,
        overrides.productUpdates,
        overrides.deletedProductIds,
      ),
    [overrides],
  )

  const combos = useMemo(
    () =>
      mergeList(seedCombos, overrides.extraCombos, overrides.comboUpdates, overrides.deletedComboIds),
    [overrides],
  )

  const liveProducts = useMemo(
    () => products.filter((item) => item.status !== 'hidden' && item.status !== 'draft'),
    [products],
  )

  const liveCombos = useMemo(
    () => combos.filter((item) => item.status !== 'hidden' && item.status !== 'draft'),
    [combos],
  )

  function findItem(id) {
    return products.find((item) => item.id === id) || combos.find((item) => item.id === id) || null
  }

  function findLiveItem(id) {
    return liveProducts.find((item) => item.id === id) || liveCombos.find((item) => item.id === id) || null
  }

  function getByCategory(category) {
    return liveProducts.filter((item) => item.category === category)
  }

  function addProduct(input) {
    const id = input.id || slugId('a')
    const sku = input.sku || `FAA-${id.toUpperCase()}`
    const product = {
      id,
      sku,
      name: input.name.trim(),
      brand: input.brand.trim(),
      category: input.category,
      size: input.size || '100ml',
      concentration: input.concentration || 'EDP',
      family: input.family || 'Oriental',
      longevity: input.longevity || '6–8 hours',
      occasion: input.occasion || 'All day',
      price: Number(input.price),
      compareAt: Number(input.compareAt || input.price),
      featured: Boolean(input.featured),
      image: input.image,
      gallery: [input.image],
      notes: input.notes || {
        top: ['Bergamot'],
        heart: ['Rose'],
        base: ['Musk'],
      },
      description: input.description.trim(),
      details: [
        `SKU ${sku}`,
        `${input.size || '100ml'} ${input.concentration || 'EDP'} · ${input.family || 'Oriental'} family`,
        '100% authentic sealed bottle from Faaperfume',
        'Same-day delivery available in Dubai',
        'Returns within 7 days if unopened',
      ],
      status: input.status || 'active',
      createdAt: Date.now(),
    }
    persist((prev) => ({
      ...prev,
      extraProducts: [...prev.extraProducts.filter((item) => item.id !== id), product],
    }))
    return product
  }

  function updateProduct(id, patch) {
    const current = findItem(id)
    if (!current || current.category === 'combo') return null
    const next = {
      ...current,
      ...patch,
      price: patch.price != null ? Number(patch.price) : current.price,
      compareAt: patch.compareAt != null ? Number(patch.compareAt) : current.compareAt,
      image: patch.image || current.image,
      gallery: [patch.image || current.image],
    }
    persist((prev) => ({
      ...prev,
      productUpdates: { ...prev.productUpdates, [id]: next },
    }))
    return next
  }

  function removeProduct(id) {
    persist((prev) => ({
      ...prev,
      deletedProductIds: [...new Set([...prev.deletedProductIds, id])],
      extraProducts: prev.extraProducts.filter((item) => item.id !== id),
    }))
  }

  function addCombo(input) {
    const id = input.id || slugId('c')
    const includes = Array.isArray(input.includes)
      ? input.includes
      : String(input.includes || '')
          .split(',')
          .map((part) => part.trim())
          .filter(Boolean)
    const combo = {
      id,
      name: input.name.trim(),
      category: 'combo',
      size: input.size || `${includes.length || 2} bottles`,
      includes,
      price: Number(input.price),
      compareAt: Number(input.compareAt || input.price),
      featured: input.featured !== false,
      badge: input.badge || 'Bundle',
      image: input.image,
      gallery: [input.image],
      description: input.description.trim(),
      details: [
        includes.join(' + '),
        'Better value than buying separately',
        'Authentic Faaperfume sourcing',
      ],
      status: input.status || 'active',
      createdAt: Date.now(),
    }
    persist((prev) => ({
      ...prev,
      extraCombos: [...prev.extraCombos.filter((item) => item.id !== id), combo],
    }))
    return combo
  }

  function updateCombo(id, patch) {
    const current = findItem(id)
    if (!current || current.category !== 'combo') return null
    const includes = patch.includes
      ? Array.isArray(patch.includes)
        ? patch.includes
        : String(patch.includes)
            .split(',')
            .map((part) => part.trim())
            .filter(Boolean)
      : current.includes
    const next = {
      ...current,
      ...patch,
      includes,
      price: patch.price != null ? Number(patch.price) : current.price,
      compareAt: patch.compareAt != null ? Number(patch.compareAt) : current.compareAt,
      image: patch.image || current.image,
      gallery: [patch.image || current.image],
      category: 'combo',
    }
    persist((prev) => ({
      ...prev,
      comboUpdates: { ...prev.comboUpdates, [id]: next },
    }))
    return next
  }

  function removeCombo(id) {
    persist((prev) => ({
      ...prev,
      deletedComboIds: [...new Set([...prev.deletedComboIds, id])],
      extraCombos: prev.extraCombos.filter((item) => item.id !== id),
    }))
  }

  const bottleImages = useMemo(() => {
    const unique = new Set(
      [...products, ...combos].map((item) => item.image).filter(Boolean),
    )
    return [...unique]
  }, [products, combos])

  const value = useMemo(
    () => ({
      products,
      combos,
      liveProducts,
      liveCombos,
      bottleImages,
      findItem,
      findLiveItem,
      getByCategory,
      getFeaturedProducts: () => liveProducts.filter((item) => item.featured),
      getFeaturedCombos: () => liveCombos.filter((item) => item.featured),
      addProduct,
      updateProduct,
      removeProduct,
      addCombo,
      updateCombo,
      removeCombo,
    }),
    [products, combos, liveProducts, liveCombos, bottleImages],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider')
  return ctx
}
