import { useState, useEffect, useRef } from 'react';
import { productAPI, categoryAPI } from '../../services/api';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiImage, FiUpload, FiRotateCcw, FiArrowLeft, FiMinus } from 'react-icons/fi';

const API_URL = 'http://localhost:3000';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrash, setShowTrash] = useState(false);
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [variants, setVariants] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    product_name: '',
    id_category: '',
    product_price: '',
    product_status: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (showTrash) fetchDeletedProducts();
  }, [showTrash]);

  const fetchDeletedProducts = async () => {
    try {
      const res = await productAPI.getDeleted();
      setDeletedProducts(res.data);
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm đã xóa:', error);
    }
  };

  const handleRestore = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục sản phẩm này?')) {
      try {
        await productAPI.restore(id);
        fetchDeletedProducts();
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi khôi phục');
      }
    }
  };

  const handleForceDelete = async (id) => {
    if (window.confirm('XÓA VĨNH VIỄN sản phẩm này? Hành động này không thể hoàn tác!')) {
      try {
        await productAPI.forceDelete(id);
        fetchDeletedProducts();
      } catch (error) {
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa vĩnh viễn');
      }
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([productAPI.getAll(), categoryAPI.getAll()]);
      setProducts(pRes.data);
      setCategories(cRes.data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingId(product.id_product);
      setFormData({
        product_name: product.product_name,
        id_category: product.id_category || '',
        product_price: product.product_price,
        product_status: product.product_status ? 1 : 0
      });
      setVariants(product.variants?.map(v => ({ size: v.size, price: v.price, stock: v.stock })) || []);
      setImagePreview(product.image_url ? `${API_URL}${product.image_url}` : null);
    } else {
      setEditingId(null);
      setFormData({ product_name: '', id_category: categories[0]?.id_category || '', product_price: '', product_status: 1 });
      setVariants([]);
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
      fd.append('product_name', formData.product_name);
      fd.append('id_category', parseInt(formData.id_category));
      fd.append('product_price', parseFloat(formData.product_price));
      fd.append('product_status', formData.product_status === 1 || formData.product_status === '1');
      if (imageFile) {
        fd.append('image', imageFile);
      }

      let productId = editingId;
      if (editingId) {
        await productAPI.update(editingId, fd);
      } else {
        const res = await productAPI.create(fd);
        productId = res.data.id_product;
      }
      // Save variants
      if (productId && variants.length > 0) {
        await productAPI.upsertVariants(productId, variants);
      } else if (productId && variants.length === 0 && editingId) {
        await productAPI.upsertVariants(productId, []);
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
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await productAPI.delete(id);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa');
      }
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price);

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải...</div>;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            {showTrash && (
              <button
                onClick={() => setShowTrash(false)}
                className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-sm font-semibold flex items-center gap-1.5"
              >
                <FiArrowLeft size={16} /> Quay lại
              </button>
            )}
            <h2 className="text-xl font-bold text-gray-800">{showTrash ? 'Thùng rác - Sản Phẩm' : 'Quản lý Sản Phẩm'}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowTrash(!showTrash)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-semibold ${
                showTrash ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FiTrash2 size={16} /> Thùng rác {deletedProducts.length > 0 && `(${deletedProducts.length})`}
            </button>
            {!showTrash && (
              <button 
                onClick={() => openModal()}
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg flex items-center gap-2 hover:bg-[var(--color-primary-dark)] transition-colors text-sm font-semibold"
              >
                <FiPlus size={16} /> Thêm Sản Phẩm Mới
              </button>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {showTrash ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-red-50 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold w-16">Ảnh</th>
                  <th className="p-4 font-semibold">Tên SP</th>
                  <th className="p-4 font-semibold">Danh Mục</th>
                  <th className="p-4 font-semibold">Giá (VNĐ)</th>
                  <th className="p-4 font-semibold text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deletedProducts.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500">Thùng rác trống</td></tr>
                ) : (
                  deletedProducts.map((p) => (
                    <tr key={p.id_product} className="hover:bg-gray-50 transition-colors bg-gray-50/50">
                      <td className="p-4">
                        {p.image_url ? (
                          <img src={`${API_URL}${p.image_url}`} alt={p.product_name} className="w-12 h-12 object-cover rounded-lg border border-gray-100 opacity-60" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300"><FiImage size={18} /></div>
                        )}
                      </td>
                      <td className="p-4 font-semibold text-gray-400 max-w-[200px] truncate line-through" title={p.product_name}>{p.product_name}</td>
                      <td className="p-4 text-gray-400">{p.category?.category_name || '-'}</td>
                      <td className="p-4 text-gray-400 font-semibold">{formatPrice(p.product_price)}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleRestore(p.id_product)}
                            className="px-3 py-1.5 rounded bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition-colors text-sm font-semibold flex items-center gap-1.5"
                          >
                            <FiRotateCcw size={14} /> Khôi phục
                          </button>
                          <button 
                            onClick={() => handleForceDelete(p.id_product)}
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
                  <th className="p-4 font-semibold w-16">Ảnh</th>
                  <th className="p-4 font-semibold">Tên SP</th>
                  <th className="p-4 font-semibold">Danh Mục</th>
                  <th className="p-4 font-semibold">Giá (VNĐ)</th>
                  <th className="p-4 font-semibold">Biến thể</th>
                  <th className="p-4 font-semibold">Trạng Thái</th>
                  <th className="p-4 font-semibold text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 ? (
                  <tr><td colSpan="7" className="p-8 text-center text-gray-500">Không có dữ liệu</td></tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id_product} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        {p.image_url ? (
                          <img 
                            src={`${API_URL}${p.image_url}`} 
                            alt={p.product_name}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                            <FiImage size={18} />
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-semibold text-gray-800 max-w-[200px] truncate" title={p.product_name}>
                        {p.product_name}
                      </td>
                      <td className="p-4 text-gray-600">
                        {p.category?.category_name || '-'}
                      </td>
                      <td className="p-4 text-[var(--color-primary)] font-semibold">{formatPrice(p.product_price)}</td>
                      <td className="p-4">
                        {p.variants && p.variants.length > 0 ? (
                          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-semibold">{p.variants.length} size</span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                          p.product_status ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {p.product_status ? 'Còn hàng' : 'Hết hàng'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => openModal(p)}
                            className="w-8 h-8 flex items-center justify-center rounded bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id_product)}
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
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
              <h3 className="font-bold text-gray-800 text-lg">
                {editingId ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Ảnh sản phẩm</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative cursor-pointer border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-[var(--color-primary)] transition-colors group"
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-white text-sm font-medium flex items-center gap-2">
                          <FiUpload size={16} /> Đổi ảnh
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-36 flex flex-col items-center justify-center text-gray-400 gap-2">
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
                <label className="block text-sm font-semibold mb-1 text-gray-700">Tên Sản Phẩm *</label>
                <input 
                  required
                  type="text" 
                  value={formData.product_name}
                  onChange={(e) => setFormData({...formData, product_name: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[var(--color-primary)] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Giá (VNĐ) *</label>
                <input 
                  required
                  type="number" 
                  min="0"
                  value={formData.product_price}
                  onChange={(e) => setFormData({...formData, product_price: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[var(--color-primary)] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Danh Mục *</label>
                <select 
                  required
                  value={formData.id_category}
                  onChange={(e) => setFormData({...formData, id_category: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[var(--color-primary)] outline-none"
                >
                  <option value="" disabled>-- Chọn danh mục --</option>
                  {categories.map((c) => (
                    <option key={c.id_category} value={c.id_category}>{c.category_name}</option>
                  ))}
                </select>
              </div>
              {/* Biến thể (Size / Giá / Tồn kho) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">Biến thể (Size)</label>
                  <button
                    type="button"
                    onClick={() => setVariants([...variants, { size: '', price: '', stock: 0 }])}
                    className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md font-semibold hover:bg-blue-100 flex items-center gap-1"
                  >
                    <FiPlus size={12} /> Thêm size
                  </button>
                </div>
                {variants.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Chưa có biến thể. Sản phẩm sẽ dùng giá mặc định ở trên.</p>
                ) : (
                  <div className="space-y-2">
                    {variants.map((v, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Size (VD: 10g, 20g...)"
                          value={v.size}
                          onChange={(e) => {
                            const copy = [...variants];
                            copy[idx].size = e.target.value;
                            setVariants(copy);
                          }}
                          className="flex-1 border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:border-[var(--color-primary)] outline-none"
                        />
                        <input
                          type="number"
                          placeholder="Giá"
                          min="0"
                          value={v.price}
                          onChange={(e) => {
                            const copy = [...variants];
                            copy[idx].price = e.target.value;
                            setVariants(copy);
                          }}
                          className="w-28 border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:border-[var(--color-primary)] outline-none"
                        />
                        <input
                          type="number"
                          placeholder="SL"
                          min="0"
                          value={v.stock}
                          onChange={(e) => {
                            const copy = [...variants];
                            copy[idx].stock = e.target.value;
                            setVariants(copy);
                          }}
                          className="w-16 border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:border-[var(--color-primary)] outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setVariants(variants.filter((_, i) => i !== idx))}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <FiMinus size={14} />
                        </button>
                      </div>
                    ))}
                    <p className="text-[10px] text-gray-400">Size • Giá (VNĐ) • Số lượng tồn</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Trạng Thái</label>
                <select 
                  value={formData.product_status}
                  onChange={(e) => setFormData({...formData, product_status: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[var(--color-primary)] outline-none"
                >
                  <option value={1}>Còn hàng</option>
                  <option value={0}>Hết hàng</option>
                </select>
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
