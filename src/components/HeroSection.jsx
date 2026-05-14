import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

// Ảnh sản phẩm: trầm hương / agarwood
const productImage = 'https://images.unsplash.com/photo-1697446631489-3e4fbbcf6065?q=80&w=1170&auto=format&fit=crop';
const altImage = 'https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&w=1200&q=85';

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section
      id="hero-section"
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#faf6ed] via-[#f5ede0] to-[#ebdfc8]"
    >
      {/* Decorative blobs */}
      <div className="absolute top-20 -left-20 w-80 h-80 bg-[var(--color-gold)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/3 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-[2] max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT: Text content */}
        <div
          className={`transition-all duration-1000 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/70 backdrop-blur border border-[var(--color-gold)]/40 rounded-full text-[var(--color-gold-dark)] text-xs font-semibold tracking-[2px] uppercase mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            Tinh Hoa Trầm Hương Việt
          </span>

          <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-primary)] leading-[1.1] mb-6">
            Khám Phá Vẻ Đẹp<br />
            Tinh Khôi Của<br />
            <span className="relative inline-block">
              <span className="text-[var(--color-gold-dark)]">Trầm Hương Tâm An</span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-gold)] to-transparent rounded-full" />
            </span>
          </h1>

          <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
            Mang đến những sản phẩm trầm hương thiên nhiên cao cấp nhất,
            chế tác tỉ mỉ từ bàn tay nghệ nhân lành nghề.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              to="/products"
              className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] text-white font-semibold text-sm uppercase tracking-wide rounded-lg hover:shadow-xl hover:shadow-[var(--color-gold)]/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Bộ Sưu Tập Cao Cấp
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold text-sm uppercase tracking-wide rounded-lg hover:bg-[var(--color-primary)] hover:text-white hover:-translate-y-0.5 transition-all duration-300"
            >
              Tìm Hiểu Thêm
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[var(--color-primary)]/15 max-w-md">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] font-[family-name:var(--font-heading)]">10+</div>
              <div className="text-xs text-gray-500 mt-1">Năm kinh nghiệm</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] font-[family-name:var(--font-heading)]">5K+</div>
              <div className="text-xs text-gray-500 mt-1">Khách hàng</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] font-[family-name:var(--font-heading)]">100%</div>
              <div className="text-xs text-gray-500 mt-1">Thiên nhiên</div>
            </div>
          </div>
        </div>

        {/* RIGHT: Product image card */}
        <div
          className={`relative transition-all duration-1000 delay-200 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Main image */}
          <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-[var(--color-primary)]/20">
            <img
              src={productImage}
              alt="Trầm Hương cao cấp"
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = altImage; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/30 via-transparent to-transparent" />
          </div>

          {/* Floating card top-left */}
          <div className="hidden md:flex absolute -top-4 -left-4 bg-white rounded-xl shadow-xl p-4 items-center gap-3 animate-float">
            <div className="w-10 h-10 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center text-[var(--color-gold-dark)] text-lg">✦</div>
            <div>
              <div className="text-sm font-bold text-[var(--color-primary)]">Chứng nhận</div>
              <div className="text-xs text-gray-500">100% Trầm thật</div>
            </div>
          </div>

          {/* Floating card bottom-right */}
          <div className="hidden md:block absolute -bottom-4 -right-4 bg-white rounded-xl shadow-xl p-4 max-w-[200px]">
            <div className="flex items-center gap-1 mb-1 text-[var(--color-gold)]">{'★★★★★'}</div>
            <div className="text-xs text-gray-600 leading-relaxed">"Mùi hương tinh tế, chất lượng tuyệt vời."</div>
            <div className="text-[10px] text-gray-400 mt-1 font-semibold">— Khách hàng VIP</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2 text-[var(--color-primary)]/50 text-[10px] tracking-[3px] animate-float">
        <span>CUỘN XUỐNG</span>
        <div className="w-px h-8 bg-gradient-to-b from-[var(--color-primary)]/50 to-transparent" />
      </div>
    </section>
  );
}
