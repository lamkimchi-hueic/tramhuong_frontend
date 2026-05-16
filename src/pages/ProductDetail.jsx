import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI, resolveImageUrl } from '../services/api';
import { useCart } from '../context/CartContext';
import { FiHome, FiChevronRight, FiShoppingBag, FiHeart, FiMinus, FiPlus, FiCheckCircle } from 'react-icons/fi';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    productAPI.getById(id)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error('Lỗi:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (loading) {
    return (
      <main className="pt-32">
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-3 border-[var(--color-primary-100)] border-t-[var(--color-primary)] rounded-full animate-spin-slow" />
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="pt-32">
        <div className="max-w-7xl mx-auto px-6 text-center py-16">
          <div className="text-5xl mb-4 opacity-30">😔</div>
          <p className="text-gray-500 mb-6">Không tìm thấy sản phẩm này.</p>
          <Link to="/products" className="inline-flex px-6 py-3 bg-[var(--color-primary)] text-white rounded-md font-semibold hover:bg-[var(--color-primary-dark)] transition-colors">
            Quay Lại Sản Phẩm
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="product-detail-page">
      {/* Breadcrumb Header */}
      <div className="bg-[var(--color-primary)] pt-28 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Link to="/" className="text-white/70 hover:text-[var(--color-gold-light)]"><FiHome size={14} /></Link>
            <FiChevronRight size={12} />
            <Link to="/products" className="text-white/70 hover:text-[var(--color-gold-light)]">Sản Phẩm</Link>
            <FiChevronRight size={12} />
            <span className="text-white/90">{product.product_name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden bg-[var(--color-cream)]">
              <img
                src={product.image_url
                  ? resolveImageUrl(product.image_url)
                  : `https://placehold.co/600x600/E8F0E0/2D5016?text=Tram+Huong`
                }
                alt={product.product_name}
                className="w-full aspect-square object-cover"
                onError={(e) => { e.target.src = 'https://placehold.co/600x600/E8F0E0/2D5016?text=Tram+Huong'; }}
              />
            </div>

            {/* Info */}
            <div className="pt-4">
              <div className="text-xs text-[var(--color-gold-dark)] uppercase tracking-[2px] font-semibold mb-3">
                {product.category?.category_name || 'Trầm Hương'}
              </div>

              <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {product.product_name}
              </h1>

              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-6 ${
                product.product_status
                  ? 'bg-[var(--color-primary-50)] text-[var(--color-primary)]'
                  : 'bg-red-50 text-red-700'
              }`}>
                <FiCheckCircle size={13} />
                {product.product_status ? 'Còn hàng' : 'Hết hàng'}
              </div>

              <div className="text-3xl font-bold text-[var(--color-primary)] mb-6">
                {formatPrice(product.product_price)}
              </div>

              <p className="text-gray-500 leading-relaxed mb-8">
                Sản phẩm trầm hương thiên nhiên cao cấp, được tuyển chọn kỹ lưỡng
                từ những vùng nguyên liệu tốt nhất. Chế tác tỉ mỉ bởi nghệ nhân
                lành nghề, mang đến hương thơm thanh tịnh và bền lâu.
              </p>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-8">
                <label className="text-sm font-semibold">Số lượng:</label>
                <div className="flex items-center border border-[var(--color-primary-100)] rounded-md overflow-hidden">
                  <button
                    id="qty-minus"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2.5 bg-[var(--color-primary-50)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-primary-100)] transition-colors"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="px-6 py-2.5 font-semibold min-w-[50px] text-center">{quantity}</span>
                  <button
                    id="qty-plus"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2.5 bg-[var(--color-primary-50)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-primary-100)] transition-colors"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  id="add-to-cart"
                  onClick={handleAddToCart}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md font-semibold text-sm uppercase tracking-wide transition-all duration-300 ${
                    addedToCart
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-primary)] text-white border-2 border-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] hover:-translate-y-0.5 hover:shadow-lg'
                  }`}
                >
                  {addedToCart ? (
                    <><FiCheckCircle size={16} /> Đã Thêm!</>
                  ) : (
                    <><FiShoppingBag size={16} /> Thêm Vào Giỏ Hàng</>
                  )}
                </button>
                <button
                  id="add-to-wishlist"
                  onClick={() => setLiked(!liked)}
                  className={`w-14 h-14 flex items-center justify-center rounded-md border-2 transition-all duration-300 ${
                    liked
                      ? 'bg-red-500 border-red-500 text-white'
                      : 'border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white'
                  }`}
                >
                  <FiHeart size={18} fill={liked ? 'white' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
