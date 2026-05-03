import { useState } from 'react';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const testimonials = [
  { id: 1, text: 'Mình rất hài lòng với sản phẩm vòng tay trầm hương. Hương thơm dịu nhẹ, đeo rất thoải mái. Sẽ ủng hộ tiếp!', name: 'Nguyễn Minh Anh', initials: 'NA', rating: 5 },
  { id: 2, text: 'Bộ quà tặng trầm hương rất sang trọng, đóng gói cẩn thận. Mình mua tặng đối tác kinh doanh, ai cũng khen.', name: 'Trần Văn Hùng', initials: 'TH', rating: 5 },
  { id: 3, text: 'Trầm hương tự nhiên chất lượng tuyệt vời. Đốt lên hương thơm lan tỏa cả phòng, rất dễ chịu và thư giãn.', name: 'Lê Thu Hương', initials: 'LH', rating: 5 },
];

export default function TestimonialSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="py-24 bg-[var(--color-cream)]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-[var(--color-primary)] text-center mb-4">
          Cảm Nhận Khách Hàng
        </h2>
        <div className="w-16 h-[3px] bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] mx-auto rounded-full mb-3" />
        <p className="text-gray-500 text-center mb-12 max-w-lg mx-auto">
          Những chia sẻ chân thực từ khách hàng đã tin tưởng và sử dụng sản phẩm
        </p>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              id={`testimonial-${t.id}`}
              className="bg-white rounded-xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="font-[family-name:var(--font-heading)] text-4xl text-[var(--color-primary-100)] mb-4">"</div>
              <p className="text-sm text-gray-500 leading-relaxed mb-6 italic">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-primary-100)] flex items-center justify-center font-bold text-[var(--color-primary)]">
                  {t.initials}
                </div>
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

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="bg-white rounded-xl p-8">
            <div className="font-[family-name:var(--font-heading)] text-4xl text-[var(--color-primary-100)] mb-4">"</div>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 italic">{testimonials[currentSlide].text}</p>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-primary-100)] flex items-center justify-center font-bold text-[var(--color-primary)]">
                {testimonials[currentSlide].initials}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800">{testimonials[currentSlide].name}</h4>
                <div className="flex gap-0.5">
                  {Array.from({ length: testimonials[currentSlide].rating }, (_, i) => (
                    <FiStar key={i} size={13} fill="#C4A35A" stroke="#C4A35A" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
            >
              <FiChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? 'bg-[var(--color-primary)] w-6' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
