import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiChevronRight } from 'react-icons/fi';
import { settingAPI, resolveImageUrl } from '../services/api';

const DEFAULT_VALUES = [
  { emoji: '🌿', title: 'Thiên Nhiên Thuần Khiết', desc: '100% trầm hương tự nhiên, không pha tạp. Nguyên liệu được tuyển chọn từ các vùng trầm hương nổi tiếng.' },
  { emoji: '✨', title: 'Chất Lượng Cao Cấp', desc: 'Mỗi sản phẩm đều trải qua quy trình kiểm tra nghiêm ngặt, đảm bảo chất lượng tốt nhất.' },
  { emoji: '🤝', title: 'Tận Tâm Phục Vụ', desc: 'Đội ngũ tư vấn chuyên nghiệp, sẵn sàng hỗ trợ khách hàng 24/7 với dịch vụ hậu mãi chu đáo.' },
];

export default function AboutPage() {
  const [activeValue, setActiveValue] = useState(null);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingAPI.getAll();
        setSettings(res.data || {});
      } catch (error) {
        console.error('Lỗi khi tải cài đặt:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Lấy dữ liệu từ settings với fallback mặc định
  const aboutTitle = settings.about_title || 'Tinh Hoa Trầm Hương Việt Nam';
  const aboutP1 = settings.about_p1 || 'Trầm Hương Tâm An được thành lập với mong muốn mang đến những sản phẩm trầm hương thiên nhiên chất lượng cao nhất cho người tiêu dùng Việt Nam.';
  const aboutP2 = settings.about_p2 || 'Với đội ngũ nghệ nhân giàu kinh nghiệm, chúng tôi cam kết mỗi sản phẩm đều được chế tác tỉ mỉ, từ khâu chọn nguyên liệu đến thành phẩm cuối cùng.';
  const aboutP3 = settings.about_p3 || 'Không chỉ là sản phẩm, mỗi tác phẩm trầm hương của chúng tôi còn mang theo giá trị văn hóa và tâm linh sâu sắc của người Việt.';
  
  const aboutImageUrl = settings.about_image_url
    ? resolveImageUrl(settings.about_image_url)
    : 'https://res.cloudinary.com/dcywlpxwi/image/upload/v1778780029/tramhuong/assets/about_process.jpg';

  const processTitle = settings.process_title || 'Quy Trình Chế Tác';
  const processDesc = settings.process_description || 'Từ việc lựa chọn nguyên liệu thô đến sản phẩm hoàn thiện, mỗi bước trong quy trình đều được thực hiện cẩn thận bởi các nghệ nhân có tay nghề cao.\n\nChúng tôi kết hợp giữa phương pháp truyền thống và công nghệ hiện đại, tạo nên những sản phẩm vừa giữ được nét đẹp truyền thống vừa phù hợp với phong cách sống hiện đại.';
  
  const processImageUrl = settings.process_image_url
    ? resolveImageUrl(settings.process_image_url)
    : 'https://res.cloudinary.com/dcywlpxwi/image/upload/v1778780032/tramhuong/assets/blog_lifestyle.jpg';

  return (
    <main id="about-page">
      {/* Header */}
      <div className="bg-[var(--color-primary)] pt-36 pb-16 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-white mb-3">Về Chúng Tôi</h1>
          <p className="text-white/70">Câu chuyện và sứ mệnh của Trầm Hương Tâm An</p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-white/50">
            <Link to="/" className="text-white/70 hover:text-[var(--color-gold-light)]"><FiHome size={14} /></Link>
            <FiChevronRight size={12} />
            <span>Về Chúng Tôi</span>
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden">
              <img src={aboutImageUrl} alt="Nghệ nhân chế tác" loading="lazy" className="w-full h-[450px] object-cover" />
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-5 leading-tight">
                {aboutTitle}
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                {aboutP1}
              </p>
              <p className="text-gray-500 leading-relaxed mb-4">
                {aboutP2}
              </p>
              <p className="text-gray-500 leading-relaxed">
                {aboutP3}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-[var(--color-cream)]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-[var(--color-primary)] text-center mb-4">
            Giá Trị Cốt Lõi
          </h2>
          <div className="w-16 h-[3px] bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] mx-auto rounded-full mb-3" />
          <p className="text-gray-500 text-center mb-12 max-w-lg mx-auto">
            Những giá trị chúng tôi theo đuổi trong mỗi sản phẩm
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DEFAULT_VALUES.map((v, idx) => (
              <div
                key={idx}
                onClick={() => setActiveValue(activeValue === idx ? null : idx)}
                className={`bg-white rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  activeValue === idx
                    ? '-translate-y-2 shadow-xl ring-2 ring-[var(--color-primary)]/20'
                    : 'hover:-translate-y-1 hover:shadow-lg'
                }`}
              >
                <div className="text-4xl mb-4">{v.emoji}</div>
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[var(--color-primary)] mb-3">
                  {v.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-5 leading-tight">
                {processTitle}
              </h2>
              {processDesc.split('\n\n').map((para, idx) => (
                <p key={idx} className="text-gray-500 leading-relaxed mb-6">
                  {para}
                </p>
              ))}
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[var(--color-primary)] text-white font-semibold text-sm uppercase tracking-wide rounded-md hover:bg-[var(--color-primary-dark)] hover:-translate-y-0.5 transition-all duration-300"
              >
                Xem Sản Phẩm
              </Link>
            </div>
            <div className="order-1 lg:order-2 rounded-2xl overflow-hidden">
              <img src={processImageUrl} alt="Không gian trầm hương" loading="lazy" className="w-full h-[450px] object-cover" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
