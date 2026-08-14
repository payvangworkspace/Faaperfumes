import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
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
import Combos from './pages/Combos'
import ProductDetail from './pages/ProductDetail'
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
                    <Route path="wishlist" element={<Wishlist />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                </Routes>
              </WishlistProvider>
            </CartProvider>
          </PromoProvider>
        </CurrencyProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
