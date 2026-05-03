import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '', password: '', confirmPassword: '', phone: '', address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }
    setLoading(true);
    try {
      await register({ username: formData.username, password: formData.password, phone: formData.phone, address: formData.address });
      setSuccess('Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { id: 'reg-username', name: 'username', label: 'Tên đăng nhập *', type: 'text', placeholder: 'Nhập tên đăng nhập' },
    { id: 'reg-password', name: 'password', label: 'Mật khẩu *', type: 'password', placeholder: 'Nhập mật khẩu' },
    { id: 'reg-confirm', name: 'confirmPassword', label: 'Xác nhận mật khẩu *', type: 'password', placeholder: 'Nhập lại mật khẩu' },
    { id: 'reg-phone', name: 'phone', label: 'Số điện thoại', type: 'tel', placeholder: 'Nhập số điện thoại' },
    { id: 'reg-address', name: 'address', label: 'Địa chỉ', type: 'text', placeholder: 'Nhập địa chỉ' },
  ];

  return (
    <main id="register-page" className="min-h-screen flex items-center justify-center px-6 pt-28 pb-16 bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-cream)]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-gold)]" />

        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-primary)] text-center mb-2">
          Đăng Ký
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          Tạo tài khoản tại Trầm Hương Tâm An
        </p>

        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm text-center mb-4">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm text-center mb-4">{success}</div>}

        <form onSubmit={handleSubmit}>
          {fields.map((f) => (
            <div key={f.id} className="mb-4">
              <label htmlFor={f.id} className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
              <input
                id={f.id}
                type={f.type}
                name={f.name}
                placeholder={f.placeholder}
                value={formData[f.name]}
                onChange={handleChange}
                required={f.label.includes('*')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 focus:bg-white outline-none transition-all"
              />
            </div>
          ))}
          <button
            type="submit"
            id="register-submit"
            disabled={loading}
            className="w-full py-3.5 bg-[var(--color-primary)] text-white font-semibold text-sm uppercase tracking-wide rounded-lg hover:bg-[var(--color-primary-dark)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 mt-2"
          >
            {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-[var(--color-primary)] font-semibold hover:underline">Đăng nhập</Link>
        </div>
      </div>
    </main>
  );
}
