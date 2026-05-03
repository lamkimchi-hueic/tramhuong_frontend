import { useState, useEffect } from 'react';
import { productAPI, categoryAPI, orderAPI } from '../../services/api';
import { FiUsers, FiBox, FiList, FiShoppingCart, FiDollarSign } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    usersCount: 0,
    productsCount: 0,
    categoriesCount: 0,
    ordersCount: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes, ordersRes] = await Promise.all([
          productAPI.getAll(),
          categoryAPI.getAll(),
          orderAPI.getAllOrders().catch(() => ({ data: [] }))
        ]);
        
        let revenueVal = 0;
        try {
          const revRes = await orderAPI.getRevenue();
          // Adjust logic based on actual backend return format for revenue
          revenueVal = revRes.data.total || Array.isArray(revRes.data) ? revRes.data.reduce((sum, item) => sum + (item.total || 0), 0) : 0;
        } catch { /* ignore revenue error if endpoint not fully ready */ }

        setStats({
          productsCount: productsRes.data?.length || 0,
          categoriesCount: categoriesRes.data?.length || 0,
          ordersCount: ordersRes.data?.length || 0,
          revenue: revenueVal,
        });
      } catch (error) {
        console.error('Lỗi khi tải thống kê', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Sản Phẩm', value: stats.productsCount, icon: FiBox, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Danh Mục', value: stats.categoriesCount, icon: FiList, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Đơn Hàng', value: stats.ordersCount, icon: FiShoppingCart, color: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-primary-50)]' },
    { title: 'Doanh Thu (VNĐ)', value: new Intl.NumberFormat('vi-VN').format(stats.revenue), icon: FiDollarSign, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  if (loading) {
    return <div className="p-8 text-center text-gray-500 flex items-center justify-center h-full">Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tổng Quan Hệ Thống</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${card.bg}`}>
                <Icon size={24} className={card.color} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Chào mừng đến với Admin Panel</h3>
        <p className="text-gray-600">
          Sử dụng thanh menu bên trái để điều hướng đến các trang quản lý cụ thể. Bạn có thể thêm, sửa, xóa sản phẩm, 
          quản lý danh mục, xử lý các đơn đặt hàng và quản lý người dùng theo phân quyền của mình.
        </p>
      </div>
    </div>
  );
}
