import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI, resolveImageUrl } from '../services/api';
import { useCart } from '../context/CartContext';
import { FiHome, FiChevronRight, FiShoppingBag, FiHeart, FiMinus, FiPlus, FiCheckCircle, FiZoomIn, FiPackage } from 'react-icons/fi';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });
  const imgContainerRef = useRef(null);
  const { addToCart } = useCart();

  // ===== State biến thể =====
  // selectedVariant lưu biến thể đang được chọn (object { id_variant, size, price, stock })
  // Nếu sản phẩm không có biến thể → selectedVariant = null
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    setLoading(true);
    setImgLoaded(false);
    setSelectedVariant(null); // Reset biến thể khi chuyển sản phẩm
    setQuantity(1);
    productAPI.getById(id)
      .then((res) => {
        setProduct(res.data);
        // Tự động chọn biến thể đầu tiên nếu sản phẩm có biến thể
        if (res.data.variants && res.data.variants.length > 0) {
          setSelectedVariant(res.data.variants[0]);
        }
      })
      .catch((err) => console.error('Lỗi:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  // ===== Giá hiển thị: ưu tiên giá biến thể nếu đang chọn =====
  const displayPrice = selectedVariant ? selectedVariant.price : product?.product_price;

  // ===== Tồn kho biến thể đang chọn =====
  const currentStock = selectedVariant ? selectedVariant.stock : null;

  const handleAddToCart = () => {
    if (product) {
      // Truyền thêm selectedVariant vào addToCart
      addToCart(product, quantity, selectedVariant);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const imageUrl = product?.image_url
    ? resolveImageUrl(product.image_url)
    : 'https://placehold.co/600x600/E8F0E0/2D5016?text=Tram+Huong';

  // If image is from Cloudinary, request optimized size
  const optimizedImageUrl = imageUrl.includes('cloudinary.com')
    ? imageUrl.replace('/upload/', '/upload/w_800,f_auto,q_auto/')
    : imageUrl;

  const handleMouseMove = (e) => {
    if (!imgContainerRef.current) return;
    const rect = imgContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
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

  const hasVariants = product.variants && product.variants.length > 0;

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
      <section className="py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
            {/* Image — constrained & zoomable */}
            <div className="lg:sticky lg:top-28">
              <div
                ref={imgContainerRef}
                className="relative rounded-2xl overflow-hidden bg-[var(--color-cream)] cursor-zoom-in group max-w-lg mx-auto"
                onMouseEnter={() => setZoomed(true)}
                onMouseLeave={() => setZoomed(false)}
                onMouseMove={handleMouseMove}
                onClick={() => setZoomed(!zoomed)}
              >
                {/* Shimmer placeholder while loading */}
                {!imgLoaded && (
                  <div className="absolute inset-0 z-10 bg-gradient-to-r from-[var(--color-cream)] via-[var(--color-cream-dark)] to-[var(--color-cream)] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
                )}

                <img
                  src={optimizedImageUrl}
                  alt={product.product_name}
                  className={`w-full aspect-square object-contain p-2 transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImgLoaded(true)}
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/600x600/E8F0E0/2D5016?text=Tram+Huong';
                    setImgLoaded(true);
                  }}
                  draggable={false}
                  style={
                    zoomed && imgLoaded
                      ? { transform: 'scale(2)', transformOrigin: `${lensPos.x}% ${lensPos.y}%`, transition: 'transform 0.15s ease-out' }
                      : { transform: 'scale(1)', transition: 'transform 0.3s ease-out' }
                  }
                />

                {/* Zoom hint icon */}
                <div className={`absolute bottom-3 right-3 bg-white/80 backdrop-blur rounded-full p-2 text-[var(--color-primary)] shadow transition-opacity duration-300 pointer-events-none ${zoomed ? 'opacity-0' : 'opacity-70 group-hover:opacity-100'}`}>
                  <FiZoomIn size={18} />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="pt-0 lg:pt-4">
              <div className="text-xs text-[var(--color-gold-dark)] uppercase tracking-[2px] font-semibold mb-3">
                {product.category?.category_name || 'Trầm Hương'}
              </div>

              <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
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

              {/* ===== GIÁ HIỂN THỊ ===== */}
              <div className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)] mb-6">
                {formatPrice(displayPrice)}
              </div>

              {/* ===== CHỌN BIẾN THỂ (SIZE) ===== */}
              {hasVariants && (
                <div className="mb-8">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">
                    Chọn phân loại:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => {
                      const isSelected = selectedVariant?.id_variant === variant.id_variant;
                      const isOutOfStock = variant.stock <= 0;
                      return (
                        <button
                          key={variant.id_variant}
                          onClick={() => {
                            if (!isOutOfStock) {
                              setSelectedVariant(variant);
                              setQuantity(1); // Reset số lượng khi đổi biến thể
                            }
                          }}
                          disabled={isOutOfStock}
                          className={`
                            relative px-4 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all duration-200
                            ${isSelected
                              ? 'border-[var(--color-primary)] bg-[var(--color-primary-50)] text-[var(--color-primary)] shadow-sm'
                              : isOutOfStock
                                ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-50)]/30'
                            }
                          `}
                        >
                          {variant.size}
                          {isSelected && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                              <FiCheckCircle size={10} className="text-white" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Hiển thị giá & tồn kho của biến thể đang chọn */}
                  {selectedVariant && (
                    <div className="mt-3 flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <FiPackage size={14} />
                        Tồn kho: <strong className={currentStock > 0 ? 'text-[var(--color-primary)]' : 'text-red-500'}>{currentStock}</strong>
                      </span>
                    </div>
                  )}
                </div>
              )}

              <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-8">
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
                    onClick={() => {
                      // Nếu có biến thể → giới hạn số lượng theo tồn kho
                      const maxQty = currentStock !== null ? currentStock : Infinity;
                      setQuantity(Math.min(quantity + 1, maxQty));
                    }}
                    className="px-4 py-2.5 bg-[var(--color-primary-50)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-primary-100)] transition-colors"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
                {/* Cảnh báo nếu đã chọn tối đa tồn kho */}
                {currentStock !== null && quantity >= currentStock && currentStock > 0 && (
                  <span className="text-xs text-amber-600 font-medium">Tối đa {currentStock} sản phẩm</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  id="add-to-cart"
                  onClick={handleAddToCart}
                  disabled={hasVariants && (!selectedVariant || currentStock <= 0)}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-md font-semibold text-sm uppercase tracking-wide transition-all duration-300 ${
                    addedToCart
                      ? 'bg-[var(--color-primary)] text-white'
                      : hasVariants && (!selectedVariant || currentStock <= 0)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[var(--color-primary)] text-white border-2 border-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] hover:-translate-y-0.5 hover:shadow-lg'
                  }`}
                >
                  {addedToCart ? (
                    <><FiCheckCircle size={16} /> Đã Thêm!</>
                  ) : hasVariants && !selectedVariant ? (
                    <>Vui lòng chọn phân loại</>
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
