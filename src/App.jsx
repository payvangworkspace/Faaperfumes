import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { CatalogProvider } from './context/CatalogContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { PromoProvider } from './context/PromoContext'
import { WishlistProvider } from './context/WishlistContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import MenPerfumes from './pages/MenPerfumes'
import WomenPerfumes from './pages/WomenPerfumes'
import Exclusive from './pages/Exclusive'
import Brands from './pages/Brands'
import PrivacyPolicy from './pages/PrivacyPolicy'
import RefundPolicy from './pages/RefundPolicy'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Wishlist from './pages/Wishlist'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import CheckoutSuccess from './pages/CheckoutSuccess'
import Combos from './pages/Combos'
import ProductDetail from './pages/ProductDetail'
import CustomerProfile from './pages/CustomerProfile'
import PayLink from './pages/PayLink'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import AdminSuperDashboard from './admin/AdminSuperDashboard'
import AdminCustomers from './admin/AdminCustomers'
import AdminCustomerForm from './admin/AdminCustomerForm'
import AdminInventory from './admin/AdminInventory'
import AdminProductForm from './admin/AdminProductForm'
import AdminCombos from './admin/AdminCombos'
import AdminComboForm from './admin/AdminComboForm'
import AdminOrders from './admin/AdminOrders'
import AdminPaymentLink from './admin/AdminPaymentLink'
import AdminPromos from './admin/AdminPromos'
import AdminAcquirers from './admin/AdminAcquirers'
import AdminAcquirerForm from './admin/AdminAcquirerForm'
import './App.css'

function ProductDetailWrapper() {
  const { id } = useParams()
  return <ProductDetail key={id} />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CurrencyProvider>
          <PromoProvider>
            <CatalogProvider>
              <CartProvider>
                <WishlistProvider>
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Home />} />
                      <Route path="men-perfumes" element={<MenPerfumes />} />
                      <Route path="women-perfumes" element={<WomenPerfumes />} />
                      <Route path="exclusive" element={<Exclusive />} />
                      <Route path="combos" element={<Combos />} />
                      <Route path="product/:id" element={<ProductDetailWrapper />} />
                      <Route path="brands" element={<Brands />} />
                      <Route path="privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="refund-policy" element={<RefundPolicy />} />
                      <Route path="login" element={<Login />} />
                      <Route path="signup" element={<Signup />} />
                      <Route path="profile" element={<CustomerProfile />} />
                      <Route path="wishlist" element={<Wishlist />} />
                      <Route path="cart" element={<Cart />} />
                      <Route path="checkout" element={<Checkout />} />
                      <Route path="checkout/success" element={<CheckoutSuccess />} />
                      <Route path="pay/:orderId" element={<PayLink />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="overview" element={<AdminSuperDashboard />} />
                      <Route path="customers" element={<AdminCustomers />} />
                      <Route path="customers/new" element={<AdminCustomerForm />} />
                      <Route path="acquirers" element={<AdminAcquirers />} />
                      <Route path="acquirers/new" element={<AdminAcquirerForm />} />
                      <Route path="acquirers/:id" element={<AdminAcquirerForm />} />
                      <Route path="inventory" element={<AdminInventory />} />
                      <Route path="inventory/new" element={<AdminProductForm />} />
                      <Route path="inventory/:id" element={<AdminProductForm />} />
                      <Route path="combos" element={<AdminCombos />} />
                      <Route path="combos/new" element={<AdminComboForm />} />
                      <Route path="combos/:id" element={<AdminComboForm />} />
                      <Route path="promos" element={<AdminPromos />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="payment-link" element={<AdminPaymentLink />} />
                    </Route>
                  </Routes>
                </WishlistProvider>
              </CartProvider>
            </CatalogProvider>
          </PromoProvider>
        </CurrencyProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
