import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, X, Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../Components/ProductCard';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const BRANDS = ['Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Sony', 'Asus', 'Dell', 'HP'];
const CATEGORIES = [
  { id: '',  name: 'Tất cả' },
  { id: '2', name: 'Điện Thoại' },
  { id: '3', name: 'Laptop' },
  { id: '4', name: 'Máy Tính Bảng' },
  { id: '5', name: 'Đồng Hồ' },
];

const BANNER_MAP = [
  { test: k => k.includes('iphone') || k.includes('apple'),
    bg: 'from-[#1a1a2e] to-[#0d0d1a]', accent: '#A8B2FF',
    title: 'Apple Store', desc: 'Khám phá hệ sinh thái Apple đỉnh cao.',
    img: 'https://images.unsplash.com/photo-1556656793-02715d8dd660?auto=format&fit=crop&w=1600&q=80' },
  { test: k => k.includes('samsung'),
    bg: 'from-[#0a1628] to-[#061020]', accent: '#60A5FA',
    title: 'Samsung Galaxy', desc: 'Đột phá công nghệ màn hình gập.',
    img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1600&q=80' },
  { test: k => k.includes('mac') || k.includes('laptop'),
    bg: 'from-[#0f1923] to-[#060e17]', accent: '#818CF8',
    title: 'Laptop & MacBook', desc: 'Hiệu năng mạnh mẽ cho công việc.',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=80' },
];

function getBanner(keyword, brandParam) {
  const k = (keyword + ' ' + brandParam).toLowerCase();
  const found = BANNER_MAP.find(b => b.test(k));
  return found || {
    bg: 'from-[#05060C] to-[#0C0D17]', accent: '#00D2A8',
    title: keyword ? `"${keyword}"` : 'Cửa Hàng',
    desc: 'Tìm kiếm sản phẩm công nghệ yêu thích của bạn.', img: '',
  };
}

export default function Category() {
  const query    = useQuery();
  const navigate = useNavigate();

  const keyword      = query.get('keyword')    || '';
  const brandParam   = query.get('brand')      || '';
  const minPriceParam= query.get('minPrice')   || '';
  const maxPriceParam= query.get('maxPrice')   || '';
  const categoryId   = query.get('categoryId') || '';

  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filters,    setFilters]    = useState({
    keyword, brand: brandParam, minPrice: minPriceParam,
    maxPrice: maxPriceParam, categoryId,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem('accessToken');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const params = new URLSearchParams();
        if (keyword)       params.append('keyword',    keyword);
        if (brandParam)    params.append('brand',      brandParam);
        if (minPriceParam) params.append('minPrice',   minPriceParam);
        if (maxPriceParam) params.append('maxPrice',   maxPriceParam);
        if (categoryId)    params.append('categoryId', categoryId);
        params.append('size', 100);

        const res  = await fetch(`http://localhost:8081/api/products?${params}`, { headers });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setProducts(data.result?.content || data.result || []);
      } catch (err) {
        setError(err.message || 'Lỗi tải dữ liệu');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    setFilters({ keyword, brand: brandParam, minPrice: minPriceParam, maxPrice: maxPriceParam, categoryId });
  }, [keyword, brandParam, minPriceParam, maxPriceParam, categoryId]);

  const applyFilters = () => {
    const p = new URLSearchParams();
    if (filters.keyword)    p.set('keyword',    filters.keyword);
    if (filters.brand)      p.set('brand',      filters.brand);
    if (filters.minPrice)   p.set('minPrice',   filters.minPrice);
    if (filters.maxPrice)   p.set('maxPrice',   filters.maxPrice);
    if (filters.categoryId) p.set('categoryId', filters.categoryId);
    navigate(`?${p.toString()}`);
    setShowFilter(false);
  };

  const clearFilters = () => {
    setFilters({ keyword: '', brand: '', minPrice: '', maxPrice: '', categoryId: '' });
    navigate('?');
    setShowFilter(false);
  };

  const banner = getBanner(keyword, brandParam);
  const hasActiveFilter = keyword || brandParam || minPriceParam || maxPriceParam || categoryId;

  /* ── Filter sidebar JSX ── */
  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Keyword */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-[#7A83A8] mb-2">
          Tìm kiếm
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#3D4466] pointer-events-none" />
          <input type="text" value={filters.keyword}
            onChange={e => setFilters(f => ({ ...f, keyword: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && applyFilters()}
            placeholder="Tên sản phẩm..."
            className="w-full bg-white/[.04] border border-white/[.09] rounded-xl pl-8 pr-3 py-2.5
              text-sm text-[#E8EAFF] placeholder-[#3D4466] outline-none
              focus:border-[#00D2A8]/50 focus:ring-2 focus:ring-[#00D2A8]/12 transition-all"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-[#7A83A8] mb-2">
          Danh mục
        </label>
        <div className="space-y-1.5">
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setFilters(f => ({ ...f, categoryId: c.id }))}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all
                ${filters.categoryId === c.id
                  ? 'bg-[#00D2A8]/[.12] text-[#00D2A8] border border-[#00D2A8]/25'
                  : 'text-[#7A83A8] hover:bg-white/[.04] hover:text-[#E8EAFF]'
                }`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-[#7A83A8] mb-2">
          Thương hiệu
        </label>
        <select value={filters.brand}
          onChange={e => setFilters(f => ({ ...f, brand: e.target.value }))}
          className="w-full bg-white/[.04] border border-white/[.09] rounded-xl px-3 py-2.5 text-sm
            text-[#E8EAFF] outline-none focus:border-[#00D2A8]/50 transition-all
            [&>option]:bg-[#0C0D17] [&>option]:text-[#E8EAFF]">
          <option value="">Tất cả thương hiệu</option>
          {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* Price */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-[0.12em] text-[#7A83A8] mb-2">
          Khoảng giá (VND)
        </label>
        <div className="flex gap-2 items-center">
          <input type="number" placeholder="Từ" value={filters.minPrice}
            onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
            className="w-full bg-white/[.04] border border-white/[.09] rounded-xl px-3 py-2.5 text-sm
              text-[#E8EAFF] placeholder-[#3D4466] outline-none focus:border-[#00D2A8]/50 transition-all"
          />
          <span className="text-[#3D4466] font-bold flex-shrink-0">—</span>
          <input type="number" placeholder="Đến" value={filters.maxPrice}
            onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
            className="w-full bg-white/[.04] border border-white/[.09] rounded-xl px-3 py-2.5 text-sm
              text-[#E8EAFF] placeholder-[#3D4466] outline-none focus:border-[#00D2A8]/50 transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2">
        <button onClick={applyFilters}
          className="w-full py-3 bg-[#00D2A8] hover:bg-[#00B894] text-[#03050A] font-black
            rounded-xl transition-colors shadow-[0_0_16px_rgba(0,210,168,0.25)]">
          Áp dụng
        </button>
        {hasActiveFilter && (
          <button onClick={clearFilters}
            className="w-full py-2.5 border border-white/[.1] text-[#7A83A8] hover:text-[#E8EAFF]
              hover:border-white/20 font-semibold rounded-xl text-sm transition-all">
            Xóa bộ lọc
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05060C] pb-20 font-body">

      {/* ── Banner ── */}
      <div className={`relative bg-gradient-to-r ${banner.bg} pt-16 overflow-hidden`}>
        {banner.img && (
          <img src={banner.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.12]" />
        )}
        <div className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 20% 50%, ${banner.accent}15 0%, transparent 60%)` }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3"
              style={{ color: banner.accent }}>
              {hasActiveFilter ? 'Kết quả tìm kiếm' : 'Danh mục'}
            </p>
            <h1 className="font-display font-black text-4xl md:text-5xl text-[#E8EAFF] mb-3 tracking-tight">
              {banner.title}
            </h1>
            <p className="text-[#7A83A8] text-base max-w-xl">{banner.desc}</p>
          </motion.div>
        </div>
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16"
          style={{ background: 'linear-gradient(to bottom, transparent, #05060C)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex gap-8">

          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-[#0C0D17] rounded-2xl border border-white/[.07] p-5">
              <div className="flex items-center gap-2 mb-5">
                <SlidersHorizontal size={16} className="text-[#00D2A8]" />
                <h2 className="font-display font-black text-sm text-[#E8EAFF] uppercase tracking-wider">
                  Bộ lọc
                </h2>
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* ── Main ── */}
          <main className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="font-display font-black text-xl text-[#E8EAFF]">
                  {loading ? 'Đang tải...' : `${products.length} sản phẩm`}
                </h2>
                {hasActiveFilter && (
                  <button onClick={clearFilters}
                    className="flex items-center gap-1 text-xs font-bold text-[#F87171] bg-[#F87171]/[.08]
                      border border-[#F87171]/20 px-2.5 py-1 rounded-full hover:bg-[#F87171]/[.14] transition-all">
                    <X size={11} /> Xóa lọc
                  </button>
                )}
              </div>
              <button onClick={() => setShowFilter(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#0C0D17] border border-white/[.09]
                  rounded-xl text-sm font-bold text-[#7A83A8] hover:text-[#E8EAFF] hover:border-white/20 transition-all">
                <Filter size={16} /> Bộ lọc
              </button>
            </div>

            {/* Active filter chips */}
            {hasActiveFilter && (
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  keyword      && { label: `"${keyword}"` },
                  brandParam   && { label: brandParam },
                  categoryId   && { label: CATEGORIES.find(c=>c.id===categoryId)?.name || categoryId },
                  (minPriceParam||maxPriceParam) && { label: `${minPriceParam||'0'}₫ – ${maxPriceParam||'∞'}` },
                ].filter(Boolean).map((chip, i) => (
                  <span key={i}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#00D2A8]/[.08] border border-[#00D2A8]/20
                      text-[#00D2A8] text-xs font-bold rounded-full">
                    {chip.label}
                  </span>
                ))}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="bg-[#F87171]/[.08] border border-[#F87171]/25 text-[#F87171]
                p-4 rounded-xl text-sm text-center font-semibold">
                {error}
              </div>
            )}

            {/* Empty */}
            {!loading && !error && products.length === 0 && (
              <div className="text-center py-20 bg-[#0C0D17] rounded-2xl border border-dashed border-white/[.1]">
                <p className="text-6xl mb-4">🔍</p>
                <p className="text-[#7A83A8] text-lg font-semibold mb-4">
                  Không tìm thấy sản phẩm nào phù hợp.
                </p>
                <button onClick={clearFilters}
                  className="text-[#00D2A8] font-bold hover:underline text-sm">
                  Xóa bộ lọc và thử lại
                </button>
              </div>
            )}

            {/* Grid */}
            {!loading && !error && products.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {products.map((product, i) => (
                  <motion.div key={product.id}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.3) }}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      {showFilter && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowFilter(false)} />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 bottom-0 w-80 bg-[#0C0D17] border-l border-white/[.07]
              p-6 overflow-y-auto shadow-[−8px_0_40px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#00D2A8]" />
                <h2 className="font-display font-black text-base text-[#E8EAFF]">Bộ lọc</h2>
              </div>
              <button onClick={() => setShowFilter(false)}
                className="p-1.5 rounded-lg text-[#3D4466] hover:text-[#E8EAFF] hover:bg-white/[.06] transition-all">
                <X size={18} />
              </button>
            </div>
            <FilterPanel />
          </motion.div>
        </div>
      )}
    </div>
  );
}
