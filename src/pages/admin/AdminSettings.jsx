import { useState, useEffect } from 'react';
import { settingAPI, resolveImageUrl } from '../../services/api';
import { FiSave, FiMapPin, FiPhone, FiMail, FiClock, FiImage, FiX } from 'react-icons/fi';

const CONTACT_FIELDS = [
  { key: 'address', label: 'Địa chỉ', icon: FiMapPin, placeholder: '123 Đường Trầm Hương, Quận 1, TP. Hồ Chí Minh', multiline: true },
  { key: 'hotline', label: 'Hotline', icon: FiPhone, placeholder: '0909 123 456' },
  { key: 'phone_cskh', label: 'Số CSKH', icon: FiPhone, placeholder: '0909 789 012' },
  { key: 'email_main', label: 'Email chính', icon: FiMail, placeholder: 'info@tramhuongtaman.vn' },
  { key: 'email_support', label: 'Email hỗ trợ', icon: FiMail, placeholder: 'support@tramhuongtaman.vn' },
  { key: 'hours_weekday', label: 'Giờ làm việc (Thứ 2 - Thứ 7)', icon: FiClock, placeholder: '8:00 - 20:00' },
  { key: 'hours_sunday', label: 'Giờ làm việc (Chủ nhật)', icon: FiClock, placeholder: '9:00 - 17:00' },
];

const HERO_FIELDS = [
  { key: 'hero_subtitle', label: 'Slogan phụ', placeholder: 'Tinh Hoa Trầm Hương Việt', multiline: false },
  { key: 'hero_title_line1', label: 'Tiêu đề dòng 1', placeholder: 'Khám Phá Vẻ Đẹp', multiline: false },
  { key: 'hero_title_line2', label: 'Tiêu đề dòng 2', placeholder: 'Tinh Khôi Của', multiline: false },
  { key: 'hero_title_highlight', label: 'Tiêu đề highlight', placeholder: 'Trầm Hương Tâm An', multiline: false },
  { key: 'hero_description', label: 'Mô tả ngắn', placeholder: 'Mang đến những sản phẩm trầm hương thiên nhiên cao cấp nhất...', multiline: true },
  { key: 'hero_stat1_label', label: 'Nhãn thống kê 1', placeholder: 'Năm kinh nghiệm', multiline: false },
  { key: 'hero_stat1_value', label: 'Giá trị thống kê 1', placeholder: '10+', multiline: false },
  { key: 'hero_stat2_label', label: 'Nhãn thống kê 2', placeholder: 'Khách hàng', multiline: false },
  { key: 'hero_stat2_value', label: 'Giá trị thống kê 2', placeholder: '5K+', multiline: false },
  { key: 'hero_stat3_label', label: 'Nhãn thống kê 3', placeholder: 'Thiên nhiên', multiline: false },
  { key: 'hero_stat3_value', label: 'Giá trị thống kê 3', placeholder: '100%', multiline: false },
];

