import { useState, useEffect } from 'react';
import { FiSun, FiHeart, FiWind, FiDroplet } from 'react-icons/fi';
import { settingAPI, resolveImageUrl, getOptimizedImageUrl } from '../services/api';
import useScrollReveal from '../hooks/useScrollReveal';

// Ảnh mặc định nếu admin chưa cấu hình
const DEFAULT_BLOG_IMG = 'https://res.cloudinary.com/dcywlpxwi/image/upload/v1778780032/tramhuong/assets/blog_lifestyle.jpg';

// Nội dung mặc định
const DEFAULTS = {
  blog_title: 'Trầm Hương &\nCuộc Sống Tươi Mới',
  blog_paragraph1: 'Trầm hương từ xưa đã được coi là báu vật của thiên nhiên. Không chỉ mang giá trị về mặt vật chất, trầm hương còn là biểu tượng của sự thanh tịnh, an lành và thịnh vượng.',
  blog_paragraph2: 'Với hương thơm dịu nhẹ, trầm hương giúp thư giãn tinh thần, cải thiện giấc ngủ và mang lại cảm giác bình yên trong tâm hồn.',
  blog_image_url: DEFAULT_BLOG_IMG,
  blog_feature1_title: 'Tinh thần sảng khoái',
  blog_feature1_desc: 'Trầm hương giúp tĩnh tâm, giảm căng thẳng hiệu quả',
  blog_feature2_title: 'Sức khỏe cải thiện',
  blog_feature2_desc: 'Hỗ trợ giấc ngủ sâu và hệ hô hấp khỏe mạnh',
  blog_feature3_title: 'Trầm hương',
  blog_feature3_desc: 'Hương thơm tự nhiên tinh khiết và thanh tịnh',
  blog_feature4_title: 'Phong vị riêng',
  blog_feature4_desc: 'Mỗi sản phẩm mang hương thơm đặc trưng riêng biệt',
};

const ICONS = [FiSun, FiHeart, FiWind, FiDroplet];

export default function BlogSection() {
  const [activeFeature, setActiveFeature] = useState(null);
  const [data, setData] = useState(DEFAULTS);
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.15 });

  // Fetch nội dung từ SiteSettings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await settingAPI.getAll();
        const settings = res.data || {};
        // Merge settings lên defaults — chỉ ghi đè nếu có giá trị
        const merged = { ...DEFAULTS };
        Object.keys(DEFAULTS).forEach(key => {
          if (settings[key]) merged[key] = settings[key];
        });
        setData(merged);
      } catch (err) {
        console.error('BlogSection: Lỗi khi tải settings:', err);
      }
    };
    fetchData();
  }, []);

  // Build features array từ data
  const features = [1, 2, 3, 4].map((n, idx) => ({
    icon: ICONS[idx],
    title: data[`blog_feature${n}_title`],
    desc: data[`blog_feature${n}_desc`],
  }));

  // Xử lý image URL - Tải ảnh nén tối ưu ở 600px width
  const blogImg = getOptimizedImageUrl(data.blog_image_url, 600);

  // Xử lý title (hỗ trợ xuống dòng bằng \n)
  const titleParts = data.blog_title.split('\n');

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
              {titleParts.map((part, i) => (
                <span key={i}>
                  {part}
                  {i < titleParts.length - 1 && <br />}
                </span>
              ))}
            </h2>
            <p className={`text-gray-500 leading-relaxed mb-4 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              {data.blog_paragraph1}
            </p>
            <p className={`text-gray-500 leading-relaxed mb-8 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              {data.blog_paragraph2}
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
