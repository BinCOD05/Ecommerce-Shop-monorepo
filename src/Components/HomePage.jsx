import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Smartphone, Laptop, Tablet, Watch } from 'lucide-react';
import ProductCard from './ProductCard';
import SwiperSlider from './SwiperSlider';

const CATEGORIES = [
  { key: 'phones',  ids: [1, 2], label: 'Điện Thoại',    icon: Smartphone, catId: 2,
    color: 'text-[#00D2A8] bg-[#00D2A8]/[.1] border-[#00D2A8]/20' },
  { key: 'laptops', ids: [3],    label: 'Laptop',          icon: Laptop,     catId: 3,
    color: 'text-[#A78BFA] bg-[#A78BFA]/[.1] border-[#A78BFA]/20' },
  { key: 'tablets', ids: [4],    label: 'Máy Tính Bảng',  icon: Tablet,     catId: 4,
    color: 'text-[#F59E0B] bg-[#F59E0B]/[.1] border-[#F59E0B]/20' },
  { key: 'watches', ids: [5],    label: 'Đồng Hồ',        icon: Watch,      catId: 5,
    color: 'text-[#F87171] bg-[#F87171]/[.1] border-[#F87171]/20' },
];

export default function HomePage() {
  const [grouped, setGrouped] = useState({});
  const [byBrand, setByBrand] = useState({});
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        const res = await fetch('http://localhost:8081/api/products?page=0&size=100');
        const data = await res.json();
        const all = data.result?.content || data.result || [];
        const g = { phones: [], laptops: [], tablets: [], watches: [] };
        const bb = {};
        all.forEach(p => {
          CATEGORIES.forEach(c => { if (c.ids.includes(p.categoryId)) g[c.key].push(p); });
          const brand = p.brandName || 'Khác';
          if (!bb[brand]) bb[brand] = [];
          bb[brand].push(p);
        });
        setGrouped(g); setByBrand(bb);
      } catch { /* silent */ }
      finally { setLoading(false); }
    })();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/category?keyword=${encodeURIComponent(search)}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#05060C]">
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-20">
        <div className="skeleton h-14 w-2/3 mx-auto rounded-2xl mb-4" />
        <div className="skeleton h-6 w-1/3 mx-auto rounded-xl mb-12" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#05060C] font-body">

      {/* ── Hero / Search ── */}
      <section className="relative overflow-hidden pt-28 pb-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00D2A8]/[.04] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#6366F1]/[.04] rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-3">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00D2A8]/[.1] border border-[#00D2A8]/20
              rounded-full text-xs font-black text-[#00D2A8] tracking-wide">
              <span className="h-1.5 w-1.5 bg-[#00D2A8] rounded-full animate-pulse" />
              Hàng ngàn sản phẩm chính hãng
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display font-black text-5xl md:text-6xl text-[#E8EAFF] tracking-tight mb-4 leading-[1.02]">
            Cửa hàng công nghệ<br />
            <span className="text-[#00D2A8]">chính hãng</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-[#7A83A8] text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Tìm kiếm thiết bị bạn yêu thích trong hàng trăm sản phẩm Apple, Samsung, Sony và nhiều hơn nữa.
          </motion.p>

          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3D4466]
                group-focus-within:text-[#00D2A8] transition-colors pointer-events-none" />
              <input type="text" placeholder="Tìm iPhone, MacBook, Samsung..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-36 py-4 bg-white/[.04] border-2 border-white/[.09] rounded-2xl
                  text-[#E8EAFF] placeholder-[#3D4466] outline-none
                  focus:border-[#00D2A8]/50 focus:ring-4 focus:ring-[#00D2A8]/10
                  focus:bg-white/[.06] transition-all text-base"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <button type="submit"
                  className="flex items-center gap-1.5 bg-[#00D2A8] hover:bg-[#00B894] text-[#03050A]
                    px-5 py-2.5 rounded-xl font-black text-sm transition-colors">
                  Tìm kiếm
                </button>
              </div>
            </div>
          </motion.form>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2.5 mt-6">
            {CATEGORIES.map(({ label, icon: Icon, color, catId }) => (
              <button key={label} onClick={() => navigate(`/category?categoryId=${catId}`)}
                className={`flex items-center gap-1.5 px-3.5 py-2 bg-white/[.03] border border-white/[.08]
                  rounded-xl text-sm font-bold text-[#7A83A8] hover:text-[#E8EAFF] hover:bg-white/[.06]
                  hover:border-white/[.14] transition-all`}>
                <span className={`w-5 h-5 flex items-center justify-center rounded-md border ${color}`}>
                  <Icon size={11} />
                </span>
                {label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Category Sections ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 space-y-20">
        {CATEGORIES.map(({ key, label, icon: Icon, color, catId }, idx) => {
          const items = grouped[key] || [];
          if (!items.length) return null;
          return (
            <motion.div key={key}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.5, delay: idx * 0.05 }}>
              <div className="flex items-end justify-between mb-7">
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${color}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-2xl text-[#E8EAFF]">{label}</h2>
                    <p className="text-sm text-[#3D4466] mt-0.5">{items.length} sản phẩm</p>
                  </div>
                </div>
                <button onClick={() => navigate(`/category?categoryId=${catId}`)}
                  className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-[#00D2A8]
                    hover:text-[#00B894] transition-colors group">
                  Xem tất cả <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
                {items.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              <button onClick={() => navigate(`/category?categoryId=${catId}`)}
                className="sm:hidden mt-5 w-full flex items-center justify-center gap-1.5 py-3
                  border border-white/[.08] rounded-xl text-sm font-bold text-[#7A83A8]
                  hover:bg-white/[.04] hover:text-[#E8EAFF] transition-all">
                Xem tất cả {label} <ArrowRight size={14} />
              </button>
            </motion.div>
          );
        })}

        {/* Brand collections */}
        {Object.keys(byBrand).length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-[#0C0D17] rounded-3xl p-8 md:p-12 border border-white/[.06]">
            <div className="text-center mb-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3D4466] mb-2">Thương hiệu nổi bật</p>
              <h2 className="font-display font-black text-3xl text-[#E8EAFF]">Bộ sưu tập theo hãng</h2>
            </div>
            <div className="space-y-14">
              {Object.entries(byBrand).map(([brand, items]) => (
                <div key={brand}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-5 w-1 bg-[#00D2A8] rounded-full shadow-[0_0_8px_rgba(0,210,168,0.5)]" />
                    <h3 className="font-display font-black text-xl text-[#E8EAFF]">{brand}</h3>
                    <span className="text-xs text-[#3D4466] bg-white/[.04] border border-white/[.07]
                      px-2 py-0.5 rounded-full">{items.length} SP</span>
                  </div>
                  <SwiperSlider items={items} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}
