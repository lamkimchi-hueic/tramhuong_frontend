import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import HeroSection from '../components/HeroSection';
import CategorySection from '../components/CategorySection';
import ProductCard from '../components/ProductCard';
import BlogSection from '../components/BlogSection';
import TestimonialSection from '../components/TestimonialSection';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productAPI.getAll();
        setFeaturedProducts(res.data.slice(0, 8));
      } catch (err) {
        console.error('Lỗi khi tải sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main id="home-page">
      <HeroSection />
      <CategorySection />

      {/* Featured Products */}
      <section id="featured-products" className="py-24 bg-[var(--color-cream)]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-[var(--color-primary)] text-center mb-4">
            Sản Phẩm Nổi Bật
          </h2>
          <div className="w-16 h-[3px] bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] mx-auto rounded-full mb-3" />
          <p className="text-gray-500 text-center mb-12 max-w-lg mx-auto">
            Những sản phẩm trầm hương được yêu thích và đánh giá cao nhất
          </p>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-3 border-[var(--color-primary-100)] border-t-[var(--color-primary)] rounded-full animate-spin-slow" />
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id_product} product={product} />
                ))}
              </div>
              <div className="text-center mt-12">
                <Link
                  to="/products"
                  id="view-all-products"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-[var(--color-primary)] text-white font-semibold text-sm uppercase tracking-wide rounded-md border-2 border-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] hover:border-[var(--color-primary-dark)] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                >
                  Xem Tất Cả Sản Phẩm
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4 opacity-30">🪵</div>
              <p>Chưa có sản phẩm nào. Hãy quay lại sau!</p>
            </div>
          )}
        </div>
      </section>

      <BlogSection />
      <TestimonialSection />
    </main>
  );
}
