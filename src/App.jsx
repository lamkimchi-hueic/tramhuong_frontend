// ==================== FILE: App.jsx ====================
// Mô tả: File gốc của ứng dụng React. Định nghĩa toàn bộ hệ thống routing (điều hướng)
// và bọc ứng dụng bằng các Context Provider (AuthProvider, CartProvider).
// Sử dụng React.lazy + Suspense để tối ưu hóa code-splitting, giảm dung lượng bundle tải ban đầu.
// ===========================================================

import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Thư viện điều hướng SPA
import { AuthProvider } from './context/AuthContext'; // Provider xác thực (đăng nhập/đăng xuất)
import Header from './components/Header';             // Component thanh điều hướng (navbar)
import Footer from './components/Footer';             // Component chân trang
import { CartProvider } from './context/CartContext'; // Provider giỏ hàng
import './App.css'; // CSS riêng của App (minimal)

// Hiệu ứng Loading xoay tròn đẹp mắt khi tải trang (lazy load)
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh] w-full py-16">
    <div className="w-10 h-10 border-[3px] border-[var(--color-primary)]/10 border-t-[var(--color-primary)] rounded-full animate-spin" />
  </div>
);

// ===== Lazy load các trang khách hàng (Client Pages) =====
const HomePage = lazy(() => import('./pages/HomePage'));               // Trang chủ
const ProductPage = lazy(() => import('./pages/ProductPage'));         // Trang danh sách sản phẩm
const ProductDetail = lazy(() => import('./pages/ProductDetail'));     // Trang chi tiết sản phẩm
const LoginPage = lazy(() => import('./pages/LoginPage'));             // Trang đăng nhập
const RegisterPage = lazy(() => import('./pages/RegisterPage'));       // Trang đăng ký
const ContactPage = lazy(() => import('./pages/ContactPage'));         // Trang liên hệ
const AboutPage = lazy(() => import('./pages/AboutPage'));             // Trang giới thiệu
const CartPage = lazy(() => import('./pages/CartPage'));               // Trang giỏ hàng
const ProfilePage = lazy(() => import('./pages/ProfilePage'));         // Trang hồ sơ cá nhân

// ===== Lazy load các trang quản trị (Admin Pages) =====
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));           // Layout bọc chung cho trang admin
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard')); // Trang tổng quan quản trị
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));         // Trang quản lý người dùng
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));   // Trang quản lý sản phẩm
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories')); // Trang quản lý danh mục
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));       // Trang quản lý đơn hàng
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));   // Trang cài đặt hệ thống
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics')); // Trang phân tích dữ liệu AI

// ==================== CLIENT LAYOUT ====================
function ClientLayout({ children }) {
  return (
    <>
      <Header />  {/* Thanh điều hướng chính */}
      <Suspense fallback={<PageLoader />}>
        {children}   {/* Nội dung trang */}
      </Suspense>
      <Footer />   {/* Chân trang */}
    </>
  );
}

// ==================== APP COMPONENT ====================
function App() {
  return (
    <AuthProvider>   {/* Bọc toàn bộ app bằng AuthProvider */}
      <CartProvider>   {/* Bọc toàn bộ app bằng CartProvider */}
        <Router>         {/* Kích hoạt routing SPA */}
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ===== NHÓM ROUTE KHÁCH HÀNG ===== */}
              <Route path="/" element={<ClientLayout><HomePage /></ClientLayout>} />
              <Route path="/products" element={<ClientLayout><ProductPage /></ClientLayout>} />
              <Route path="/products/:id" element={<ClientLayout><ProductDetail /></ClientLayout>} />
              <Route path="/login" element={<ClientLayout><LoginPage /></ClientLayout>} />
              <Route path="/register" element={<ClientLayout><RegisterPage /></ClientLayout>} />
              <Route path="/contact" element={<ClientLayout><ContactPage /></ClientLayout>} />
              <Route path="/about" element={<ClientLayout><AboutPage /></ClientLayout>} />
              <Route path="/cart" element={<ClientLayout><CartPage /></ClientLayout>} />
              <Route path="/profile" element={<ClientLayout><ProfilePage /></ClientLayout>} />

              {/* ===== NHÓM ROUTE QUẢN TRỊ (ADMIN) ===== */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="analytics" element={<AdminAnalytics />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
