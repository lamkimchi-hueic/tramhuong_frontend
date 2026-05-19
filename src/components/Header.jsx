// ==================== FILE: Header.jsx ====================
// Mô tả: Component thanh điều hướng chính (Navbar) ở đầu trang.
// Tính năng: Logo, menu điều hướng, thanh tìm kiếm, giỏ hàng, user menu.
// Hỗ trợ responsive: trên mobile hiển thị hamburger menu.
// Hiệu ứng: thanh nav trong suốt trên trang chủ, chuyển thành trắng khi cuộn.
// ==================================================================

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Routing hooks
import { FiSearch, FiUser, FiLogOut, FiMenu, FiX, FiPieChart, FiShoppingCart } from 'react-icons/fi'; // Icons
import { useAuth } from '../context/AuthContext';   // Hook lấy thông tin đăng nhập
import { useCart } from '../context/CartContext';     // Hook lấy số lượng giỏ hàng
import { settingAPI, resolveImageUrl } from '../services/api'; // API để fetch settings

export default function Header() {
  const [scrolled, setScrolled] = useState(false);       // Theo dõi trang đã cuộn xuống chưa
  const [menuOpen, setMenuOpen] = useState(false);       // Trạng thái mở/đóng menu mobile
  const [userMenuOpen, setUserMenuOpen] = useState(false); // Trạng thái mở/đóng dropdown user
  const [searchOpen, setSearchOpen] = useState(false);   // Trạng thái mở/đóng ô tìm kiếm
  const [searchQuery, setSearchQuery] = useState('');    // Từ khóa tìm kiếm
  const [logoUrl, setLogoUrl] = useState(null);          // Logo URL từ settings
  const { user, logout, loading } = useAuth();           // Thông tin user đăng nhập
  const { itemCount } = useCart();                       // Tổng số sản phẩm trong giỏ hàng
  const location = useLocation();                        // URL hiện tại
  const navigate = useNavigate();                        // Hàm điều hướng

  // Fetch logo từ settings
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const settings = await settingAPI.getAll();
        if (settings.data && settings.data.logo_url) {
          setLogoUrl(resolveImageUrl(settings.data.logo_url));
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };
    fetchLogo();
  }, []);

  // Lắng nghe event logo update từ admin
  useEffect(() => {
    const handleLogoUpdate = async () => {
      console.log('📢 Logo updated event received, refetching...');
      try {
        const settings = await settingAPI.getAll();
        if (settings.data && settings.data.logo_url) {
          const newLogoUrl = resolveImageUrl(settings.data.logo_url);
          setLogoUrl(newLogoUrl);
          console.log('✓ Logo refetched:', newLogoUrl);
        }
      } catch (error) {
        console.error('Error refetching logo:', error);
      }
    };

    window.addEventListener('logoUpdated', handleLogoUpdate);
    return () => window.removeEventListener('logoUpdated', handleLogoUpdate);
  }, []);

  // ===== Xử lý tìm kiếm khi nhấn Enter =====
  // Chuyển hướng đến trang sản phẩm kèm query string tìm kiếm
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`); // Chuyển đến trang sản phẩm với từ khóa
      setSearchOpen(false);   // Đóng ô tìm kiếm
      setSearchQuery('');     // Reset từ khóa
    }
  };

  // Kiểm tra có đang ở trang chủ không (để áp dụng header trong suốt)
  const isHome = location.pathname === '/';

  // ===== Lắng nghe sự kiện cuộn trang =====
  // Khi cuộn xuống > 50px → đánh dấu scrolled = true để đổi style header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);     // Gắn listener
    return () => window.removeEventListener('scroll', handleScroll); // Gỡ listener khi unmount
  }, []);

  // ===== Đóng menu khi chuyển trang =====
  useEffect(() => {
    setMenuOpen(false);       // Đóng menu mobile
    setUserMenuOpen(false);   // Đóng dropdown user
  }, [location]); // Chạy mỗi khi URL thay đổi

  // ===== Xác định header có trong suốt không =====
  // Chỉ trong suốt khi: ở trang chủ + chưa cuộn + menu mobile chưa mở
  const isTransparent = isHome && !scrolled && !menuOpen;

  // ===== Danh sách link điều hướng =====
  const navLinks = [
    { to: '/', label: 'Trang Chủ' },
    { to: '/products', label: 'Sản Phẩm' },
    { to: '/about', label: 'Về Chúng Tôi' },
    { to: '/contact', label: 'Liên Hệ' },
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent'                              // Trang chủ, chưa cuộn → trong suốt
          : 'bg-white/97 backdrop-blur-lg shadow-md'      // Các trang khác hoặc đã cuộn → nền trắng mờ
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* ===== LOGO ===== */}
        <Link to="/" className="flex items-center gap-3 z-50">
          {/* Logo ảnh từ settings hoặc SVG mặc định */}
          <div className="w-12 h-12 flex items-center justify-center">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M30 5 L35 20 L45 15 L38 28 L50 30 L38 32 L45 45 L35 40 L30 55 L25 40 L15 45 L22 32 L10 30 L22 28 L15 15 L25 20 Z"
                  fill="#2D5016" stroke="rgba(45,80,22,0.3)" strokeWidth="0.5"
                />
                <circle cx="30" cy="30" r="6" fill="none" stroke="#C4A35A" strokeWidth="1" />
              </svg>
            )}
          </div>
          {/* Tên thương hiệu */}
          <div className="flex flex-col leading-tight">
            <span className="font-[family-name:var(--font-heading)] text-lg font-bold tracking-wide uppercase text-[#2D5016]">
              Trầm Hương
            </span>
            <span className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-wide uppercase text-[#2D5016]">
              Tâm An
            </span>
          </div>
        </Link>

        {/* ===== DESKTOP NAV (ẩn trên mobile) ===== */}
        <nav className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium tracking-wide uppercase relative pb-1 transition-colors duration-300
                after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[var(--color-gold)] after:transition-all after:duration-300
                ${location.pathname === link.to ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
                ${isTransparent ? 'text-[#2D5016]' : 'text-[#2D5016] hover:text-[var(--color-primary-dark)]'}
              `}
              // after: pseudo-element tạo gạch chân vàng cho link đang active/hover
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ===== CÁC NÚT HÀNH ĐỘNG (ẩn trên mobile) ===== */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* --- Ô tìm kiếm có animation mở rộng --- */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm trầm hương..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch} // Nhấn Enter → tìm kiếm
              className={`absolute right-0 top-1/2 -translate-y-1/2 h-10 bg-white border border-[var(--color-primary)]/20 rounded-full pl-4 pr-12 text-sm transition-all duration-500 outline-none focus:border-[var(--color-primary)] focus:shadow-lg ${
                searchOpen ? 'w-64 opacity-100 visible' : 'w-0 opacity-0 invisible' // Animation mở/đóng
              }`}
            />
            {/* Nút toggle mở/đóng ô tìm kiếm */}
            <button
              id="search-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 ${
                searchOpen ? 'text-[var(--color-primary)]' : 'text-[#2D5016]'
              } hover:bg-[var(--color-primary)]/10`}
            >
              {searchOpen ? <FiX size={18} /> : <FiSearch size={18} />}
            </button>
          </div>

          {/* --- Nút giỏ hàng với badge số lượng --- */}
          <Link
            to="/cart"
            id="cart-btn"
            className={`w-10 h-10 rounded-full flex items-center justify-center relative transition-all duration-300 hover:bg-[var(--color-primary)]/10 text-[#2D5016]`}
          >
            <FiShoppingCart size={18} />
            {/* Badge đỏ hiển thị số lượng sản phẩm trong giỏ */}
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* --- User menu: hiển thị tùy theo trạng thái đăng nhập --- */}
          {loading ? (
            // Đang kiểm tra token → hiện placeholder loading
            <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
          ) : user ? (
            // Đã đăng nhập → hiện dropdown menu
            <div className="relative">
              <button
                id="user-menu-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)} // Toggle mở/đóng dropdown
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[var(--color-primary)]/10 text-[#2D5016]`}
              >
                <FiUser size={18} />
              </button>
              {/* Dropdown menu user */}
              {userMenuOpen && (
                <div className="absolute top-full right-0 mt-2 min-w-[180px] bg-white rounded-xl shadow-xl py-2 animate-fade-in-up">
                  {/* Link vào trang quản trị (chỉ hiện cho Admin/Employee) */}
                  {(user.role === 'Admin' || user.role === 'Employee') && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary)] transition-colors"
                    >
                      <FiPieChart size={14} /> Quản trị
                    </Link>
                  )}
                  {/* Link đến trang hồ sơ */}
                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    <FiUser size={14} /> {user.username}
                  </Link>
                  {/* Nút đăng xuất */}
                  <button
                    onClick={logout}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <FiLogOut size={14} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Chưa đăng nhập → hiện nút "Đăng Nhập"
            <Link
              to="/login"
              id="login-btn"
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-all duration-300 ${
                isTransparent
                  ? 'border border-[#2D5016]/60 text-[#2D5016] hover:bg-[#2D5016] hover:text-white' // Trên nền trong suốt
                  : 'bg-[#2D5016] text-white hover:bg-[var(--color-primary-dark)]'                    // Trên nền trắng
              }`}
            >
              Đăng Nhập
            </Link>
          )}
        </div>

        {/* ===== NÚT HAMBURGER (chỉ hiện trên mobile) ===== */}
        <button
          id="hamburger-btn"
          onClick={() => setMenuOpen(!menuOpen)} // Toggle mở/đóng menu mobile
          className={`md:hidden z-50 text-xl text-[#2D5016]`}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* ===== MOBILE MENU (toàn màn hình) ===== */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-0 bg-white z-40 pt-24 px-6 animate-fade-in-up">
          <nav className="flex flex-col gap-1">
            {/* Render danh sách link điều hướng */}
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`py-3 px-4 text-lg font-medium rounded-lg transition-colors ${
                  location.pathname === link.to
                    ? 'bg-[var(--color-primary-50)] text-[var(--color-primary)]' // Link active
                    : 'text-gray-700 hover:bg-gray-50'                            // Link bình thường
                }`}
              >
                {link.label}
              </Link>
            ))}
            {/* Nút đăng nhập (chỉ hiện khi chưa đăng nhập) */}
            {!user && (
              <Link
                to="/login"
                className="mt-4 py-3 bg-[var(--color-primary)] text-white text-center rounded-lg font-semibold"
              >
                Đăng Nhập
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
