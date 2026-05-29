import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Users, Package, LogOut, Menu, X, Ticket, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProductManager from '../Components/admin/ProductManager';
import UserManager from '../Components/admin/UserManager';
import OrderManager from '../Components/admin/OrderManager';
import VoucherManager from '../Components/admin/VoucherManager';

const TABS = [
  { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'orders',    label: 'Đơn hàng',  icon: ShoppingCart },
  { id: 'products',  label: 'Sản phẩm',  icon: Package },
  { id: 'users',     label: 'Người dùng', icon: Users },
  { id: 'vouchers',  label: 'Mã giảm giá', icon: Ticket },
];

const CARDS = [
  { id: 'orders',   title: 'Đơn hàng',    desc: 'Kiểm tra và xử lý đơn hàng mới',  icon: ShoppingCart, color: 'bg-[#00D2A8]/[.08] border-[#00D2A8]/20',   iconColor: 'bg-[#00D2A8]/[.15] border border-[#00D2A8]/25', textColor: 'text-[#00D2A8]' },
  { id: 'products', title: 'Sản phẩm',    desc: 'Quản lý kho, giá và thông tin SP', icon: Package,      color: 'bg-[#A78BFA]/[.08] border-[#A78BFA]/20',   iconColor: 'bg-[#A78BFA]/[.15] border border-[#A78BFA]/25', textColor: 'text-[#A78BFA]' },
  { id: 'users',    title: 'Người dùng',  desc: 'Quản lý tài khoản và phân quyền', icon: Users,        color: 'bg-[#34D399]/[.08] border-[#34D399]/20',   iconColor: 'bg-[#34D399]/[.15] border border-[#34D399]/25', textColor: 'text-[#34D399]' },
  { id: 'vouchers', title: 'Mã giảm giá', desc: 'Tạo và quản lý mã khuyến mãi',    icon: Ticket,       color: 'bg-[#F59E0B]/[.08] border-[#F59E0B]/20',   iconColor: 'bg-[#F59E0B]/[.15] border border-[#F59E0B]/25', textColor: 'text-[#F59E0B]' },
];

export default function Admin() {
  const navigate = useNavigate();
  const { isAdmin, loading, logout: authLogout } = useAuth();
  const [tab, setTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) navigate('/', { replace: true });
  }, [isAdmin, loading]);

  const logout = () => {
    if (!window.confirm('Đăng xuất khỏi trang quản trị?')) return;
    authLogout();
  };

  const content = () => {
    switch (tab) {
      case 'products': return <ProductManager />;
      case 'users':    return <UserManager />;
      case 'orders':   return <OrderManager />;
      case 'vouchers': return <VoucherManager />;
      default: return (
        <div className="space-y-6">
          <div>
            <h2 className="font-display font-black text-2xl text-[#E8EAFF]">Chào mừng trở lại 👋</h2>
            <p className="text-[#3D4466] text-sm mt-1">Chọn một mục để bắt đầu quản lý hệ thống.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CARDS.map(({ id, title, desc, icon: Icon, color, iconColor, textColor }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`p-6 rounded-2xl border ${color} text-left hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]
                  transition-all duration-200 hover:-translate-y-0.5 group`}>
                <div className={`w-11 h-11 ${iconColor} rounded-xl flex items-center justify-center mb-4
                  group-hover:scale-110 transition-transform`}>
                  <Icon size={20} className={textColor} />
                </div>
                <h3 className={`font-display font-bold text-lg ${textColor} mb-1`}>{title}</h3>
                <p className="text-sm text-[#7A83A8]">{desc}</p>
                <div className={`flex items-center gap-1 mt-3 text-xs font-bold ${textColor} opacity-60 group-hover:opacity-100 transition-opacity`}>
                  Quản lý <ChevronRight size={12} />
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-[#05060C] overflow-hidden font-body">

      {/* Sidebar */}
      <aside className={`bg-[#0C0D17] flex flex-col transition-all duration-300 flex-shrink-0
        ${sidebarOpen ? 'w-60' : 'w-16'} fixed h-full z-20 md:relative
        border-r border-white/[.07] shadow-[4px_0_24px_rgba(0,0,0,0.4)]`}>

        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-white/[.07]">
          {sidebarOpen ? (
            <>
              <div className="w-8 h-8 bg-[#00D2A8] rounded-xl flex items-center justify-center font-display font-black text-xs text-[#03050A] flex-shrink-0
                shadow-[0_0_12px_rgba(0,210,168,0.4)]">SP</div>
              <span className="font-display font-bold text-[#E8EAFF]">Admin Panel</span>
              <button onClick={() => setSidebarOpen(false)} className="ml-auto text-[#3D4466] hover:text-[#E8EAFF] transition-colors md:hidden">
                <X size={18} />
              </button>
            </>
          ) : (
            <div className="w-8 h-8 bg-[#00D2A8] rounded-xl flex items-center justify-center font-display font-black text-xs text-[#03050A] mx-auto
              shadow-[0_0_12px_rgba(0,210,168,0.4)]">SP</div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} title={!sidebarOpen ? label : ''}
              className={`admin-nav-item w-full ${tab === id ? 'active' : ''} ${!sidebarOpen ? 'justify-center px-0' : ''}`}>
              <Icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/[.07]">
          <button onClick={logout} title={!sidebarOpen ? 'Đăng xuất' : ''}
            className={`admin-nav-item w-full text-red-400 hover:bg-red-400/[.08] hover:text-red-300 ${!sidebarOpen ? 'justify-center px-0' : ''}`}>
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="font-semibold">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar (mobile) */}
        <header className="bg-[#0C0D17] border-b border-white/[.07] h-14 flex items-center px-5 gap-4 md:hidden flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="text-[#7A83A8] hover:text-[#E8EAFF]"><Menu size={22} /></button>
          <span className="font-display font-bold text-[#E8EAFF]">Quản trị hệ thống</span>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-5 md:p-6 bg-[#05060C]">
          <div className="max-w-7xl mx-auto">
            {content()}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-10 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
