// ==================== FILE: api.js ====================
// Mô tả: File cấu hình chính cho tất cả các request HTTP đến Backend API.
// Sử dụng thư viện Axios để gửi request và quản lý token xác thực (JWT).
// Export ra các API client cho từng module: Auth, User, Product, Category, Order, Setting.
// ===========================================================

import axios from 'axios'; // Import thư viện Axios để gọi HTTP request

// Lấy URL gốc của Backend API từ biến môi trường Vite (.env → VITE_API_URL)
const API_BASE_URL = import.meta.env.VITE_API_URL;

// ==================== HÀM XỬ LÝ URL ẢNH ====================
// Chức năng: Chuyển đổi đường dẫn ảnh tương đối thành đường dẫn tuyệt đối.
// - Nếu URL đã là link đầy đủ (Cloudinary, Unsplash...) → giữ nguyên, không xử lý.
// - Nếu URL là đường dẫn tương đối (VD: /uploads/products/abc.jpg) → ghép thêm domain backend phía trước.
export const resolveImageUrl = (url) => {
  if (!url) return null; // Nếu không có URL → trả về null
  if (url.startsWith('http://') || url.startsWith('https://')) return url; // URL đầy đủ → giữ nguyên
  // Loại bỏ phần "/api" ở cuối URL gốc để lấy domain backend thuần (VD: https://tramhuong-backend.onrender.com)
  const base = (API_BASE_URL || '').replace(/\/api\/?$/, '');
  // Ghép domain backend + đường dẫn ảnh (VD: https://...onrender.com/uploads/products/abc.jpg)
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
};

// ==================== TẠO INSTANCE AXIOS ====================
// Tạo một instance Axios dùng chung cho toàn bộ ứng dụng
// với baseURL là đường dẫn API gốc và header mặc định là JSON
const api = axios.create({
  baseURL: API_BASE_URL, // URL gốc, VD: https://tramhuong-backend.onrender.com/api
  headers: {
    'Content-Type': 'application/json', // Mặc định gửi dữ liệu dạng JSON
  },
});

// ==================== INTERCEPTOR (BỘ CHẶN REQUEST) ====================
// Tự động gắn JWT token vào header Authorization trước mỗi request.
// Token được lấy từ localStorage (đã lưu khi đăng nhập thành công).
// Điều này giúp backend nhận diện người dùng mà không cần truyền token thủ công mỗi lần.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Lấy token từ localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Gắn token vào header dạng Bearer
  }
  return config; // Trả về config đã chỉnh sửa
});

// ==================== AUTH & USERS API ====================
// Các hàm gọi API liên quan đến Xác thực (đăng nhập, đăng ký) và Thông tin người dùng
export const authAPI = {
  login: (data) => api.post('/login', data),       // Đăng nhập: gửi username + password
  register: (data) => api.post('/register', data),  // Đăng ký: gửi thông tin user mới
  getMe: () => api.get('/me'),                       // Lấy thông tin user hiện tại (dựa vào token)
};

// Các hàm CRUD (Tạo, Đọc, Sửa, Xóa) cho quản lý người dùng (chỉ Admin sử dụng)
export const userAPI = {
  getAll: () => api.get('/users'),                          // Lấy danh sách tất cả user
  getById: (id) => api.get(`/users/${id}`),                 // Lấy thông tin 1 user theo ID
  create: (data) => api.post('/users', data),               // Tạo user mới
  update: (id, data) => api.put(`/users/${id}`, data),      // Cập nhật thông tin user
  delete: (id) => api.delete(`/users/${id}`),               // Xóa mềm user (đánh dấu deletedAt)
  getDeleted: () => api.get('/users/deleted'),               // Lấy danh sách user đã xóa mềm
  restore: (id) => api.patch(`/users/${id}/restore`),        // Khôi phục user đã xóa mềm
  forceDelete: (id) => api.delete(`/users/${id}/force`),     // Xóa vĩnh viễn user
};

