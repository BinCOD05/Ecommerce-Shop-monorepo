import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axiosInstance';
import { useToast } from '../../context/ToastContext';
import { X, CheckCircle, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { formatVND, formatDate } from '../../utils/format';
import { getStatusColor, getStatusLabel } from '../../utils/orderStatus';

const ALL_ACTIONS = [
  { label: 'Xác nhận đơn',    value: 'CONFIRMED', color: 'bg-[#00D2A8] hover:bg-[#00B894] text-[#03050A]' },
  { label: 'Đang giao hàng',  value: 'SHIPPING',  color: 'bg-[#A78BFA]/[.15] hover:bg-[#A78BFA]/[.25] text-[#A78BFA]' },
  { label: 'Giao thành công', value: 'DELIVERED', color: 'bg-[#34D399]/[.15] hover:bg-[#34D399]/[.25] text-[#34D399]' },
  { label: 'Hủy đơn hàng',    value: 'CANCELLED', color: 'bg-[#F87171]/[.08] hover:bg-[#F87171]/[.1] text-[#F87171] border border-[#F87171]/20' },
];

const VALID_TRANSITIONS = {
  PENDING:   ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPING',  'CANCELLED'],
  SHIPPING:  ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
};

export default function OrderManager() {
  const toast = useToast();

  const [orders,     setOrders]     = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [loadError,  setLoadError]  = useState('');
  const [selected,   setSelected]   = useState(null);
  const [updating,   setUpdating]   = useState('');
  const [imeiInputs, setImeiInputs] = useState({});
  const [savingImei, setSavingImei] = useState('');

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await api.get('/api/admin/orders');
      const list = Array.isArray(data) ? data : (data.result || []);
      setOrders(list.sort((a, b) => b.id - a.id));
    } catch (e) {
      setLoadError(e?.message || 'Không kết nối được server (bạn có quyền ADMIN không?)');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const updateStatus = async (newStatus) => {
    if (!selected || updating) return;
    setUpdating(newStatus);
    try {
      const updated = await api.put(`/api/admin/orders/${selected.id}/status?status=${newStatus}`);
      const orderData = updated?.id ? updated : (updated?.result ?? updated);
      setSelected(orderData);
      setOrders(prev => prev.map(o => (o.id === orderData.id ? orderData : o)));
      toast.success(`Đã cập nhật sang "${getStatusLabel(newStatus)}"`);
    } catch (e) {
      toast.error(e?.message || 'Cập nhật trạng thái thất bại');
    } finally {
      setUpdating('');
    }
  };

  const saveImei = async (itemId) => {
    const imei = (imeiInputs[itemId] || '').trim();
    if (!imei) { toast.warning('Vui lòng nhập IMEI'); return; }
    setSavingImei(itemId);
    try {
      await api.put(`/api/admin/order-items/${itemId}/imei?imei=${encodeURIComponent(imei)}`);
      setSelected(s => ({
        ...s,
        orderItems: s.orderItems.map(it => (it.id === itemId ? { ...it, imei } : it)),
      }));
      setImeiInputs(p => { const n = { ...p }; delete n[itemId]; return n; });
      toast.success('Đã lưu IMEI');
    } catch (e) {
      toast.error(e?.message || 'Lưu IMEI thất bại');
    } finally {
      setSavingImei('');
    }
  };

  const validNext = VALID_TRANSITIONS[selected?.status] ?? [];

  return (
    <div className="space-y-5 font-body">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-[#E8EAFF]">Quản lý Đơn hàng</h2>
          <p className="text-sm text-[#3D4466] mt-0.5">{orders.length} đơn hàng</p>
        </div>
        <button onClick={loadOrders} disabled={loading}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#7A83A8] hover:text-[#C8CADF] border border-white/[.09] px-3 py-1.5 rounded-lg hover:bg-[#12141F] transition-colors disabled:opacity-50">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Làm mới
        </button>
      </div>

      {loadError && (
        <div className="flex items-center gap-2 p-4 bg-[#F87171]/[.08] border border-[#F87171]/20 rounded-2xl text-[#F87171] text-sm">
          <AlertCircle size={16} className="flex-shrink-0" /> {loadError}
        </div>
      )}

      <div className="bg-[#0C0D17] rounded-2xl border border-white/[.07] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead><tr>
              <th>Mã đơn</th><th>Khách hàng</th><th>Ngày đặt</th><th>Tổng tiền</th><th>Trạng thái</th><th className="text-right">Thao tác</th>
            </tr></thead>
            <tbody>
              {loading && orders.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-14"><Loader2 className="h-5 w-5 animate-spin text-[#00D2A8] mx-auto" /></td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-14 text-[#3D4466]">Chưa có đơn hàng nào</td></tr>
              ) : orders.map(o => (
                <tr key={o.id} className={selected?.id === o.id ? 'bg-[#00D2A8]/[.08]/40' : ''}>
                  <td>
                    <p className="font-bold text-[#E8EAFF] font-mono text-sm">#{o.id}</p>
                    {o.code && <p className="text-[10px] text-[#3D4466] mt-0.5">{o.code}</p>}
                  </td>
                  <td>
                    <p className="font-medium text-[#E8EAFF] text-sm">{o.name}</p>
                    <p className="text-xs text-[#3D4466]">{o.phoneNumber}</p>
                  </td>
                  <td className="text-sm text-[#7A83A8]">
                    {o.orderDate ? new Date(o.orderDate).toLocaleDateString('vi-VN') : '---'}
                  </td>
                  <td><span className="font-bold text-[#00D2A8] text-sm">{formatVND(o.totalPrice)}</span></td>
                  <td><span className={`badge ${getStatusColor(o.status)}`}>{getStatusLabel(o.status)}</span></td>
                  <td className="text-right">
                    <button onClick={() => setSelected(o)}
                      className="text-xs font-semibold text-[#00D2A8] hover:bg-[#00D2A8]/[.08] px-3 py-1.5 rounded-lg transition-colors">
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-[#0C0D17] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>

            <div className="sticky top-0 bg-[#0C0D17] border-b border-white/[.07] px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-display font-bold text-lg text-[#E8EAFF]">Đơn #{selected.id}</h3>
                <span className={`badge ${getStatusColor(selected.status)}`}>{getStatusLabel(selected.status)}</span>
                {selected.code && <span className="text-xs text-[#3D4466] font-mono hidden sm:block">{selected.code}</span>}
              </div>
              <button onClick={() => setSelected(null)} className="text-[#3D4466] hover:text-[#B0B8D4] p-1"><X size={20} /></button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

              <div className="space-y-5">
                <section>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#3D4466] mb-2">Thông tin giao hàng</p>
                  <div className="bg-[#12141F] rounded-xl p-4 space-y-1.5 text-sm">
                    <p className="font-bold text-[#E8EAFF]">{selected.name}</p>
                    <p className="text-[#7A83A8]">{selected.phoneNumber}</p>
                    {selected.address && <p className="text-xs text-[#7A83A8] leading-relaxed">{selected.address}</p>}
                    {selected.note && (
                      <div className="mt-2 pt-2 border-t border-amber-100 bg-[#F59E0B]/[.08] rounded-lg p-2.5">
                        <p className="text-xs font-semibold text-[#F59E0B]">Ghi chú:</p>
                        <p className="text-xs text-[#F59E0B] mt-0.5 italic">"{selected.note}"</p>
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#3D4466] mb-2">Thanh toán</p>
                  <p className="font-display font-bold text-2xl text-[#00D2A8]">{formatVND(selected.totalPrice)}</p>
                  <p className="text-xs text-[#3D4466] mt-1">COD — Thanh toán khi nhận hàng</p>
                </section>

                <section>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#3D4466] mb-3">Cập nhật trạng thái</p>
                  {validNext.length === 0 ? (
                    <div className="bg-[#12141F] border border-white/[.07] rounded-xl p-3 text-center">
                      <p className="text-xs text-[#3D4466]">
                        {selected.status === 'DELIVERED' ? '✅ Đơn đã hoàn tất' : '❌ Đơn đã bị hủy'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {ALL_ACTIONS.map(action => {
                        const canDo  = validNext.includes(action.value);
                        const isBusy = updating === action.value;
                        return (
                          <button key={action.value}
                            onClick={() => canDo && !updating && updateStatus(action.value)}
                            disabled={!canDo || !!updating}
                            className={`w-full py-2.5 px-4 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2
                              ${canDo ? action.color + ' cursor-pointer' : 'bg-[#12141F] text-[#7A83A8] border border-white/[.07] cursor-not-allowed'}
                              ${!!updating && !isBusy ? 'opacity-50' : ''}`}>
                            {isBusy && <Loader2 size={14} className="animate-spin" />}
                            {action.label}
                            {!canDo && <span className="text-[10px] ml-1 opacity-60">(không khả dụng)</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>

              <div className="lg:col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#3D4466] mb-3">
                  Sản phẩm ({selected.orderItems?.length || 0})
                </p>
                <div className="space-y-3 max-h-[430px] overflow-y-auto pr-1">
                  {selected.orderItems?.map((item, i) => (
                    <div key={item.id || i}
                      className="flex gap-4 p-4 border border-white/[.07] rounded-xl bg-[#12141F]/40 hover:bg-[#12141F] transition-colors">
                      <div className="w-14 h-14 bg-[#0C0D17] rounded-xl border border-white/[.09] flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {item.productImage
                          ? <img src={item.productImage} alt="" className="w-full h-full object-cover" />
                          : <span className="text-[#7A83A8] text-xs font-bold">IMG</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#E8EAFF] text-sm truncate">{item.productName}</p>
                        <p className="text-xs text-[#7A83A8] mt-0.5">{formatVND(item.price)} × {item.quantity}</p>
                        <p className="text-xs font-bold text-[#C8CADF] mt-0.5">= {formatVND(item.price * item.quantity)}</p>
                      </div>
                      <div className="w-52 flex-shrink-0">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[#3D4466] mb-1.5">IMEI / Serial</p>
                        {item.imei ? (
                          <div className="flex items-center gap-1.5 bg-[#34D399]/[.08] border border-emerald-200 rounded-lg px-2.5 py-1.5">
                            <CheckCircle size={12} className="text-[#34D399] flex-shrink-0" />
                            <span className="text-xs font-mono text-[#34D399] truncate">{item.imei}</span>
                          </div>
                        ) : (
                          <div className="flex gap-1.5">
                            <input placeholder="Nhập IMEI..."
                              value={imeiInputs[item.id] || ''}
                              onChange={e => setImeiInputs(p => ({ ...p, [item.id]: e.target.value }))}
                              onKeyDown={e => e.key === 'Enter' && saveImei(item.id)}
                              className="flex-1 border border-white/[.09] rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-[#0C0D17] min-w-0" />
                            <button onClick={() => saveImei(item.id)}
                              disabled={savingImei === item.id || !imeiInputs[item.id]?.trim()}
                              className="px-2.5 py-1.5 bg-[#00D2A8] hover:bg-[#00B894] text-[#03050A] text-xs font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 flex-shrink-0">
                              {savingImei === item.id ? <Loader2 size={11} className="animate-spin" /> : 'Lưu'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
