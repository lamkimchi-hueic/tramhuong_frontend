import { useState, useEffect, useRef } from 'react';
import { categoryAPI, resolveImageUrl } from '../../services/api';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiRotateCcw, FiArrowLeft, FiImage, FiUpload } from 'react-icons/fi';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrash, setShowTrash] = useState(false);
  const [deletedCategories, setDeletedCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({ category_name: '' });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (showTrash) fetchDeletedCategories();
  }, [showTrash]);

  const fetchDeletedCategories = async () => {
    try {
      const res = await categoryAPI.getDeleted();
      setDeletedCategories(res.data);
    } catch (error) {
      console.error('Lỗi khi tải danh mục đã xóa:', error);
    }
  };

  const handleRestore = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục danh mục này?')) {
      try {
        await categoryAPI.restore(id);
        fetchDeletedCategories();
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi khôi phục');
      }
    }
  };

  const handleForceDelete = async (id) => {
    if (window.confirm('XÓA VĨNH VIỄN danh mục này? Hành động này không thể hoàn tác!')) {
      try {
        await categoryAPI.forceDelete(id);
        fetchDeletedCategories();
      } catch (error) {
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa vĩnh viễn');
      }
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingId(category.id_category);
      setFormData({ category_name: category.category_name });
      setImagePreview(category.image_url ? resolveImageUrl(category.image_url) : null);
    } else {
      setEditingId(null);
      setFormData({ category_name: '' });
      setImagePreview(null);
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('category_name', formData.category_name);
      if (imageFile) fd.append('image', imageFile);

      if (editingId) {
        await categoryAPI.update(editingId, fd);
      } else {
        await categoryAPI.create(fd);
      }
      setShowModal(false);
      setImageFile(null);
      setImagePreview(null);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này? Các sản phẩm trong danh mục có thể bị ảnh hưởng.')) {
      try {
        await categoryAPI.delete(id);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa');
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải...</div>;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-4xl mx-auto">
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
            <h2 className="text-xl font-bold text-gray-800">{showTrash ? 'Thùng rác - Danh Mục' : 'Quản lý Danh Mục'}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowTrash(!showTrash)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-semibold ${
                showTrash ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FiTrash2 size={16} /> Thùng rác {deletedCategories.length > 0 && `(${deletedCategories.length})`}
            </button>
            {!showTrash && (
              <button 
                onClick={() => openModal()}
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg flex items-center gap-2 hover:bg-[var(--color-primary-dark)] transition-colors text-sm font-semibold"
              >
                <FiPlus size={16} /> Thêm Danh Mục
              </button>
            )}
          </div>
        </div>
        
        {showTrash ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-red-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold w-24">ID</th>
                <th className="p-4 font-semibold">Tên Danh Mục</th>
                <th className="p-4 font-semibold text-center w-40">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {deletedCategories.length === 0 ? (
                <tr><td colSpan="3" className="p-8 text-center text-gray-500">Thùng rác trống</td></tr>
              ) : (
                deletedCategories.map((c) => (
                  <tr key={c.id_category} className="hover:bg-gray-50 transition-colors bg-gray-50/50">
                    <td className="p-4 text-gray-400">{c.id_category}</td>
                    <td className="p-4 font-semibold text-gray-400 line-through">{c.category_name}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleRestore(c.id_category)}
                          className="px-3 py-1.5 rounded bg-[var(--color-primary-50)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors text-sm font-semibold flex items-center gap-1.5"
                        >
                          <FiRotateCcw size={14} /> Khôi phục
                        </button>
                        <button 
                          onClick={() => handleForceDelete(c.id_category)}
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
                <th className="p-4 font-semibold w-24">ID</th>
                <th className="p-4 font-semibold w-16">Ảnh</th>
                <th className="p-4 font-semibold">Tên Danh Mục</th>
                <th className="p-4 font-semibold text-center w-32">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-500">Không có dữ liệu</td></tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id_category} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-600">{c.id_category}</td>
                    <td className="p-4">
                      {c.image_url ? (
                        <img src={resolveImageUrl(c.image_url)} alt={c.category_name} className="w-12 h-12 object-cover rounded-lg border border-gray-100" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300"><FiImage size={18} /></div>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-gray-800">{c.category_name}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openModal(c)}
                          className="w-8 h-8 flex items-center justify-center rounded bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(c.id_category)}
                          className="w-8 h-8 flex items-center justify-center rounded bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 text-lg">
                {editingId ? 'Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Ảnh danh mục</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative cursor-pointer border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-[var(--color-primary)] transition-colors group"
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-white text-sm font-medium flex items-center gap-2"><FiUpload size={16} /> Đổi ảnh</div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-32 flex flex-col items-center justify-center text-gray-400 gap-2">
                      <FiImage size={32} />
                      <span className="text-sm">Click để chọn ảnh</span>
                      <span className="text-xs text-gray-300">JPG, PNG, WEBP (tối đa 5MB)</span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Tên Danh Mục *</label>
                <input 
                  required
                  type="text" 
                  value={formData.category_name}
                  onChange={(e) => setFormData({category_name: e.target.value})}
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
