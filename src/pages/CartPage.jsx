import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI, authAPI, resolveImageUrl } from '../services/api';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft, FiCheckCircle, FiMapPin, FiPhone } from 'react-icons/fi';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalAmount, clearCart, getCartItemKey } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      authAPI.getMe().then(res => {
        setShippingInfo({
          address: res.data.address || '',
          phone: res.data.phone || ''
        });
      });
    }
  }, [user]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) return;
    if (!shippingInfo.address || !shippingInfo.phone) {
      alert('Vui lòng nhập đầy đủ thông tin giao hàng!');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        id_user: user.id_user,
        total_amount: totalAmount,
        shipping_address: shippingInfo.address,
        shipping_phone: shippingInfo.phone,
        items: cartItems.map((item) => ({
          id_product: item.id_product,
          quantity: item.quantity,
          // Sử dụng cart_price (giá biến thể) nếu có, ngược lại dùng giá gốc
          price: item.cart_price || item.product_price,
        })),
      };

      await orderAPI.create(orderData);
      setOrderSuccess(true);
      clearCart();
    } catch (error) {
      alert('Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <main className="pt-32 pb-24 bg-gray-50 min-h-screen">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-10 text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-[var(--color-primary-50)] text-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Đặt hàng thành công!</h1>
          <p className="text-gray-500 mb-8">
            Cảm ơn bạn đã tin tưởng Trầm Hương Tâm An. Đơn hàng của bạn đang được xử lý.
          </p>
          <Link
            to="/"
            className="block w-full py-3.5 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            Về Trang Chủ
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <FiShoppingBag className="text-[var(--color-primary)]" /> Giỏ Hàng Của Bạn
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <div className="text-6xl mb-6 opacity-20">🛒</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Giỏ hàng đang trống</h2>
            <p className="text-gray-500 mb-8">Hãy chọn cho mình những sản phẩm trầm hương ưng ý nhất nhé!</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] transition-all"
            >
              <FiArrowLeft /> Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const cartKey = getCartItemKey(item);
                const itemPrice = item.cart_price || item.product_price;
                return (
                  <div key={cartKey} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 animate-fade-in">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.image_url
                          ? resolveImageUrl(item.image_url)
                          : `https://placehold.co/200x200/E8F0E0/2D5016?text=Tram+Huong`
                        }
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://placehold.co/200x200/E8F0E0/2D5016?text=Tram+Huong'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 truncate">{item.product_name}</h3>
                      {/* Hiển thị biến thể đang chọn (nếu có) */}
                      {item.selectedVariant && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-[var(--color-primary-50)] text-[var(--color-primary)] text-xs font-semibold rounded">
                          {item.selectedVariant.size}
                        </span>
                      )}
                      <p className="text-[var(--color-primary)] font-semibold text-sm mt-1">
                        {formatPrice(itemPrice)}
                      </p>
                    </div>
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(cartKey, item.quantity - 1)}
                        className="p-2 hover:bg-gray-50 text-gray-500"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => {
                          // Giới hạn theo tồn kho biến thể (nếu có)
                          const maxQty = item.selectedVariant ? item.selectedVariant.stock : Infinity;
                          if (item.quantity < maxQty) {
                            updateQuantity(cartKey, item.quantity + 1);
                          }
                        }}
                        className="p-2 hover:bg-gray-50 text-gray-500"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                    <div className="text-right hidden sm:block min-w-[100px]">
                      <p className="font-bold text-gray-800">{formatPrice(itemPrice * item.quantity)}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(cartKey)}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-lg"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                );
              })}
              
              <div className="pt-4">
                <Link to="/products" className="text-sm font-semibold text-[var(--color-primary)] flex items-center gap-2 hover:underline">
                  <FiArrowLeft /> Tiếp tục mua sắm
                </Link>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:sticky lg:top-32">
              <h2 className="text-lg font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">
                Thông tin nhận hàng
              </h2>
              
              {user && (
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block flex items-center gap-2">
                      <FiPhone size={12} /> Số điện thoại nhận hàng
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                      placeholder="Nhập số điện thoại..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:bg-white focus:border-[var(--color-primary)] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block flex items-center gap-2">
                      <FiMapPin size={12} /> Địa chỉ giao hàng
                    </label>
                    <textarea
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      placeholder="Nhập địa chỉ giao hàng chi tiết..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:bg-white focus:border-[var(--color-primary)] outline-none transition-all h-20 resize-none"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500">
                  <span>Tổng tiền hàng</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Phí vận chuyển</span>
                  <span className="text-[var(--color-primary)] font-medium">Miễn phí</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                  <span className="font-bold text-gray-800">Tổng cộng</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[var(--color-primary)]">{formatPrice(totalAmount)}</p>
                    <p className="text-xs text-gray-400">(Đã bao gồm VAT)</p>
                  </div>
                </div>
              </div>

              <button
                disabled={loading}
                onClick={handleCheckout}
                className="w-full py-4 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[var(--color-primary-dark)] hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : (user ? 'Tiến hành đặt hàng' : 'Đăng nhập để đặt hàng')}
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-4 opacity-30 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="visa" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="mastercard" />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
