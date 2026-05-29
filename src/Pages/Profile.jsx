import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, Calendar, Lock, LogOut, Loader2,
  MapPin, Trash2, Plus, Eye, EyeOff, Check, Star, Home,
  Briefcase, ChevronRight, ShieldCheck, Package,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth }  from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

/* ── tiny helpers ────────────────────────────────── */
const EMPTY_ADDR = {
  recipient: '', phone: '', line1: '', line2: '',
  ward: '', district: '', city: '', addressType: 'HOME', defaultAddress: false,
};
const EMPTY_PWD = { password: '', newPassword: '', confirmPassword: '' };

const addrTypeIcon = (t) =>
  t === 'HOME' ? <Home size={12} /> : t === 'OFFICE' ? <Briefcase size={12} /> : <MapPin size={12} />;
const addrTypeLabel = (t) =>
  t === 'HOME' ? 'Nhà riêng' : t === 'OFFICE' ? 'Văn phòng' : 'Khác';

function PwdField({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-[10px] font-black text-[#7A83A8] mb-1.5 uppercase tracking-[0.12em]">
        {label}
      </label>
      <div className="relative">
        <input type={show ? 'text' : 'password'} value={value} onChange={onChange}
          placeholder={placeholder} required
          className="w-full bg-white/[.04] border border-white/[.1] rounded-xl py-3 px-4 pr-10
            text-sm text-[#E8EAFF] placeholder-[#3D4466] outline-none
            focus:bg-white/[.06] focus:border-[#00D2A8]/60 focus:ring-2 focus:ring-[#00D2A8]/15 transition-all"
        />
        <button type="button" onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3D4466] hover:text-[#7A83A8] transition-colors">
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, icon: Icon }) {
  return (
    <div>
      <p className="text-[10px] font-black text-[#3D4466] mb-1.5 uppercase tracking-[0.12em] flex items-center gap-1.5">
        {Icon && <Icon size={11} />}{label}
      </p>
      <div className="bg-white/[.03] border border-white/[.07] rounded-xl px-4 py-3">
        <p className="text-sm font-semibold text-[#E8EAFF]">{value || <span className="text-[#3D4466]">—</span>}</p>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'info',     label: 'Thông tin',   icon: User },
  { id: 'address',  label: 'Địa chỉ',     icon: MapPin },
  { id: 'security', label: 'Bảo mật',     icon: ShieldCheck },
];

/* ══════════════════════════════════════════════════ */
export default function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const toast = useToast();

  const [tab,          setTab]          = useState('info');
  const [addresses,    setAddresses]    = useState([]);
  const [addrLoading,  setAddrLoading]  = useState(true);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [savingAddr,   setSavingAddr]   = useState(false);
  const [addrForm,     setAddrForm]     = useState(EMPTY_ADDR);
  const [confirmDel,   setConfirmDel]   = useState(null); // address id
  const [pwdForm,      setPwdForm]      = useState(EMPTY_PWD);
  const [savingPwd,    setSavingPwd]    = useState(false);
  const [pwdDone,      setPwdDone]      = useState(false);

  /* ── fetch addresses ── */
  const loadAddresses = async () => {
    setAddrLoading(true);
    try {
      const res = await api.get('/api/users/address');
      setAddresses(res.result || []);
    } catch (err) {
      toast.error(err?.message || 'Không tải được địa chỉ');
    } finally {
      setAddrLoading(false);
    }
  };

  useEffect(() => { loadAddresses(); }, []);

  /* ── add address ── */
  const handleAddAddr = async (e) => {
    e.preventDefault();
    setSavingAddr(true);
    try {
      await api.post('/api/users/address', addrForm);
      await loadAddresses();
      setAddrForm(EMPTY_ADDR);
      setShowAddrForm(false);
      toast.success('Đã thêm địa chỉ mới');
    } catch (err) {
      toast.error(err?.message || 'Không thể thêm địa chỉ');
    } finally {
      setSavingAddr(false);
    }
  };

  /* ── set default address ── */
  const handleSetDefault = async (id) => {
    try {
      await api.patch(`/api/users/address/${id}`);
      await loadAddresses();
      toast.success('Đã đặt địa chỉ mặc định');
    } catch (err) {
      toast.error(err?.message || 'Lỗi cập nhật địa chỉ');
    }
  };

  /* ── delete address ── */
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/users/address/${id}`);
      setConfirmDel(null);
      await loadAddresses();
      toast.success('Đã xóa địa chỉ');
    } catch (err) {
      toast.error(err?.message || 'Không thể xóa địa chỉ');
    }
  };

  /* ── change password ── */
  const handleChangePwd = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }
    setSavingPwd(true);
    try {
      await api.patch('/api/users/change-pwd', {
        password: pwdForm.password,
        newPassword: pwdForm.newPassword,
        confirmPassword: pwdForm.confirmPassword,
      });
      toast.success('Đổi mật khẩu thành công');
      setPwdForm(EMPTY_PWD);
      setPwdDone(true);
      setTimeout(() => setPwdDone(false), 3000);
    } catch (err) {
      toast.error(err?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setSavingPwd(false);
    }
  };

  /* ── loading / unauth ── */
  if (!user) return (
    <div className="min-h-screen bg-[#05060C] flex items-center justify-center font-body pt-16">
      <div className="text-center">
        <p className="text-[#7A83A8] mb-4">Vui lòng đăng nhập để xem hồ sơ</p>
        <Link to="/signin" className="px-6 py-2.5 bg-[#00D2A8] text-[#03050A] font-bold rounded-xl text-sm">
          Đăng nhập
        </Link>
      </div>
    </div>
  );

  const initials = user.fullName
    ? user.fullName.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()
    : user.username?.slice(0, 2).toUpperCase();

  return (
    <main className="min-h-screen bg-[#05060C] pt-20 pb-20 font-body">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* ── Page header ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="mb-8 pt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00D2A8] mb-2">Tài khoản</p>
          <h1 className="font-display font-black text-3xl text-[#E8EAFF]">Hồ sơ cá nhân</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

          {/* ── LEFT: Avatar card ── */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="flex flex-col gap-4">

            {/* Avatar */}
            <div className="bg-[#0C0D17] rounded-2xl border border-white/[.07] p-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-2xl bg-[#00D2A8]/[.15] border-2 border-[#00D2A8]/40
                  flex items-center justify-center shadow-[0_0_24px_rgba(0,210,168,0.2)]">
                  <span className="font-display font-black text-2xl text-[#00D2A8]">{initials}</span>
                </div>
                {user.roleTypes?.includes('ADMIN') && (
                  <div className="absolute -bottom-1 -right-1 bg-[#F59E0B] rounded-lg p-1 border-2 border-[#05060C]">
                    <Star size={10} className="text-[#03050A] fill-[#03050A]" />
                  </div>
                )}
              </div>
              <h2 className="font-display font-black text-lg text-[#E8EAFF] leading-tight">
                {user.fullName || user.username}
              </h2>
              <p className="text-xs text-[#3D4466] mt-1">@{user.username}</p>
              {user.roleTypes?.map(r => (
                <span key={r}
                  className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black
                    bg-[#00D2A8]/[.1] text-[#00D2A8] border border-[#00D2A8]/20 uppercase tracking-wider">
                  {r}
                </span>
              ))}
            </div>

            {/* Nav tabs */}
            <div className="bg-[#0C0D17] rounded-2xl border border-white/[.07] p-2 flex flex-col gap-0.5">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
                    transition-all text-left ${tab === id
                      ? 'bg-[#00D2A8]/[.12] text-[#00D2A8] border border-[#00D2A8]/20'
                      : 'text-[#7A83A8] hover:bg-white/[.04] hover:text-[#E8EAFF]'
                    }`}>
                  <Icon size={16} className="flex-shrink-0" />
                  {label}
                  {tab === id && <ChevronRight size={14} className="ml-auto" />}
                </button>
              ))}
            </div>

            {/* Quick links */}
            <div className="bg-[#0C0D17] rounded-2xl border border-white/[.07] p-2 flex flex-col gap-0.5">
              <Link to="/orders"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
                  text-[#7A83A8] hover:bg-white/[.04] hover:text-[#E8EAFF] transition-all">
                <Package size={16} /> Đơn hàng của tôi
              </Link>
              <button onClick={logout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
                  text-red-400 hover:bg-red-400/[.08] transition-all text-left">
                <LogOut size={16} /> Đăng xuất
              </button>
            </div>
          </motion.div>

          {/* ── RIGHT: Tab content ── */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 }}>
            <AnimatePresence mode="wait">

              {/* ── TAB: INFO ── */}
              {tab === 'info' && (
                <motion.div key="info"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="bg-[#0C0D17] rounded-2xl border border-white/[.07] p-6">
                  <h3 className="font-display font-black text-base text-[#E8EAFF] mb-6 flex items-center gap-2">
                    <User size={16} className="text-[#00D2A8]" /> Thông tin tài khoản
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Tên đăng nhập" value={user.username} icon={User} />
                    <Field label="Họ và tên"     value={user.fullName} />
                    <Field label="Email"          value={user.email}    icon={Mail} />
                    <Field label="Số điện thoại"  value={user.phone}    icon={Phone} />
                    <Field label="Giới tính"      value={
                      user.gender === 'MALE' ? 'Nam' : user.gender === 'FEMALE' ? 'Nữ' : user.gender
                    } />
                    <Field label="Thành viên từ" icon={Calendar}
                      value={user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('vi-VN', { day:'2-digit',month:'2-digit',year:'numeric' })
                        : undefined}
                    />
                  </div>
                </motion.div>
              )}

              {/* ── TAB: ADDRESS ── */}
              {tab === 'address' && (
                <motion.div key="address"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="space-y-4">

                  <div className="bg-[#0C0D17] rounded-2xl border border-white/[.07] p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-display font-black text-base text-[#E8EAFF] flex items-center gap-2">
                        <MapPin size={16} className="text-[#00D2A8]" />
                        Địa chỉ giao hàng
                        <span className="text-xs font-semibold text-[#3D4466] bg-white/[.04] px-2 py-0.5 rounded-full">
                          {addresses.length}
                        </span>
                      </h3>
                      {!showAddrForm && (
                        <button onClick={() => setShowAddrForm(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00D2A8]/[.12] hover:bg-[#00D2A8]/[.2]
                            text-[#00D2A8] text-xs font-black rounded-lg border border-[#00D2A8]/25
                            transition-all">
                          <Plus size={13} /> Thêm mới
                        </button>
                      )}
                    </div>

                    {/* Address list */}
                    {addrLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 size={24} className="animate-spin text-[#00D2A8]" />
                      </div>
                    ) : addresses.length === 0 ? (
                      <div className="text-center py-10 border border-dashed border-white/[.08] rounded-xl">
                        <MapPin size={32} className="text-[#3D4466] mx-auto mb-3" />
                        <p className="text-[#7A83A8] text-sm font-semibold">Chưa có địa chỉ nào</p>
                        <p className="text-[#3D4466] text-xs mt-1">Thêm địa chỉ để đặt hàng nhanh hơn</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {addresses.map(addr => (
                          <motion.div key={addr.id} layout
                            className={`relative p-4 rounded-xl border transition-all
                              ${addr.defaultAddress
                                ? 'border-[#00D2A8]/30 bg-[#00D2A8]/[.05]'
                                : 'border-white/[.07] hover:border-white/[.12]'
                              }`}>

                            {/* Badge */}
                            {addr.defaultAddress && (
                              <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5
                                bg-[#00D2A8] text-[#03050A] text-[10px] font-black rounded-full">
                                <Star size={9} className="fill-[#03050A]" /> Mặc định
                              </span>
                            )}

                            {/* Content */}
                            <div className="flex items-start gap-3 pr-20">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                                ${addr.defaultAddress ? 'bg-[#00D2A8]/[.15] text-[#00D2A8]' : 'bg-white/[.05] text-[#7A83A8]'}`}>
                                {addrTypeIcon(addr.addressType)}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-bold text-sm text-[#E8EAFF]">{addr.recipient}</p>
                                  <span className="text-[10px] text-[#3D4466] bg-white/[.04] px-1.5 py-0.5 rounded">
                                    {addrTypeLabel(addr.addressType)}
                                  </span>
                                </div>
                                <p className="text-xs text-[#7A83A8] mt-1">
                                  {[addr.line1, addr.ward, addr.district, addr.city].filter(Boolean).join(', ')}
                                </p>
                                <p className="text-xs text-[#3D4466] mt-0.5">
                                  <Phone size={10} className="inline mr-1" />{addr.phone}
                                </p>
                              </div>
                            </div>

                            {/* Actions */}
                            {confirmDel === addr.id ? (
                              <div className="mt-3 flex items-center gap-2 bg-[#F87171]/[.08] border border-[#F87171]/20
                                rounded-lg px-3 py-2 text-xs">
                                <span className="text-[#F87171] font-semibold flex-1">Xóa địa chỉ này?</span>
                                <button onClick={() => handleDelete(addr.id)}
                                  className="px-2.5 py-1 bg-[#F87171]/[.15] text-[#F87171] font-black rounded-lg hover:bg-[#F87171]/[.25] border border-[#F87171]/25 transition-colors">
                                  Xóa
                                </button>
                                <button onClick={() => setConfirmDel(null)}
                                  className="px-2.5 py-1 bg-white/[.06] text-[#E8EAFF] font-semibold rounded-lg hover:bg-white/[.1] transition-colors">
                                  Hủy
                                </button>
                              </div>
                            ) : (
                              <div className="mt-3 flex gap-2">
                                {!addr.defaultAddress && (
                                  <button onClick={() => handleSetDefault(addr.id)}
                                    className="text-[10px] font-black px-3 py-1.5 bg-[#00D2A8]/[.1] hover:bg-[#00D2A8]/[.2]
                                      text-[#00D2A8] border border-[#00D2A8]/20 rounded-lg transition-all">
                                    Đặt mặc định
                                  </button>
                                )}
                                <button onClick={() => setConfirmDel(addr.id)}
                                  className="text-[10px] font-black px-3 py-1.5 bg-white/[.04] hover:bg-[#F87171]/[.08]
                                    text-[#7A83A8] hover:text-[#F87171] border border-white/[.07] rounded-lg transition-all
                                    flex items-center gap-1">
                                  <Trash2 size={11} /> Xóa
                                </button>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add address form */}
                  <AnimatePresence>
                    {showAddrForm && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        className="bg-[#0C0D17] rounded-2xl border border-[#00D2A8]/20 p-6">
                        <h4 className="font-display font-black text-sm text-[#E8EAFF] mb-5 flex items-center gap-2">
                          <Plus size={14} className="text-[#00D2A8]" /> Địa chỉ mới
                        </h4>
                        <form onSubmit={handleAddAddr} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                              ['recipient', 'Tên người nhận *',  'text',  false],
                              ['phone',     'Số điện thoại *',   'tel',   false],
                              ['line1',     'Số nhà, tên đường *','text',  true],
                              ['ward',      'Phường / Xã *',     'text',  false],
                              ['district',  'Quận / Huyện *',    'text',  false],
                              ['city',      'Tỉnh / Thành phố *','text',  false],
                            ].map(([k, ph, t, span]) => (
                              <input key={k} type={t} placeholder={ph} required={ph.endsWith('*')}
                                value={addrForm[k]}
                                onChange={e => setAddrForm(f => ({ ...f, [k]: e.target.value }))}
                                className={`bg-white/[.04] border border-white/[.1] rounded-xl px-4 py-2.5 text-sm
                                  text-[#E8EAFF] placeholder-[#3D4466] outline-none
                                  focus:border-[#00D2A8]/50 focus:ring-2 focus:ring-[#00D2A8]/12 transition-all
                                  ${span ? 'sm:col-span-2' : ''}`}
                              />
                            ))}
                          </div>

                          <div className="flex items-center gap-3 flex-wrap">
                            <select value={addrForm.addressType}
                              onChange={e => setAddrForm(f => ({ ...f, addressType: e.target.value }))}
                              className="bg-white/[.04] border border-white/[.1] rounded-xl px-4 py-2.5 text-sm
                                text-[#E8EAFF] outline-none focus:border-[#00D2A8]/50 transition-all
                                [&>option]:bg-[#0C0D17]">
                              <option value="HOME">Nhà riêng</option>
                              <option value="OFFICE">Văn phòng</option>
                              <option value="OTHER">Khác</option>
                            </select>
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                              <input type="checkbox" checked={addrForm.defaultAddress}
                                onChange={e => setAddrForm(f => ({ ...f, defaultAddress: e.target.checked }))}
                                className="w-4 h-4 rounded accent-[#00D2A8]"
                              />
                              <span className="text-sm font-semibold text-[#7A83A8]">Đặt làm mặc định</span>
                            </label>
                          </div>

                          <div className="flex gap-3 pt-1">
                            <button type="submit" disabled={savingAddr}
                              className="flex-1 py-2.5 bg-[#00D2A8] hover:bg-[#00B894] text-[#03050A] font-black
                                rounded-xl text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2
                                shadow-[0_0_16px_rgba(0,210,168,0.2)]">
                              {savingAddr ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                              {savingAddr ? 'Đang lưu...' : 'Lưu địa chỉ'}
                            </button>
                            <button type="button"
                              onClick={() => { setShowAddrForm(false); setAddrForm(EMPTY_ADDR); }}
                              className="px-5 py-2.5 border border-white/[.1] text-[#7A83A8] hover:text-[#E8EAFF]
                                hover:border-white/20 font-semibold rounded-xl text-sm transition-all">
                              Hủy
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* ── TAB: SECURITY ── */}
              {tab === 'security' && (
                <motion.div key="security"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="bg-[#0C0D17] rounded-2xl border border-white/[.07] p-6">

                  <h3 className="font-display font-black text-base text-[#E8EAFF] mb-6 flex items-center gap-2">
                    <Lock size={16} className="text-[#00D2A8]" /> Đổi mật khẩu
                  </h3>

                  <AnimatePresence mode="wait">
                    {pwdDone ? (
                      <motion.div key="done"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center py-10 gap-4">
                        <div className="w-14 h-14 bg-[#34D399]/[.15] rounded-2xl flex items-center justify-center
                          border border-[#34D399]/25 shadow-[0_0_24px_rgba(52,211,153,0.2)]">
                          <Check size={28} className="text-[#34D399]" />
                        </div>
                        <p className="font-display font-black text-lg text-[#E8EAFF]">Đổi mật khẩu thành công!</p>
                        <p className="text-[#7A83A8] text-sm">Mật khẩu mới của bạn đã được cập nhật.</p>
                      </motion.div>
                    ) : (
                      <motion.form key="form" onSubmit={handleChangePwd} className="space-y-4 max-w-md">
                        <PwdField label="Mật khẩu hiện tại"
                          value={pwdForm.password}
                          onChange={e => setPwdForm(f => ({ ...f, password: e.target.value }))}
                          placeholder="Nhập mật khẩu hiện tại"
                        />
                        <PwdField label="Mật khẩu mới"
                          value={pwdForm.newPassword}
                          onChange={e => setPwdForm(f => ({ ...f, newPassword: e.target.value }))}
                          placeholder="Tối thiểu 8 ký tự"
                        />
                        <PwdField label="Xác nhận mật khẩu mới"
                          value={pwdForm.confirmPassword}
                          onChange={e => setPwdForm(f => ({ ...f, confirmPassword: e.target.value }))}
                          placeholder="Nhập lại mật khẩu mới"
                        />

                        {/* Password strength hint */}
                        {pwdForm.newPassword && pwdForm.confirmPassword && (
                          <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg
                            ${pwdForm.newPassword === pwdForm.confirmPassword
                              ? 'bg-[#34D399]/[.08] text-[#34D399] border border-[#34D399]/20'
                              : 'bg-[#F87171]/[.08] text-[#F87171] border border-[#F87171]/20'
                            }`}>
                            {pwdForm.newPassword === pwdForm.confirmPassword
                              ? <><Check size={12} /> Mật khẩu khớp</>
                              : <>Mật khẩu chưa khớp</>
                            }
                          </div>
                        )}

                        <div className="flex gap-3 pt-2">
                          <button type="submit" disabled={savingPwd}
                            className="flex-1 py-3 bg-[#00D2A8] hover:bg-[#00B894] text-[#03050A] font-black
                              rounded-xl text-sm transition-all disabled:opacity-60
                              flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(0,210,168,0.2)]">
                            {savingPwd
                              ? <><Loader2 size={15} className="animate-spin" /> Đang lưu...</>
                              : <><Lock size={15} /> Đổi mật khẩu</>
                            }
                          </button>
                          <button type="button"
                            onClick={() => { setPwdForm(EMPTY_PWD); }}
                            className="px-5 py-3 border border-white/[.1] text-[#7A83A8] hover:text-[#E8EAFF]
                              hover:border-white/20 font-semibold rounded-xl text-sm transition-all">
                            Xóa
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
