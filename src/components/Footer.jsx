import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiYoutube, FiMail, FiSend } from 'react-icons/fi';
import { settingAPI } from '../services/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [hours, setHours] = useState(['Thứ 2 - Thứ 6: 8:00 - 20:00', 'Thứ 7: 8:00 - 18:00', 'Chủ Nhật: 9:00 - 17:00']);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingAPI.getAll();
        const s = res.data;
        if (s.hours_weekday || s.hours_sunday) {
          setHours([
            `Thứ 2 - Thứ 7: ${s.hours_weekday || '8:00 - 20:00'}`,
            `Chủ Nhật: ${s.hours_sunday || '9:00 - 17:00'}`
          ]);
        }
      } catch (error) {
        console.error('Lỗi khi tải cài đặt:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer id="footer" className="bg-[var(--color-primary-dark)] text-white pt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          {/* Brand */}
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-4 tracking-wide">
              Trầm Hương Tâm An
            </h3>
            <p className="text-sm text-white/65 leading-relaxed mb-5">
              Chuyên cung cấp các sản phẩm trầm hương thiên nhiên cao cấp,
              được tuyển chọn và chế tác tỉ mỉ.
            </p>
            <div className="flex gap-3">
              {[FiFacebook, FiInstagram, FiYoutube, FiMail].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm hover:bg-[var(--color-gold)] hover:-translate-y-1 transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-base font-semibold mb-5">Liên Kết</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Trang Chủ' },
                { to: '/products', label: 'Sản Phẩm' },
                { to: '/about', label: 'Về Chúng Tôi' },
                { to: '/contact', label: 'Liên Hệ' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/65 hover:text-[var(--color-gold-light)] hover:pl-1 transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-base font-semibold mb-5">Giờ Mở Cửa</h3>
            <ul className="space-y-2.5">
              {hours.map((h, i) => (
                <li key={i} className="text-sm text-white/65">{h}</li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-base font-semibold mb-5">Nhận Tin Mới</h3>
            <p className="text-sm text-white/65 leading-relaxed mb-4">
              Đăng ký để nhận thông tin mới nhất về sản phẩm và ưu đãi đặc biệt.
            </p>
            {subscribed && (
              <div className="text-sm text-[var(--color-primary-100)] mb-3">✓ Cảm ơn bạn đã đăng ký!</div>
            )}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                id="newsletter-email"
                type="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-md text-white text-sm placeholder:text-white/40 focus:border-[var(--color-gold)] focus:bg-white/10 outline-none transition-all"
              />
              <button
                id="newsletter-submit"
                type="submit"
                className="px-4 py-3 bg-[var(--color-primary)] text-white rounded-md font-semibold text-sm hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                <FiSend size={16} />
              </button>
            </form>
          </div>
        </div>

        <div className="py-5 text-center text-xs text-white/40">
          © 2026 Trầm Hương Tâm An. Tất cả quyền được bảo lưu. | Nhóm 2
        </div>
      </div>
    </footer>
  );
}
