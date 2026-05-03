import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroBanner from '../assets/images/hero_banner.png';

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

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-[rgba(30,58,14,0.82)] via-[rgba(45,80,22,0.65)] to-[rgba(0,0,0,0.3)]" />

      {/* Content */}
      <div
        className={`relative z-[2] max-w-xl pl-8 md:pl-16 transition-all duration-1000 ${
          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <span className="inline-block px-4 py-1.5 bg-[var(--color-gold)]/20 border border-[var(--color-gold)]/50 rounded-full text-[var(--color-gold-light)] text-xs font-semibold tracking-[2px] uppercase mb-5">
          ✦ Tinh Hoa Trầm Hương Việt
        </span>

        <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-[3.2rem] font-bold text-white leading-tight mb-5">
          Khám Phá Vẻ Đẹp<br />
          Tinh Khôi Và Sang Trọng Của<br />
          <span className="text-[var(--color-gold-light)]">Trầm Hương Tâm An</span>
        </h1>

        <p className="text-base md:text-lg text-white/85 leading-relaxed mb-8 max-w-md">
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
            className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-white text-white font-semibold text-sm uppercase tracking-wide rounded-md hover:bg-white hover:text-[var(--color-primary)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Tìm Hiểu Thêm
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2 text-white/60 text-xs tracking-wider animate-float">
        <span>CUỘN XUỐNG</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}
