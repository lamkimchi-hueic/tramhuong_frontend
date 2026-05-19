import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { settingAPI, resolveImageUrl } from '../services/api';

const defaultHeroImage = 'https://res.cloudinary.com/dcywlpxwi/image/upload/v1778780041/tramhuong/assets/thac.jpg';
const altImage = 'https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&w=1200&q=85';

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetchSettings();
    setLoaded(true);
  }, []);

  // Lắng nghe event logo/hero update từ admin
  useEffect(() => {
    const handleHeroUpdate = () => {
      console.log('📢 Hero/Logo updated event received, refetching...');
      fetchSettings();
    };

    window.addEventListener('logoUpdated', handleHeroUpdate);
    return () => window.removeEventListener('logoUpdated', handleHeroUpdate);
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await settingAPI.getAll();
      setSettings(res.data || {});
    } catch (error) {
      console.error('Lỗi khi tải hero settings:', error);
    }
  };

  // Get values from settings or use defaults
  const heroImage = settings.hero_image_url 
    ? resolveImageUrl(settings.hero_image_url)
    : defaultHeroImage;
  const heroSubtitle = settings.hero_subtitle || 'Tinh Hoa Trầm Hương Việt';
  const heroTitleLine1 = settings.hero_title_line1 || 'Khám Phá Vẻ Đẹp';
  const heroTitleLine2 = settings.hero_title_line2 || 'Tinh Khôi Của';
  const heroTitleHighlight = settings.hero_title_highlight || 'Trầm Hương Tâm An';
  const heroDescription = settings.hero_description || 'Mang đến những sản phẩm trầm hương thiên nhiên cao cấp nhất, chế tác tỉ mỉ từ bàn tay nghệ nhân lành nghề.';
  
  const stat1Value = settings.hero_stat1_value || '10+';
  const stat1Label = settings.hero_stat1_label || 'Năm kinh nghiệm';
  const stat2Value = settings.hero_stat2_value || '5K+';
  const stat2Label = settings.hero_stat2_label || 'Khách hàng';
  const stat3Value = settings.hero_stat3_value || '100%';
  const stat3Label = settings.hero_stat3_label || 'Thiên nhiên';

  return (
    <section
      id="hero-section"
      className="relative min-h-0 lg:min-h-[640px] lg:h-screen lg:max-h-[900px] flex items-center overflow-hidden bg-gradient-to-br from-[#faf6ed] via-[#f5ede0] to-[#ebdfc8] pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-12 lg:pb-0"
    >
      {/* Decorative blobs */}
      <div className="absolute top-20 -left-20 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-[var(--color-gold)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/3 w-56 sm:w-72 md:w-96 h-56 sm:h-72 md:h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-[2] max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 lg:px-16 py-6 sm:py-8 md:py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
        {/* LEFT: Text content */}
        <div
          className={`text-center lg:text-left transition-all duration-1000 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-white/70 backdrop-blur border border-[var(--color-gold)]/40 rounded-full text-[var(--color-gold-dark)] text-[10px] sm:text-xs font-semibold tracking-[1.5px] sm:tracking-[2px] uppercase mb-4 sm:mb-6 shadow-sm transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            {heroSubtitle}
          </span>

          <h1 className={`font-[family-name:var(--font-heading)] text-[1.6rem] sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--color-primary)] leading-[1.2] sm:leading-[1.15] mb-4 sm:mb-5 transition-all duration-1000 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {heroTitleLine1}<br />
            {heroTitleLine2}<br />
            <span className="relative inline-block whitespace-nowrap">
              <span className="text-[var(--color-gold-dark)]">{heroTitleHighlight}</span>
              <span className={`absolute -bottom-1.5 sm:-bottom-2 left-0 h-0.5 sm:h-1 bg-gradient-to-r from-[var(--color-gold)] to-transparent rounded-full transition-all duration-1000 delay-700 ${loaded ? 'right-0' : 'right-full'}`} />
            </span>
          </h1>

          <p className={`text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed mb-5 sm:mb-6 max-w-lg mx-auto lg:mx-0 transition-all duration-800 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {heroDescription}
          </p>

          <div className={`flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-5 sm:mb-6 md:mb-8 justify-center lg:justify-start transition-all duration-800 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <Link
              to="/products"
              className="group inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3 sm:py-3.5 bg-[var(--color-primary)] text-white font-semibold text-xs sm:text-sm uppercase tracking-wide rounded-lg hover:shadow-xl hover:shadow-[var(--color-primary)]/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Bộ Sưu Tập Cao Cấp
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-5 sm:px-8 py-3 sm:py-3.5 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold text-xs sm:text-sm uppercase tracking-wide rounded-lg hover:bg-[var(--color-primary)] hover:text-white hover:-translate-y-0.5 transition-all duration-300"
            >
              Tìm Hiểu Thêm
            </Link>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-[var(--color-primary)]/15 max-w-xs sm:max-w-md mx-auto lg:mx-0 transition-all duration-800 delay-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-primary)] font-[family-name:var(--font-heading)]">{stat1Value}</div>
              <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 mt-0.5">{stat1Label}</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-primary)] font-[family-name:var(--font-heading)]">{stat2Value}</div>
              <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 mt-0.5">{stat2Label}</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-primary)] font-[family-name:var(--font-heading)]">{stat3Value}</div>
              <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 mt-0.5">{stat3Label}</div>
            </div>
          </div>
        </div>

        {/* RIGHT: Product image card */}
        <div
          className={`relative transition-all duration-1000 delay-300 ${
            loaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
          }`}
        >
          {/* Main image */}
          <div className="relative aspect-[4/5] w-full max-w-[220px] sm:max-w-[280px] md:max-w-sm lg:max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-[var(--color-primary)]/20 img-hover-zoom">
            <img
              src={heroImage}
              alt="Trầm Hương cao cấp"
              className="w-full h-full object-cover img-ken-burns"
              fetchPriority="high"
              decoding="async"
              onError={(e) => { e.currentTarget.src = altImage; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/30 via-transparent to-transparent" />
          </div>

          {/* Floating card top-left */}
          <div className={`hidden md:flex absolute top-4 left-4 lg:top-6 lg:-left-4 bg-white/95 rounded-xl shadow-xl p-2.5 md:p-3 items-center gap-2 animate-float transition-all duration-700 delay-700 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center text-[var(--color-gold-dark)] text-sm md:text-base">✦</div>
            <div>
              <div className="text-[11px] md:text-xs font-bold text-[var(--color-primary)]">Chứng nhận</div>
              <div className="text-[9px] md:text-[10px] text-gray-500">100% Trầm thật</div>
            </div>
          </div>

          {/* Floating card bottom-right */}
          <div className={`hidden md:block absolute bottom-4 right-4 lg:bottom-6 lg:-right-4 bg-white/95 rounded-xl shadow-xl p-2.5 md:p-3 max-w-[160px] md:max-w-[180px] transition-all duration-700 delay-900 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="flex items-center gap-0.5 mb-1 text-[var(--color-gold)] text-xs md:text-sm">{'★★★★★'}</div>
            <div className="text-[11px] md:text-xs text-gray-600 leading-relaxed">"Mùi hương tinh tế, chất lượng tuyệt vời."</div>
            <div className="text-[9px] md:text-[10px] text-gray-400 mt-1 font-semibold">— Khách hàng VIP</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator — ẩn trên mobile vì section không cố định chiều cao */}
      <div className="hidden lg:flex absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-[2] flex-col items-center gap-1.5 text-[var(--color-primary)]/60 text-[10px] tracking-[3px] animate-float">
        <span>CUỘN XUỐNG</span>
        <div className="w-px h-6 bg-gradient-to-b from-[var(--color-primary)]/60 to-transparent" />
      </div>
    </section>
  );
}
