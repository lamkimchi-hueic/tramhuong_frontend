import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(username, password);
      if (user.user.role === 'Admin' || user.user.role === 'Employee') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="login-page" className="min-h-screen flex items-center justify-center px-6 pt-28 pb-16 bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-cream)]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10 relative overflow-hidden">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-gold)]" />

        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-primary)] text-center mb-2">
          Đăng Nhập
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          Chào mừng trở lại Trầm Hương Tâm An
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="login-username" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Tên đăng nhập
            </label>
            <input
              id="login-username"
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 focus:bg-white outline-none transition-all"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="login-password" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 focus:bg-white outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
              >
                {showPassword ? 'Ẩn' : 'Hiện'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            id="login-submit"
            disabled={loading}
            className="w-full py-3.5 bg-[var(--color-primary)] text-white font-semibold text-sm uppercase tracking-wide rounded-lg hover:bg-[var(--color-primary-dark)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 mt-2"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-[var(--color-primary)] font-semibold hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </main>
  );
}
