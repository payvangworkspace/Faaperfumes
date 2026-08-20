import { CURRENCIES } from './currency'
import { readJson, writeJson } from './storage'

export const ACQUIRERS_KEY = 'faaperfume_acquirers'

export const ACQUIRER_TYPES = [
  { id: 'PAYIN', label: 'PAYIN' },
  { id: 'PAYOUT', label: 'PAYOUT' },
]

export const HTTP_METHODS = [
  { id: 'POST', label: 'POST' },
  { id: 'GET', label: 'GET' },
  { id: 'PUT', label: 'PUT' },
]

export const ACQUIRER_ENVIRONMENTS = [
  { id: 'UAT', label: 'UAT' },
  { id: 'PROD', label: 'PROD' },
]

export function defaultHeaders() {
  return {
    'Content-Type': 'application/json',
    authorization: '',
    payload: '',
  }
}

export function defaultRequestTemplate(currency = 'AED', merchantId = '') {
  return {
    merchant_id: merchantId,
    txn_amount: '',
    currency,
    txn_unique_id: '',
    customer_name: '',
    email_address: '',
    mobile_number: '',
    remarks: '',
    payment_mode: 'ALL',
  }
}

export function getAcquirers() {
  return readJson(ACQUIRERS_KEY, [])
}

export function findAcquirer(id) {
  return getAcquirers().find((item) => item.id === id) || null
}

export function saveAcquirer(acquirer) {
  const next = [acquirer, ...getAcquirers().filter((item) => item.id !== acquirer.id)]
  writeJson(ACQUIRERS_KEY, next)
  return acquirer
}

export function deleteAcquirer(id) {
  const next = getAcquirers().filter((item) => item.id !== id)
  writeJson(ACQUIRERS_KEY, next)
  return next
}

export function buildAcquirer(form, existing = null) {
  const currency = form.currency || 'AED'
  const now = Date.now()
  return {
    id: existing?.id || crypto.randomUUID(),
    aggregatorCode: form.aggregatorCode.trim().toUpperCase(),
    apiName: form.apiName.trim(),
    baseUrl: form.baseUrl.trim(),
    endpoint: form.endpoint.trim(),
    responseUrl: form.responseUrl.trim(),
    webhookUrl: form.webhookUrl.trim(),
    merchantId: form.merchantId.trim(),
    secretKey: form.secretKey.trim(),
    responseKey: form.responseKey.trim(),
    clientId: form.clientId.trim() || 'NA',
    type: form.type,
    httpMethod: form.httpMethod,
    environment: form.environment,
    currency,
    currencyName: CURRENCIES.find((item) => item.code === currency)?.name || currency,
    active: Boolean(form.active),
    status: form.active ? 'active' : 'hidden',
    headers: form.headers,
    requestTemplate: form.requestTemplate,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  }
}

export function currenciesInUse(acquirers) {
  return [...new Set(acquirers.map((item) => item.currency).filter(Boolean))]
}
