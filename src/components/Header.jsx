import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiLogOut, FiMenu, FiX, FiPieChart, FiShoppingCart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, loading } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const isTransparent = isHome && !scrolled && !menuOpen;

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
          ? 'bg-transparent'
          : 'bg-white/97 backdrop-blur-lg shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 z-50">
          <div className="w-12 h-12">
            <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M30 5 L35 20 L45 15 L38 28 L50 30 L38 32 L45 45 L35 40 L30 55 L25 40 L15 45 L22 32 L10 30 L22 28 L15 15 L25 20 Z"
                fill="#2D5016"
                stroke="rgba(45,80,22,0.3)"
                strokeWidth="0.5"
              />
              <circle
                cx="30" cy="30" r="6" fill="none"
                stroke="#C4A35A"
                strokeWidth="1"
              />
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-[family-name:var(--font-heading)] text-lg font-bold tracking-wide uppercase text-[#2D5016]">
              Trầm Hương
            </span>
            <span className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-wide uppercase text-[#2D5016]/80">
              Tâm An
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
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
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm trầm hương..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className={`absolute right-0 top-1/2 -translate-y-1/2 h-10 bg-white border border-[var(--color-primary)]/20 rounded-full pl-4 pr-12 text-sm transition-all duration-500 outline-none focus:border-[var(--color-primary)] focus:shadow-lg ${
                searchOpen ? 'w-64 opacity-100 visible' : 'w-0 opacity-0 invisible'
              }`}
            />
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

          <Link
            to="/cart"
            id="cart-btn"
            className={`w-10 h-10 rounded-full flex items-center justify-center relative transition-all duration-300 hover:bg-[var(--color-primary)]/10 text-[#2D5016]`}
          >
            <FiShoppingCart size={18} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {loading ? (
            <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button
                id="user-menu-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[var(--color-primary)]/10 text-[#2D5016]`}
              >
                <FiUser size={18} />
              </button>
              {userMenuOpen && (
                <div className="absolute top-full right-0 mt-2 min-w-[180px] bg-white rounded-xl shadow-xl py-2 animate-fade-in-up">
                  {(user.role === 'Admin' || user.role === 'Employee') && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary)] transition-colors"
                    >
                      <FiPieChart size={14} /> Quản trị
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    <FiUser size={14} /> {user.username}
                  </Link>
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
            <Link
              to="/login"
              id="login-btn"
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-all duration-300 ${
                isTransparent
                  ? 'border border-[#2D5016]/60 text-[#2D5016] hover:bg-[#2D5016] hover:text-white'
                  : 'bg-[#2D5016] text-white hover:bg-[var(--color-primary-dark)]'
              }`}
            >
              Đăng Nhập
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          id="hamburger-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden z-50 text-xl text-[#2D5016]`}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-0 bg-white z-40 pt-24 px-6 animate-fade-in-up">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`py-3 px-4 text-lg font-medium rounded-lg transition-colors ${
                  location.pathname === link.to
                    ? 'bg-[var(--color-primary-50)] text-[var(--color-primary)]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
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
