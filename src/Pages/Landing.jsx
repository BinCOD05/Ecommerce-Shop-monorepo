import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, ShieldCheck, Star, Package, ChevronDown } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

const FEATURES = [
  { icon: Zap,         color: 'text-[#F59E0B] bg-[#F59E0B]/[.1] border-[#F59E0B]/20',  title: 'Giao siêu tốc',    desc: 'Nhận hàng trong 2 giờ nội thành. Đóng gói cao cấp.' },
  { icon: ShieldCheck, color: 'text-[#00D2A8] bg-[#00D2A8]/[.1] border-[#00D2A8]/20', title: 'Bảo hành VIP',     desc: '1 đổi 1 trong 30 ngày. Hỗ trợ kỹ thuật trọn đời.' },
  { icon: Star,        color: 'text-[#A78BFA] bg-[#A78BFA]/[.1] border-[#A78BFA]/20', title: 'Chính hãng 100%', desc: 'Mỗi sản phẩm đều được kiểm định xuất xứ và chất lượng.' },
  { icon: Package,     color: 'text-[#F87171] bg-[#F87171]/[.1] border-[#F87171]/20', title: 'Đổi trả dễ dàng', desc: 'Hoàn tiền hoặc đổi hàng trong 30 ngày không cần lý do.' },
];

const BRANDS = ['Apple', 'Samsung', 'Sony', 'Xiaomi', 'Asus', 'Dell'];

const STATS = [
  { num: '10k+', label: 'Khách hàng' },
  { num: '500+', label: 'Sản phẩm' },
  { num: '99%',  label: 'Hài lòng' },
  { num: '24/7', label: 'Hỗ trợ' },
];