export default function AdminSettings() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('contact'); // 'contact' hoặc 'hero'
  const [heroImagePreview, setHeroImagePreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await settingAPI.getAll();
      setFormData(res.data);
      // Set preview ảnh từ URL lưu trữ
      if (res.data.hero_image_url) {
        setHeroImagePreview(resolveImageUrl(res.data.hero_image_url));
      }
      if (res.data.logo_url) {
        setLogoPreview(resolveImageUrl(res.data.logo_url));
      }
    } catch (error) {
      console.error('Lỗi khi tải cài đặt:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'hero') {
        setHeroImageFile(file);
        const reader = new FileReader();
        reader.onload = (event) => setHeroImagePreview(event.target.result);
        reader.readAsDataURL(file);
      } else if (type === 'logo') {
        setLogoFile(file);
        const reader = new FileReader();
        reader.onload = (event) => setLogoPreview(event.target.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const settingsToSave = [];

      if (activeTab === 'contact') {
        // Lưu contact fields
        CONTACT_FIELDS.forEach(f => {
          settingsToSave.push({
            key: f.key,
            value: formData[f.key] || ''
          });
        });
      } else if (activeTab === 'hero') {
        // Lưu hero text fields
        HERO_FIELDS.forEach(f => {
          settingsToSave.push({
            key: f.key,
            value: formData[f.key] || ''
          });
        });

        // Nếu có upload ảnh hero hoặc logo, gửi FormData
        if (heroImageFile || logoFile) {
          const formDataImages = new FormData();
          if (heroImageFile) {
            formDataImages.append('hero_image', heroImageFile);
            settingsToSave.push({
              key: 'hero_image_url',
              value: 'pending_upload' // Placeholder
            });
          }
          if (logoFile) {
            formDataImages.append('logo_image', logoFile);
            settingsToSave.push({
              key: 'logo_url',
              value: 'pending_upload'
            });
          }
          
          // Upload ảnh qua endpoint riêng (sẽ tạo)
          await settingAPI.uploadHeroImages(formDataImages);
          
          setHeroImageFile(null);
          setLogoFile(null);
        }
      }

      await settingAPI.bulkUpsert(settingsToSave);
      setMessage('Lưu cài đặt thành công!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Có lỗi xảy ra khi lưu: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Cài đặt Website</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg flex items-center gap-2 hover:bg-[var(--color-primary-dark)] transition-colors text-sm font-semibold disabled:opacity-50"
        >
          <FiSave size={16} /> {saving ? 'Đang lưu...' : 'Lưu tất cả'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-100">
        <div className="flex">
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'contact'
                ? 'text-[var(--color-primary)] border-[var(--color-primary)]'
                : 'text-gray-600 border-transparent hover:text-gray-800'
            }`}
          >
            Thông tin Liên hệ
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'hero'
                ? 'text-[var(--color-primary)] border-[var(--color-primary)]'
                : 'text-gray-600 border-transparent hover:text-gray-800'
            }`}
          >
            Hero Section
          </button>
        </div>
      </div>

      {message && (
        <div className={`mx-6 mt-4 px-4 py-3 rounded-lg text-sm font-medium ${
          message.includes('lỗi') ? 'bg-red-50 text-red-600' : 'bg-[var(--color-primary-50)] text-[var(--color-primary)]'
        }`}>
          {message}
        </div>
      )}

      <div className="p-6">
        {activeTab === 'contact' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CONTACT_FIELDS.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.key} className={field.multiline ? 'md:col-span-2' : ''}>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Icon size={16} className="text-[var(--color-primary)]" />
                      {field.label}
                    </label>
                    {field.multiline ? (
                      <textarea
                        value={formData[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 focus:bg-white outline-none transition-all resize-y"
                      />
                    ) : (
                      <input
                        type="text"
                        value={formData[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 focus:bg-white outline-none transition-all"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-5 bg-gray-50 rounded-xl">
              <h3 className="text-sm font-bold text-gray-700 mb-3">Xem trước</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PreviewCard icon={FiMapPin} title="Địa chỉ" lines={[formData.address || '(chưa có)']} />
                <PreviewCard icon={FiPhone} title="Điện thoại" lines={[
                  `Hotline: ${formData.hotline || '(chưa có)'}`,
                  `CSKH: ${formData.phone_cskh || '(chưa có)'}`
                ]} />
                <PreviewCard icon={FiMail} title="Email" lines={[
                  formData.email_main || '(chưa có)',
                  formData.email_support || '(chưa có)'
                ]} />
                <PreviewCard icon={FiClock} title="Giờ làm việc" lines={[
                  `Thứ 2 - Thứ 7: ${formData.hours_weekday || '(chưa có)'}`,
                  `Chủ nhật: ${formData.hours_sunday || '(chưa có)'}`
                ]} />
              </div>
            </div>
          </>
        )}

        {activeTab === 'hero' && (
          <>
            {/* Hero Images Section */}
            <div className="mb-8 p-5 bg-gray-50 rounded-xl">
              <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <FiImage size={16} className="text-[var(--color-primary)]" />
                Hình ảnh Hero
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hero Main Image */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Ảnh Hero (Ảnh chính bên phải)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="hero-image"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'hero')}
                      className="hidden"
                    />
                    <label
                      htmlFor="hero-image"
                      className="block aspect-video bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-50)] transition-all"
                    >
                      {heroImagePreview ? (
                        <img src={heroImagePreview} alt="Hero preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center flex-col gap-2 text-gray-400">
                          <FiImage size={32} />
                          <span className="text-sm">Chọn ảnh hero</span>
                        </div>
                      )}
                    </label>
                    {heroImagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setHeroImagePreview(null);
                          setHeroImageFile(null);
                          document.getElementById('hero-image').value = '';
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <FiX size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Logo */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Logo (Ảnh phía trên)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="logo-image"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'logo')}
                      className="hidden"
                    />
                    <label
                      htmlFor="logo-image"
                      className="block aspect-video bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-50)] transition-all"
                    >
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center flex-col gap-2 text-gray-400">
                          <FiImage size={32} />
                          <span className="text-sm">Chọn ảnh logo</span>
                        </div>
                      )}
                    </label>
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setLogoPreview(null);
                          setLogoFile(null);
                          document.getElementById('logo-image').value = '';
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <FiX size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Text Content */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-700 mb-4">Nội dung Hero</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {HERO_FIELDS.map((field) => (
                  <div key={field.key} className={field.multiline ? 'md:col-span-2' : ''}>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      {field.label}
                    </label>
                    {field.multiline ? (
                      <textarea
                        value={formData[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 focus:bg-white outline-none transition-all resize-y"
                      />
                    ) : (
                      <input
                        type="text"
                        value={formData[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 focus:bg-white outline-none transition-all"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Preview */}
            <div className="p-5 bg-gradient-to-br from-[#faf6ed] via-[#f5ede0] to-[#ebdfc8] rounded-xl border border-gray-200">
              <h3 className="text-sm font-bold text-gray-800 mb-4">Xem trước Hero Section</h3>
              
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="text-center">
                  <p className="text-xs text-[var(--color-gold-dark)] font-semibold uppercase tracking-wider mb-2">
                    {formData.hero_subtitle || 'Tinh Hoa Trầm Hương Việt'}
                  </p>
                  <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-3">
                    {formData.hero_title_line1 || 'Khám Phá Vẻ Đẹp'}<br />
                    {formData.hero_title_line2 || 'Tinh Khôi Của'}<br />
                    <span className="text-[var(--color-gold-dark)]">
                      {formData.hero_title_highlight || 'Trầm Hương Tâm An'}
                    </span>
                  </h1>
                  <p className="text-sm text-gray-600 mb-4 max-w-lg mx-auto">
                    {formData.hero_description || 'Mang đến những sản phẩm trầm hương thiên nhiên cao cấp nhất...'}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="text-center">
                      <div className="text-lg font-bold text-[var(--color-primary)]">
                        {formData[`hero_stat${i}_value`] || '0'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formData[`hero_stat${i}_label`] || 'Thống kê'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PreviewCard({ icon: Icon, title, lines }) {
  return (
    <div className="flex gap-3 p-4 bg-white rounded-lg border border-gray-100">
      <div className="w-10 h-10 min-w-[40px] rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary)] flex items-center justify-center">
        <Icon size={18} />
      </div>
      <div>
        <h4 className="font-semibold text-gray-800 text-sm mb-0.5">{title}</h4>
        {lines.map((line, i) => (
          <p key={i} className="text-xs text-gray-500">{line}</p>
        ))}
      </div>
    </div>
  );
}
