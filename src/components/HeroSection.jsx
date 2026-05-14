import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Ảnh nền: trầm hương/zen sáng tươi (Unsplash) - thay URL nên nếu muốn
const heroBanner = 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1920&q=80';

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section id="hero-section" className="relative h-screen min-h-[650px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBanner}
          alt="Trầm Hương Tâm An"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient Overlay - warm/light cho tươi sáng */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[rgba(255,250,240,0.92)] via-[rgba(250,235,215,0.75)] to-[rgba(180,140,90,0.25)]" />

      {/* Content */}
      <div
        className={`relative z-[2] max-w-xl pl-8 md:pl-16 transition-all duration-1000 ${
          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <span className="inline-block px-4 py-1.5 bg-[var(--color-gold)]/15 border border-[var(--color-gold)]/40 rounded-full text-[var(--color-gold-dark)] text-xs font-semibold tracking-[2px] uppercase mb-5">
          ✦ Tinh Hoa Trầm Hương Việt
        </span>

        <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-[3.2rem] font-bold text-[var(--color-primary)] leading-tight mb-5">
          Khám Phá Vẻ Đẹp<br />
          Tinh Khôi Và Sang Trọng Của<br />
          <span className="text-[var(--color-gold-dark)]">Trầm Hương Tâm An</span>
        </h1>

        <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8 max-w-md">
          Mang đến những sản phẩm trầm hương thiên nhiên cao cấp nhất,
          được chế tác tỉ mỉ từ bàn tay nghệ nhân lành nghề.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/products"
            id="hero-cta"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] text-white font-semibold text-sm uppercase tracking-wide rounded-md hover:from-[var(--color-gold-light)] hover:to-[var(--color-gold)] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
          >
            Bộ Sưu Tập Cao Cấp
          </Link>
          <Link
            to="/about"
            id="hero-about"
            className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold text-sm uppercase tracking-wide rounded-md hover:bg-[var(--color-primary)] hover:text-white hover:-translate-y-0.5 transition-all duration-300"
          >
            Tìm Hiểu Thêm
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2 text-[var(--color-primary)]/60 text-xs tracking-wider animate-float">
        <span>CUỘN XUỐNG</span>
        <div className="w-px h-8 bg-gradient-to-b from-[var(--color-primary)]/60 to-transparent" />
      </div>
    </section>
  );
}
