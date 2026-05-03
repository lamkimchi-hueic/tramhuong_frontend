import { useState, useEffect } from 'react';
import { orderAPI, userAPI, productAPI } from '../../services/api';
import { FiTrash2, FiRotateCcw, FiArrowLeft, FiPlus, FiX, FiMinus } from 'react-icons/fi';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrash, setShowTrash] = useState(false);
  const [deletedOrders, setDeletedOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchUsersAndProducts();
  }, []);

  const fetchUsersAndProducts = async () => {
    try {
      const [usersRes, productsRes] = await Promise.all([
        userAPI.getAll(),
        productAPI.getAll()
      ]);
      setUsers(usersRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  };

  const [matchedUser, setMatchedUser] = useState(null);
  const [guestName, setGuestName] = useState('');

  const openCreateModal = () => {
    setSelectedUser('');
    setOrderItems([]);
    setShippingPhone('');
    setShippingAddress('');
    setMatchedUser(null);
    setGuestName('');
    setShowModal(true);
  };

  const normalizePhone = (p) => (p || '').replace(/\s+/g, '').trim();

  const handlePhoneChange = (phone) => {
    setShippingPhone(phone);
    const normalized = normalizePhone(phone);
    if (normalized.length >= 3) {
      const found = users.find(u => u.phone && normalizePhone(u.phone) === normalized);
      if (found) {
        setMatchedUser(found);
        setSelectedUser(String(found.id_user));
        setShippingAddress(found.address || '');
      } else {
        setMatchedUser(null);
        setSelectedUser('');
      }
    } else {
      setMatchedUser(null);
      setSelectedUser('');
    }
  };

  const addProduct = (productId) => {
    if (!productId) return;
    const existing = orderItems.find(i => i.id_product === parseInt(productId));
    if (existing) {
      setOrderItems(orderItems.map(i => i.id_product === parseInt(productId) ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      const product = products.find(p => p.id_product === parseInt(productId));
      if (product) {
        setOrderItems([...orderItems, { id_product: product.id_product, product_name: product.product_name, price: product.product_price, quantity: 1 }]);
      }
    }
  };

  const updateItemQty = (id, qty) => {
    if (qty < 1) {
      setOrderItems(orderItems.filter(i => i.id_product !== id));
    } else {
      setOrderItems(orderItems.map(i => i.id_product === id ? { ...i, quantity: qty } : i));
    }
  };

  const removeItem = (id) => setOrderItems(orderItems.filter(i => i.id_product !== id));

  const orderTotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCreateOrder = async () => {
    if (orderItems.length === 0) return alert('Vui lòng thêm ít nhất 1 sản phẩm!');
    if (!shippingPhone) return alert('Vui lòng nhập số điện thoại!');
    if (!shippingAddress) return alert('Vui lòng nhập địa chỉ giao hàng!');

    setSubmitting(true);
    try {
      await orderAPI.create({
        id_user: selectedUser ? parseInt(selectedUser) : null,
        total_amount: orderTotal,
        shipping_phone: shippingPhone,
        shipping_address: shippingAddress,
        items: orderItems.map(i => ({ id_product: i.id_product, quantity: i.quantity, price: i.price }))
      });
      setShowModal(false);
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (showTrash) fetchDeletedOrders();
  }, [showTrash]);

  const fetchDeletedOrders = async () => {
    try {
      const res = await orderAPI.getDeleted();
      setDeletedOrders(res.data);
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng đã xóa:', error);
    }
  };

  const handleRestore = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục đơn hàng này?')) {
      try {
        await orderAPI.restore(id);
        fetchDeletedOrders();
        fetchOrders();
      } catch (error) {
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi khôi phục');
      }
    }
  };

  const handleForceDelete = async (id) => {
    if (window.confirm('XÓA VĨNH VIỄN đơn hàng này? Hành động này không thể hoàn tác!')) {
      try {
        await orderAPI.forceDelete(id);
        fetchDeletedOrders();
      } catch (error) {
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa vĩnh viễn');
      }
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderAPI.getAllOrders();
      setOrders(res.data);
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await orderAPI.updateStatus(id, { status: newStatus });
      fetchOrders();
    } catch (error) {
      alert('Cập nhật trạng thái thất bại. ' + (error.response?.data?.message || ''));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      try {
        await orderAPI.deleteOrder(id);
        fetchOrders();
      } catch (error) {
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa');
      }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-50 text-green-600 border border-green-200';
      case 'Confirmed': return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'Cancelled': return 'bg-red-50 text-red-600 border border-red-200';
      default: return 'bg-yellow-50 text-yellow-600 border border-yellow-200'; // Pending
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price || 0);

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải...</div>;

  return (
    <>
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {showTrash && (
            <button
              onClick={() => setShowTrash(false)}
              className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-sm font-semibold flex items-center gap-1.5"
            >
              <FiArrowLeft size={16} /> Quay lại
            </button>
          )}
          <h2 className="text-xl font-bold text-gray-800">{showTrash ? 'Thùng rác - Đơn Hàng' : 'Quản lý Đơn Hàng'}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowTrash(!showTrash)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-semibold ${
              showTrash ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FiTrash2 size={16} /> Thùng rác {deletedOrders.length > 0 && `(${deletedOrders.length})`}
          </button>
          {!showTrash && (
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg flex items-center gap-2 hover:bg-[var(--color-primary-dark)] transition-colors text-sm font-semibold"
            >
              <FiPlus size={16} /> Thêm Đơn Hàng
            </button>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {showTrash ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-red-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Khách Hàng</th>
                <th className="p-4 font-semibold text-right">Tổng Tiền (VNĐ)</th>
                <th className="p-4 font-semibold text-center">Trạng Thái</th>
                <th className="p-4 font-semibold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {deletedOrders.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Thùng rác trống</td></tr>
              ) : (
                deletedOrders.map((o) => (
                  <tr key={o.id_order} className="hover:bg-gray-50 transition-colors bg-gray-50/50">
                    <td className="p-4 font-medium text-gray-400 line-through">#{o.id_order}</td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-400">{o.user?.username || 'Khách vãng lai'}</p>
                      <p className="text-xs text-gray-400">SĐT: {o.shipping_phone || o.user?.phone || '-'}</p>
                    </td>
                    <td className="p-4 text-right font-semibold text-gray-400">
                      {formatPrice(o.total_amount)}
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-400">
                        {o.status || 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleRestore(o.id_order)}
                          className="px-3 py-1.5 rounded bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition-colors text-sm font-semibold flex items-center gap-1.5"
                        >
                          <FiRotateCcw size={14} /> Khôi phục
                        </button>
                        <button 
                          onClick={() => handleForceDelete(o.id_order)}
                          className="px-3 py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors text-sm font-semibold flex items-center gap-1.5"
                        >
                          <FiTrash2 size={14} /> Xóa vĩnh viễn
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Khách Hàng</th>
                <th className="p-4 font-semibold text-right">Tổng Tiền (VNĐ)</th>
                <th className="p-4 font-semibold text-center">Trạng Thái</th>
                <th className="p-4 font-semibold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Không có đơn hàng nào</td></tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id_order} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-800">#{o.id_order}</td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-800">{o.user?.username || 'Khách vãng lai'}</p>
                      <p className="text-xs text-gray-500 font-medium">SĐT: {o.shipping_phone || o.user?.phone || '-'}</p>
                      <p className="text-[10px] text-gray-400 max-w-[200px] leading-tight">ĐC: {o.shipping_address || o.user?.address || '-'}</p>
                    </td>
                    <td className="p-4 text-right font-semibold text-[var(--color-primary)]">
                      {formatPrice(o.total_amount)}
                    </td>
                    <td className="p-4 text-center">
                      <select
                        value={o.status || 'Pending'}
                        onChange={(e) => handleStatusChange(o.id_order, e.target.value)}
                        className={`text-sm px-2 py-1.5 rounded-md font-medium outline-none cursor-pointer appearance-none text-center ${getStatusColor(o.status || 'Pending')}`}
                      >
                        <option value="Pending">Đang xử lý</option>
                        <option value="Confirmed">Đã xác nhận</option>
                        <option value="Completed">Hoàn thành</option>
                        <option value="Cancelled">Đã hủy</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleDelete(o.id_order)}
                        className="w-8 h-8 flex items-center justify-center mx-auto rounded bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        title="Xóa"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>

    {/* Modal Thêm Đơn Hàng */}
    {showModal && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
            <h3 className="text-lg font-bold text-gray-800">Thêm Đơn Hàng Mới</h3>
            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FiX size={20} /></button>
          </div>
          <div className="p-6 space-y-5">
            {/* Nhập SĐT để tìm khách hàng */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Số điện thoại khách hàng</label>
              <input
                type="text"
                value={shippingPhone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="Nhập SĐT để tìm khách hàng..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-[var(--color-primary)] outline-none"
              />
              {shippingPhone.trim().length >= 3 && (
                <div className="mt-2">
                  {matchedUser ? (
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm">
                      <span className="text-green-600 font-semibold">✓</span>
                      <span className="text-green-700">Khách hàng: <strong>{matchedUser.username}</strong></span>
                    </div>
                  ) : (
                    <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                      Khách hàng mới — đơn hàng sẽ được tạo cho khách vãng lai
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tên khách hàng mới (chỉ hiển thị khi không tìm thấy user) */}
            {shippingPhone.trim().length >= 3 && !matchedUser && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên khách hàng</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Nhập tên khách hàng..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-[var(--color-primary)] outline-none"
                />
              </div>
            )}

            {/* Địa chỉ giao hàng */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Địa chỉ giao hàng</label>
              <input
                type="text"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Nhập địa chỉ giao hàng..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-[var(--color-primary)] outline-none"
              />
            </div>

            {/* Thêm sản phẩm */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Thêm sản phẩm</label>
              <select
                onChange={(e) => { addProduct(e.target.value); e.target.value = ''; }}
                defaultValue=""
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-[var(--color-primary)] outline-none"
              >
                <option value="">-- Chọn sản phẩm --</option>
                {products.map(p => <option key={p.id_product} value={p.id_product}>{p.product_name} - {formatPrice(p.product_price)} đ</option>)}
              </select>
            </div>

            {/* Danh sách sản phẩm đã chọn */}
            {orderItems.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                      <th className="p-3 text-left">Sản phẩm</th>
                      <th className="p-3 text-center w-32">Số lượng</th>
                      <th className="p-3 text-right">Thành tiền</th>
                      <th className="p-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orderItems.map(item => (
                      <tr key={item.id_product}>
                        <td className="p-3 font-medium text-gray-800">{item.product_name}</td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => updateItemQty(item.id_product, item.quantity - 1)} className="p-1 hover:bg-gray-100 rounded"><FiMinus size={14} /></button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button onClick={() => updateItemQty(item.id_product, item.quantity + 1)} className="p-1 hover:bg-gray-100 rounded"><FiPlus size={14} /></button>
                          </div>
                        </td>
                        <td className="p-3 text-right font-semibold text-[var(--color-primary)]">{formatPrice(item.price * item.quantity)} đ</td>
                        <td className="p-3"><button onClick={() => removeItem(item.id_product)} className="text-red-400 hover:text-red-600"><FiX size={16} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-3 bg-gray-50 flex justify-between items-center font-bold text-gray-800">
                  <span>Tổng cộng:</span>
                  <span className="text-[var(--color-primary)]">{formatPrice(orderTotal)} đ</span>
                </div>
              </div>
            )}
          </div>
          <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
            <button onClick={() => setShowModal(false)} className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-200">Hủy</button>
            <button
              onClick={handleCreateOrder}
              disabled={submitting}
              className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
            >
              {submitting ? 'Đang tạo...' : 'Tạo Đơn Hàng'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
