import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Package, MapPin, CreditCard, Calendar,
  Truck, CheckCircle, XCircle, Loader2, StickyNote,
} from 'lucide-react';

const formatVND = (v) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v ?? 0);

const formatDate = (s) => {
  if (!s) return '---';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(s));
};

const STEPS = [
  { label: 'Đặt hàng', icon: Package,      step: 1 },
  { label: 'Xác nhận', icon: CheckCircle,  step: 2 },
  { label: 'Giao hàng',icon: Truck,        step: 3 },
  { label: 'Hoàn tất', icon: CheckCircle,  step: 4 },
];

const STATUS_MAP = {
  PENDING:   1,
  CONFIRMED: 2,
  SHIPPING:  3,
  DELIVERED: 4,
  CANCELLED: 0,
  CANCELED:  0,
};

const STATUS_LABEL = {
  PENDING:   'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING:  'Đang giao hàng',
  DELIVERED: 'Giao thành công',
  CANCELLED: 'Đã hủy',
  CANCELED:  'Đã hủy',
};

const STATUS_STYLE = {
  PENDING:   'bg-[#F59E0B]/[.12] text-[#F59E0B] border-[#F59E0B]/25',
  CONFIRMED: 'bg-[#00D2A8]/[.12] text-[#00D2A8] border-[#00D2A8]/25',
  SHIPPING:  'bg-[#A78BFA]/[.12] text-[#A78BFA] border-[#A78BFA]/25',
  DELIVERED: 'bg-[#34D399]/[.12] text-[#34D399] border-[#34D399]/25',
  CANCELLED: 'bg-[#F87171]/[.12] text-[#F87171] border-[#F87171]/25',
  CANCELED:  'bg-[#F87171]/[.12] text-[#F87171] border-[#F87171]/25',
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const token = sessionStorage.getItem('accessToken');
        const res = await fetch(`http://localhost:8081/api/orders/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error('Không thể tải chi tiết đơn hàng');
        const data = await res.json();
        setOrder(data.result ?? data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#05060C] flex items-center justify-center">
      <Loader2 size={28} className="animate-spin text-[#00D2A8]" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#05060C] flex items-center justify-center p-4">
      <div className="bg-[#F87171]/[.08] border border-[#F87171]/20 rounded-2xl px-8 py-6 text-center">
        <XCircle size={32} className="text-[#F87171] mx-auto mb-3" />
        <p className="text-[#F87171] font-semibold">{error}</p>
        <button onClick={() => navigate(-1)}
          className="mt-4 text-sm text-[#7A83A8] hover:text-[#E8EAFF] underline transition-colors">
          Quay lại
        </button>
      </div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-[#05060C] flex items-center justify-center">
      <p className="text-[#7A83A8]">Không tìm thấy đơn hàng.</p>
    </div>
  );

  const currentStep = STATUS_MAP[order.status] ?? 1;
  const isCancelled = currentStep === 0;
  const statusLabel = STATUS_LABEL[order.status] ?? order.status;
  const statusStyle = STATUS_STYLE[order.status] ?? 'bg-white/[.05] text-[#C8CADF] border-white/[.09]';
  const items       = order.orderItems ?? order.items ?? [];

  return (
    <main className="min-h-screen bg-[#05060C] pt-24 pb-20 font-body">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">

        {/* ── Back + Title ── */}
        <div className="mb-6">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-[#7A83A8] hover:text-[#E8EAFF] transition-colors mb-5 font-medium">
            <ArrowLeft size={16} /> Quay lại đơn hàng
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00D2A8] mb-1">
                Chi tiết đơn hàng
              </p>
              <h1 className="font-display font-black text-2xl text-[#E8EAFF] flex items-center gap-3 flex-wrap">
                {order.code || `#${order.id}`}
                <span className={`text-xs px-2.5 py-1 rounded-full border font-black ${statusStyle}`}>
                  {statusLabel}
                </span>
              </h1>
              <p className="text-sm text-[#3D4466] mt-1.5 flex items-center gap-1.5">
                <Calendar size={13} />
                {formatDate(order.orderDate)}
              </p>
            </div>

            {order.status === 'PENDING' && (
              <button className="px-4 py-2 border border-[#F87171]/25 text-[#F87171] rounded-xl
                hover:bg-[#F87171]/[.08] text-sm font-bold transition-colors flex-shrink-0">
                Hủy đơn hàng
              </button>
            )}
          </div>
        </div>

        {/* ── Timeline ── */}
        {!isCancelled ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#0C0D17] rounded-2xl border border-white/[.07] p-6 mb-5">
            <div className="relative">
              {/* Track background */}
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-white/[.08] rounded-full" />
              {/* Track active */}
              <div
                className="absolute top-5 left-5 h-0.5 bg-[#34D399] rounded-full transition-all duration-700"
                style={{ width: `calc(${Math.max(0, (currentStep - 1) / 3) * 100}% - ${currentStep < 4 ? '20px' : '0px'})` }}
              />

              <div className="relative flex justify-between">
                {STEPS.map(({ label, icon: Icon, step }) => {
                  const done   = currentStep >= step;
                  const active = currentStep === step;
                  return (
                    <div key={step} className="flex flex-col items-center gap-2 z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                        ${done
                          ? 'bg-[#34D399]/[.15] border-[#34D399] shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                          : 'bg-[#0C0D17] border-white/[.12]'
                        }`}>
                        <Icon size={16} className={done ? 'text-[#34D399]' : 'text-[#3D4466]'} />
                      </div>
                      <span className={`text-xs font-semibold hidden sm:block ${done ? 'text-[#34D399]' : 'text-[#3D4466]'}`}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-[#F87171]/[.06] border border-[#F87171]/20 rounded-2xl p-4 mb-5
            flex items-center gap-3">
            <XCircle size={20} className="text-[#F87171] flex-shrink-0" />
            <span className="text-[#F87171] font-semibold text-sm">Đơn hàng đã bị hủy.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* ── Products ── */}
          <div className="md:col-span-2">
            <div className="bg-[#0C0D17] rounded-2xl border border-white/[.07] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-white/[.06] flex items-center justify-between">
                <h3 className="font-display font-bold text-sm text-[#E8EAFF]">Sản phẩm</h3>
                <span className="text-xs text-[#3D4466]">{items.length} sản phẩm</span>
              </div>

              <div className="divide-y divide-white/[.05]">
                {items.map((it, i) => (
                  <div key={it.id ?? i} className="flex items-center gap-4 p-4">
                    <div className="w-14 h-14 bg-[#F0F1F5] rounded-xl flex-shrink-0 overflow-hidden
                      flex items-center justify-center">
                      {it.productImage
                        ? <img src={it.productImage} alt="" className="w-full h-full object-cover" />
                        : <Package size={18} className="text-[#94A3B8]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#E8EAFF] text-sm line-clamp-2">
                        {it.productName ?? it.name}
                      </p>
                      <p className="text-xs text-[#3D4466] mt-0.5">×{it.quantity ?? 1}</p>
                      {it.imei && (
                        <p className="text-xs text-[#00D2A8] font-mono mt-0.5">IMEI: {it.imei}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-sm text-[#E8EAFF]">
                        {formatVND((it.price ?? it.unitPrice ?? 0) * (it.quantity ?? 1))}
                      </p>
                      {(it.quantity ?? 1) > 1 && (
                        <p className="text-[10px] text-[#3D4466]">
                          {formatVND(it.price ?? it.unitPrice ?? 0)} / sp
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="px-5 py-4 bg-white/[.02] border-t border-white/[.06] flex justify-between items-center">
                <span className="font-bold text-[#E8EAFF]">Tổng cộng</span>
                <span className="font-display font-black text-xl text-[#F59E0B]">
                  {formatVND(order.totalPrice ?? order.total ?? 0)}
                </span>
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">
            {/* Delivery address */}
            <div className="bg-[#0C0D17] rounded-2xl border border-white/[.07] p-5">
              <h3 className="font-bold text-sm text-[#E8EAFF] mb-3 flex items-center gap-2">
                <MapPin size={15} className="text-[#00D2A8]" /> Địa chỉ nhận hàng
              </h3>
              <div className="space-y-1 text-sm">
                {order.name && (
                  <p className="font-bold text-[#E8EAFF]">{order.name}</p>
                )}
                {order.phoneNumber && (
                  <p className="text-[#7A83A8]">{order.phoneNumber}</p>
                )}
                {order.address && (
                  <p className="text-[#7A83A8] leading-relaxed">{order.address}</p>
                )}
                {!order.name && !order.address && (
                  <p className="text-[#3D4466] italic text-xs">Không có thông tin địa chỉ</p>
                )}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-[#0C0D17] rounded-2xl border border-white/[.07] p-5">
              <h3 className="font-bold text-sm text-[#E8EAFF] mb-3 flex items-center gap-2">
                <CreditCard size={15} className="text-[#00D2A8]" /> Thanh toán
              </h3>
              <p className="text-sm text-[#7A83A8]">Thanh toán khi nhận hàng (COD)</p>
            </div>

            {/* Note */}
            {order.note && (
              <div className="bg-[#F59E0B]/[.06] border border-[#F59E0B]/20 rounded-2xl p-5">
                <h3 className="font-bold text-sm text-[#F59E0B] mb-2 flex items-center gap-2">
                  <StickyNote size={14} /> Ghi chú
                </h3>
                <p className="text-sm text-[#B0B8D4] italic">"{order.note}"</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
