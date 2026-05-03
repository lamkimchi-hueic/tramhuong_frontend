import { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import { FiTrash2, FiPlus, FiEdit2, FiX, FiRotateCcw, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrash, setShowTrash] = useState(false);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Customer',
    phone: ''
  });

  useEffect(() => {
    if (currentUser?.role !== 'Admin') {
      navigate('/admin');
      return;
    }
    fetchUsers();
  }, [currentUser, navigate]);

  useEffect(() => {
    if (showTrash) fetchDeletedUsers();
  }, [showTrash]);

  const fetchDeletedUsers = async () => {
    try {
      const res = await userAPI.getDeleted();
      setDeletedUsers(res.data);
    } catch (error) {
      console.error('Lỗi khi tải người dùng đã xóa:', error);
    }
  };

  const handleRestore = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục người dùng này?')) {
      try {
        await userAPI.restore(id);
        fetchDeletedUsers();
        fetchUsers();
      } catch (error) {
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi khôi phục');
      }
    }
  };

  const handleForceDelete = async (id) => {
    if (window.confirm('XÓA VĨNH VIỄN người dùng này? Hành động này không thể hoàn tác!')) {
      try {
        await userAPI.forceDelete(id);
        fetchDeletedUsers();
      } catch (error) {
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa vĩnh viễn');
      }
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userAPI.getAll();
      setUsers(res.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingId(user.id_user);
      setFormData({
        username: user.username,
        password: '', // Don't show password
        role: user.role,
        phone: user.phone || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        username: '',
        password: '',
        role: 'Customer',
        phone: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Only include password if it's not empty
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await userAPI.update(editingId, updateData);
      } else {
        if (!formData.password) {
          alert('Vui lòng nhập mật khẩu cho người dùng mới');
          return;
        }
        await userAPI.create(formData);
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa (xóa mềm) người dùng này?')) {
      try {
        await userAPI.delete(id);
        fetchUsers();
      } catch (error) {
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa');
      }
    }
  };

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
            <h2 className="text-xl font-bold text-gray-800">{showTrash ? 'Thùng rác - Người Dùng' : 'Quản lý Người Dùng'}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowTrash(!showTrash)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-semibold ${
                showTrash ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FiTrash2 size={16} /> Thùng rác {deletedUsers.length > 0 && `(${deletedUsers.length})`}
            </button>
            {!showTrash && (
              <button 
                onClick={() => openModal()}
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg flex items-center gap-2 hover:bg-[var(--color-primary-dark)] transition-colors text-sm font-semibold"
              >
                <FiPlus size={16} /> Thêm Người Dùng
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
                  <th className="p-4 font-semibold">Tài Khoản</th>
                  <th className="p-4 font-semibold">Quyền</th>
                  <th className="p-4 font-semibold">Số điện thoại</th>
                  <th className="p-4 font-semibold text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deletedUsers.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500">Thùng rác trống</td></tr>
                ) : (
                  deletedUsers.map((u) => (
                    <tr key={u.id_user} className="hover:bg-gray-50 transition-colors bg-gray-50/50">
                      <td className="p-4 text-gray-400">{u.id_user}</td>
                      <td className="p-4 font-semibold text-gray-400 line-through">{u.username}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-400">{u.role}</span>
                      </td>
                      <td className="p-4 text-gray-400">{u.phone || '-'}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleRestore(u.id_user)}
                            className="px-3 py-1.5 rounded bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition-colors text-sm font-semibold flex items-center gap-1.5"
                          >
                            <FiRotateCcw size={14} /> Khôi phục
                          </button>
                          <button 
                            onClick={() => handleForceDelete(u.id_user)}
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
                  <th className="p-4 font-semibold">Tài Khoản</th>
                  <th className="p-4 font-semibold">Quyền</th>
                  <th className="p-4 font-semibold">Số điện thoại</th>
                  <th className="p-4 font-semibold text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 min-h-[200px]">
                {users.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500">Không có dữ liệu</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id_user} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-gray-600">{u.id_user}</td>
                      <td className="p-4 font-semibold text-gray-800">{u.username}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                          u.role === 'Admin' ? 'bg-red-50 text-red-600' :
                          u.role === 'Employee' ? 'bg-blue-50 text-blue-600' :
                          'bg-green-50 text-green-600'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">{u.phone || '-'}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => openModal(u)}
                            className="w-8 h-8 flex items-center justify-center rounded bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                            title="Sửa"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          {currentUser.id_user !== u.id_user && (
                            <button 
                              onClick={() => handleDelete(u.id_user)}
                              className="w-8 h-8 flex items-center justify-center rounded bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                              title="Xóa"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 text-lg">
                {editingId ? 'Sửa Người Dùng' : 'Thêm Người Dùng Mới'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Tên đăng nhập *</label>
                <input 
                  required
                  type="text" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[var(--color-primary)] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Mật khẩu {editingId && '(Để trống nếu không đổi)'}
                </label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[var(--color-primary)] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Vai trò</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[var(--color-primary)] outline-none"
                >
                  <option value="Customer">Customer</option>
                  <option value="Employee">Employee</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Số điện thoại</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[var(--color-primary)] outline-none"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded font-semibold text-sm hover:bg-gray-200">
                  Hủy
                </button>
                <button type="submit" className="flex-1 py-2 bg-[var(--color-primary)] text-white rounded font-semibold text-sm hover:bg-[var(--color-primary-dark)]">
                  Lưu Lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
