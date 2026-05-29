import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { User, LogOut, ShoppingCart, ChevronDown, Menu, X, Search, Package, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const NAV = [
  { label: 'Cửa hàng', to: '/store' },
  { label: 'iPhone',   to: '/category?keyword=iphone' },
  { label: 'Mac',      to: '/category?keyword=mac' },
  { label: 'iPad',     to: '/category?keyword=ipad' },
  { label: 'Samsung',  to: '/category?keyword=samsung' },
  { label: 'Watch',    to: '/category?keyword=watch' },
];

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { count }                 = useCart();
  const navigate                  = useNavigate();
  const location                  = useLocation();

  const [userMenu,   setUserMenu]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [search,     setSearch]     = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setUserMenu(false); }, [location]);

  const isActive = (path) => {
    const [p, q] = path.toLowerCase().split('?');
    const cur = location.pathname.toLowerCase();
    const cs  = location.search.toLowerCase();
    if (p === '/') return cur === '/';
    if (q) return cur === p && cs.includes(q);
    return cur === p && cs === '';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/category?keyword=${encodeURIComponent(search)}`);
      setMobileOpen(false);
      setSearch('');
    }
  };

  return (
    <header className={`fixed top-0 inset-x-0 z-50 font-body transition-all duration-300
      ${scrolled
        ? 'bg-[#05060C]/90 backdrop-blur-2xl border-b border-white/[.07] shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
        : 'bg-[#05060C]/70 backdrop-blur-md border-b border-white/[.04]'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(o => !o)}
          className="lg:hidden p-2 -ml-1 rounded-xl text-[#7A83A8] hover:text-[#E8EAFF] hover:bg-white/[.06] transition-all">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-display font-black text-xs
            bg-[#00D2A8] text-[#03050A] group-hover:shadow-[0_0_16px_rgba(0,210,168,0.5)] transition-shadow duration-300">
            SP
          </div>
          <span className="font-display font-bold text-[#E8EAFF] text-lg tracking-tight hidden sm:block">
            SopPings
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1 mx-4">
          {NAV.map(item => (
            <Link key={item.label} to={item.to}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150
                ${isActive(item.to)
                  ? 'bg-[#00D2A8]/[.12] text-[#00D2A8]'
                  : 'text-[#7A83A8] hover:text-[#E8EAFF] hover:bg-white/[.05]'
                }`}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1.5">

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#3D4466] group-focus-within:text-[#00D2A8] transition-colors pointer-events-none" />
              <input type="text" placeholder="Tìm kiếm..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white/[.05] border border-white/[.08] rounded-lg text-sm w-36
                  focus:w-52 transition-all duration-300 focus:ring-2 focus:ring-[#00D2A8]/20
                  focus:border-[#00D2A8]/50 focus:bg-white/[.07] outline-none text-[#E8EAFF] placeholder-[#3D4466]"
              />
            </div>
          </form>

          {/* Cart */}
          <Link to="/Shopping-Cart"
            className="relative p-2 text-[#7A83A8] hover:text-[#E8EAFF] hover:bg-white/[.06] rounded-xl transition-all">
            <ShoppingCart size={20} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#00D2A8] text-[#03050A]
                text-[10px] font-black flex items-center justify-center rounded-full px-1
                shadow-[0_0_8px_rgba(0,210,168,0.6)]">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>

          {/* Admin shortcut */}
          {isAdmin && (
            <Link to="/admin"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold
                bg-[#00D2A8]/[.12] text-[#00D2A8] hover:bg-[#00D2A8]/[.2] transition-all border border-[#00D2A8]/20">
              <Zap size={12} /> Admin
            </Link>
          )}

          {/* Auth */}
          {user ? (
            <div className="relative">
              <button onClick={() => setUserMenu(o => !o)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-white/[.1]
                  hover:border-white/[.18] hover:bg-white/[.04] transition-all">
                <div className="w-6 h-6 bg-[#00D2A8]/[.2] text-[#00D2A8] rounded-lg flex items-center justify-center font-black text-xs border border-[#00D2A8]/30">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-semibold text-[#E8EAFF] max-w-[80px] truncate">
                  {user.username}
                </span>
                <ChevronDown size={14} className={`text-[#3D4466] transition-transform duration-200 ${userMenu ? 'rotate-180' : ''}`} />
              </button>

              {userMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0C0D17] rounded-2xl border border-white/[.1]
                  shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden animate-scale-in origin-top-right">
                  <div className="px-4 py-3 border-b border-white/[.07] bg-white/[.02]">
                    <p className="text-sm font-bold text-[#E8EAFF] truncate">{user.fullName || user.username}</p>
                    <p className="text-xs text-[#3D4466] truncate mt-0.5">{user.email}</p>
                  </div>
                  <div className="p-1.5">
                    <Link to="/profile" className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#7A83A8]
                      rounded-lg hover:bg-white/[.05] hover:text-[#00D2A8] transition-colors font-medium">
                      <User size={15} /> Hồ sơ cá nhân
                    </Link>
                    <Link to="/orders" className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#7A83A8]
                      rounded-lg hover:bg-white/[.05] hover:text-[#00D2A8] transition-colors font-medium">
                      <Package size={15} /> Đơn hàng của tôi
                    </Link>
                  </div>
                  <div className="p-1.5 border-t border-white/[.07]">
                    <button onClick={logout}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-400
                        rounded-lg hover:bg-red-400/[.08] transition-colors font-medium">
                      <LogOut size={15} /> Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/signin"
              className="px-4 py-2 text-sm font-bold text-[#03050A] bg-[#00D2A8] rounded-xl
                hover:bg-[#00B894] transition-all duration-200 active:scale-95
                shadow-[0_0_16px_rgba(0,210,168,0.3)] hover:shadow-[0_0_24px_rgba(0,210,168,0.5)]">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/[.07] bg-[#0C0D17]">
          <div className="px-4 py-4">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3D4466]" />
              <input type="text" placeholder="Tìm kiếm sản phẩm..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/[.05] border border-white/[.09] rounded-xl
                  text-sm outline-none focus:ring-2 focus:ring-[#00D2A8]/20 focus:border-[#00D2A8]/40
                  text-[#E8EAFF] placeholder-[#3D4466]"
              />
            </form>
            <div className="space-y-0.5">
              {NAV.map(item => (
                <Link key={item.to} to={item.to}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors
                    ${isActive(item.to)
                      ? 'bg-[#00D2A8]/[.12] text-[#00D2A8]'
                      : 'text-[#7A83A8] hover:bg-white/[.05] hover:text-[#E8EAFF]'
                    }`}>
                  {item.label}
                </Link>
              ))}
            </div>
            {!user && (
              <Link to="/signin"
                className="block mt-4 text-center py-3 rounded-xl bg-[#00D2A8] text-[#03050A] font-bold text-sm">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
