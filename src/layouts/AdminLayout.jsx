import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiUsers, FiBox, FiList, FiShoppingCart, FiLogOut, FiMenu, FiX, FiPieChart, FiSettings } from 'react-icons/fi';
import { useState, useEffect } from 'react';

export default function AdminLayout() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else if (user.role !== 'Admin' && user.role !== 'Employee') {
        navigate('/');
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    setSidebarOpen(false); // Close sidebar on route change on mobile
  }, [location.pathname]);

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin" />
    </div>;
  }

  if (!user || (user.role !== 'Admin' && user.role !== 'Employee')) {
    return null;
  }

  const menuItems = [
    { path: '/admin', name: 'Dashboard', icon: FiPieChart },
    { path: '/admin/orders', name: 'Đơn hàng', icon: FiShoppingCart },
    { path: '/admin/products', name: 'Sản phẩm', icon: FiBox },
    { path: '/admin/categories', name: 'Danh mục', icon: FiList },
  ];

  if (user.role === 'Admin') {
    menuItems.push({ path: '/admin/users', name: 'Người dùng', icon: FiUsers });
    menuItems.push({ path: '/admin/settings', name: 'Cài đặt', icon: FiSettings });
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-[family-name:var(--font-body)]">
      {/* Sidebar background overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
          <Link to="/admin" className="font-[family-name:var(--font-heading)] font-bold text-xl text-[var(--color-primary)]">
            Admin Panel
          </Link>
          <button className="lg:hidden text-gray-400 hover:text-gray-600" onClick={() => setSidebarOpen(false)}>
            <FiX size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3 mt-4">Menu Chính</div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-[var(--color-primary-50)] text-[var(--color-primary)]' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[var(--color-primary)]'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[var(--color-primary)]' : 'text-gray-400'} />
                {item.name}
              </Link>
            );
          })}

          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3 mt-8">Cài đặt</div>
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <FiHome size={18} className="text-gray-400" />
            Về Trang Khách
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-1"
          >
            <FiLogOut size={18} className="text-red-400" />
            Đăng xuất
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 lg:px-8 z-10">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-md lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-gray-800 capitalize hidden sm:block">
              {menuItems.find(i => i.path === location.pathname)?.name || 'Trang Quản Trị'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-700">{user.username}</p>
              <p className="text-xs text-[var(--color-primary)] font-medium bg-[var(--color-primary-50)] px-2 py-0.5 rounded inline-block mt-0.5">
                {user.role}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-gold)] text-white flex items-center justify-center font-bold shadow-md">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Output area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
