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
  const [activeTab, setActiveTab] = useState('branding'); // 'branding', 'contact' hoặc 'hero'
  const [heroImagePreview, setHeroImagePreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async (showLoading = true) => {
    if (showLoading) setLoading(true);
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
      if (showLoading) setLoading(false);
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
      // 1. Luôn upload ảnh nếu có bất kỳ thay đổi nào về ảnh
      if (heroImageFile || logoFile) {
        console.log('📤 Uploading images...');
        const formDataImages = new FormData();
        if (heroImageFile) {
          console.log('  - Adding hero_image:', heroImageFile.name);
          formDataImages.append('hero_image', heroImageFile);
        }
        if (logoFile) {
          console.log('  - Adding logo_image:', logoFile.name);
          formDataImages.append('logo_image', logoFile);
        }
        console.log('  - Sending to API...');
        const uploadRes = await settingAPI.uploadHeroImages(formDataImages);
        console.log('✓ Upload response:', uploadRes);
        
        // Broadcast event để các components khác biết logo đã update
        window.dispatchEvent(new CustomEvent('logoUpdated', { 
          detail: { timestamp: Date.now() } 
        }));
        
        setHeroImageFile(null);
        setLogoFile(null);
      }

      // 2. Lưu text settings dựa theo tab hiện tại
      const settingsToSave = [];
      if (activeTab === 'contact') {
        CONTACT_FIELDS.forEach(f => {
          settingsToSave.push({
            key: f.key,
            value: formData[f.key] || ''
          });
        });
        await settingAPI.bulkUpsert(settingsToSave);
      } else if (activeTab === 'hero') {
        HERO_FIELDS.forEach(f => {
          settingsToSave.push({
            key: f.key,
            value: formData[f.key] || ''
          });
        });
        await settingAPI.bulkUpsert(settingsToSave);
      }

      // 3. Tải lại cài đặt mới nhất từ DB/Cloudinary để hiển thị đúng URL thật
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

      <div className="border-b border-gray-100">
        <div className="flex">
          <button
            onClick={() => setActiveTab('branding')}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'branding'
                ? 'text-[var(--color-primary)] border-[var(--color-primary)]'
                : 'text-gray-600 border-transparent hover:text-gray-800'
            }`}
          >
            Thương hiệu & Logo
          </button>
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
            Nội dung Banner (Hero)
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
        {activeTab === 'branding' && (
          <div className="space-y-8">
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]"></span>
                Logo Website
              </h3>
              <p className="text-xs text-gray-500 mb-6">Logo chính thức hiển thị trên thanh điều hướng (Navbar) và chân trang (Footer).</p>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-5">
                  <div className="relative group">
                    <input type="file" id="logo-image" accept="image/*" onChange={(e) => handleImageChange(e, 'logo')} className="hidden" />
                    <label htmlFor="logo-image" className="block aspect-[4/3] bg-white border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-50)]/30 transition-all shadow-sm">
                      {logoPreview ? (
                        <div className="w-full h-full relative p-4 flex items-center justify-center bg-gray-50">
                          <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center flex-col gap-3 text-gray-400 p-6">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-[var(--color-primary-100)] group-hover:text-[var(--color-primary)] transition-all">
                            <FiImage size={24} />
                          </div>
                          <span className="text-sm font-semibold text-gray-700">Chọn ảnh logo mới</span>
                        </div>
                      )}
                    </label>
                    {logoPreview && (
                      <button type="button" onClick={() => { setLogoPreview(null); setLogoFile(null); document.getElementById('logo-image').value = ''; }} className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-colors z-10">
                        <FiX size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="md:col-span-7 space-y-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Xem trước hiển thị</h4>
                  <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400">Trên thanh Nav:</span>
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-50">
                      <div className="w-8 h-8 flex items-center justify-center">
                        {logoPreview ? <img src={logoPreview} alt="Mockup" className="w-full h-full object-contain" /> : <span className="text-xs text-gray-300">Logo</span>}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-[#1E293B] rounded-xl flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">Trên Footer:</span>
                    <div className="flex items-center gap-2 bg-[#0F172A] px-3 py-1.5 rounded-lg">
                      <div className="w-8 h-8 flex items-center justify-center">
                        {logoPreview ? <img src={logoPreview} alt="Mockup" className="w-full h-full object-contain" /> : <span className="text-xs text-gray-500">Logo</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]"></span>
                Ảnh nền chính (Hero Banner)
              </h3>
              <div className="relative group max-w-2xl">
                <input type="file" id="hero-image" accept="image/*" onChange={(e) => handleImageChange(e, 'hero')} className="hidden" />
                <label htmlFor="hero-image" className="block aspect-video bg-white border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-50)]/30 transition-all shadow-sm">
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
                  <button type="button" onClick={() => { setHeroImagePreview(null); setHeroImageFile(null); document.getElementById('hero-image').value = ''; }} className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-colors z-10">
                    <FiX size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
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
                    <textarea value={formData[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} placeholder={field.placeholder} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 outline-none transition-all resize-y" />
                  ) : (
                    <input type="text" value={formData[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} placeholder={field.placeholder} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 outline-none transition-all" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-4">Nội dung Banner (Hero Section)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {HERO_FIELDS.map((field) => (
                  <div key={field.key} className={field.multiline ? 'md:col-span-2' : ''}>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">{field.label}</label>
                    {field.multiline ? (
                      <textarea value={formData[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} placeholder={field.placeholder} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 outline-none transition-all" />
                    ) : (
                      <input type="text" value={formData[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} placeholder={field.placeholder} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 outline-none transition-all" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-5 bg-gradient-to-br from-[#faf6ed] via-[#f5ede0] to-[#ebdfc8] rounded-xl border border-gray-200">
              <h3 className="text-sm font-bold text-gray-800 mb-4">Xem trước Hero Section</h3>
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="text-center">
                  <p className="text-xs text-[var(--color-gold-dark)] font-semibold uppercase tracking-wider mb-2">{formData.hero_subtitle || '...'}</p>
                  <h1 className="text-2xl font-bold text-[var(--color-primary)]">{formData.hero_title_line1 || '...'}</h1>
                  <p className="text-sm text-gray-600 mt-2">{formData.hero_description || '...'}</p>
                </div>
              </div>
            </div>
          </div>
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
