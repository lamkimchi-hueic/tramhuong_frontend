import { useState, useEffect } from 'react';
import { settingAPI, resolveImageUrl } from '../../services/api';
import { FiSave, FiMapPin, FiPhone, FiMail, FiClock, FiImage, FiX, FiPlus, FiTrash2, FiStar } from 'react-icons/fi';

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
  { key: 'hero_subtitle', label: 'Slogan phụ', placeholder: 'Tinh Hoa Trầm Hương Việt' },
  { key: 'hero_title_line1', label: 'Tiêu đề dòng 1', placeholder: 'Khám Phá Vẻ Đẹp' },
  { key: 'hero_title_line2', label: 'Tiêu đề dòng 2', placeholder: 'Tinh Khôi Của' },
  { key: 'hero_title_highlight', label: 'Tiêu đề highlight', placeholder: 'Trầm Hương Tâm An' },
  { key: 'hero_description', label: 'Mô tả ngắn', placeholder: 'Mang đến những sản phẩm trầm hương...', multiline: true },
  { key: 'hero_stat1_label', label: 'Nhãn thống kê 1', placeholder: 'Năm kinh nghiệm' },
  { key: 'hero_stat1_value', label: 'Giá trị thống kê 1', placeholder: '10+' },
  { key: 'hero_stat2_label', label: 'Nhãn thống kê 2', placeholder: 'Khách hàng' },
  { key: 'hero_stat2_value', label: 'Giá trị thống kê 2', placeholder: '5K+' },
  { key: 'hero_stat3_label', label: 'Nhãn thống kê 3', placeholder: 'Thiên nhiên' },
  { key: 'hero_stat3_value', label: 'Giá trị thống kê 3', placeholder: '100%' },
];

const BLOG_FIELDS = [
  { key: 'blog_title', label: 'Tiêu đề (dùng \\n để xuống dòng)', placeholder: 'Trầm Hương &\nCuộc Sống Tươi Mới', multiline: true },
  { key: 'blog_paragraph1', label: 'Đoạn văn 1', placeholder: 'Trầm hương từ xưa đã được coi là báu vật...', multiline: true },
  { key: 'blog_paragraph2', label: 'Đoạn văn 2', placeholder: 'Với hương thơm dịu nhẹ...', multiline: true },
  { key: 'blog_image_url', label: 'URL hình ảnh', placeholder: 'https://...' },
  { key: 'blog_feature1_title', label: 'Tính năng 1 — Tiêu đề', placeholder: 'Tinh thần sảng khoái' },
  { key: 'blog_feature1_desc', label: 'Tính năng 1 — Mô tả', placeholder: 'Trầm hương giúp tĩnh tâm...' },
  { key: 'blog_feature2_title', label: 'Tính năng 2 — Tiêu đề', placeholder: 'Sức khỏe cải thiện' },
  { key: 'blog_feature2_desc', label: 'Tính năng 2 — Mô tả', placeholder: 'Hỗ trợ giấc ngủ sâu...' },
  { key: 'blog_feature3_title', label: 'Tính năng 3 — Tiêu đề', placeholder: 'Trầm hương' },
  { key: 'blog_feature3_desc', label: 'Tính năng 3 — Mô tả', placeholder: 'Hương thơm tự nhiên...' },
  { key: 'blog_feature4_title', label: 'Tính năng 4 — Tiêu đề', placeholder: 'Phong vị riêng' },
  { key: 'blog_feature4_desc', label: 'Tính năng 4 — Mô tả', placeholder: 'Mỗi sản phẩm mang hương thơm...' },
];

const DEFAULT_TESTIMONIALS = [
  { name: 'Nguyễn Minh Anh', text: 'Mình rất hài lòng với sản phẩm vòng tay trầm hương...', rating: 5 },
  { name: 'Trần Văn Hùng', text: 'Bộ quà tặng trầm hương rất sang trọng...', rating: 5 },
  { name: 'Lê Thu Hương', text: 'Trầm hương tự nhiên chất lượng tuyệt vời...', rating: 5 },
];

const TABS = [
  { id: 'branding', label: 'Thương hiệu' },
  { id: 'contact', label: 'Liên hệ' },
  { id: 'hero', label: 'Banner' },
  { id: 'blog', label: 'Giới thiệu' },
  { id: 'testimonials', label: 'Đánh giá KH' },
];

// ===== Shared input styles =====
const inputCls = 'w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 outline-none transition-all';

