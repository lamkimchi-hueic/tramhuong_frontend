import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiChevronRight, FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import { settingAPI } from '../services/api';

const defaultContactInfo = [
  { icon: FiMapPin, title: 'Địa chỉ', lines: ['123 Đường Trầm Hương, Quận 1,', 'TP. Hồ Chí Minh'] },
  { icon: FiPhone, title: 'Điện thoại', lines: ['Hotline: 0909 123 456', 'CSKH: 0909 789 012'] },
  { icon: FiMail, title: 'Email', lines: ['info@tramhuongtaman.vn', 'support@tramhuongtaman.vn'] },
  { icon: FiClock, title: 'Giờ làm việc', lines: ['Thứ 2 - Thứ 7: 8:00 - 20:00', 'Chủ nhật: 9:00 - 17:00'] },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [contactInfo, setContactInfo] = useState(defaultContactInfo);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingAPI.getAll();
        const s = res.data;
        if (Object.keys(s).length > 0) {
          setContactInfo([
            { icon: FiMapPin, title: 'Địa chỉ', lines: [s.address || '123 Đường Trầm Hương, Quận 1, TP. Hồ Chí Minh'] },
            { icon: FiPhone, title: 'Điện thoại', lines: [`Hotline: ${s.hotline || '0909 123 456'}`, `CSKH: ${s.phone_cskh || '0909 789 012'}`] },
            { icon: FiMail, title: 'Email', lines: [s.email_main || 'info@tramhuongtaman.vn', s.email_support || 'support@tramhuongtaman.vn'] },
            { icon: FiClock, title: 'Giờ làm việc', lines: [`Thứ 2 - Thứ 7: ${s.hours_weekday || '8:00 - 20:00'}`, `Chủ nhật: ${s.hours_sunday || '9:00 - 17:00'}`] },
          ]);
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin liên hệ:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <main id="contact-page">
      <div className="bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] pt-36 pb-16 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-white mb-3">Liên Hệ</h1>
          <p className="text-white/70">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-white/50">
            <Link to="/" className="text-white/70 hover:text-[var(--color-gold-light)]"><FiHome size={14} /></Link>
            <FiChevronRight size={12} />
            <span>Liên Hệ</span>
          </div>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info Cards */}
            <div className="flex flex-col gap-5">
              {contactInfo.map((info, idx) => {
                const Icon = info.icon;
                return (
                  <div
                    key={idx}
                    className="flex gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md hover:translate-x-1 transition-all duration-300"
                  >
                    <div className="w-12 h-12 min-w-[48px] rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary)] flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{info.title}</h3>
                      {info.lines.map((line, i) => (
                        <p key={i} className="text-sm text-gray-500">{line}</p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Form */}
            <div className="bg-white p-10 rounded-2xl shadow-md">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--color-primary)] mb-6">
                Gửi Tin Nhắn
              </h2>

              {submitted && (
                <div className="bg-[var(--color-primary-50)] text-[var(--color-primary)] px-4 py-3 rounded-lg text-sm text-center mb-4">
                  ✓ Cảm ơn bạn! Chúng tôi sẽ phản hồi sớm nhất.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {['name', 'email', 'subject'].map((field) => (
                  <div key={field} className="mb-4">
                    <label htmlFor={`contact-${field}`} className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {field === 'name' ? 'Họ và tên' : field === 'email' ? 'Email' : 'Chủ đề'}
                    </label>
                    <input
                      id={`contact-${field}`}
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      placeholder={`Nhập ${field === 'name' ? 'họ và tên' : field === 'email' ? 'email' : 'chủ đề'}`}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 focus:bg-white outline-none transition-all"
                    />
                  </div>
                ))}
                <div className="mb-4">
                  <label htmlFor="contact-message" className="block text-sm font-semibold text-gray-700 mb-1.5">Nội dung</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Nhập nội dung tin nhắn..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 focus:bg-white outline-none transition-all resize-y"
                  />
                </div>
                <button
                  type="submit"
                  id="contact-submit"
                  className="w-full py-3.5 bg-[var(--color-primary)] text-white font-semibold text-sm uppercase tracking-wide rounded-lg hover:bg-[var(--color-primary-dark)] transition-all duration-300"
                >
                  Gửi Tin Nhắn
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
