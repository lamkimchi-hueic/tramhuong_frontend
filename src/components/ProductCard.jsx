// ==================== FILE: ProductCard.jsx ====================
// Mô tả: Component thẻ sản phẩm (product card) dùng chung.
// Hiển thị ảnh, tên, danh mục, giá sản phẩm trong dạng card.
// Sử dụng trên trang chủ (Sản Phẩm Nổi Bật) và trang danh sách sản phẩm.
// Có hiệu ứng hover: phóng to ảnh, hiện nút yêu thích & thêm giỏ hàng.
// Hỗ trợ hiển thị khoảng giá nếu sản phẩm có biến thể (variants).
// ==================================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { resolveImageUrl, getOptimizedImageUrl } from '../services/api'; // Hàm chuyển đổi URL ảnh

export default function ProductCard({ product }) {
  const [liked, setLiked] = useState(false);     // Trạng thái yêu thích (trái tim đỏ)
  const [imgError, setImgError] = useState(false); // Trạng thái lỗi tải ảnh
  const [added, setAdded] = useState(false);       // Trạng thái đã thêm vào giỏ hàng
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Nếu có biến thể, lấy biến thể đầu tiên tương tự như trang chi tiết
    const selectedVariant = (product.variants && product.variants.length > 0) ? product.variants[0] : null;
    
    addToCart(product, 1, selectedVariant);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  // ===== Hàm format giá tiền sang VNĐ =====
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // ===== Tính giá hiển thị dựa trên biến thể =====
  const hasVariants = product.variants && product.variants.length > 0;
  let priceDisplay;

  if (hasVariants) {
    const prices = product.variants.map(v => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    if (minPrice === maxPrice) {
      // Tất cả biến thể cùng giá → hiện 1 giá
      priceDisplay = formatPrice(minPrice);
    } else {
      // Có nhiều mức giá → hiện khoảng giá
      priceDisplay = `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
    }
  } else {
    priceDisplay = formatPrice(product.product_price);
  }

  return (
    <div
      id={`product-card-${product.id_product}`}
      className="group bg-white rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative"
    >
      {/* ===== PHẦN ẢNH SẢN PHẨM ===== */}
      <Link to={`/products/${product.id_product}`}> {/* Click vào ảnh → chuyển đến trang chi tiết */}
        <div className="relative aspect-square overflow-hidden bg-[var(--color-cream)]">
          <img
            src={imgError
              ? 'https://placehold.co/400x400/E8F0E0/2D5016?text=Tram+Huong' // Ảnh fallback khi lỗi
              : product.image_url
                ? getOptimizedImageUrl(product.image_url, 400) // Tải ảnh kích thước tối ưu 400px
                : `https://placehold.co/400x400/E8F0E0/2D5016?text=Tram+Huong` // Ảnh placeholder nếu không có
            }
            alt={product.product_name}
            loading="lazy" // Lazy loading: chỉ tải ảnh khi gần hiện trong viewport
            onError={() => setImgError(true)} // Nếu ảnh lỗi → hiện ảnh fallback
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" // Phóng to 5% khi hover
          />
          {/* Badge "Còn hàng" ở góc trên trái */}
          {product.product_status && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-[var(--color-primary)] text-white text-[0.7rem] font-semibold rounded-md uppercase tracking-wide">
              Còn hàng
            </span>
          )}
          {/* Badge số lượng biến thể ở góc trên phải */}
          {hasVariants && (
            <span className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm text-[var(--color-primary)] text-[0.65rem] font-bold rounded-md shadow-sm">
              {product.variants.length} phân loại
            </span>
          )}
        </div>
      </Link>

      {/* ===== NÚT HÀNH ĐỘNG NHANH (hiện khi hover) ===== */}
      {/* Nằm góc trên phải, trượt ra từ phải sang trái khi hover */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" style={hasVariants ? { top: '3.5rem' } : {}}>
        {/* Nút yêu thích (trái tim) */}
        <button
          onClick={() => setLiked(!liked)}
          className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors duration-200 ${
            liked ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-[var(--color-primary)] hover:text-white'
          }`}
          aria-label="Yêu thích"
        >
          <FiHeart size={15} fill={liked ? 'white' : 'none'} />
        </button>
        {/* Nút thêm vào giỏ hàng */}
        <button
          onClick={handleAddToCart}
          className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-300 relative group/btn ${
            added
              ? 'bg-green-600 text-white scale-110'
              : 'bg-white text-gray-600 hover:bg-[var(--color-primary)] hover:text-white'
          }`}
          aria-label="Thêm vào giỏ hàng"
          disabled={added}
        >
          {added ? <FiCheck size={15} /> : <FiShoppingBag size={15} />}
          
          {/* Tooltip báo đã thêm */}
          {added && (
            <span className="absolute bottom-full mb-2 bg-green-600 text-white text-[10px] font-medium px-2 py-0.5 rounded shadow whitespace-nowrap animate-bounce">
              Đã thêm!
            </span>
          )}
        </button>
      </div>

      {/* ===== PHẦN THÔNG TIN SẢN PHẨM ===== */}
      <div className="p-4 pb-5">
        {/* Tên danh mục (hiển thị phía trên tên sản phẩm) */}
        <div className="text-[0.72rem] text-[var(--color-gold-dark)] uppercase font-semibold tracking-wider mb-1">
          {product.category?.category_name || 'Trầm Hương'}
        </div>
        {/* Tên sản phẩm (click → trang chi tiết) */}
        <Link to={`/products/${product.id_product}`}>
          <h3 className="font-[family-name:var(--font-heading)] text-base font-semibold text-gray-800 mb-2 leading-snug line-clamp-2 hover:text-[var(--color-primary)] transition-colors">
            {product.product_name}
          </h3>
        </Link>
        {/* Giá sản phẩm (hiển thị khoảng giá nếu có biến thể) */}
        <div className={`font-bold text-[var(--color-primary)] ${hasVariants ? 'text-sm' : 'text-lg'}`}>
          {priceDisplay}
        </div>
      </div>
    </div>
  );
}
