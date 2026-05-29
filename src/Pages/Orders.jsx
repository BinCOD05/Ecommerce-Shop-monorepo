import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, MapPin, ChevronRight, Search, ShieldCheck, Loader2, ShoppingBag } from 'lucide-react';

const formatVND = (v) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const formatDate = (s) => {
  if (!s) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(s));
};

const STATUS = {
  PENDING:   { label: 'Chờ xác nhận',   cls: 'bg-[#F59E0B]/[.12] text-[#F59E0B] border-[#F59E0B]/25' },
  CONFIRMED: { label: 'Đã xác nhận',    cls: 'bg-[#00D2A8]/[.12] text-[#00D2A8] border-[#00D2A8]/25' },
  SHIPPING:  { label: 'Đang giao',       cls: 'bg-[#A78BFA]/[.12] text-[#A78BFA] border-[#A78BFA]/25' },
  DELIVERED: { label: 'Giao thành công', cls: 'bg-[#34D399]/[.12] text-[#34D399] border-[#34D399]/25' },
  CANCELLED: { label: 'Đã hủy',         cls: 'bg-[#F87171]/[.12] text-[#F87171] border-[#F87171]/25' },
  CANCELED:  { label: 'Đã hủy',         cls: 'bg-[#F87171]/[.12] text-[#F87171] border-[#F87171]/25' },
};

const getStatus = (s) => STATUS[s] || { label: s, cls: 'bg-white/[.05] text-[#C8CADF] border-white/[.09]' };

