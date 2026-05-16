import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { resolveImageUrl } from '../services/api';

export default function ProductCard({ product }) {
  const [liked, setLiked] = useState(false);
  const [imgError, setImgError] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div
      id={`product-card-${product.id_product}`}
      className="group bg-white rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative"
    >
      {/* Image */}
      <Link to={`/products/${product.id_product}`}>
        <div className="relative aspect-square overflow-hidden bg-[var(--color-cream)]">
          <img
            src={imgError
              ? 'https://placehold.co/400x400/E8F0E0/2D5016?text=Tram+Huong'
              : product.image_url
                ? resolveImageUrl(product.image_url)
                : `https://placehold.co/400x400/E8F0E0/2D5016?text=Tram+Huong`
            }
            alt={product.product_name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.product_status && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-[var(--color-primary)] text-white text-[0.7rem] font-semibold rounded-md uppercase tracking-wide">
              Còn hàng
            </span>
          )}
        </div>
      </Link>

      {/* Quick Actions */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <button
          onClick={() => setLiked(!liked)}
          className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors duration-200 ${
            liked ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-[var(--color-primary)] hover:text-white'
          }`}
          aria-label="Yêu thích"
        >
          <FiHeart size={15} fill={liked ? 'white' : 'none'} />
        </button>
        <button
          className="w-9 h-9 rounded-full bg-white text-gray-600 flex items-center justify-center shadow-md hover:bg-[var(--color-primary)] hover:text-white transition-colors duration-200"
          aria-label="Thêm vào giỏ"
        >
          <FiShoppingBag size={15} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 pb-5">
        <div className="text-[0.72rem] text-[var(--color-gold-dark)] uppercase font-semibold tracking-wider mb-1">
          {product.category?.category_name || 'Trầm Hương'}
        </div>
        <Link to={`/products/${product.id_product}`}>
          <h3 className="font-[family-name:var(--font-heading)] text-base font-semibold text-gray-800 mb-2 leading-snug line-clamp-2 hover:text-[var(--color-primary)] transition-colors">
            {product.product_name}
          </h3>
        </Link>
        <div className="text-lg font-bold text-[var(--color-primary)]">
          {formatPrice(product.product_price)}
        </div>
      </div>
    </div>
  );
}
