import { useState, useEffect } from 'react';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { settingAPI } from '../services/api';
import useScrollReveal from '../hooks/useScrollReveal';

// Testimonials mặc định — sẽ bị ghi đè nếu admin đã cấu hình qua settings
const DEFAULT_TESTIMONIALS = [
  { id: 1, text: 'Mình rất hài lòng với sản phẩm vòng tay trầm hương. Hương thơm dịu nhẹ, đeo rất thoải mái. Sẽ ủng hộ tiếp!', name: 'Nguyễn Minh Anh', rating: 5 },
  { id: 2, text: 'Bộ quà tặng trầm hương rất sang trọng, đóng gói cẩn thận. Mình mua tặng đối tác kinh doanh, ai cũng khen.', name: 'Trần Văn Hùng', rating: 5 },
  { id: 3, text: 'Trầm hương tự nhiên chất lượng tuyệt vời. Đốt lên hương thơm lan tỏa cả phòng, rất dễ chịu và thư giãn.', name: 'Lê Thu Hương', rating: 5 },
];

// Tạo initials từ tên (VD: "Nguyễn Minh Anh" → "NA")
function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || '?';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function TestimonialSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.1 });
  const [isMobile, setIsMobile] = useState(false);

  // Lắng nghe kích thước màn hình để tối ưu hóa render DOM trên mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch testimonials từ SiteSettings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await settingAPI.getAll();
        const settings = res.data || {};

        // Kiểm tra có testimonials trong settings không (key: testimonials_data — JSON string)
        if (settings.testimonials_data) {
          try {
            const parsed = JSON.parse(settings.testimonials_data);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setTestimonials(parsed.map((t, idx) => ({
                id: idx + 1,
                text: t.text || '',
                name: t.name || '',
                rating: parseInt(t.rating) || 5,
              })));
            }
          } catch (e) {
            console.error('TestimonialSection: Lỗi parse testimonials_data:', e);
          }
        }
      } catch (err) {
        console.error('TestimonialSection: Lỗi khi tải settings:', err);
      }
    };
    fetchData();
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="py-24 bg-[var(--color-cream)]" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">
        <h2 className={`font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-[var(--color-primary)] text-center mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Cảm Nhận Khách Hàng
        </h2>
        <div className={`w-16 h-[3px] bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] mx-auto rounded-full mb-3 transition-all duration-700 delay-150 ${isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} />
        <p className={`text-gray-500 text-center mb-12 max-w-lg mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          Những chia sẻ chân thực từ khách hàng đã tin tưởng và sử dụng sản phẩm
        </p>

        {/* Desktop/Mobile Conditional Rendering */}
        {!isMobile ? (
          /* Desktop Grid */
          <div className="grid grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={t.id} id={`testimonial-${t.id}`}
                className={`bg-white rounded-xl p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: isVisible ? `${300 + idx * 150}ms` : '0ms' }}
              >
                <div className="font-[family-name:var(--font-heading)] text-4xl text-[var(--color-primary-100)] mb-4">"</div>
                <p className="text-sm text-gray-500 leading-relaxed mb-6 italic">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-primary-100)] flex items-center justify-center font-bold text-[var(--color-primary)]">{getInitials(t.name)}</div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">{t.name}</h4>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }, (_, i) => (
                        <FiStar key={i} size={13} fill="#C4A35A" stroke="#C4A35A" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Mobile Carousel */
          <div>
            <div className={`bg-white rounded-xl p-8 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <div className="font-[family-name:var(--font-heading)] text-4xl text-[var(--color-primary-100)] mb-4">"</div>
              <p className="text-sm text-gray-500 leading-relaxed mb-6 italic">{testimonials[currentSlide]?.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-primary-100)] flex items-center justify-center font-bold text-[var(--color-primary)]">{getInitials(testimonials[currentSlide]?.name)}</div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">{testimonials[currentSlide]?.name}</h4>
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonials[currentSlide]?.rating || 5 }, (_, i) => (
                      <FiStar key={i} size={13} fill="#C4A35A" stroke="#C4A35A" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-6">
              <button onClick={prevSlide} className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"><FiChevronLeft size={18} /></button>
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentSlide(idx)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-[var(--color-primary)] w-6' : 'bg-gray-300'}`} />
                ))}
              </div>
              <button onClick={nextSlide} className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"><FiChevronRight size={18} /></button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
