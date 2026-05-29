import { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { useToast } from '../../context/ToastContext';
import { Plus, Search, Trash2, Eye, X, ImagePlus, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

const PAGE_SIZE = 8;

// Inline confirm cho delete
function DeleteConfirm({ name, onConfirm, onCancel }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-[#F87171]/[.08] border border-[#F87171]/20 rounded-xl mt-2">
      <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
      <span className="text-xs text-[#F87171] font-medium flex-1">Xóa "{name}"?</span>
      <button onClick={onConfirm} className="px-2.5 py-1 bg-[#F87171]/[.08]0 text-[#03050A] text-xs font-bold rounded-lg hover:bg-red-600 transition-colors">Xóa</button>
      <button onClick={onCancel}  className="px-2.5 py-1 bg-[#0C0D17] border border-white/[.09] text-[#7A83A8] text-xs font-semibold rounded-lg hover:bg-[#12141F] transition-colors">Hủy</button>
    </div>
  );
}

export default function ProductManager() {
  const toast = useToast();

  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [keyword,    setKeyword]    = useState('');
  const [page,       setPage]       = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [brands,     setBrands]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm,   setShowForm]   = useState(false);
  const [form, setForm] = useState({ name: '', price: '', stock: '', description: '', brandId: '', categoryId: '', color: '', storage: '', isActive: true, specs: [] });
  const [files,      setFiles]      = useState([]);
  const [primaryIdx, setPrimaryIdx] = useState(0);
  const [tempSpec,   setTempSpec]   = useState({ name: '', value: '' });
  const [detail,     setDetail]     = useState(null);
  const [confirmDel, setConfirmDel] = useState(null); // { id, name }

  useEffect(() => { loadMeta(); loadProducts(0, ''); }, []);

  const loadMeta = async () => {
    try {
      const [bRes, cRes] = await Promise.all([
        api.get('/api/brands'),
        api.get('/api/categories'),
      ]);
      const bl = bRes.result || [];
      const cl = cRes.result || [];
      setBrands(bl); setCategories(cl);
      setForm(p => ({ ...p, brandId: bl[0]?.id || '', categoryId: cl[0]?.id || '' }));
    } catch { /* silent */ }
  };

  const loadProducts = async (pg = 0, kw = keyword) => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page: pg, size: PAGE_SIZE, ...(kw ? { keyword: kw } : {}) });
      const res = await api.get(`/api/products?${p}`);
      setProducts(res.result?.content || []);
      setTotalPages(res.result?.totalPage || 0);
      setPage(pg);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setForm({ name: '', price: '', stock: '', description: '', brandId: brands[0]?.id || '', categoryId: categories[0]?.id || '', color: '', storage: '', isActive: true, specs: [] });
    setFiles([]); setPrimaryIdx(0); setTempSpec({ name: '', value: '' }); setShowForm(false);
  };

  const create = async () => {
    if (!files.length) { toast.warning('Vui lòng chọn ít nhất 1 ảnh'); return; }
    if (!form.name || !form.price) { toast.warning('Tên và giá không được để trống'); return; }
    try {
      const fd = new FormData();
      fd.append('product', new Blob([JSON.stringify({
        name: form.name, price: Number(form.price), stock: Number(form.stock),
        description: form.description, brandId: Number(form.brandId), categoryId: Number(form.categoryId),
        color: form.color, storage: form.storage, isActive: true, specs: form.specs,
        images: files.map((_, i) => ({ primary: i === primaryIdx, sortOrder: i })),
      })], { type: 'application/json' }));
      files.forEach(f => fd.append('files', f));

      // Gửi multipart — không dùng axiosInstance (nó set Content-Type: JSON)
      const token = sessionStorage.getItem('accessToken');
      const res = await fetch('http://localhost:8081/api/products', {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: fd,
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success('Thêm sản phẩm thành công!');
      resetForm(); loadProducts(0, keyword);
    } catch (err) { toast.error('Lỗi: ' + err.message); }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/api/products/${id}`);
      toast.success('Đã xóa sản phẩm');
      setConfirmDel(null);
      loadProducts(page, keyword);
    } catch (err) { toast.error(err?.message || 'Xóa thất bại'); }
  };

  const viewDetail = async (id) => {
    try {
      const res = await api.get(`/api/products/${id}`);
      setDetail(res.result);
    } catch (err) { toast.error(err?.message || 'Không thể tải chi tiết'); }
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  const addSpec = () => {
    if (tempSpec.name && tempSpec.value) {
      setForm(p => ({ ...p, specs: [...p.specs, tempSpec] }));
      setTempSpec({ name: '', value: '' });
    }
  };

  return (
    <div className="space-y-5 font-body">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-[#E8EAFF]">Quản lý Sản phẩm</h2>
          <p className="text-sm text-[#3D4466] mt-0.5">{products.length} sản phẩm</p>
        </div>
        <button onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#00D2A8]/[.12] hover:bg-[#00D2A8] text-[#03050A] text-sm font-semibold rounded-xl transition-colors">
          <Plus size={16} /> Thêm sản phẩm
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-[#0C0D17] rounded-2xl border border-white/[.07] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-[#E8EAFF]">Sản phẩm mới</h3>
            <button onClick={resetForm} className="text-[#3D4466] hover:text-[#B0B8D4]"><X size={18} /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[['name', 'Tên sản phẩm *', 'text'], ['price', 'Giá bán *', 'number'], ['stock', 'Tồn kho', 'number']].map(([k, ph, t]) => (
              <div key={k}>
                <label className="block text-xs font-semibold text-[#7A83A8] mb-1.5 uppercase tracking-wider">{ph}</label>
                <input type={t} placeholder={ph} value={form[k]} onChange={f(k)} className="input-base" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ['brandId',    'Thương hiệu', brands,     'id', 'name'],
              ['categoryId', 'Danh mục',    categories, 'id', 'name'],
            ].map(([k, label, list, vk, lk]) => (
              <div key={k}>
                <label className="block text-xs font-semibold text-[#7A83A8] mb-1.5 uppercase tracking-wider">{label}</label>
                <select value={form[k]} onChange={f(k)} className="input-base">
                  {list.map(i => <option key={i[vk]} value={i[vk]}>{i[lk]}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-[#7A83A8] mb-1.5 uppercase tracking-wider">Màu sắc</label>
              <input placeholder="VD: Titan Black" value={form.color} onChange={f('color')} className="input-base" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#7A83A8] mb-1.5 uppercase tracking-wider">Dung lượng</label>
              <input placeholder="VD: 256GB" value={form.storage} onChange={f('storage')} className="input-base" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#7A83A8] mb-1.5 uppercase tracking-wider">Mô tả</label>
            <textarea rows={3} value={form.description} onChange={f('description')} className="input-base resize-none" placeholder="Mô tả sản phẩm..." />
          </div>

          {/* Images */}
          <div className="bg-[#12141F] rounded-xl border border-dashed border-white/[.12] p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-[#7A83A8] uppercase tracking-wider">Ảnh sản phẩm</label>
              <label className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00D2A8] text-[#03050A] text-xs font-semibold rounded-lg cursor-pointer hover:bg-[#00B894] transition-colors">
                <ImagePlus size={13} /> Tải ảnh lên
                <input type="file" multiple accept="image/*" className="hidden"
                  onChange={e => { const nf = Array.from(e.target.files || []); setFiles(p => [...p, ...nf]); e.target.value = null; }} />
              </label>
            </div>
            {files.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {files.map((file, i) => (
                  <div key={i} onClick={() => setPrimaryIdx(i)}
                    className={`relative group w-20 h-20 rounded-xl border-2 overflow-hidden cursor-pointer transition-all
                      ${primaryIdx === i ? 'border-blue-500 ring-2 ring-blue-200' : 'border-white/[.09] hover:border-slate-400'}`}>
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                    {primaryIdx === i && <span className="absolute bottom-0 left-0 right-0 bg-[#00D2A8] text-[#03050A] text-[9px] font-bold text-center py-0.5">Chính</span>}
                    <button onClick={e => { e.stopPropagation(); setFiles(p => p.filter((_, j) => j !== i)); if (i === primaryIdx) setPrimaryIdx(0); }}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-[#F87171]/[.08]0 text-[#03050A] rounded-full text-xs items-center justify-center hidden group-hover:flex">×</button>
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-[#3D4466] text-center py-3">Click vào ảnh để đặt làm ảnh chính</p>}
          </div>

          {/* Specs */}
          <div>
            <label className="block text-xs font-semibold text-[#7A83A8] mb-2 uppercase tracking-wider">Thông số kỹ thuật</label>
            <div className="flex gap-2 mb-2">
              <input placeholder="Tên thông số" value={tempSpec.name} onChange={e => setTempSpec(p => ({ ...p, name: e.target.value }))} className="input-base flex-1 text-sm" />
              <input placeholder="Giá trị" value={tempSpec.value} onChange={e => setTempSpec(p => ({ ...p, value: e.target.value }))} className="input-base flex-1 text-sm" />
              <button onClick={addSpec} className="px-4 py-2 bg-[#34D399]/[.15] text-[#34D399] text-sm font-semibold rounded-xl hover:bg-[#34D399]/[.25] transition-colors flex-shrink-0">Thêm</button>
            </div>
            {form.specs.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {form.specs.map((s, i) => (
                  <div key={i} className="flex justify-between items-center bg-[#12141F] border border-white/[.09] rounded-lg px-3 py-2 text-sm">
                    <span className="truncate text-[#B0B8D4]"><b>{s.name}:</b> {s.value}</span>
                    <button onClick={() => setForm(p => ({ ...p, specs: p.specs.filter((_, j) => j !== i) }))} className="text-red-400 hover:text-[#F87171] ml-2 flex-shrink-0">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={create} className="w-full h-12 bg-[#00D2A8]/[.12] hover:bg-[#00D2A8] text-[#03050A] font-semibold rounded-xl transition-colors">
            Lưu sản phẩm
          </button>
        </div>
      )}

      {/* Search */}
      <div className="bg-[#0C0D17] rounded-2xl border border-white/[.07] p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3D4466]" />
            <input placeholder="Tìm kiếm sản phẩm..." value={keyword} onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && loadProducts(0, keyword)} className="input-base pl-9" />
          </div>
          <button onClick={() => loadProducts(0, keyword)} className="px-5 py-2.5 bg-[#00D2A8] text-[#03050A] text-sm font-semibold rounded-xl hover:bg-[#00D2A8] transition-colors flex-shrink-0">
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0C0D17] rounded-2xl border border-white/[.07] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead><tr>
              <th>Sản phẩm</th><th>Giá</th><th>Kho</th><th>Thuộc tính</th><th className="text-right">Thao tác</th>
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-12 text-[#3D4466]">Đang tải...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-[#3D4466]">Không tìm thấy sản phẩm</td></tr>
              ) : products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#12141F] rounded-xl overflow-hidden border border-white/[.07] flex-shrink-0">
                        {p.thumbnailUrl
                          ? <img src={p.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-[#7A83A8] text-xs font-bold">{p.name?.charAt(0)}</div>
                        }
                      </div>
                      <div>
                        <p className="font-semibold text-[#E8EAFF] text-sm">{p.name}</p>
                        <p className="text-xs text-[#3D4466]">{p.brandName} · {p.categoryName}</p>
                      </div>
                    </div>
                    {/* Delete confirm inline */}
                    {confirmDel?.id === p.id && (
                      <DeleteConfirm name={p.name} onConfirm={() => remove(p.id)} onCancel={() => setConfirmDel(null)} />
                    )}
                  </td>
                  <td><span className="font-bold text-[#00D2A8]">{Number(p.price).toLocaleString()}đ</span></td>
                  <td>
                    <span className={`badge ${p.stock > 10 ? 'bg-[#34D399]/[.08] text-emerald-700 border-emerald-200' : p.stock > 0 ? 'bg-[#F59E0B]/[.08] text-amber-700 border-amber-200' : 'bg-[#F87171]/[.08] text-[#F87171] border-[#F87171]/20'}`}>{p.stock}</span>
                  </td>
                  <td>
                    <div className="flex gap-1 flex-wrap">
                      {p.color   && <span className="text-[10px] bg-[#12141F] border border-white/[.09] px-2 py-0.5 rounded-full text-[#7A83A8]">{p.color}</span>}
                      {p.storage && <span className="text-[10px] bg-[#12141F] border border-white/[.09] px-2 py-0.5 rounded-full text-[#7A83A8]">{p.storage}</span>}
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => viewDetail(p.id)} className="p-1.5 text-[#3D4466] hover:text-[#00D2A8] hover:bg-[#00D2A8]/[.08] rounded-lg transition-all"><Eye size={15} /></button>
                      <button onClick={() => setConfirmDel({ id: p.id, name: p.name })} className="p-1.5 text-[#3D4466] hover:text-[#F87171] hover:bg-[#F87171]/[.08] rounded-lg transition-all"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/[.05] bg-[#12141F]/50">
            <span className="text-xs text-[#3D4466]">Trang <b className="text-[#B0B8D4]">{page + 1}</b> / {totalPages}</span>
            <div className="flex gap-1.5">
              <button disabled={page === 0} onClick={() => loadProducts(page - 1, keyword)} className="p-1.5 border border-white/[.09] rounded-lg hover:bg-[#0C0D17] disabled:opacity-40 transition-colors"><ChevronLeft size={15} /></button>
              <button disabled={page >= totalPages - 1} onClick={() => loadProducts(page + 1, keyword)} className="p-1.5 border border-white/[.09] rounded-lg hover:bg-[#0C0D17] disabled:opacity-40 transition-colors"><ChevronRight size={15} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDetail(null)}>
          <div className="bg-[#0C0D17] rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#0C0D17] border-b border-white/[.07] px-6 py-4 flex justify-between items-center">
              <h2 className="font-display font-bold text-lg text-[#E8EAFF]">{detail.name}</h2>
              <button onClick={() => setDetail(null)} className="text-[#3D4466] hover:text-[#B0B8D4] p-1"><X size={20} /></button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="grid grid-cols-2 gap-2">
                  {detail.images?.map((img, i) => (
                    <div key={i} className="relative aspect-square bg-[#12141F] rounded-xl overflow-hidden border border-white/[.07]">
                      <img src={img.imageUrl} alt="" className="w-full h-full object-contain p-2" />
                      {img.primary && <span className="absolute top-1.5 right-1.5 text-[9px] font-bold bg-[#00D2A8] text-[#03050A] px-1.5 py-0.5 rounded-full">Chính</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="font-display font-bold text-xl text-[#E8EAFF]">{detail.name}</p>
                  <p className="font-bold text-[#00D2A8] text-lg mt-1">{Number(detail.price).toLocaleString()}đ</p>
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  {[['Thương hiệu', detail.brand?.name], ['Danh mục', detail.category?.name], ['Màu sắc', detail.color], ['Bộ nhớ', detail.storage], ['Tồn kho', detail.stock]].map(([k, v]) => v != null ? (
                    <div key={k} className="border-b border-white/[.05] py-1.5">
                      <span className="text-[#3D4466] text-xs">{k}</span>
                      <p className="font-semibold text-[#C8CADF]">{v}</p>
                    </div>
                  ) : null)}
                </div>
                {detail.specs?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-[#7A83A8] uppercase tracking-wider mb-2">Thông số kỹ thuật</p>
                    <div className="space-y-1.5">
                      {detail.specs.map((s, i) => (
                        <div key={i} className="flex justify-between text-sm bg-[#12141F] rounded-lg px-3 py-1.5">
                          <span className="text-[#7A83A8]">{s.name}</span>
                          <span className="font-medium text-[#C8CADF]">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {detail.description && <p className="text-sm text-[#7A83A8] leading-relaxed border-t border-white/[.05] pt-3">{detail.description}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
