import { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { useToast } from '../../context/ToastContext';
import { Search, Plus, Trash2, Eye, X, ChevronLeft, ChevronRight, AlertTriangle, Loader2 } from 'lucide-react';

const PAGE_SIZE = 10;
const ROLE_STYLE = {
  OWNER: 'bg-[#A78BFA]/[.1] text-[#A78BFA] border border-[#A78BFA]/25',
  ADMIN: 'bg-[#00D2A8]/[.1] text-[#00D2A8]',
  USER:  'bg-[#181A28] text-[#B0B8D4]',
};

export default function UserManager() {
  const toast = useToast();

  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [keyword,    setKeyword]    = useState('');
  const [page,       setPage]       = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [form,       setForm]       = useState({ username: '', password: '', fullName: '', email: '', phone: '' });
  const [showForm,   setShowForm]   = useState(false);
  const [creating,   setCreating]   = useState(false);
  const [detail,     setDetail]     = useState(null);
  const [confirmDel, setConfirmDel] = useState(null); // { id, name }
  const [confirmRole, setConfirmRole] = useState(null); // { userId, role }

  useEffect(() => { loadUsers(0, ''); }, []);

  const loadUsers = async (pg = 0, kw = keyword) => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page: pg, size: PAGE_SIZE });
      const res = await api.post(`/api/users/search?${p}`, { keyword: kw });
      setUsers(res.result?.content || []);
      setTotalPages(res.result?.totalPage || 0);
      setPage(pg);
    } catch (err) {
      toast.error(err?.message || 'Lỗi tải danh sách user');
      setUsers([]);
    } finally { setLoading(false); }
  };

  const createUser = async () => {
    if (!form.username || !form.password || !form.email) {
      toast.warning('Cần điền Username, Password và Email');
      return;
    }
    setCreating(true);
    try {
      await api.post('/auth/register', form);
      toast.success('Tạo tài khoản thành công');
      setForm({ username: '', password: '', fullName: '', email: '', phone: '' });
      setShowForm(false);
      loadUsers(0, keyword);
    } catch (err) {
      toast.error(err?.message || 'Tạo tài khoản thất bại');
    } finally { setCreating(false); }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/api/users/${id}`);
      toast.success('Đã xóa user');
      setConfirmDel(null);
      loadUsers(page, keyword);
    } catch (err) { toast.error(err?.message || 'Xóa thất bại'); }
  };

  const changeRole = async (userId, role) => {
    try {
      await api.put(`/api/users/${userId}`, { roleType: role });
      toast.success(`Đã cấp quyền ${role}`);
      setConfirmRole(null);
      loadUsers(page, keyword);
    } catch (err) { toast.error(err?.message || 'Cập nhật quyền thất bại'); }
  };

  const viewDetail = async (id) => {
    try {
      const res = await api.get(`/api/users/${id}`);
      setDetail(res.result);
    } catch (err) { toast.error(err?.message || 'Không tải được chi tiết'); }
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="space-y-5 font-body">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-[#E8EAFF]">Quản lý Người dùng</h2>
          <p className="text-sm text-[#3D4466] mt-0.5">{users.length} người dùng</p>
        </div>
        <button onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#00D2A8]/[.12] hover:bg-[#00D2A8] text-[#03050A] text-sm font-semibold rounded-xl transition-colors">
          <Plus size={16} /> Thêm user
        </button>
      </div>

      {showForm && (
        <div className="bg-[#0C0D17] rounded-2xl border border-white/[.07] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base text-[#E8EAFF]">Tạo tài khoản mới</h3>
            <button onClick={() => setShowForm(false)} className="text-[#3D4466] hover:text-[#B0B8D4]"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[['username', 'Username *', 'text'], ['password', 'Mật khẩu *', 'password'], ['fullName', 'Họ tên', 'text'], ['email', 'Email *', 'email'], ['phone', 'SĐT', 'tel']].map(([k, ph, t]) => (
              <input key={k} type={t} placeholder={ph} value={form[k]} onChange={f(k)} className="input-base" />
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={createUser} disabled={creating}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#00D2A8]/[.12] hover:bg-[#00D2A8] text-[#03050A] text-sm font-semibold rounded-xl transition-colors disabled:opacity-60">
              {creating && <Loader2 size={14} className="animate-spin" />} Tạo tài khoản
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-white/[.09] text-[#7A83A8] text-sm font-semibold rounded-xl hover:bg-[#12141F] transition-colors">Hủy</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-[#0C0D17] rounded-2xl border border-white/[.07] p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3D4466]" />
            <input placeholder="Tìm theo tên, email..." value={keyword} onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && loadUsers(0, keyword)} className="input-base pl-9" />
          </div>
          <button onClick={() => loadUsers(0, keyword)} className="px-5 py-2.5 bg-[#00D2A8] text-[#03050A] text-sm font-semibold rounded-xl hover:bg-[#00D2A8] transition-colors flex-shrink-0">
            Tìm
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0C0D17] rounded-2xl border border-white/[.07] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead><tr>
              <th>ID</th><th>Tài khoản</th><th>Email</th><th>Quyền hạn</th><th className="text-right">Thao tác</th>
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-12 text-[#3D4466]">Đang tải...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-[#3D4466]">Không có user nào</td></tr>
              ) : users.map(u => (
                <>
                <tr key={u.id}>
                  <td className="text-xs font-mono text-[#3D4466]">#{u.id}</td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-[#03050A] font-bold text-xs flex-shrink-0">
                        {u.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-[#E8EAFF] text-sm">{u.username}</p>
                        <p className="text-xs text-[#3D4466]">{u.fullName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-sm text-[#7A83A8]">{u.email}</td>
                  <td>
                    <div className="flex flex-wrap gap-1 items-center">
                      {u.roleTypes?.map(r => (
                        <span key={r} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ROLE_STYLE[r] || 'bg-[#181A28] text-[#B0B8D4]'}`}>{r}</span>
                      ))}
                      <select defaultValue=""
                        onChange={e => e.target.value && setConfirmRole({ userId: u.id, role: e.target.value, username: u.username })}
                        className="text-[10px] border border-white/[.09] rounded-lg px-1.5 py-0.5 bg-[#0C0D17] text-[#7A83A8] cursor-pointer focus:outline-none hover:border-blue-400 transition-colors">
                        <option value="" disabled>+ Role</option>
                        <option value="ADMIN">Set ADMIN</option>
                        <option value="OWNER">Set OWNER</option>
                      </select>
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => viewDetail(u.id)} className="p-1.5 text-[#3D4466] hover:text-[#00D2A8] hover:bg-[#00D2A8]/[.08] rounded-lg transition-all"><Eye size={15} /></button>
                      <button onClick={() => setConfirmDel({ id: u.id, name: u.username })} className="p-1.5 text-[#3D4466] hover:text-[#F87171] hover:bg-[#F87171]/[.08] rounded-lg transition-all"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
                {confirmDel?.id === u.id && (
                  <tr><td colSpan={5} className="bg-[#F87171]/[.08] border-y border-red-100 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={14} className="text-red-500" />
                      <span className="text-xs text-[#F87171] font-medium flex-1">Xóa user <b>{u.username}</b>? Hành động này không thể hoàn tác.</span>
                      <button onClick={() => remove(u.id)} className="px-3 py-1.5 bg-[#F87171]/[.08]0 text-[#03050A] text-xs font-bold rounded-lg hover:bg-red-600 transition-colors">Xóa</button>
                      <button onClick={() => setConfirmDel(null)} className="px-3 py-1.5 bg-[#0C0D17] border border-white/[.09] text-[#7A83A8] text-xs font-semibold rounded-lg hover:bg-[#12141F] transition-colors">Hủy</button>
                    </div>
                  </td></tr>
                )}
                {confirmRole?.userId === u.id && (
                  <tr><td colSpan={5} className="bg-[#00D2A8]/[.08] border-y border-blue-100 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={14} className="text-[#00D2A8]" />
                      <span className="text-xs text-[#00D2A8] font-medium flex-1">Cấp quyền <b>{confirmRole.role}</b> cho user <b>{u.username}</b>?</span>
                      <button onClick={() => changeRole(confirmRole.userId, confirmRole.role)} className="px-3 py-1.5 bg-[#00D2A8] text-[#03050A] text-xs font-bold rounded-lg hover:bg-[#00B894] transition-colors">Xác nhận</button>
                      <button onClick={() => setConfirmRole(null)} className="px-3 py-1.5 bg-[#0C0D17] border border-white/[.09] text-[#7A83A8] text-xs font-semibold rounded-lg hover:bg-[#12141F] transition-colors">Hủy</button>
                    </div>
                  </td></tr>
                )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/[.05] bg-[#12141F]">
            <span className="text-xs text-[#3D4466]">Trang <b className="text-[#B0B8D4]">{page + 1}</b> / {totalPages}</span>
            <div className="flex gap-1.5">
              <button disabled={page === 0} onClick={() => loadUsers(page - 1, keyword)} className="p-1.5 border border-white/[.09] rounded-lg hover:bg-[#0C0D17] disabled:opacity-40 transition-colors"><ChevronLeft size={15} /></button>
              <button disabled={page >= totalPages - 1} onClick={() => loadUsers(page + 1, keyword)} className="p-1.5 border border-white/[.09] rounded-lg hover:bg-[#0C0D17] disabled:opacity-40 transition-colors"><ChevronRight size={15} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDetail(null)}>
          <div className="bg-[#0C0D17] rounded-2xl w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[.07]">
              <h3 className="font-display font-bold text-lg text-[#E8EAFF]">Chi tiết User</h3>
              <button onClick={() => setDetail(null)} className="text-[#3D4466] hover:text-[#B0B8D4]"><X size={18} /></button>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-[#03050A] font-display font-bold text-2xl mx-auto mb-5">
                {detail.username?.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-3 text-sm">
                {[['Username', detail.username], ['Họ tên', detail.fullName], ['Email', detail.email], ['SĐT', detail.phone || '—'], ['Ngày tạo', new Date(detail.createdAt).toLocaleDateString('vi-VN')]].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-white/[.05]">
                    <span className="text-[#3D4466] font-medium">{k}</span>
                    <span className="font-semibold text-[#E8EAFF]">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2">
                  <span className="text-[#3D4466] font-medium">Quyền</span>
                  <div className="flex gap-1">
                    {detail.roleTypes?.map(r => <span key={r} className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${ROLE_STYLE[r] || 'bg-[#181A28] text-[#B0B8D4]'}`}>{r}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
