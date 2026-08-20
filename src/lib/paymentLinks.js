import { CURRENCIES, convertToAed } from './currency'
import { readJson, writeJson } from './storage'
import { saveOrder } from './orders'

export const PAYMENT_LINKS_KEY = 'faaperfume_payment_links'

export const PAYMENT_MODES = [
  { id: 'online', label: 'ONLINE' },
  { id: 'upi', label: 'UPI' },
  { id: 'card', label: 'CARD' },
  { id: 'netbanking', label: 'NETBANKING' },
  { id: 'wallet', label: 'WALLET' },
  { id: 'cod', label: 'COD' },
]

export const PAYIN_COUNTRIES = [
  { id: 'AE', label: 'UAE' },
  { id: 'IN', label: 'India' },
  { id: 'US', label: 'United States' },
  { id: 'GB', label: 'United Kingdom' },
]

export const PAYIN_CURRENCIES = CURRENCIES.map((item) => ({
  id: item.code,
  label: item.label,
  name: item.name,
}))

export function getPaymentLinks() {
  return readJson(PAYMENT_LINKS_KEY, [])
}

export function savePaymentLink(link) {
  const next = [link, ...getPaymentLinks().filter((item) => item.id !== link.id)]
  writeJson(PAYMENT_LINKS_KEY, next)
  return link
}

export function findPaymentLink(id) {
  return getPaymentLinks().find((item) => item.id === id) || null
}

export function nextOrderRequestId() {
  return `ORD${Date.now().toString().slice(-10)}`
}

export function amountToAed(amount, currency) {
  return Math.round(convertToAed(Number(amount || 0), currency))
}

export function createPayinOrder(form) {
  const totalAed = amountToAed(form.amount, form.currency)
  const createdAt = Date.now()
  const items = form.items?.length
    ? form.items
    : [
        {
          id: form.productId || 'custom',
          name: form.remark || 'Admin payment order',
          quantity: 1,
          unit: totalAed,
          lineTotal: totalAed,
        },
      ]

  const order = {
    id: form.orderRequestId,
    createdAt,
    updatedAt: createdAt,
    status: 'pending',
    source: 'admin-payin',
    userId: form.customerId || null,
    customer: {
      fullName: form.customerName.trim(),
      email: form.customerEmail.trim().toLowerCase(),
      phone: form.customerPhone.trim(),
      address: form.address?.trim() || 'Payment link — pending address',
      city: form.city?.trim() || '',
      emirate: form.country === 'AE' ? 'Dubai' : form.country,
      notes: form.remark.trim(),
    },
    payment: form.paymentMode,
    currency: form.currency,
    country: form.country,
    vpa: form.vpa || '',
    promo: null,
    items,
    subtotalAed: totalAed,
    shippingAed: 0,
    totalAed,
    itemCount: items.reduce((sum, item) => sum + (item.quantity || 1), 0),
  }

  const link = {
    id: crypto.randomUUID(),
    orderId: order.id,
    createdAt,
    amount: Number(form.amount),
    currency: form.currency,
    country: form.country,
    paymentMode: form.paymentMode,
    customerName: order.customer.fullName,
    customerEmail: order.customer.email,
    remark: form.remark,
    vpa: form.vpa || '',
    vpaVerified: Boolean(form.vpaVerified),
    path: `/pay/${order.id}`,
  }

  saveOrder(order)
  savePaymentLink(link)
  return { order, link }
}
