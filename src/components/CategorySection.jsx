import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import { categoryAPI, resolveImageUrl } from '../services/api';
import useScrollReveal from '../hooks/useScrollReveal';

export default function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.1 });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.getAll();
        setCategories(res.data.slice(0, 3));
      } catch (err) {
        console.error('Lỗi khi tải danh mục:', err);
      }
    };
    fetchCategories();
  }, []);

  if (categories.length === 0) return null;

  return (
    <section id="categories" className="py-24 bg-white" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">
        <h2 className={`font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-[var(--color-primary)] text-center mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Danh Mục Sản Phẩm
        </h2>
        <div className={`w-16 h-[3px] bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] mx-auto rounded-full mb-3 transition-all duration-700 delay-150 ${isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} />
        <p className={`text-gray-500 text-center mb-12 max-w-lg mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          Khám phá các dòng sản phẩm trầm hương cao cấp được tuyển chọn kỹ lưỡng
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id_category}
              to={`/products?category=${cat.id_category}`}
              id={`category-${cat.id_category}`}
              className={`group relative rounded-xl overflow-hidden aspect-[4/5] cursor-pointer transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: isVisible ? `${300 + idx * 150}ms` : '0ms' }}
              onMouseEnter={() => setHoveredId(cat.id_category)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {cat.image_url ? (
                <img
                  src={resolveImageUrl(cat.image_url)}
                  alt={cat.category_name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center">
                  <span className="text-white/30 text-6xl font-bold">{cat.category_name?.charAt(0)}</span>
                </div>
              )}

              {/* Overlay */}
              <div className={`absolute inset-0 flex flex-col justify-end p-7 transition-all duration-500 ${
                hoveredId === cat.id_category
                  ? 'bg-gradient-to-t from-[rgba(45,80,22,0.85)] via-[rgba(45,80,22,0.3)] to-transparent'
                  : 'bg-gradient-to-t from-black/70 via-black/10 to-transparent'
              }`}>
                <h3 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl text-white tracking-wide uppercase mb-2">
                  {cat.category_name}
                </h3>
              </div>

              {/* Arrow */}
              <div className={`absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 ${
                hoveredId === cat.id_category ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}>
                <FiArrowUpRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
