// ==================== FILE: App.jsx ====================
// Mô tả: File gốc của ứng dụng React. Định nghĩa toàn bộ hệ thống routing (điều hướng)
// và bọc ứng dụng bằng các Context Provider (AuthProvider, CartProvider).
// Chia thành 2 nhóm route: Client (trang khách hàng) và Admin (trang quản trị).
// ===========================================================

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Thư viện điều hướng SPA
import { AuthProvider } from './context/AuthContext'; // Provider xác thực (đăng nhập/đăng xuất)
import Header from './components/Header';             // Component thanh điều hướng (navbar)
import Footer from './components/Footer';             // Component chân trang

// ===== Import các trang khách hàng (Client Pages) =====
import HomePage from './pages/HomePage';               // Trang chủ
import ProductPage from './pages/ProductPage';         // Trang danh sách sản phẩm
import ProductDetail from './pages/ProductDetail';     // Trang chi tiết sản phẩm
import LoginPage from './pages/LoginPage';             // Trang đăng nhập
import RegisterPage from './pages/RegisterPage';       // Trang đăng ký
import ContactPage from './pages/ContactPage';         // Trang liên hệ
import AboutPage from './pages/AboutPage';             // Trang giới thiệu
import CartPage from './pages/CartPage';               // Trang giỏ hàng
import ProfilePage from './pages/ProfilePage';         // Trang hồ sơ cá nhân

// ===== Import các trang quản trị (Admin Pages) =====
import AdminLayout from './layouts/AdminLayout';           // Layout bọc chung cho trang admin (sidebar + header)
import AdminDashboard from './pages/admin/AdminDashboard'; // Trang tổng quan quản trị
import AdminUsers from './pages/admin/AdminUsers';         // Trang quản lý người dùng
import AdminProducts from './pages/admin/AdminProducts';   // Trang quản lý sản phẩm
import AdminCategories from './pages/admin/AdminCategories'; // Trang quản lý danh mục
import AdminOrders from './pages/admin/AdminOrders';       // Trang quản lý đơn hàng
import AdminSettings from './pages/admin/AdminSettings';   // Trang cài đặt hệ thống
import AdminAnalytics from './pages/admin/AdminAnalytics'; // Trang phân tích dữ liệu AI

import { CartProvider } from './context/CartContext'; // Provider giỏ hàng
import './App.css'; // CSS riêng của App (minimal)

// ==================== CLIENT LAYOUT ====================
// Layout dành cho các trang khách hàng.
// Bọc nội dung trang bằng Header (thanh điều hướng trên cùng) và Footer (chân trang).
// Các trang admin KHÔNG sử dụng layout này mà dùng AdminLayout riêng.
function ClientLayout({ children }) {
  return (
    <>
      <Header />  {/* Thanh điều hướng chính */}
      {children}   {/* Nội dung trang (HomePage, ProductPage, ...) */}
      <Footer />   {/* Chân trang */}
    </>
  );
}

// ==================== APP COMPONENT ====================
// Component gốc của ứng dụng.
// Cấu trúc lồng nhau: AuthProvider → CartProvider → Router → Routes
// - AuthProvider: Cung cấp trạng thái đăng nhập cho toàn bộ app
// - CartProvider: Cung cấp trạng thái giỏ hàng cho toàn bộ app
// - Router: Bật chế độ SPA routing (không reload trang khi chuyển URL)
function App() {
  return (
    <AuthProvider>   {/* Bọc toàn bộ app bằng AuthProvider */}
      <CartProvider>   {/* Bọc toàn bộ app bằng CartProvider */}
        <Router>         {/* Kích hoạt routing SPA */}
          <Routes>
            {/* ===== NHÓM ROUTE KHÁCH HÀNG ===== */}
            {/* Mỗi route bọc trong ClientLayout để có Header + Footer */}
            <Route path="/" element={<ClientLayout><HomePage /></ClientLayout>} />                    {/* Trang chủ */}
            <Route path="/products" element={<ClientLayout><ProductPage /></ClientLayout>} />          {/* Danh sách sản phẩm */}
            <Route path="/products/:id" element={<ClientLayout><ProductDetail /></ClientLayout>} />    {/* Chi tiết sản phẩm (theo ID) */}
            <Route path="/login" element={<ClientLayout><LoginPage /></ClientLayout>} />               {/* Đăng nhập */}
            <Route path="/register" element={<ClientLayout><RegisterPage /></ClientLayout>} />         {/* Đăng ký */}
            <Route path="/contact" element={<ClientLayout><ContactPage /></ClientLayout>} />           {/* Liên hệ */}
            <Route path="/about" element={<ClientLayout><AboutPage /></ClientLayout>} />               {/* Giới thiệu */}
          <Route path="/cart" element={<ClientLayout><CartPage /></ClientLayout>} />                 {/* Giỏ hàng */}
          <Route path="/profile" element={<ClientLayout><ProfilePage /></ClientLayout>} />           {/* Hồ sơ cá nhân */}

            {/* ===== NHÓM ROUTE QUẢN TRỊ (ADMIN) ===== */}
            {/* AdminLayout là layout lồng (nested route): có sidebar + header riêng */}
            {/* Các route con (children) sẽ hiển thị bên trong <Outlet /> của AdminLayout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />              {/* /admin → Trang tổng quan */}
              <Route path="users" element={<AdminUsers />} />           {/* /admin/users → Quản lý người dùng */}
              <Route path="products" element={<AdminProducts />} />     {/* /admin/products → Quản lý sản phẩm */}
              <Route path="categories" element={<AdminCategories />} /> {/* /admin/categories → Quản lý danh mục */}
              <Route path="orders" element={<AdminOrders />} />         {/* /admin/orders → Quản lý đơn hàng */}
              <Route path="settings" element={<AdminSettings />} />     {/* /admin/settings → Cài đặt hệ thống */}
              <Route path="analytics" element={<AdminAnalytics />} />   {/* /admin/analytics → Phân tích dữ liệu AI */}
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App; // Export component App để main.jsx render