export default function AdminSettings() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('branding');
  const [heroImagePreview, setHeroImagePreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  // Testimonials — mảng các object { name, text, rating }
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await settingAPI.getAll();
      setFormData(res.data);
      if (res.data.hero_image_url) setHeroImagePreview(resolveImageUrl(res.data.hero_image_url));
      if (res.data.logo_url) setLogoPreview(resolveImageUrl(res.data.logo_url));
      // Parse testimonials từ JSON
      if (res.data.testimonials_data) {
        try {
          const parsed = JSON.parse(res.data.testimonials_data);
          if (Array.isArray(parsed) && parsed.length > 0) setTestimonials(parsed);
        } catch (e) { /* giữ default */ }
      }
    } catch (error) {
      console.error('Lỗi khi tải cài đặt:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleChange = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleImageChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    if (type === 'hero') {
      setHeroImageFile(file);
      reader.onload = (ev) => setHeroImagePreview(ev.target.result);
    } else {
      setLogoFile(file);
      reader.onload = (ev) => setLogoPreview(ev.target.result);
    }
    reader.readAsDataURL(file);
  };

  // ===== Testimonial helpers =====
  const updateTestimonial = (idx, field, value) => {
    setTestimonials(prev => prev.map((t, i) => i === idx ? { ...t, [field]: value } : t));
  };
  const addTestimonial = () => {
    setTestimonials(prev => [...prev, { name: '', text: '', rating: 5 }]);
  };
  const removeTestimonial = (idx) => {
    setTestimonials(prev => prev.filter((_, i) => i !== idx));
  };

  // ===== SAVE =====
  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      // Upload images nếu có
      if (heroImageFile || logoFile) {
        const fd = new FormData();
        if (heroImageFile) fd.append('hero_image', heroImageFile);
        if (logoFile) fd.append('logo_image', logoFile);
        await settingAPI.uploadHeroImages(fd);
        window.dispatchEvent(new CustomEvent('logoUpdated', { detail: { timestamp: Date.now() } }));
        setHeroImageFile(null);
        setLogoFile(null);
      }

      // Save text settings theo tab
      const settingsToSave = [];
      if (activeTab === 'contact') {
        CONTACT_FIELDS.forEach(f => settingsToSave.push({ key: f.key, value: formData[f.key] || '' }));
      } else if (activeTab === 'hero') {
        HERO_FIELDS.forEach(f => settingsToSave.push({ key: f.key, value: formData[f.key] || '' }));
      } else if (activeTab === 'blog') {
        BLOG_FIELDS.forEach(f => settingsToSave.push({ key: f.key, value: formData[f.key] || '' }));
      } else if (activeTab === 'testimonials') {
        settingsToSave.push({ key: 'testimonials_data', value: JSON.stringify(testimonials) });
      }

      if (settingsToSave.length > 0) {
        await settingAPI.bulkUpsert(settingsToSave);
      }

      await fetchSettings(false);
      setMessage('Lưu cài đặt thành công!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('❌ Error saving:', error);
      setMessage('Có lỗi xảy ra khi lưu: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Cài đặt Website</h2>
        <button onClick={handleSave} disabled={saving}
          className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg flex items-center gap-2 hover:bg-[var(--color-primary-dark)] transition-colors text-sm font-semibold disabled:opacity-50">
          <FiSave size={16} /> {saving ? 'Đang lưu...' : 'Lưu tất cả'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-100">
        <div className="flex overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[100px] px-4 py-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-[var(--color-primary)] border-[var(--color-primary)]'
                  : 'text-gray-600 border-transparent hover:text-gray-800'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`mx-6 mt-4 px-4 py-3 rounded-lg text-sm font-medium ${
          message.includes('lỗi') ? 'bg-red-50 text-red-600' : 'bg-[var(--color-primary-50)] text-[var(--color-primary)]'
        }`}>{message}</div>
      )}

      <div className="p-6">
        {/* ===== TAB: Branding ===== */}
        {activeTab === 'branding' && (
          <div className="space-y-8">
            {/* Logo */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]"></span> Logo Website
              </h3>
              <p className="text-xs text-gray-500 mb-6">Logo hiển thị trên Navbar và Footer.</p>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-5">
                  <div className="relative group">
                    <input type="file" id="logo-image" accept="image/*" onChange={(e) => handleImageChange(e, 'logo')} className="hidden" />
                    <label htmlFor="logo-image" className="block aspect-[4/3] bg-white border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:border-[var(--color-primary)] transition-all shadow-sm">
                      {logoPreview ? (
                        <div className="w-full h-full relative p-4 flex items-center justify-center bg-gray-50">
                          <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center flex-col gap-3 text-gray-400 p-6">
                          <FiImage size={24} />
                          <span className="text-sm font-semibold text-gray-700">Chọn ảnh logo mới</span>
                        </div>
                      )}
                    </label>
                    {logoPreview && (
                      <button type="button" onClick={() => { setLogoPreview(null); setLogoFile(null); }} className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-colors z-10">
                        <FiX size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="md:col-span-7 space-y-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Xem trước</h4>
                  <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400">Nav:</span>
                    <div className="w-8 h-8 flex items-center justify-center">
                      {logoPreview ? <img src={logoPreview} alt="Mockup" className="w-full h-full object-contain" /> : <span className="text-xs text-gray-300">Logo</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Hero image */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]"></span> Ảnh nền chính (Hero)
              </h3>
              <div className="relative group max-w-2xl">
                <input type="file" id="hero-image" accept="image/*" onChange={(e) => handleImageChange(e, 'hero')} className="hidden" />
                <label htmlFor="hero-image" className="block aspect-video bg-white border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:border-[var(--color-primary)] transition-all shadow-sm">
                  {heroImagePreview ? (
                    <img src={heroImagePreview} alt="Hero preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center flex-col gap-3 text-gray-400 p-6">
                      <FiImage size={24} />
                      <span className="text-sm font-semibold text-gray-700">Chọn ảnh hero banner</span>
                    </div>
                  )}
                </label>
                {heroImagePreview && (
                  <button type="button" onClick={() => { setHeroImagePreview(null); setHeroImageFile(null); }} className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-colors z-10">
                    <FiX size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== TAB: Contact ===== */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CONTACT_FIELDS.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.key} className={field.multiline ? 'md:col-span-2' : ''}>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Icon size={16} className="text-[var(--color-primary)]" /> {field.label}
                  </label>
                  {field.multiline ? (
                    <textarea value={formData[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} placeholder={field.placeholder} rows={3} className={inputCls + ' resize-y'} />
                  ) : (
                    <input type="text" value={formData[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} placeholder={field.placeholder} className={inputCls} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ===== TAB: Hero ===== */}
        {activeTab === 'hero' && (
          <div className="space-y-8">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Nội dung Banner (Hero Section)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {HERO_FIELDS.map((field) => (
                <div key={field.key} className={field.multiline ? 'md:col-span-2' : ''}>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">{field.label}</label>
                  {field.multiline ? (
                    <textarea value={formData[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} placeholder={field.placeholder} rows={3} className={inputCls} />
                  ) : (
                    <input type="text" value={formData[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} placeholder={field.placeholder} className={inputCls} />
                  )}
                </div>
              ))}
            </div>
            {/* Preview */}
            <div className="p-5 bg-gradient-to-br from-[#faf6ed] via-[#f5ede0] to-[#ebdfc8] rounded-xl border border-gray-200">
              <h3 className="text-sm font-bold text-gray-800 mb-4">Xem trước Hero Section</h3>
              <div className="bg-white rounded-lg p-6 text-center space-y-2">
                <p className="text-xs text-[var(--color-gold-dark)] font-semibold uppercase tracking-wider">{formData.hero_subtitle || '...'}</p>
                <h1 className="text-2xl font-bold text-[var(--color-primary)]">{formData.hero_title_line1 || '...'}</h1>
                <p className="text-sm text-gray-600">{formData.hero_description || '...'}</p>
              </div>
            </div>
          </div>
        )}

        {/* ===== TAB: Blog / Giới thiệu ===== */}
        {activeTab === 'blog' && (
          <div className="space-y-8">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Nội dung phần "Trầm Hương & Cuộc Sống Tươi Mới"</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {BLOG_FIELDS.map((field) => (
                <div key={field.key} className={field.multiline ? 'md:col-span-2' : ''}>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">{field.label}</label>
                  {field.multiline ? (
                    <textarea value={formData[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} placeholder={field.placeholder} rows={3} className={inputCls + ' resize-y'} />
                  ) : (
                    <input type="text" value={formData[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} placeholder={field.placeholder} className={inputCls} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== TAB: Testimonials ===== */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700">Đánh giá khách hàng</h3>
              <button onClick={addTestimonial}
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors">
                <FiPlus size={16} /> Thêm đánh giá
              </button>
            </div>

            {testimonials.map((t, idx) => (
              <div key={idx} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-800">Đánh giá #{idx + 1}</h4>
                  {testimonials.length > 1 && (
                    <button onClick={() => removeTestimonial(idx)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Tên khách hàng</label>
                    <input type="text" value={t.name} onChange={(e) => updateTestimonial(idx, 'name', e.target.value)} placeholder="Nguyễn Văn A" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Số sao (1-5)</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} type="button" onClick={() => updateTestimonial(idx, 'rating', star)}
                          className="p-1 transition-transform hover:scale-110">
                          <FiStar size={20} fill={star <= t.rating ? '#C4A35A' : 'none'} stroke={star <= t.rating ? '#C4A35A' : '#d1d5db'} />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-500">{t.rating}/5</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Nội dung đánh giá</label>
                  <textarea value={t.text} onChange={(e) => updateTestimonial(idx, 'text', e.target.value)} placeholder="Mình rất hài lòng với sản phẩm..." rows={3} className={inputCls + ' resize-y'} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
