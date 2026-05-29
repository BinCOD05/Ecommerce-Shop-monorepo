import { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { useToast } from '../../context/ToastContext';
import { Ticket, Trash2, Plus, RefreshCw, Calendar, Loader2, AlertTriangle } from 'lucide-react';
import { formatVND } from '../../utils/format';

export default function VoucherManager() {
  const toast = useToast();
  const [vouchers, setVouchers] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ code: '', discountAmount: '', quantity: '', expirationDate: '' });
  const [confirmDel, setConfirmDel] = useState(null); // { id, code }

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/vouchers');
      setVouchers(Array.isArray(data) ? data : (data.result || []));
    } catch (err) { toast.error(err?.message || 'Không tải được voucher'); }
    finally { setLoading(false); }
  };

  const create = async (e) => {
    e.preventDefault();
    if (!form.code || !form.discountAmount || !form.quantity || !form.expirationDate) {
      toast.warning('Điền đầy đủ thông tin'); return;
    }
    setCreating(true);
    let date = form.expirationDate;
    if (date.length === 16) date += ':00';
    try {
      await api.post('/api/admin/vouchers', {
        code: form.code,
        discountAmount: Number(form.discountAmount),
        quantity: Number(form.quantity),
        expirationDate: date,
      });
      toast.success(`Đã tạo mã giảm giá ${form.code}`);
      setForm({ code: '', discountAmount: '', quantity: '', expirationDate: '' });
      load();
    } catch (err) { toast.error(err?.message || 'Tạo mã thất bại'); }
    finally { setCreating(false); }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/api/admin/vouchers/${id}`);
      toast.success('Đã xóa mã giảm giá');
      setConfirmDel(null);
      load();
    } catch (err) { toast.error(err?.message || 'Xóa thất bại'); }
  };

  const genCode = () => setForm(p => ({ ...p, code: `SALE-${Math.random().toString(36).substring(2, 8).toUpperCase()}` }));
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: k === 'code' ? e.target.value.toUpperCase() : e.target.value }));

  return (
    <div className="space-y-5 font-body">
      <div>
        <h2 className="font-display font-bold text-xl text-[#E8EAFF] flex items-center gap-2">
          <Ticket size={20} className="text-amber-500" /> Quản lý Mã Giảm Giá
        </h2>
        <p className="text-sm text-[#3D4466] mt-0.5">{vouchers.length} mã giảm giá</p>
      </div>

      {/* Create form */}
      <div className="bg-[#0C0D17] rounded-2xl border border-white/[.07] p-6">
        <h3 className="font-display font-bold text-base text-[#E8EAFF] mb-4">Tạo mã mới</h3>
        <form onSubmit={create}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-[#7A83A8] mb-1.5 uppercase tracking-wider">Mã Code</label>
              <div className="flex">
                <input placeholder="VD: SALE50" value={form.code} onChange={f('code')} required
                  className="input-base rounded-r-none font-mono font-bold flex-1" />
                <button type="button" onClick={genCode}
                  className="px-3 bg-[#181A28] hover:bg-white/[.08] border border-l-0 border-white/[.09] rounded-r-xl text-[#7A83A8] hover:text-[#B0B8D4] transition-colors">
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#7A83A8] mb-1.5 uppercase tracking-wider">Giảm (VNĐ)</label>
              <input type="number" placeholder="50000" value={form.discountAmount} onChange={f('discountAmount')} required className="input-base" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#7A83A8] mb-1.5 uppercase tracking-wider">Số lượng</label>
              <input type="number" placeholder="100" value={form.quantity} onChange={f('quantity')} required className="input-base" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#7A83A8] mb-1.5 uppercase tracking-wider">Hết hạn</label>
              <input type="datetime-local" value={form.expirationDate} onChange={f('expirationDate')} required className="input-base text-sm" />
            </div>
          </div>
          <button type="submit" disabled={creating}
            className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-[#03050A] text-sm font-semibold rounded-xl transition-colors disabled:opacity-60">
            {creating ? <Loader2 size={15} className="animate-spin" /> : <Plus size={16} />}
            Tạo mã giảm giá
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-[#0C0D17] rounded-2xl border border-white/[.07] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead><tr>
              <th>ID</th><th>Mã Code</th><th>Giảm giá</th><th>Còn lại</th><th>Hết hạn</th><th className="text-right">Xóa</th>
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="py-12 text-center"><Loader2 className="h-5 w-5 animate-spin text-[#00D2A8] mx-auto" /></td></tr>
              ) : vouchers.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-[#3D4466]">Chưa có mã giảm giá nào</td></tr>
              ) : vouchers.map(v => (
                <>
                <tr key={v.id}>
                  <td className="text-xs font-mono text-[#3D4466]">#{v.id}</td>
                  <td>
                    <span className="font-mono font-bold text-sm bg-[#F59E0B]/[.08] text-amber-800 border border-amber-200 px-3 py-1 rounded-lg">
                      {v.code}
                    </span>
                  </td>
                  <td><span className="font-bold text-[#34D399] text-sm">-{formatVND(v.discountAmount)}</span></td>
                  <td>
                    <span className={`badge ${v.quantity > 0 ? 'bg-[#34D399]/[.08] text-emerald-700 border-emerald-200' : 'bg-[#F87171]/[.08] text-[#F87171] border-[#F87171]/20'}`}>
                      {v.quantity}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-sm text-[#7A83A8]">
                      <Calendar size={13} className="text-[#3D4466]" />
                      {v.expirationDate ? new Date(v.expirationDate).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </div>
                  </td>
                  <td className="text-right">
                    <button onClick={() => setConfirmDel({ id: v.id, code: v.code })}
                      className="p-1.5 text-[#3D4466] hover:text-[#F87171] hover:bg-[#F87171]/[.08] rounded-lg transition-all">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
                {confirmDel?.id === v.id && (
                  <tr><td colSpan={6} className="bg-[#F87171]/[.08] border-y border-red-100 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={14} className="text-red-500" />
                      <span className="text-xs text-[#F87171] font-medium flex-1">Xóa mã <b className="font-mono">{v.code}</b>?</span>
                      <button onClick={() => remove(v.id)} className="px-3 py-1.5 bg-[#F87171]/[.08]0 text-[#03050A] text-xs font-bold rounded-lg hover:bg-red-600 transition-colors">Xóa</button>
                      <button onClick={() => setConfirmDel(null)} className="px-3 py-1.5 bg-[#0C0D17] border border-white/[.09] text-[#7A83A8] text-xs font-semibold rounded-lg hover:bg-[#12141F] transition-colors">Hủy</button>
                    </div>
                  </td></tr>
                )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
