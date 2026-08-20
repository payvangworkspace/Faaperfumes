import { readJson, writeJson } from './storage'

export const ORDERS_KEY = 'faaperfume_orders'
export const LAST_ORDER_KEY = 'faaperfume_last_order'

export const ORDER_STATUSES = [
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
]

export function getOrders() {
  return readJson(ORDERS_KEY, [])
}

export function saveOrder(order) {
  const next = [order, ...getOrders().filter((o) => o.id !== order.id)]
  writeJson(ORDERS_KEY, next)
  writeJson(LAST_ORDER_KEY, order)
  return order
}

export function updateOrderStatus(orderId, status) {
  const next = getOrders().map((order) =>
    order.id === orderId
      ? { ...order, status, updatedAt: Date.now() }
      : order,
  )
  writeJson(ORDERS_KEY, next)
  return next
}

export function getOrdersByCustomerEmail(email) {
  const normalised = email.trim().toLowerCase()
  return getOrders().filter((o) => o.customer?.email === normalised)
}

export function formatOrderDate(timestamp) {
  return new Date(timestamp).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function paymentLabel(payment) {
  if (payment === 'cod') return 'Cash on delivery'
  if (payment === 'upi') return 'UPI'
  if (payment === 'online') return 'Online checkout'
  if (payment === 'wallet') return 'Wallet'
  if (payment === 'netbanking') return 'Net banking'
  if (payment === 'card') return 'Card'
  return 'Card on delivery'
}

export function deleteOrder(orderId) {
  const next = getOrders().filter((order) => order.id !== orderId)
  writeJson(ORDERS_KEY, next)
  return next
}

export function ordersToCsv(orders) {
  const header = [
    'Order ID',
    'Created',
    'Customer',
    'Email',
    'Phone',
    'Status',
    'Payment',
    'Items',
    'Total AED',
  ]
  const rows = orders.map((order) => [
    order.id,
    formatOrderDate(order.createdAt),
    order.customer?.fullName || '',
    order.customer?.email || '',
    order.customer?.phone || '',
    order.status,
    paymentLabel(order.payment),
    (order.items || []).map((item) => `${item.name} x${item.quantity}`).join('; '),
    order.totalAed ?? 0,
  ])
  return [header, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`)
        .join(','),
    )
    .join('\n')
}
