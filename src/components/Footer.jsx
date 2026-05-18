// ==================== FILE: Footer.jsx ====================
// Mô tả: Component chân trang (footer) của website.
// Hiển thị: thông tin thương hiệu, liên kết nhanh, giờ mở cửa, form đăng ký nhận tin.
// Giờ mở cửa được tải động từ SiteSetting trong database.
// ==================================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiYoutube, FiMail, FiSend } from 'react-icons/fi'; // Icons mạng xã hội
import { settingAPI } from '../services/api'; // API cài đặt hệ thống

export default function Footer() {
  const [email, setEmail] = useState('');           // Email người dùng nhập để đăng ký nhận tin
  const [subscribed, setSubscribed] = useState(false); // Trạng thái đã đăng ký thành công
  // Giờ mở cửa mặc định (sẽ được ghi đè bằng dữ liệu từ database nếu có)
  const [hours, setHours] = useState(['Thứ 2 - Thứ 6: 8:00 - 20:00', 'Thứ 7: 8:00 - 18:00', 'Chủ Nhật: 9:00 - 17:00']);

  // ===== Tải giờ mở cửa từ SiteSetting (database) =====
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingAPI.getAll(); // Gọi API lấy tất cả cài đặt
        const s = res.data;
        // Nếu có dữ liệu giờ mở cửa trong database → cập nhật
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

  // ===== Xử lý submit form đăng ký nhận tin =====
  const handleSubmit = (e) => {
    e.preventDefault();         // Ngăn form reload trang
    if (email) {
      setSubscribed(true);      // Hiện thông báo thành công
      setEmail('');              // Reset ô email
      setTimeout(() => setSubscribed(false), 3000); // Ẩn thông báo sau 3 giây
    }
  };

  return (
    <footer id="footer" className="bg-[var(--color-primary)] text-white pt-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Grid 4 cột: Thương hiệu | Liên kết | Giờ mở cửa | Đăng ký nhận tin */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          
          {/* ===== CỘT 1: Thông tin thương hiệu ===== */}
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-4 tracking-wide">
              Trầm Hương Tâm An
            </h3>
            <p className="text-sm text-white/65 leading-relaxed mb-5">
              Chuyên cung cấp các sản phẩm trầm hương thiên nhiên cao cấp,
              được tuyển chọn và chế tác tỉ mỉ.
            </p>
            {/* Icons mạng xã hội */}
            <div className="flex gap-3">
              {[FiFacebook, FiInstagram, FiYoutube, FiMail].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm hover:bg-[var(--color-gold)] hover:-translate-y-1 transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* ===== CỘT 2: Liên kết nhanh ===== */}
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

          {/* ===== CỘT 3: Giờ mở cửa (tải từ database) ===== */}
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-base font-semibold mb-5">Giờ Mở Cửa</h3>
            <ul className="space-y-2.5">
              {hours.map((h, i) => (
                <li key={i} className="text-sm text-white/65">{h}</li>
              ))}
            </ul>
          </div>

          {/* ===== CỘT 4: Form đăng ký nhận tin (Newsletter) ===== */}
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-base font-semibold mb-5">Nhận Tin Mới</h3>
            <p className="text-sm text-white/65 leading-relaxed mb-4">
              Đăng ký để nhận thông tin mới nhất về sản phẩm và ưu đãi đặc biệt.
            </p>
            {/* Thông báo đăng ký thành công */}
            {subscribed && (
              <div className="text-sm text-[var(--color-primary-100)] mb-3">✓ Cảm ơn bạn đã đăng ký!</div>
            )}
            {/* Form nhập email */}
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
                <FiSend size={16} /> {/* Icon gửi */}
              </button>
            </form>
          </div>
        </div>

        {/* ===== Dòng bản quyền ===== */}
        <div className="py-5 text-center text-xs text-white/40">
          © 2026 Trầm Hương Tâm An. Tất cả quyền được bảo lưu. | Nhóm 2
        </div>
      </div>
    </footer>
  );
}
