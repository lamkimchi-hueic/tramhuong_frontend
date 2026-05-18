// ==================== FILE: AuthContext.jsx ====================
// Mô tả: Context quản lý trạng thái xác thực (authentication) toàn cục.
// Cung cấp thông tin user đang đăng nhập, và các hàm login/register/logout
// cho tất cả component con trong ứng dụng thông qua React Context API.
// ==================================================================

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api'; // Import API xác thực từ file api.js

// Tạo Context object để chia sẻ trạng thái auth giữa các component
const AuthContext = createContext(null);

// ==================== AUTH PROVIDER ====================
// Component bọc (wrapper) cung cấp trạng thái auth cho toàn bộ ứng dụng.
// Được đặt ở cấp cao nhất trong App.jsx để mọi component con đều truy cập được.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // Lưu thông tin user đang đăng nhập (null = chưa đăng nhập)
  const [loading, setLoading] = useState(true); // Trạng thái đang kiểm tra token khi app khởi động

  // ===== Kiểm tra token khi app khởi động =====
  // Khi app load lần đầu, kiểm tra xem localStorage có token không.
  // Nếu có → gọi API /me để lấy thông tin user tương ứng.
  // Nếu token hết hạn hoặc không hợp lệ → xóa token và đặt user = null.
  useEffect(() => {
    const token = localStorage.getItem('token'); // Lấy JWT token từ localStorage
    if (token) {
      authAPI.getMe() // Gọi API lấy thông tin user từ token
        .then((res) => setUser(res.data)) // Token hợp lệ → lưu thông tin user
        .catch(() => {
          localStorage.removeItem('token'); // Token không hợp lệ → xóa token
          setUser(null);                    // Reset trạng thái user
        })
        .finally(() => setLoading(false)); // Hoàn tất kiểm tra → tắt loading
    } else {
      setLoading(false); // Không có token → không cần kiểm tra, tắt loading luôn
    }
  }, []); // [] = chỉ chạy 1 lần khi component mount (app khởi động)

  // ===== Hàm đăng nhập =====
  // Gửi username + password đến API /login.
  // Nếu thành công → lưu token vào localStorage và cập nhật state user.
  const login = async (username, password) => {
    const res = await authAPI.login({ username, password }); // Gọi API đăng nhập
    localStorage.setItem('token', res.data.token);           // Lưu JWT token
    setUser(res.data.user);                                  // Cập nhật thông tin user
    return res.data;                                         // Trả về data cho component gọi
  };

  // ===== Hàm đăng ký =====
  // Gửi thông tin đăng ký đến API /register.
  // Không tự động đăng nhập sau khi đăng ký (user phải login thủ công).
  const register = async (data) => {
    const res = await authAPI.register(data); // Gọi API đăng ký
    return res.data;                          // Trả về kết quả
  };

  // ===== Hàm đăng xuất =====
  // Xóa token khỏi localStorage và reset state user = null.
  const logout = () => {
    localStorage.removeItem('token'); // Xóa JWT token
    setUser(null);                    // Reset user về null (chưa đăng nhập)
  };

  // Cung cấp các giá trị auth cho tất cả component con thông qua Context Provider
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ==================== CUSTOM HOOK ====================
// Hook tiện ích để các component con dễ dàng truy cập AuthContext.
// Cách dùng: const { user, login, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);
