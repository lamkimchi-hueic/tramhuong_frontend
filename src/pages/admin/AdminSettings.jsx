import { useState, useEffect } from 'react';
import { settingAPI } from '../../services/api';
import { FiSave, FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';

const SETTING_FIELDS = [
  { key: 'address', label: 'Địa chỉ', icon: FiMapPin, placeholder: '123 Đường Trầm Hương, Quận 1, TP. Hồ Chí Minh', multiline: true },
  { key: 'hotline', label: 'Hotline', icon: FiPhone, placeholder: '0909 123 456' },
  { key: 'phone_cskh', label: 'Số CSKH', icon: FiPhone, placeholder: '0909 789 012' },
  { key: 'email_main', label: 'Email chính', icon: FiMail, placeholder: 'info@tramhuongtaman.vn' },
  { key: 'email_support', label: 'Email hỗ trợ', icon: FiMail, placeholder: 'support@tramhuongtaman.vn' },
  { key: 'hours_weekday', label: 'Giờ làm việc (Thứ 2 - Thứ 7)', icon: FiClock, placeholder: '8:00 - 20:00' },
  { key: 'hours_sunday', label: 'Giờ làm việc (Chủ nhật)', icon: FiClock, placeholder: '9:00 - 17:00' },
];

export default function AdminSettings() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await settingAPI.getAll();
      setFormData(res.data);
    } catch (error) {
      console.error('Lỗi khi tải cài đặt:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const settings = SETTING_FIELDS.map(f => ({
        key: f.key,
        value: formData[f.key] || ''
      }));
      await settingAPI.bulkUpsert(settings);
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
        <h2 className="text-xl font-bold text-gray-800">Cài đặt Thông tin Liên hệ</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg flex items-center gap-2 hover:bg-[var(--color-primary-dark)] transition-colors text-sm font-semibold disabled:opacity-50"
        >
          <FiSave size={16} /> {saving ? 'Đang lưu...' : 'Lưu tất cả'}
        </button>
      </div>

      {message && (
        <div className={`mx-6 mt-4 px-4 py-3 rounded-lg text-sm font-medium ${
          message.includes('lỗi') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          {message}
        </div>
      )}

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SETTING_FIELDS.map((field) => {
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
