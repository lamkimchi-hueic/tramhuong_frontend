// ==================== FILE: AdminLayout.jsx ====================
// Mô tả: Layout chung cho toàn bộ trang quản trị (Admin Panel).
// Bao gồm: Sidebar (thanh menu bên trái), Top Header (thanh trên), và vùng nội dung chính.
// Kiểm tra quyền truy cập: chỉ cho phép Admin và Employee vào trang quản trị.
// Hỗ trợ responsive: sidebar ẩn trên mobile, hiển thị dạng drawer khi nhấn nút hamburger.
// ==================================================================

import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'; // Routing tools
import { useAuth } from '../context/AuthContext';                           // Hook lấy thông tin user đăng nhập
import { FiHome, FiUsers, FiBox, FiList, FiShoppingCart, FiLogOut, FiMenu, FiX, FiPieChart, FiSettings, FiActivity } from 'react-icons/fi'; // Icons
import { useState, useEffect } from 'react';

export default function AdminLayout() {
  const { user, logout, loading } = useAuth(); // Lấy thông tin user, hàm logout, và trạng thái loading
  const navigate = useNavigate();               // Hook điều hướng trang
  const location = useLocation();               // Hook lấy URL hiện tại (để highlight menu active)
  const [sidebarOpen, setSidebarOpen] = useState(false); // Trạng thái mở/đóng sidebar trên mobile

  // ===== Kiểm tra quyền truy cập =====
  // Nếu user chưa đăng nhập → chuyển về trang login.
  // Nếu user đã đăng nhập nhưng không phải Admin/Employee → chuyển về trang chủ.
  useEffect(() => {
    if (!loading) {                                       // Chờ AuthContext kiểm tra token xong
      if (!user) {
        navigate('/login');                               // Chưa đăng nhập → redirect login
      } else if (user.role !== 'Admin' && user.role !== 'Employee') {
        navigate('/');                                    // Không đủ quyền → redirect trang chủ
      }
    }
  }, [user, loading, navigate]);

  // ===== Tự đóng sidebar khi chuyển trang (trên mobile) =====
  useEffect(() => {
    setSidebarOpen(false); // Đóng sidebar mỗi khi URL thay đổi
  }, [location.pathname]);

  // ===== Hiển thị loading spinner khi đang kiểm tra token =====
  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin" />
    </div>;
  }

  // ===== Bảo vệ: nếu không đủ quyền → không render gì =====
  if (!user || (user.role !== 'Admin' && user.role !== 'Employee')) {
    return null;
  }

  // ===== Định nghĩa danh sách menu sidebar =====
  // Mỗi item có: đường dẫn (path), tên hiển thị (name), icon
  const menuItems = [
    { path: '/admin', name: 'Dashboard', icon: FiPieChart },         // Trang tổng quan
    { path: '/admin/orders', name: 'Đơn hàng', icon: FiShoppingCart }, // Quản lý đơn hàng
    { path: '/admin/products', name: 'Sản phẩm', icon: FiBox },      // Quản lý sản phẩm
    { path: '/admin/categories', name: 'Danh mục', icon: FiList },    // Quản lý danh mục
    { path: '/admin/analytics', name: 'Phân tích (AI)', icon: FiActivity }, // Phân tích dữ liệu AI
  ];

  // Chỉ Admin mới thấy menu "Người dùng" và "Cài đặt" (Employee không có quyền)
  if (user.role === 'Admin') {
    menuItems.push({ path: '/admin/users', name: 'Người dùng', icon: FiUsers });
    menuItems.push({ path: '/admin/settings', name: 'Cài đặt', icon: FiSettings });
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-[family-name:var(--font-body)]">

      {/* ===== Overlay mờ nền khi sidebar mở trên mobile ===== */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" // Chỉ hiện trên mobile (lg:hidden)
          onClick={() => setSidebarOpen(false)}                 // Click vào overlay → đóng sidebar
        />
      )}

      {/* ===== SIDEBAR (Thanh menu bên trái) ===== */}
      {/* Trên desktop (lg): luôn hiện, fixed bên trái. */}
      {/* Trên mobile: ẩn mặc định, trượt ra từ trái khi sidebarOpen = true. */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Logo + nút đóng sidebar (mobile) */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
          <Link to="/admin" className="font-[family-name:var(--font-heading)] font-bold text-xl text-[var(--color-primary)]">
            Admin Panel
          </Link>
          <button className="lg:hidden text-gray-400 hover:text-gray-600" onClick={() => setSidebarOpen(false)}>
            <FiX size={20} /> {/* Icon X để đóng sidebar trên mobile */}
          </button>
        </div>

        {/* Danh sách menu */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3 mt-4">Menu Chính</div>
          
          {/* Render từng menu item */}
          {menuItems.map((item) => {
            const Icon = item.icon;                               // Lấy icon component
            const isActive = location.pathname === item.path;     // Kiểm tra có phải trang hiện tại không
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-[var(--color-primary-50)] text-[var(--color-primary)]'  // Menu đang active → highlight
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[var(--color-primary)]' // Menu không active
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[var(--color-primary)]' : 'text-gray-400'} />
                {item.name} {/* Tên menu */}
              </Link>
            );
          })}

          {/* Nhóm menu phụ: về trang khách + đăng xuất */}
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3 mt-8">Cài đặt</div>
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <FiHome size={18} className="text-gray-400" />
            Về Trang Khách {/* Link quay về trang chủ khách hàng */}
          </Link>
          <button
            onClick={logout} // Gọi hàm logout từ AuthContext
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-1"
          >
            <FiLogOut size={18} className="text-red-400" />
            Đăng xuất
          </button>
        </nav>
      </aside>

      {/* ===== VÙNG NỘI DUNG CHÍNH ===== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* ===== TOP HEADER (Thanh trên cùng) ===== */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 lg:px-8 z-10">
          <div className="flex items-center gap-4">
            {/* Nút hamburger mở sidebar (chỉ hiện trên mobile) */}
            <button 
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-md lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu size={20} />
            </button>
            {/* Tên trang hiện tại (lấy từ menuItems dựa vào URL) */}
            <h1 className="text-lg font-semibold text-gray-800 capitalize hidden sm:block">
              {menuItems.find(i => i.path === location.pathname)?.name || 'Trang Quản Trị'}
            </h1>
          </div>

          {/* Thông tin user đang đăng nhập */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-700">{user.username}</p>    {/* Tên user */}
              <p className="text-xs text-[var(--color-primary)] font-medium bg-[var(--color-primary-50)] px-2 py-0.5 rounded inline-block mt-0.5">
                {user.role} {/* Vai trò: Admin hoặc Employee */}
              </p>
            </div>
            {/* Avatar tròn hiển thị chữ cái đầu tiên của username */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-gold)] text-white flex items-center justify-center font-bold shadow-md">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* ===== VÙNG HIỂN THỊ NỘI DUNG TRANG CON ===== */}
        {/* <Outlet /> là nơi các route con (AdminDashboard, AdminProducts, ...) sẽ được render */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 lg:p-8">
          <Outlet /> {/* Hiển thị component con tương ứng với route hiện tại */}
        </main>
      </div>
    </div>
  );
}
