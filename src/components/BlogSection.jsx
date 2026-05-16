import { useState } from 'react';
import { FiSun, FiHeart, FiWind, FiDroplet } from 'react-icons/fi';
import useScrollReveal from '../hooks/useScrollReveal';
const blogImg = 'https://res.cloudinary.com/dcywlpxwi/image/upload/v1778780032/tramhuong/assets/blog_lifestyle.jpg';

const features = [
  { icon: FiSun, title: 'Tinh thần sảng khoái', desc: 'Trầm hương giúp tĩnh tâm, giảm căng thẳng hiệu quả' },
  { icon: FiHeart, title: 'Sức khỏe cải thiện', desc: 'Hỗ trợ giấc ngủ sâu và hệ hô hấp khỏe mạnh' },
  { icon: FiWind, title: 'Trầm hương', desc: 'Hương thơm tự nhiên tinh khiết và thanh tịnh' },
  { icon: FiDroplet, title: 'Phong vị riêng', desc: 'Mỗi sản phẩm mang hương thơm đặc trưng riêng biệt' },
];

export default function BlogSection() {
  const [activeFeature, setActiveFeature] = useState(null);
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <section id="blog-section" className="py-24 bg-white" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`rounded-2xl overflow-hidden relative group img-hover-zoom transition-all duration-800 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <img src={blogImg} alt="Trầm Hương và Cuộc Sống" loading="lazy" className="w-full h-[450px] object-cover" />
            <span className={`absolute bottom-5 left-5 px-5 py-2 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-md transition-all duration-500 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Khám Phá
            </span>
          </div>
          <div>
            <h2 className={`font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-[var(--color-primary)] mb-5 leading-tight transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Trầm Hương &<br />Cuộc Sống Tươi Mới
            </h2>
            <p className={`text-gray-500 leading-relaxed mb-4 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              Trầm hương từ xưa đã được coi là báu vật của thiên nhiên. Không chỉ mang giá trị về mặt vật chất, trầm hương còn là biểu tượng của sự thanh tịnh, an lành và thịnh vượng.
            </p>
            <p className={`text-gray-500 leading-relaxed mb-8 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              Với hương thơm dịu nhẹ, trầm hương giúp thư giãn tinh thần, cải thiện giấc ngủ và mang lại cảm giác bình yên trong tâm hồn.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((f, idx) => {
                const Icon = f.icon;
                return (
                  <div key={idx}
                    className={`flex gap-3 items-start p-3 rounded-lg cursor-pointer transition-all duration-500 ${activeFeature === idx ? 'bg-[var(--color-primary-50)] shadow-sm' : 'hover:bg-gray-50'} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                    style={{ transitionDelay: isVisible ? `${500 + idx * 100}ms` : '0ms' }}
                    onClick={() => setActiveFeature(activeFeature === idx ? null : idx)}
                  >
                    <div className="w-10 h-10 min-w-[40px] rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary)] flex items-center justify-center">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">{f.title}</h4>
                      <p className={`text-xs text-gray-500 leading-relaxed transition-all duration-300 ${activeFeature === idx ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 sm:max-h-20 sm:opacity-100'} overflow-hidden`}>{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
