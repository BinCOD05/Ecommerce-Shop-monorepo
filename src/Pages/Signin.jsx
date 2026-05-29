import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Loader2, Zap, ShieldCheck, Star } from 'lucide-react';
import { useAuth }  from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Field = ({ label, id, type = 'text', value, onChange, placeholder, required, span2 }) => {
  const [show, setShow] = useState(false);
  const isPwd = type === 'password';
  return (
    <div className={span2 ? 'sm:col-span-2' : ''}>
      <label htmlFor={id}
        className="block text-[10px] font-black text-[#7A83A8] mb-1.5 uppercase tracking-[0.12em]">
        {label}
      </label>
      <div className="relative">
        <input id={id} type={isPwd && show ? 'text' : type}
          value={value} onChange={onChange}
          placeholder={placeholder} required={required}
          className="w-full bg-white/[.04] border border-white/[.1] rounded-xl py-3 px-4 pr-10 text-sm
            text-[#E8EAFF] placeholder-[#3D4466] outline-none
            focus:bg-white/[.06] focus:border-[#00D2A8]/60 focus:ring-2 focus:ring-[#00D2A8]/15
            transition-all"
        />
        {isPwd && (
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3D4466] hover:text-[#7A83A8] transition-colors">
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
};

const PERKS = [
  { icon: Zap,         color: 'text-[#F59E0B]', label: 'Giao hàng siêu tốc', sub: 'Nhận hàng trong 2 giờ' },
  { icon: ShieldCheck, color: 'text-[#00D2A8]', label: 'Bảo hành VIP',       sub: '1 đổi 1 trong 30 ngày' },
  { icon: Star,        color: 'text-[#A78BFA]', label: 'Chính hãng 100%',    sub: 'Kiểm định xuất xứ' },
];

export default function SignIn() {
  const [isReg,   setIsReg]   = useState(false);
  const [form,    setForm]    = useState({ username: '', password: '', confirmPassword: '', fullName: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const toast     = useToast();
  const navigate  = useNavigate();

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isReg) {
        if (form.password !== form.confirmPassword) {
          toast.error('Mật khẩu xác nhận không khớp'); return;
        }
        const { default: api } = await import('../api/axiosInstance');
        await api.post('/auth/register', {
          username: form.username, fullName: form.fullName,
          password: form.password, phone: form.phone, email: form.email,
        });
        toast.success('Đăng ký thành công! Hãy đăng nhập ngay.');
        setIsReg(false);
        setForm(p => ({ ...p, password: '', confirmPassword: '' }));
      } else {
        const user = await login(form.username, form.password);
        toast.success(`Chào mừng trở lại, ${user.fullName || user.username}!`);
        const isAdmin = user.roleTypes?.some(r => r === 'ADMIN');
        navigate(isAdmin ? '/admin' : '/', { replace: true });
      }
    } catch (err) {
      toast.error(err?.message || (isReg ? 'Đăng ký thất bại' : 'Tên đăng nhập hoặc mật khẩu không đúng'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-body bg-[#05060C]">

      {/* ── Left brand panel ── */}
      <div className="hidden lg:flex lg:w-[46%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #080A12 0%, #0C0E1A 100%)' }}>
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-15%] left-[-5%] w-96 h-96 bg-[#00D2A8]/[.07] rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-[#6366F1]/[.06] rounded-full blur-[80px]" />
        </div>
        {/* Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="sg" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#E8EAFF" strokeWidth="0.7"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sg)" />
        </svg>

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-20">
            <div className="w-9 h-9 bg-[#00D2A8] rounded-xl flex items-center justify-center font-display font-black text-sm text-[#03050A]
              shadow-[0_0_20px_rgba(0,210,168,0.4)]">
              SP
            </div>
            <span className="font-display font-bold text-lg tracking-wide text-[#E8EAFF]">SopPings</span>
          </Link>

          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#00D2A8]/[.1] border border-[#00D2A8]/20
              rounded-full text-xs font-bold text-[#00D2A8]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] animate-pulse" />
              Hơn 10,000+ khách hàng tin dùng
            </span>
            <h1 className="font-display font-black text-4xl xl:text-5xl leading-tight text-[#E8EAFF]">
              Mua sắm công nghệ<br />
              <span className="text-[#00D2A8]">đỉnh cao.</span>
            </h1>
            <p className="text-[#7A83A8] text-base leading-relaxed max-w-sm">
              Hàng chính hãng, giá tốt nhất, trải nghiệm mua sắm đẳng cấp.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-3">
          {PERKS.map(({ icon: Icon, color, label, sub }) => (
            <div key={label}
              className="flex items-center gap-4 p-4 bg-white/[.03] rounded-2xl border border-white/[.06]">
              <Icon size={20} className={color} />
              <div>
                <p className="text-sm font-bold text-[#E8EAFF]">{label}</p>
                <p className="text-xs text-[#3D4466] mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form ── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#05060C]">
        <div className="w-full max-w-md">

          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#00D2A8] rounded-xl flex items-center justify-center font-display font-black text-xs text-[#03050A]">
              SP
            </div>
            <span className="font-display font-bold text-[#E8EAFF]">SopPings</span>
          </Link>

          <div className="mb-8">
            <h2 className="font-display font-black text-3xl text-[#E8EAFF] mb-1">
              {isReg ? 'Tạo tài khoản' : 'Chào mừng trở lại'}
            </h2>
            <p className="text-[#7A83A8] text-sm">
              {isReg ? 'Điền thông tin để bắt đầu mua sắm' : 'Đăng nhập để tiếp tục trải nghiệm'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div key={isReg ? 'reg' : 'log'}
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18 }}
                className={isReg ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'flex flex-col gap-4'}>
                {isReg ? (<>
                  <Field label="Tên đăng nhập" id="username" value={form.username} onChange={set('username')} placeholder="username" required span2 />
                  <Field label="Họ và tên"     id="fullName" value={form.fullName} onChange={set('fullName')} placeholder="Nguyễn Văn A" required />
                  <Field label="Số điện thoại" id="phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="0912..." required />
                  <Field label="Email" id="email" type="email" value={form.email} onChange={set('email')} placeholder="email@example.com" required span2 />
                  <Field label="Mật khẩu" id="password" type="password" value={form.password} onChange={set('password')} placeholder="Tối thiểu 8 ký tự" required />
                  <Field label="Xác nhận mật khẩu" id="confirmPassword" type="password" value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Nhập lại" required />
                </>) : (<>
                  <Field label="Tên đăng nhập" id="username" value={form.username} onChange={set('username')} placeholder="username" required />
                  <Field label="Mật khẩu" id="password" type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required />
                </>)}
              </motion.div>
            </AnimatePresence>

            <button type="submit" disabled={loading}
              className="mt-6 w-full h-12 bg-[#00D2A8] hover:bg-[#00B894] text-[#03050A] font-black rounded-xl
                transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60
                active:scale-[0.98] shadow-[0_0_24px_rgba(0,210,168,0.3)]
                hover:shadow-[0_0_36px_rgba(0,210,168,0.5)]">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>
                {isReg ? 'Tạo tài khoản' : 'Đăng nhập'} <ArrowRight size={16} />
              </>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#7A83A8]">
            {isReg ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
            <button type="button" onClick={() => setIsReg(r => !r)}
              className="ml-1.5 text-[#00D2A8] font-bold hover:text-[#00B894] transition-colors hover:underline">
              {isReg ? 'Đăng nhập ngay' : 'Đăng ký miễn phí'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
