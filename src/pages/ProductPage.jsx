import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { FiHome, FiChevronRight } from 'react-icons/fi';

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    categoryAPI.getAll()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Lỗi khi tải danh mục:', err));
  }, []);

  useEffect(() => {
    const catId = searchParams.get('category');
    if (catId) setActiveCategory(parseInt(catId));
    else setActiveCategory(null);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const query = searchParams.get('q');
    
    let fetchProducts;
    if (query) {
      fetchProducts = productAPI.getAll({ q: query });
      setActiveCategory(null); // Reset category if searching
    } else if (activeCategory) {
      fetchProducts = productAPI.getByCategory(activeCategory);
    } else {
      fetchProducts = productAPI.getAll();
    }

    fetchProducts
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Lỗi khi tải sản phẩm:', err))
      .finally(() => setLoading(false));
  }, [activeCategory, searchParams]);

  const handleFilterClick = (catId) => {
    setActiveCategory(catId);
    catId ? setSearchParams({ category: catId }) : setSearchParams({});
  };

  return (
    <main id="product-page">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] pt-36 pb-16 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-white mb-3">Sản Phẩm</h1>
          <p className="text-white/70">Khám phá bộ sưu tập trầm hương cao cấp của chúng tôi</p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-white/50">
            <Link to="/" className="text-white/70 hover:text-[var(--color-gold-light)] transition-colors"><FiHome size={14} /></Link>
            <FiChevronRight size={12} />
            <span>Sản Phẩm</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-16 bg-[var(--color-cream)]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <button
              id="filter-all"
              onClick={() => handleFilterClick(null)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium border transition-all duration-300 ${
                !activeCategory
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                  : 'bg-transparent text-gray-700 border-[var(--color-primary-100)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
              }`}
            >
              Tất Cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id_category}
                id={`filter-${cat.id_category}`}
                onClick={() => handleFilterClick(cat.id_category)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium border transition-all duration-300 ${
                  activeCategory === cat.id_category
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'bg-transparent text-gray-700 border-[var(--color-primary-100)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                }`}
              >
                {cat.category_name}
              </button>
            ))}
          </div>

          {/* Products */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-3 border-[var(--color-primary-100)] border-t-[var(--color-primary)] rounded-full animate-spin-slow" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id_product} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4 opacity-30">🔍</div>
              <p>Không tìm thấy sản phẩm nào trong danh mục này.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
