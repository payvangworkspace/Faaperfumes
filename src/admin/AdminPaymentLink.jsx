import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, ROLES } from '../context/AuthContext'
import { useCatalog } from '../context/CatalogContext'
import { useCart } from '../context/CartContext'
import {
  PAYIN_COUNTRIES,
  PAYIN_CURRENCIES,
  PAYMENT_MODES,
  amountToAed,
  createPayinOrder,
  nextOrderRequestId,
} from '../lib/paymentLinks'
import { IconBack } from './icons'

const emptyForm = () => ({
  customerId: '',
  transactionType: 'PAYIN',
  paymentMode: 'card',
  country: 'AE',
  currency: 'AED',
  amount: '',
  orderRequestId: nextOrderRequestId(),
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  vpa: '',
  vpaVerified: false,
  remark: '',
  productId: '',
})

export default function AdminPaymentLink() {
  const { users } = useAuth()
  const { liveProducts, liveCombos, findLiveItem } = useCatalog()
  const { showToast } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [created, setCreated] = useState(null)
  const customers = users.filter((user) => user.role !== ROLES.ADMIN)
  const catalog = [...liveProducts, ...liveCombos]

  const selectedProduct = form.productId ? findLiveItem(form.productId) : null
  const previewAmount = form.amount || 0
  const previewAed = amountToAed(previewAmount, form.currency)

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value, vpaVerified: key === 'vpa' ? false : prev.vpaVerified }))
  }

  function handleCustomer(id) {
    const customer = customers.find((item) => item.id === id)
    setForm((prev) => ({
      ...prev,
      customerId: id,
      customerName: customer?.name || '',
      customerEmail: customer?.email || '',
      customerPhone: customer?.phone || '',
    }))
  }

  function handleProduct(id) {
    const product = findLiveItem(id)
    setForm((prev) => ({
      ...prev,
      productId: id,
      amount: product ? String(product.price) : prev.amount,
      currency: 'AED',
      remark: product ? product.name : prev.remark,
    }))
  }

  function handleVerify() {
    const ok = form.vpa.includes('@') && form.vpa.trim().length > 5
    setForm((prev) => ({ ...prev, vpaVerified: ok }))
    showToast(ok ? 'VPA format verified' : 'Enter a valid VPA such as name@bank')
  }

  function handleClear() {
    setForm(emptyForm())
    setCreated(null)
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (
      !form.customerName.trim() ||
      !form.customerEmail.trim() ||
      !form.customerPhone.trim() ||
      !form.amount ||
      !form.remark.trim()
    ) {
      setError('Fill customer, amount, and payment remark.')
      return
    }
    const items = selectedProduct
      ? [
          {
            id: selectedProduct.id,
            name: selectedProduct.name,
            quantity: 1,
            unit: selectedProduct.price,
            lineTotal: selectedProduct.price,
          },
        ]
      : undefined
    const result = createPayinOrder({ ...form, items })
    setCreated(result)
    showToast(`Payment order ${result.order.id} created`)
  }

  const payUrl = useMemo(() => {
    if (!created) return ''
    return `${window.location.origin}${created.link.path}`
  }, [created])

  return (
    <div className="admin-pay-layout">
      <section className="admin-card">
        <div className="admin-card__head">
          <div>
            <h2>Create payment order</h2>
            <p>All fields write a live pending transaction into the Faaperfume ledger.</p>
          </div>
          <span className="admin-pill">PAYIN FORM</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid admin-form-grid--2">
            <label className="admin-field">
              <span>Select customer <b className="admin-req">*</b></span>
              <select value={form.customerId} onChange={(e) => handleCustomer(e.target.value)}>
                <option value="">Choose a registered shopper</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} — {customer.email}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-field">
              <span>Select transaction type</span>
              <select value={form.transactionType} disabled>
                <option value="PAYIN">PAYIN</option>
              </select>
            </label>
            <label className="admin-field">
              <span>Select payment mode <b className="admin-req">*</b></span>
              <select
                value={form.paymentMode}
                onChange={(e) => update('paymentMode', e.target.value)}
              >
                {PAYMENT_MODES.map((mode) => (
                  <option key={mode.id} value={mode.id}>
                    {mode.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-field">
              <span>Country <b className="admin-req">*</b></span>
              <select value={form.country} onChange={(e) => update('country', e.target.value)}>
                {PAYIN_COUNTRIES.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-field">
              <span>Currency <b className="admin-req">*</b></span>
              <select value={form.currency} onChange={(e) => update('currency', e.target.value)}>
                {PAYIN_CURRENCIES.map((currency) => (
                  <option key={currency.id} value={currency.id}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-field">
              <span>Catalog item</span>
              <select value={form.productId} onChange={(e) => handleProduct(e.target.value)}>
                <option value="">Custom amount</option>
                {catalog.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — AED {item.price}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-field">
              <span>Payable amount <b className="admin-req">*</b></span>
              <input
                type="number"
                min="1"
                value={form.amount}
                onChange={(e) => update('amount', e.target.value)}
                placeholder="Enter payable amount"
                required
              />
            </label>
            <label className="admin-field">
              <span>Order request ID</span>
              <input value={form.orderRequestId} readOnly />
            </label>
            <label className="admin-field">
              <span>Customer name <b className="admin-req">*</b></span>
              <input
                value={form.customerName}
                onChange={(e) => update('customerName', e.target.value)}
                required
              />
            </label>
            <label className="admin-field">
              <span>Customer email ID <b className="admin-req">*</b></span>
              <input
                type="email"
                value={form.customerEmail}
                onChange={(e) => update('customerEmail', e.target.value)}
                required
              />
            </label>
            <label className="admin-field">
              <span>Customer contact number <b className="admin-req">*</b></span>
              <input
                value={form.customerPhone}
                onChange={(e) => update('customerPhone', e.target.value)}
                required
              />
            </label>
            <label className="admin-field">
              <span>VPA ID</span>
              <div className="admin-verify">
                <input
                  value={form.vpa}
                  onChange={(e) => update('vpa', e.target.value)}
                  placeholder="name@bank"
                />
                <button type="button" className="admin-btn admin-btn--ghost" onClick={handleVerify}>
                  {form.vpaVerified ? 'Verified' : 'Verify'}
                </button>
              </div>
            </label>
            <label className="admin-field admin-field--wide">
              <span>Payment remark <b className="admin-req">*</b></span>
              <input
                value={form.remark}
                onChange={(e) => update('remark', e.target.value)}
                required
              />
            </label>
          </div>

          {error ? <p className="admin-error">{error}</p> : null}

          <div className="admin-form-actions">
            <button type="button" className="admin-btn admin-btn--line" onClick={() => navigate(-1)}>
              <IconBack />
              Back
            </button>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={handleClear}>
              Clear
            </button>
            <button type="submit" className="admin-btn admin-btn--gradient">
              Submit
            </button>
          </div>
        </form>
      </section>

      <aside className="admin-card">
        <div className="admin-card__head">
          <div>
            <h2>Checkout preview</h2>
            <p>Payment link from the created order.</p>
          </div>
        </div>
        <div className="admin-preview-card">
          <small>Secure checkout</small>
          <h3>Complete your payment</h3>
          <p>Order {form.orderRequestId}</p>
          <div className="admin-preview-total">
            <span>Total amount</span>
            <strong>
              {form.currency} {previewAmount || 0}
            </strong>
            <span>{previewAed ? `≈ AED ${previewAed}` : ''}</span>
          </div>
        </div>
        {created ? (
          <div style={{ marginTop: '1rem' }}>
            <p className="admin-note">Pending order written to the live ledger.</p>
            <p className="admin-accent" style={{ wordBreak: 'break-all' }}>{payUrl}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem' }}>
              <Link className="admin-btn admin-btn--maroon" to={created.link.path}>
                Open payment page
              </Link>
              <Link className="admin-btn admin-btn--ghost" to="/admin/orders">
                View transactions
              </Link>
            </div>
          </div>
        ) : (
          <p className="admin-note" style={{ marginTop: '1rem' }}>
            Fill the form and click Submit. The payment link from the created order will appear here.
          </p>
        )}
      </aside>
    </div>
  )
}