export default function Orders() {
  const navigate = useNavigate();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [imei,    setImei]    = useState('');
  const [checking, setChecking] = useState(false);
  const [warrantyResult, setWarrantyResult] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = sessionStorage.getItem('accessToken');
        const res = await fetch('http://localhost:8081/api/orders', {
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
        if (!res.ok) throw new Error('Không thể tải đơn hàng');
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.result || []);
        setOrders(list.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const checkWarranty = async () => {
    if (!imei.trim()) return;
    setChecking(true);
    setWarrantyResult(null);
    try {
      const res  = await fetch(`http://localhost:8081/api/warranty?imei=${encodeURIComponent(imei.trim())}`);
      const text = await res.text();
      setWarrantyResult(text);
    } catch {
      setWarrantyResult('Lỗi kết nối khi tra cứu.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#05060C] pt-24 pb-20 font-body">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00D2A8] mb-1">Tài khoản</p>
            <h1 className="text-3xl font-display font-black text-[#E8EAFF]">Đơn hàng của tôi</h1>
            <p className="text-[#7A83A8] text-sm mt-1">{orders.length} đơn hàng</p>
          </div>

          {/* IMEI lookup */}
          <div className="bg-[#0C0D17] rounded-xl border border-white/[.09] overflow-hidden flex items-center
            w-full md:w-auto focus-within:border-[#00D2A8]/40 transition-colors">
            <Search className="ml-3 text-[#3D4466] h-4 w-4 flex-shrink-0" />
            <input
              value={imei}
              onChange={e => setImei(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && checkWarranty()}
              placeholder="Tra cứu bảo hành (IMEI)"
              className="px-3 py-2.5 outline-none text-sm w-full md:w-56 bg-transparent
                text-[#E8EAFF] placeholder-[#3D4466]"
            />
            <button
              onClick={checkWarranty}
              disabled={checking || !imei.trim()}
              className="bg-[#00D2A8] text-[#03050A] px-4 py-2.5 text-sm font-black
                hover:bg-[#00B894] transition-colors disabled:opacity-50 flex items-center gap-1.5 flex-shrink-0"
            >
              {checking && <Loader2 size={13} className="animate-spin" />}
              Kiểm tra
            </button>
          </div>
        </div>

        {/* ── Warranty result ── */}
        {warrantyResult && (
          <div className="mb-6 bg-[#00D2A8]/[.06] border border-[#00D2A8]/20 rounded-2xl p-5
            flex items-start gap-3">
            <ShieldCheck className="text-[#00D2A8] h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-[#00D2A8] uppercase tracking-wider mb-2">Kết quả tra cứu</p>
              <pre className="text-sm text-[#B0B8D4] whitespace-pre-wrap font-body leading-relaxed">
                {warrantyResult}
              </pre>
              <button
                onClick={() => { setWarrantyResult(null); setImei(''); }}
                className="text-xs text-[#3D4466] hover:text-[#7A83A8] underline mt-3 transition-colors"
              >
                Đóng lại
              </button>
            </div>
          </div>
        )}

        {/* ── States ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={28} className="animate-spin text-[#00D2A8]" />
            <p className="text-[#7A83A8] text-sm">Đang tải đơn hàng...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-[#F87171]/[.08] border border-[#F87171]/20 rounded-2xl p-5 text-center">
            <p className="text-[#F87171] font-semibold">{error}</p>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4
            bg-[#0C0D17] rounded-2xl border border-dashed border-white/[.08]">
            <ShoppingBag size={40} className="text-[#3D4466]" />
            <p className="text-[#7A83A8] font-semibold">Bạn chưa có đơn hàng nào</p>
            <button onClick={() => navigate('/store')}
              className="px-5 py-2 bg-[#00D2A8] text-[#03050A] font-black text-sm rounded-xl
                hover:bg-[#00B894] transition-colors">
              Mua sắm ngay
            </button>
          </div>
        )}

        {/* ── Order list ── */}
        <div className="space-y-4">
          {orders.map(order => {
            const st = getStatus(order.status);
            return (
              <div key={order.id}
                className="bg-[#0C0D17] rounded-2xl border border-white/[.07] overflow-hidden
                  hover:border-white/[.12] transition-all">

                {/* Order header */}
                <div className="p-4 border-b border-white/[.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/[.04] border border-white/[.07] rounded-xl
                      flex items-center justify-center flex-shrink-0">
                      <Package size={18} className="text-[#7A83A8]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[#E8EAFF] text-sm">
                          {order.code || `#${order.id}`}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${st.cls}`}>
                          {st.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#3D4466] mt-0.5">
                        <Calendar size={11} />
                        {formatDate(order.orderDate)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right sm:text-right flex sm:flex-col items-center sm:items-end justify-between">
                    <span className="text-xs text-[#3D4466]">Tổng tiền</span>
                    <span className="font-display font-black text-lg text-[#F59E0B]">
                      {formatVND(order.totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                {order.orderItems?.length > 0 && (
                  <div className="px-4 py-3 space-y-2.5">
                    {order.orderItems.slice(0, 3).map((item, i) => (
                      <div key={item.id || i} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#F0F1F5] rounded-lg overflow-hidden flex-shrink-0
                          flex items-center justify-center">
                          {item.productImage
                            ? <img src={item.productImage} alt="" className="w-full h-full object-cover" />
                            : <Package size={16} className="text-[#94A3B8]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#C8CADF] truncate">{item.productName}</p>
                          <p className="text-xs text-[#3D4466]">×{item.quantity}</p>
                        </div>
                        <span className="text-sm font-bold text-[#E8EAFF] flex-shrink-0">
                          {formatVND(item.price)}
                        </span>
                      </div>
                    ))}
                    {order.orderItems.length > 3 && (
                      <p className="text-xs text-[#3D4466] text-center py-1">
                        +{order.orderItems.length - 3} sản phẩm khác
                      </p>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="px-4 py-3 bg-white/[.02] border-t border-white/[.05]
                  flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  {order.address && (
                    <div className="flex items-center gap-1.5 text-xs text-[#3D4466] min-w-0">
                      <MapPin size={12} className="flex-shrink-0" />
                      <span className="truncate max-w-[240px]">{order.address}</span>
                    </div>
                  )}
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="flex items-center gap-1 text-xs font-bold text-[#00D2A8]
                      hover:text-[#00B894] transition-colors flex-shrink-0 ml-auto"
                  >
                    Xem chi tiết <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