export default function Landing() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <main className="min-h-screen bg-[#05060C] font-body overflow-x-hidden">

      {/* ── Hero ────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">

        {/* Ambient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-[#00D2A8]/[.06] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] bg-[#6366F1]/[.06] rounded-full blur-[100px]" />
          <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-[#F59E0B]/[.04] rounded-full blur-[80px]" />
          {/* Grid */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="g" width="64" height="64" patternUnits="userSpaceOnUse">
                <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#E8EAFF" strokeWidth="0.8"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#g)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-20 items-center">

            {/* ── Text side ── */}
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">

              {/* Badge */}
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00D2A8]/[.1] border border-[#00D2A8]/25
                  rounded-full text-xs font-bold text-[#00D2A8] tracking-wide">
                  <span className="h-1.5 w-1.5 bg-[#00D2A8] rounded-full animate-pulse" />
                  Bộ sưu tập mới nhất đã có mặt
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1 variants={fadeUp}
                className="font-display font-black text-6xl md:text-7xl xl:text-[88px] text-[#E8EAFF]
                  leading-[0.92] tracking-tight">
                Công nghệ{' '}
                <span className="relative">
                  <span className="text-[#00D2A8]">đỉnh</span>
                </span>
                <br />
                <span className="text-[#E8EAFF]/60">cho bạn.</span>
              </motion.h1>

              {/* Sub */}
              <motion.p variants={fadeUp}
                className="text-lg text-[#7A83A8] max-w-md leading-relaxed font-body">
                Hàng chính hãng, giá tốt nhất, dịch vụ hậu mãi 5 sao. Trải nghiệm mua sắm công nghệ
                hoàn toàn mới tại{' '}
                <strong className="text-[#E8EAFF] font-bold">SopPings</strong>.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                <Link to="/store"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#00D2A8] text-[#03050A]
                    font-bold rounded-2xl transition-all duration-300 group active:scale-95
                    shadow-[0_0_24px_rgba(0,210,168,0.35)] hover:shadow-[0_0_40px_rgba(0,210,168,0.55)]
                    hover:bg-[#00B894]">
                  Khám phá ngay
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#features"
                  className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/[.12]
                    text-[#E8EAFF] font-bold rounded-2xl hover:bg-white/[.05] hover:border-white/20
                    transition-all duration-200">
                  Tìm hiểu thêm
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-8 pt-2">
                {STATS.map(({ num, label }) => (
                  <div key={label}>
                    <div className="font-display font-black text-2xl text-[#00D2A8]">{num}</div>
                    <div className="text-xs text-[#3D4466] font-semibold mt-0.5 uppercase tracking-wider">{label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ── Visual side ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block relative">

              <div className="relative w-full aspect-[4/5] max-w-[420px] mx-auto">
                {/* Main card */}
                <div className="absolute inset-0 rounded-[3rem] overflow-hidden border border-white/[.08]
                  shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
                  style={{ background: 'linear-gradient(135deg, #0E101B 0%, #141624 100%)' }}>
                  <img
                    src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80"
                    alt="Tech"
                    className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #05060C 30%, transparent 80%)' }} />
                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-[10px] font-black text-[#00D2A8] uppercase tracking-[0.2em] mb-2">Featured</p>
                    <h3 className="font-display font-black text-2xl text-[#E8EAFF]">iPhone 16 Pro</h3>
                    <p className="text-[#7A83A8] text-sm mt-1.5">Titanium. So strong. So light.</p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="font-display font-black text-[#F59E0B] text-xl">28.990.000₫</span>
                    </div>
                  </div>
                </div>

                {/* Float 1 */}
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
                  className="absolute -top-5 -right-8 bg-[#0C0D17] rounded-2xl border border-[#00D2A8]/25
                    px-4 py-3 flex items-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                  <div className="w-10 h-10 bg-[#00D2A8]/[.15] rounded-xl flex items-center justify-center border border-[#00D2A8]/25">
                    <ShieldCheck size={18} className="text-[#00D2A8]" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#E8EAFF]">Chính hãng</p>
                    <p className="text-[10px] text-[#3D4466] mt-0.5">Bảo hành 12 tháng</p>
                  </div>
                </motion.div>

                {/* Float 2 */}
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 3.8, delay: 0.6, ease: 'easeInOut' }}
                  className="absolute -bottom-5 -left-8 bg-[#0C0D17] rounded-2xl border border-[#F59E0B]/20
                    px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                  <p className="text-[10px] text-[#3D4466] font-semibold">Đánh giá</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className="text-[#F59E0B] fill-[#F59E0B]" />
                    ))}
                    <span className="text-[10px] text-[#7A83A8] ml-1 font-semibold">4.9</span>
                  </div>
                  <p className="text-[10px] text-[#3D4466] mt-0.5">2.300+ đánh giá</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#3D4466]">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>
            <ChevronDown size={16} className="text-[#3D4466]" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Brands ──────────────────────────────────── */}
      <section className="py-14 border-y border-white/[.05]"
        style={{ background: 'linear-gradient(180deg, #08091280 0%, #05060C 100%)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-[#3D4466] mb-8">
            Thương hiệu chính hãng
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
            {BRANDS.map(b => (
              <span key={b}
                className="font-display font-black text-xl text-[#1E2234] hover:text-[#00D2A8] transition-colors duration-300 cursor-default">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────── */}
      <section id="features" className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00D2A8] mb-4">
              Tại sao chọn chúng tôi
            </p>
            <h2 className="font-display font-black text-4xl md:text-5xl text-[#E8EAFF] tracking-tight mb-4">
              Trải nghiệm khác biệt
            </h2>
            <p className="text-[#7A83A8] max-w-xl mx-auto leading-relaxed">
              Chúng tôi không chỉ bán sản phẩm — chúng tôi trao trải nghiệm công nghệ hoàn hảo.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ icon: Icon, color, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group p-6 bg-[#0C0D17] rounded-3xl border border-white/[.07]
                  hover:border-white/[.14] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                  transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 ${color} rounded-2xl border flex items-center justify-center mb-5
                  group-hover:scale-110 transition-transform`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-display font-bold text-lg text-[#E8EAFF] mb-2">{title}</h3>
                <p className="text-[#7A83A8] text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-[2.5rem] overflow-hidden border border-white/[.07]"
            style={{ background: 'linear-gradient(135deg, #0E101B 0%, #13152200 50%, #0E101B 100%)' }}>
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[-40%] left-[20%] w-80 h-80 bg-[#00D2A8]/[.08] rounded-full blur-[80px]" />
              <div className="absolute bottom-[-30%] right-[15%] w-72 h-72 bg-[#6366F1]/[.07] rounded-full blur-[60px]" />
            </div>
            <div className="relative z-10 text-center p-12 md:p-20">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00D2A8]/[.1] border border-[#00D2A8]/25
                rounded-full text-xs font-black text-[#00D2A8] mb-6 tracking-wide">
                <span className="h-1.5 w-1.5 bg-[#34D399] rounded-full animate-pulse" />
                Đang có khuyến mãi đặc biệt
              </span>
              <h2 className="font-display font-black text-4xl md:text-5xl mb-5 leading-tight text-[#E8EAFF]">
                Nâng tầm phong cách sống<br />với công nghệ
              </h2>
              <p className="text-[#7A83A8] text-base max-w-lg mx-auto mb-8 leading-relaxed">
                Hàng ngàn khách hàng đã tin tưởng lựa chọn SopPings. Bạn thì sao?
              </p>
              <Link to="/store"
                className="inline-flex items-center gap-2.5 px-10 py-4 bg-[#00D2A8] text-[#03050A]
                  font-black text-base rounded-2xl transition-all duration-300 active:scale-95
                  shadow-[0_0_32px_rgba(0,210,168,0.4)] hover:shadow-[0_0_48px_rgba(0,210,168,0.6)]
                  hover:bg-[#00B894]">
                Vào cửa hàng ngay <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[.06] py-10 text-center">
        <div className="flex items-center justify-center gap-2.5 mb-3">
          <div className="w-7 h-7 bg-[#00D2A8] rounded-xl flex items-center justify-center font-display font-black text-[10px] text-[#03050A]">
            SP
          </div>
          <span className="font-display font-bold text-[#E8EAFF] text-base">SopPings</span>
        </div>
        <p className="text-sm text-[#3D4466]">
          © 2025 SopPings. Designed with precision.
        </p>
      </footer>
    </main>
  );
}
