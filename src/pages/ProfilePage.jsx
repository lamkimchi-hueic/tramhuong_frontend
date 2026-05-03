import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI, orderAPI, authAPI } from '../services/api';
import { FiUser, FiMapPin, FiPhone, FiPackage, FiEdit2, FiCheckCircle } from 'react-icons/fi';

export default function ProfilePage() {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ phone: '', address: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchOrders();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const res = await authAPI.getMe();
      setUserInfo(res.data);
      setFormData({
        phone: res.data.phone || '',
        address: res.data.address || '',
      });
    } catch (err) {
      console.error('Lỗi khi tải thông tin user:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getUserOrders(user.id_user);
      setOrders(res.data);
    } catch (err) {
      console.error('Lỗi khi tải đơn hàng:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await userAPI.update(user.id_user, formData);
      setMessage('Cập nhật thông tin thành công!');
      setIsEditing(false);
      fetchUserData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Cập nhật thất bại');
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-50';
      case 'Confirmed': return 'text-blue-600 bg-blue-50';
      case 'Cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  if (loading) return <div className="pt-32 text-center text-gray-500">Đang tải...</div>;

  return (
    <main className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* User Info Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-24 bg-[var(--color-primary)]"></div>
              <div className="relative mt-4">
                <div className="w-24 h-24 bg-white rounded-full mx-auto p-1 shadow-md border-4 border-white">
                  <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-[var(--color-primary)]">
                    <FiUser size={40} />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mt-4">{userInfo?.username}</h2>
                <p className="text-sm text-gray-500">{userInfo?.role}</p>
              </div>

              <div className="mt-8 space-y-4 text-left">
                <div className="flex items-center gap-3 text-gray-600">
                  <FiPhone className="text-gray-400" />
                  <span className="text-sm">{userInfo?.phone || 'Chưa cập nhật số điện thoại'}</span>
                </div>
                <div className="flex items-start gap-3 text-gray-600">
                  <FiMapPin className="text-gray-400 mt-1 flex-shrink-0" />
                  <span className="text-sm">{userInfo?.address || 'Chưa cập nhật địa chỉ'}</span>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mt-8 w-full py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <FiEdit2 size={14} /> Chỉnh sửa thông tin
              </button>

              {message && (
                <div className="mt-4 p-2 bg-green-50 text-green-600 text-xs rounded-md flex items-center justify-center gap-1">
                  <FiCheckCircle size={12} /> {message}
                </div>
              )}
            </div>

            {isEditing && (
              <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
                <h3 className="font-bold text-gray-800 mb-4">Cập nhật thông tin</h3>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Số điện thoại</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-[var(--color-primary)] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Địa chỉ</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-[var(--color-primary)] outline-none h-24 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[var(--color-primary)] text-white font-bold rounded-lg hover:bg-[var(--color-primary-dark)]"
                  >
                    Lưu thay đổi
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FiPackage className="text-[var(--color-primary)]" /> Lịch sử đơn hàng
                </h2>
                <span className="text-xs font-bold text-gray-400 uppercase">{orders.length} đơn hàng</span>
              </div>

              <div className="divide-y divide-gray-50">
                {orders.length === 0 ? (
                  <div className="p-16 text-center text-gray-400">
                    <p>Bạn chưa có đơn hàng nào.</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id_order} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                        <div>
                          <p className="font-bold text-gray-800">Đơn hàng #{order.id_order}</p>
                          <p className="text-xs text-gray-400">{new Date(order.order_date).toLocaleDateString('vi-VN')}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {order.status === 'Pending' ? 'Đang chờ' : order.status}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {order.Products?.map((p, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {p.product_name} <span className="text-gray-400">x{p.ProductOrder?.product_quantity}</span>
                            </span>
                            <span className="font-medium text-gray-800">{formatPrice(p.ProductOrder?.product_price)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-dashed border-gray-100 flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-800">Tổng cộng:</span>
                        <span className="text-lg font-bold text-[var(--color-primary)]">{formatPrice(order.total_amount)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
