import { useState } from 'react';
import { FiSun, FiHeart, FiWind, FiDroplet, FiChevronRight } from 'react-icons/fi';
import blogImg from '../assets/images/blog_lifestyle.png';

const features = [
  { icon: FiSun, title: 'Tinh thần sảng khoái', desc: 'Trầm hương giúp tĩnh tâm, giảm căng thẳng hiệu quả' },
  { icon: FiHeart, title: 'Sức khỏe cải thiện', desc: 'Hỗ trợ giấc ngủ sâu và hệ hô hấp khỏe mạnh' },
  { icon: FiWind, title: 'Trầm hương', desc: 'Hương thơm tự nhiên tinh khiết và thanh tịnh' },
  { icon: FiDroplet, title: 'Phong vị riêng', desc: 'Mỗi sản phẩm mang hương thơm đặc trưng riêng biệt' },
];

export default function BlogSection() {
  const [activeFeature, setActiveFeature] = useState(null);

  return (
    <section id="blog-section" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden relative group">
            <img
              src={blogImg}
              alt="Trầm Hương và Cuộc Sống"
              loading="lazy"
              className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-103"
            />
            <span className="absolute bottom-5 left-5 px-5 py-2 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-md">
              Khám Phá
            </span>
          </div>

          {/* Content */}
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-[var(--color-primary)] mb-5 leading-tight">
              Trầm Hương &<br />Cuộc Sống Tươi Mới
            </h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              Trầm hương từ xưa đã được coi là báu vật của thiên nhiên.
              Không chỉ mang giá trị về mặt vật chất, trầm hương còn là
              biểu tượng của sự thanh tịnh, an lành và thịnh vượng.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              Với hương thơm dịu nhẹ, trầm hương giúp thư giãn tinh thần,
              cải thiện giấc ngủ và mang lại cảm giác bình yên trong tâm hồn.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((f, idx) => {
                const Icon = f.icon;
                return (
                  <div
                    key={idx}
                    className={`flex gap-3 items-start p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                      activeFeature === idx
                        ? 'bg-[var(--color-primary-50)] shadow-sm'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveFeature(activeFeature === idx ? null : idx)}
                  >
                    <div className="w-10 h-10 min-w-[40px] rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary)] flex items-center justify-center">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">{f.title}</h4>
                      <p className={`text-xs text-gray-500 leading-relaxed transition-all duration-300 ${
                        activeFeature === idx ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 sm:max-h-20 sm:opacity-100'
                      } overflow-hidden`}>
                        {f.desc}
                      </p>
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