// ==================== PRODUCTS API ====================
// Các hàm CRUD cho quản lý sản phẩm
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),                 // Lấy tất cả sản phẩm (hỗ trợ tìm kiếm qua params ?q=...)
  getById: (id) => api.get(`/products/${id}`),                          // Lấy chi tiết 1 sản phẩm theo ID
  getByCategory: (categoryId) => api.get(`/category/${categoryId}/products`), // Lấy sản phẩm theo danh mục
  create: (data) => {
    // Nếu dữ liệu là FormData (có chứa file ảnh) → gửi dạng multipart/form-data
    if (data instanceof FormData) {
      return api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.post('/products', data); // Không có file ảnh → gửi JSON bình thường
  },
  update: (id, data) => {
    // Tương tự create, hỗ trợ cả FormData (có ảnh) và JSON (không có ảnh)
    if (data instanceof FormData) {
      return api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.put(`/products/${id}`, data);
  },
  uploadImage: (id, formData) => api.post(`/products/${id}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }), // Upload ảnh riêng cho sản phẩm
  delete: (id) => api.delete(`/products/${id}`),                        // Xóa mềm sản phẩm
  getDeleted: () => api.get('/products/deleted'),                        // Lấy danh sách sản phẩm đã xóa mềm
  restore: (id) => api.patch(`/products/${id}/restore`),                 // Khôi phục sản phẩm đã xóa mềm
  forceDelete: (id) => api.delete(`/products/${id}/force`),              // Xóa vĩnh viễn sản phẩm
  getVariants: (id) => api.get(`/products/${id}/variants`),              // Lấy danh sách biến thể (kích cỡ/giá) của sản phẩm
  upsertVariants: (id, variants) => api.put(`/products/${id}/variants`, { variants }), // Tạo mới hoặc cập nhật biến thể
};

// ==================== CATEGORIES API ====================
// Các hàm CRUD cho quản lý danh mục sản phẩm
export const categoryAPI = {
  getAll: () => api.get('/categories'),                                  // Lấy tất cả danh mục
  getById: (id) => api.get(`/categories/${id}`),                         // Lấy chi tiết 1 danh mục
  create: (data) => {
    // Hỗ trợ upload ảnh danh mục qua FormData
    if (data instanceof FormData) {
      return api.post('/categories', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.post('/categories', data);
  },
  update: (id, data) => {
    if (data instanceof FormData) {
      return api.put(`/categories/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.put(`/categories/${id}`, data);
  },
  delete: (id) => api.delete(`/categories/${id}`),                       // Xóa mềm danh mục
  getDeleted: () => api.get('/categories/deleted'),                       // Lấy danh mục đã xóa mềm
  restore: (id) => api.patch(`/categories/${id}/restore`),                // Khôi phục danh mục
  forceDelete: (id) => api.delete(`/categories/${id}/force`),             // Xóa vĩnh viễn danh mục
};

// ==================== ORDERS API ====================
// Các hàm CRUD cho quản lý đơn hàng
export const orderAPI = {
  create: (data) => api.post('/orders', data),                           // Tạo đơn hàng mới (khách hàng đặt hàng)
  getUserOrders: () => api.get('/orders'),                                // Lấy danh sách đơn hàng của user hiện tại
  getAllOrders: () => api.get('/orders/all'),                              // Lấy tất cả đơn hàng (Admin/Employee)
  getById: (id) => api.get(`/orders/${id}`),                              // Lấy chi tiết 1 đơn hàng
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),      // Cập nhật trạng thái đơn hàng (Confirmed, Cancelled...)
  update: (id, data) => api.put(`/orders/${id}`, data),                   // Cập nhật thông tin đơn hàng (Admin)
  deleteOrder: (id) => api.delete(`/orders/${id}`),                       // Xóa mềm đơn hàng
  getDeleted: () => api.get('/orders/deleted'),                           // Lấy đơn hàng đã xóa mềm
  restore: (id) => api.patch(`/orders/${id}/restore`),                    // Khôi phục đơn hàng
  forceDelete: (id) => api.delete(`/orders/${id}/force`),                 // Xóa vĩnh viễn đơn hàng
  getRevenue: () => api.get('/revenue'),                                  // Lấy tổng doanh thu (chỉ tính đơn Completed)
};

// ==================== SITE SETTINGS API ====================
// Các hàm CRUD cho quản lý cấu hình website (hotline, địa chỉ, giờ mở cửa...)
export const settingAPI = {
  getAll: () => api.get('/settings'),                                     // Lấy tất cả cài đặt dạng object {key: value}
  getList: () => api.get('/settings/list'),                               // Lấy tất cả cài đặt dạng mảng [{id, key, value}]
  getByKey: (key) => api.get(`/settings/${key}`),                         // Lấy 1 cài đặt theo key
  upsert: (data) => api.post('/settings', data),                          // Tạo mới hoặc cập nhật 1 cài đặt
  bulkUpsert: (settings) => api.put('/settings/bulk', { settings }),       // Cập nhật nhiều cài đặt cùng lúc
  uploadHeroImages: (formData) => api.post('/settings/hero/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }), // Upload hero images
  delete: (key) => api.delete(`/settings/${key}`),                        // Xóa 1 cài đặt
};

export default api; // Export instance axios mặc định để sử dụng ở nơi khác nếu cần
