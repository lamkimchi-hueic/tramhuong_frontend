import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';

// Client Pages
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import ProductDetail from './pages/ProductDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminSettings from './pages/admin/AdminSettings';

import { CartProvider } from './context/CartContext';
import './App.css';

// Component layout dành riêng cho trang khách
function ClientLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* ----- Client Routes ----- */}
            <Route path="/" element={<ClientLayout><HomePage /></ClientLayout>} />
            <Route path="/products" element={<ClientLayout><ProductPage /></ClientLayout>} />
            <Route path="/products/:id" element={<ClientLayout><ProductDetail /></ClientLayout>} />
            <Route path="/login" element={<ClientLayout><LoginPage /></ClientLayout>} />
            <Route path="/register" element={<ClientLayout><RegisterPage /></ClientLayout>} />
            <Route path="/contact" element={<ClientLayout><ContactPage /></ClientLayout>} />
            <Route path="/about" element={<ClientLayout><AboutPage /></ClientLayout>} />
          <Route path="/cart" element={<ClientLayout><CartPage /></ClientLayout>} />
          <Route path="/profile" element={<ClientLayout><ProfilePage /></ClientLayout>} />

            {/* ----- Admin Routes ----- */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
