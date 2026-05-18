// ==================== FILE: CartContext.jsx ====================
// Mô tả: Context quản lý giỏ hàng (shopping cart) toàn cục.
// Lưu trữ danh sách sản phẩm trong giỏ hàng vào localStorage để
// dữ liệu không bị mất khi reload trang.
// Cung cấp các hàm: thêm, xóa, cập nhật số lượng, xóa toàn bộ giỏ hàng.
// ==================================================================

import { createContext, useContext, useState, useEffect } from 'react';

// Tạo Context object cho giỏ hàng
const CartContext = createContext();

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
  // Nếu sản phẩm đã tồn tại trong giỏ → cộng thêm số lượng.
  // Nếu chưa tồn tại → thêm mới vào cuối mảng.
  const addToCart = (product, quantity) => {
    setCartItems((prevItems) => {
      // Kiểm tra sản phẩm đã có trong giỏ chưa (so sánh theo id_product)
      const existingItem = prevItems.find((item) => item.id_product === product.id_product);
      if (existingItem) {
        // Đã tồn tại → cập nhật số lượng (cộng thêm quantity mới)
        return prevItems.map((item) =>
          item.id_product === product.id_product
            ? { ...item, quantity: item.quantity + quantity } // Cộng thêm số lượng
            : item // Giữ nguyên các sản phẩm khác
        );
      }
      // Chưa tồn tại → thêm sản phẩm mới kèm số lượng vào cuối mảng
      return [...prevItems, { ...product, quantity }];
    });
  };

  // ===== Xóa sản phẩm khỏi giỏ hàng =====
  // Lọc bỏ sản phẩm có id_product trùng khớp
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id_product !== productId));
  };

  // ===== Cập nhật số lượng sản phẩm =====
  // Không cho phép số lượng < 1 (tối thiểu là 1)
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return; // Bảo vệ: không cho số lượng < 1
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id_product === productId ? { ...item, quantity } : item
      )
    );
  };

  // ===== Xóa toàn bộ giỏ hàng =====
  // Được gọi sau khi đặt hàng thành công
  const clearCart = () => {
    setCartItems([]); // Reset giỏ hàng về mảng rỗng
  };

  // ===== Tính tổng tiền giỏ hàng =====
  // Cộng dồn (giá × số lượng) của tất cả sản phẩm trong giỏ
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
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
        addToCart,       // Hàm thêm sản phẩm
        removeFromCart,  // Hàm xóa sản phẩm
        updateQuantity,  // Hàm cập nhật số lượng
        clearCart,       // Hàm xóa toàn bộ giỏ
        totalAmount,     // Tổng tiền
        itemCount,       // Tổng số lượng sản phẩm
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
