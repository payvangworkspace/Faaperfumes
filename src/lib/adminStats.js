function dayKey(timestamp) {
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function startOfDay(date = new Date()) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function isSameDay(timestamp, date = new Date()) {
  return dayKey(timestamp) === dayKey(date.getTime())
}

export function percentChange(current, previous) {
  if (!previous && !current) return 0
  if (!previous) return 100
  return Math.round(((current - previous) / previous) * 1000) / 10
}

export function computeOrderStats(orders) {
  const active = orders.filter((order) => order.status !== 'cancelled')
  const today = startOfDay()
  const yesterday = startOfDay(new Date(Date.now() - 86400000))

  const todayOrders = active.filter((order) => isSameDay(order.createdAt, today))
  const yesterdayOrders = active.filter((order) => isSameDay(order.createdAt, yesterday))

  const todaySales = todayOrders.reduce((sum, order) => sum + (order.totalAed || 0), 0)
  const yesterdaySales = yesterdayOrders.reduce((sum, order) => sum + (order.totalAed || 0), 0)
  const todayCount = todayOrders.length
  const yesterdayCount = yesterdayOrders.length
  const todayAov = todayCount ? Math.round(todaySales / todayCount) : 0
  const yesterdayAov = yesterdayCount ? Math.round(yesterdaySales / yesterdayCount) : 0

  const grossSales = active.reduce((sum, order) => sum + (order.totalAed || 0), 0)
  const byStatus = orders.reduce((acc, order) => {
    const key = order.status || 'pending'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  const weekly = Array.from({ length: 7 }, (_, index) => {
    const date = startOfDay(new Date(Date.now() - (6 - index) * 86400000))
    const dayOrders = active.filter((order) => isSameDay(order.createdAt, date))
    return {
      key: dayKey(date.getTime()),
      label: date.toLocaleDateString(undefined, { weekday: 'short' }),
      dateLabel: date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
      sales: dayOrders.reduce((sum, order) => sum + (order.totalAed || 0), 0),
      count: dayOrders.length,
    }
  })

  return {
    todaySales,
    yesterdaySales,
    todayCount,
    yesterdayCount,
    todayAov,
    yesterdayAov,
    salesChange: percentChange(todaySales, yesterdaySales),
    countChange: percentChange(todayCount, yesterdayCount),
    aovChange: percentChange(todayAov, yesterdayAov),
    grossSales,
    totalOrders: orders.length,
    byStatus,
    weekly,
    pendingCount: byStatus.pending || 0,
    confirmedCount: byStatus.confirmed || 0,
    shippedCount: byStatus.shipped || 0,
    deliveredCount: byStatus.delivered || 0,
    cancelledCount: byStatus.cancelled || 0,
    successCount: (byStatus.confirmed || 0) + (byStatus.shipped || 0) + (byStatus.delivered || 0),
    successSales: active
      .filter((order) => ['confirmed', 'shipped', 'delivered'].includes(order.status))
      .reduce((sum, order) => sum + (order.totalAed || 0), 0),
    pendingSales: orders
      .filter((order) => order.status === 'pending')
      .reduce((sum, order) => sum + (order.totalAed || 0), 0),
    cancelledSales: orders
      .filter((order) => order.status === 'cancelled')
      .reduce((sum, order) => sum + (order.totalAed || 0), 0),
  }
}

export function topSellingItems(orders, limit = 6) {
  const map = new Map()
  orders
    .filter((order) => order.status !== 'cancelled')
    .forEach((order) => {
      ;(order.items || []).forEach((item) => {
        const current = map.get(item.id) || { id: item.id, name: item.name, quantity: 0, sales: 0 }
        current.quantity += item.quantity || 1
        current.sales += item.lineTotal || 0
        map.set(item.id, current)
      })
    })
  return [...map.values()].sort((a, b) => b.sales - a.sales).slice(0, limit)
}

export function customerSpendMap(orders) {
  return orders.reduce((acc, order) => {
    const email = order.customer?.email
    if (!email) return acc
    if (!acc[email]) {
      acc[email] = { orderCount: 0, spentAed: 0, lastOrderAt: null }
    }
    acc[email].orderCount += 1
    if (order.status !== 'cancelled') acc[email].spentAed += order.totalAed || 0
    if (!acc[email].lastOrderAt || order.createdAt > acc[email].lastOrderAt) {
      acc[email].lastOrderAt = order.createdAt
    }
    return acc
  }, {})
}
