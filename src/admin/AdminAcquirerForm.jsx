import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { CURRENCIES } from '../lib/currency'
import {
  ACQUIRER_ENVIRONMENTS,
  ACQUIRER_TYPES,
  HTTP_METHODS,
  buildAcquirer,
  defaultHeaders,
  defaultRequestTemplate,
  findAcquirer,
  saveAcquirer,
} from '../lib/acquirers'
import { useCart } from '../context/CartContext'
import { IconBack } from './icons'

function stringify(value) {
  return JSON.stringify(value, null, 2)
}

function emptyForm() {
  return {
    aggregatorCode: '',
    apiName: '',
    baseUrl: '',
    endpoint: '',
    responseUrl: '',
    webhookUrl: '',
    merchantId: '',
    secretKey: '',
    responseKey: '',
    clientId: 'NA',
    type: 'PAYIN',
    httpMethod: 'POST',
    environment: 'UAT',
    currency: 'AED',
    active: true,
    headersText: stringify(defaultHeaders()),
    templateText: stringify(defaultRequestTemplate('AED')),
  }
}

export default function AdminAcquirerForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const [existing] = useState(() => (id ? findAcquirer(id) : null))
  const { showToast } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!existing) return
    setForm({
      aggregatorCode: existing.aggregatorCode,
      apiName: existing.apiName,
      baseUrl: existing.baseUrl,
      endpoint: existing.endpoint,
      responseUrl: existing.responseUrl,
      webhookUrl: existing.webhookUrl,
      merchantId: existing.merchantId,
      secretKey: existing.secretKey,
      responseKey: existing.responseKey,
      clientId: existing.clientId,
      type: existing.type,
      httpMethod: existing.httpMethod,
      environment: existing.environment,
      currency: existing.currency,
      active: existing.active,
      headersText: stringify(existing.headers || defaultHeaders()),
      templateText: stringify(existing.requestTemplate || defaultRequestTemplate(existing.currency)),
    })
  }, [existing])

  const selectedCurrency = useMemo(
    () => CURRENCIES.find((item) => item.code === form.currency) || CURRENCIES[0],
    [form.currency],
  )

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleCurrency(code) {
    setForm((prev) => {
      let templateText = prev.templateText
      try {
        const parsed = JSON.parse(prev.templateText)
        parsed.currency = code
        templateText = stringify(parsed)
      } catch {
        templateText = stringify(defaultRequestTemplate(code, prev.merchantId))
      }
      return { ...prev, currency: code, templateText }
    })
  }

  function handleMerchant(value) {
    setForm((prev) => {
      let templateText = prev.templateText
      try {
        const parsed = JSON.parse(prev.templateText)
        parsed.merchant_id = value
        templateText = stringify(parsed)
      } catch {
        templateText = prev.templateText
      }
      return { ...prev, merchantId: value, templateText }
    })
  }

  function parseJson(label, raw) {
    try {
      return { ok: true, value: JSON.parse(raw) }
    } catch {
      return { ok: false, error: `${label} must be valid JSON.` }
    }
  }

  function handleClear() {
    setForm(emptyForm())
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.aggregatorCode.trim() || !form.apiName.trim() || !form.baseUrl.trim() || !form.endpoint.trim()) {
      setError('Aggregator code, API name, base URL, and endpoint are required.')
      return
    }
    const headers = parseJson('Headers', form.headersText)
    const template = parseJson('Request template', form.templateText)
    if (!headers.ok) {
      setError(headers.error)
      return
    }
    if (!template.ok) {
      setError(template.error)
      return
    }
    const acquirer = buildAcquirer(
      {
        ...form,
        headers: headers.value,
        requestTemplate: { ...template.value, currency: form.currency },
      },
      existing,
    )
    saveAcquirer(acquirer)
    showToast(`${acquirer.aggregatorCode} ${isEdit ? 'updated' : 'saved'}`)
    navigate('/admin/acquirers')
  }

  if (isEdit && !existing) {
    return <Navigate to="/admin/acquirers" replace />
  }

  return (
    <section className="admin-card">
      <div className="admin-card__head">
        <Link className="admin-link" to="/admin/acquirers">
          ← Back to acquirers
        </Link>
        <span className="admin-pill">{isEdit ? 'EDIT CONNECTOR' : 'NEW CONNECTOR'}</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-section__title">
          <div>
            <h3>Acquirer gateway API</h3>
            <p>
              Configure connector endpoints, credentials, and a request template for{' '}
              {selectedCurrency.name}.
            </p>
          </div>
        </div>

        <div className="admin-form-grid admin-form-grid--2">
          <label className="admin-field">
            <span>Aggregator code <b className="admin-req">*</b></span>
            <input
              value={form.aggregatorCode}
              onChange={(e) => update('aggregatorCode', e.target.value)}
              placeholder="e.g. GEIDEA_AED"
              required
            />
          </label>
          <label className="admin-field">
            <span>API name <b className="admin-req">*</b></span>
            <input
              value={form.apiName}
              onChange={(e) => update('apiName', e.target.value)}
              placeholder="e.g. CREATE_SESSION"
              required
            />
          </label>
          <label className="admin-field">
            <span>Base URL <b className="admin-req">*</b></span>
            <input
              value={form.baseUrl}
              onChange={(e) => update('baseUrl', e.target.value)}
              placeholder="https://api.example.com"
              required
            />
          </label>
          <label className="admin-field">
            <span>Endpoint <b className="admin-req">*</b></span>
            <input
              value={form.endpoint}
              onChange={(e) => update('endpoint', e.target.value)}
              placeholder="/payins/createOrder"
              required
            />
          </label>
          <label className="admin-field">
            <span>Response URL</span>
            <input
              value={form.responseUrl}
              onChange={(e) => update('responseUrl', e.target.value)}
              placeholder="Enter response URL"
            />
          </label>
          <label className="admin-field">
            <span>Webhook URL</span>
            <input
              value={form.webhookUrl}
              onChange={(e) => update('webhookUrl', e.target.value)}
              placeholder="Enter webhook URL"
            />
          </label>
          <label className="admin-field">
            <span>Merchant ID</span>
            <input
              value={form.merchantId}
              onChange={(e) => handleMerchant(e.target.value)}
              placeholder="Enter merchant ID"
            />
          </label>
          <label className="admin-field">
            <span>Secret key</span>
            <input
              type="password"
              value={form.secretKey}
              onChange={(e) => update('secretKey', e.target.value)}
              placeholder="Enter secret key"
            />
          </label>
          <label className="admin-field">
            <span>Response key</span>
            <input
              value={form.responseKey}
              onChange={(e) => update('responseKey', e.target.value)}
              placeholder="Enter response key"
            />
          </label>
          <label className="admin-field">
            <span>Client ID</span>
            <input
              value={form.clientId}
              onChange={(e) => update('clientId', e.target.value)}
              placeholder="NA"
            />
          </label>
          <label className="admin-field">
            <span>Currency <b className="admin-req">*</b></span>
            <select value={form.currency} onChange={(e) => handleCurrency(e.target.value)}>
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} — {currency.name}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span>Type <b className="admin-req">*</b></span>
            <select value={form.type} onChange={(e) => update('type', e.target.value)}>
              {ACQUIRER_TYPES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span>HTTP method <b className="admin-req">*</b></span>
            <select value={form.httpMethod} onChange={(e) => update('httpMethod', e.target.value)}>
              {HTTP_METHODS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span>Environment <b className="admin-req">*</b></span>
            <select value={form.environment} onChange={(e) => update('environment', e.target.value)}>
              {ACQUIRER_ENVIRONMENTS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span>Active</span>
            <label className="admin-check-inline">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => update('active', e.target.checked)}
              />
              Connector is live
            </label>
          </label>
          <label className="admin-field">
            <span>Headers (JSON) <b className="admin-req">*</b></span>
            <textarea
              className="admin-json"
              value={form.headersText}
              onChange={(e) => update('headersText', e.target.value)}
              spellCheck={false}
              required
            />
          </label>
          <label className="admin-field">
            <span>Request template (JSON) <b className="admin-req">*</b></span>
            <textarea
              className="admin-json"
              value={form.templateText}
              onChange={(e) => update('templateText', e.target.value)}
              spellCheck={false}
              required
            />
          </label>
        </div>

        {error ? <p className="admin-error">{error}</p> : null}

        <div className="admin-form-actions">
          <Link className="admin-btn admin-btn--line" to="/admin/acquirers">
            <IconBack />
            Back
          </Link>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={handleClear}>
            Clear
          </button>
          <button type="submit" className="admin-btn admin-btn--maroon">
            {isEdit ? 'Save acquirer' : 'Submit'}
          </button>
        </div>
      </form>
    </section>
  )
}
