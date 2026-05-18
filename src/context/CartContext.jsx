// ==================== FILE: CartContext.jsx ====================
// Mô tả: Context quản lý giỏ hàng (shopping cart) toàn cục.
// Lưu trữ danh sách sản phẩm trong giỏ hàng vào localStorage để
// dữ liệu không bị mất khi reload trang.
// Cung cấp các hàm: thêm, xóa, cập nhật số lượng, xóa toàn bộ giỏ hàng.
// Hỗ trợ biến thể sản phẩm (ProductVariant): cùng 1 sản phẩm nhưng khác size
// sẽ được lưu thành các dòng riêng biệt trong giỏ hàng.
// ==================================================================

import { createContext, useContext, useState, useEffect } from 'react';

// Tạo Context object cho giỏ hàng
const CartContext = createContext();

// ===== Hàm tạo key duy nhất cho mỗi dòng trong giỏ =====
// Nếu item có biến thể → key = "productId-variantId", ngược lại chỉ dùng productId.
// Điều này cho phép cùng 1 sản phẩm nhưng khác size nằm trên các dòng riêng biệt.
const getCartItemKey = (item) => {
  if (item.selectedVariant) return `${item.id_product}-${item.selectedVariant.id_variant}`;
  return `${item.id_product}`;
};

// ==================== CART PROVIDER ====================
// Component bọc (wrapper) cung cấp trạng thái giỏ hàng cho toàn bộ ứng dụng.
export function CartProvider({ children }) {

  // ===== Khởi tạo state giỏ hàng từ localStorage =====
  // Sử dụng lazy initializer: đọc giỏ hàng đã lưu từ localStorage khi app khởi động.
  // Nếu chưa có → khởi tạo mảng rỗng [].
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart'); // Đọc dữ liệu giỏ hàng từ localStorage
    return savedCart ? JSON.parse(savedCart) : [];  // Parse JSON hoặc trả về mảng rỗng
  });

  // ===== Đồng bộ giỏ hàng vào localStorage mỗi khi thay đổi =====
  // Mỗi khi cartItems thay đổi (thêm/xóa/cập nhật), tự động lưu lại vào localStorage.
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]); // Dependency: cartItems → chạy lại khi giỏ hàng thay đổi

  // ===== Thêm sản phẩm vào giỏ hàng =====
  // Hỗ trợ biến thể: nếu có selectedVariant, sẽ dùng giá và thông tin biến thể.
  // Cùng 1 sản phẩm nhưng khác biến thể sẽ nằm ở các dòng khác nhau.
  const addToCart = (product, quantity, selectedVariant = null) => {
    setCartItems((prevItems) => {
      const newItem = {
        ...product,
        selectedVariant,
        // Nếu có biến thể → dùng giá biến thể, ngược lại dùng giá gốc sản phẩm
        cart_price: selectedVariant ? selectedVariant.price : product.product_price,
      };
      const newKey = getCartItemKey(newItem);

      // Tìm item đã tồn tại trong giỏ (so sánh theo key = product + variant)
      const existingIndex = prevItems.findIndex((item) => getCartItemKey(item) === newKey);

      if (existingIndex >= 0) {
        // Đã tồn tại → cập nhật số lượng (cộng thêm quantity mới)
        return prevItems.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      // Chưa tồn tại → thêm sản phẩm mới kèm số lượng vào cuối mảng
      return [...prevItems, { ...newItem, quantity }];
    });
  };

  // ===== Xóa sản phẩm khỏi giỏ hàng =====
  // Sử dụng cartKey (product + variant) để xác định chính xác dòng cần xóa
  const removeFromCart = (cartKey) => {
    setCartItems((prevItems) => prevItems.filter((item) => getCartItemKey(item) !== cartKey));
  };

  // ===== Cập nhật số lượng sản phẩm =====
  // Không cho phép số lượng < 1 (tối thiểu là 1)
  const updateQuantity = (cartKey, quantity) => {
    if (quantity < 1) return; // Bảo vệ: không cho số lượng < 1
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        getCartItemKey(item) === cartKey ? { ...item, quantity } : item
      )
    );
  };

  // ===== Xóa toàn bộ giỏ hàng =====
  // Được gọi sau khi đặt hàng thành công
  const clearCart = () => {
    setCartItems([]); // Reset giỏ hàng về mảng rỗng
  };

  // ===== Tính tổng tiền giỏ hàng =====
  // Ưu tiên dùng cart_price (giá biến thể) nếu có, ngược lại dùng product_price
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.cart_price || item.product_price) * item.quantity,
    0 // Giá trị khởi tạo = 0
  );

  // ===== Đếm tổng số lượng sản phẩm trong giỏ =====
  // Hiển thị trên badge icon giỏ hàng ở Header
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Cung cấp tất cả state và hàm xử lý giỏ hàng cho component con
  return (
    <CartContext.Provider
      value={{
        cartItems,      // Mảng các sản phẩm trong giỏ
        addToCart,       // Hàm thêm sản phẩm (hỗ trợ biến thể)
        removeFromCart,  // Hàm xóa sản phẩm (theo cartKey)
        updateQuantity,  // Hàm cập nhật số lượng (theo cartKey)
        clearCart,       // Hàm xóa toàn bộ giỏ
        totalAmount,     // Tổng tiền
        itemCount,       // Tổng số lượng sản phẩm
        getCartItemKey,  // Hàm tạo key cho cart item (export để dùng ở CartPage)
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ==================== CUSTOM HOOK ====================
// Hook tiện ích để truy cập CartContext.
// Cách dùng: const { cartItems, addToCart, totalAmount } = useCart();
export const useCart = () => useContext(CartContext);
