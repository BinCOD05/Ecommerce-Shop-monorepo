import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Check, Loader2 } from 'lucide-react';

const formatVND = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

function ShoppingCart() {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  const getAuthToken = () => sessionStorage.getItem('accessToken') || '';

  // --- API CALLS ---
  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        setError('Vui lòng đăng nhập để xem giỏ hàng');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:8081/api/cart`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Không thể tải giỏ hàng');
      const data = await response.json();
      setCartData(data.result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const apiCall = async (url, method, body) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`http://localhost:8081${url}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) throw new Error('Lỗi cập nhật');
      return (await response.json()).result;
    } catch (err) {
      throw err;
    }
  };

  // --- HANDLERS ---
  const handleQuantityChange = async (e, cartItemId, newQuantity) => {
    e.stopPropagation(); // Ngăn chặn việc click nút này kích hoạt chọn sản phẩm
    
    setUpdatingItems(prev => new Set(prev).add(cartItemId));
    try {
      if (newQuantity === 0) {
         await handleRemoveItem(e, cartItemId); // Truyền e vào để stopPropagation bên trong remove
         return;
      }
      const result = await apiCall(`/api/cart/items/${cartItemId}`, 'PUT', { quantity: newQuantity });
      setCartData(result);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingItems(prev => { const s = new Set(prev); s.delete(cartItemId); return s; });
    }
  };

  const handleToggleSelection = async (cartItemId, currentSelected) => {
    // Không cần stopPropagation ở đây vì đây là hàm gọi từ container cha hoặc checkbox
    if (updatingItems.has(cartItemId)) return; // Tránh spam click khi đang loading

    setUpdatingItems(prev => new Set(prev).add(cartItemId));
    try {
      const result = await apiCall(
        `/api/cart/items/${cartItemId}/select`, 
        'PATCH', 
        { selected: !currentSelected }
      );
      setCartData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingItems(prev => { const s = new Set(prev); s.delete(cartItemId); return s; });
    }
  };

  const handleRemoveItem = async (e, cartItemId) => {
    if (e) e.stopPropagation(); // Ngăn chặn sự kiện click lan ra thẻ cha
    
    if(!window.confirm("Bạn muốn xóa sản phẩm này khỏi giỏ?")) return;
    
    setUpdatingItems(prev => new Set(prev).add(cartItemId));
    try {
        const token = getAuthToken();
        const response = await fetch(`http://localhost:8081/api/cart/items/${cartItemId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if(response.ok) {
            fetchCart(); 
            window.dispatchEvent(new Event('cartUpdated'));
        }
    } catch(err) {
        console.error(err);
    } finally {
        setUpdatingItems(prev => { const s = new Set(prev); s.delete(cartItemId); return s; });
    }
  }

  // --- CALCULATIONS ---
  const subtotal = cartData?.cartItemResponses?.reduce((sum, item) => item.selected ? sum + item.price * item.quantity : sum, 0) || 0;
  const shipping = 0; // Đã sửa: Luôn luôn Free ship
  const total = subtotal + shipping;
  const totalItems = cartData?.cartItemResponses?.length || 0;
  const selectedCount = cartData?.cartItemResponses?.filter(item => item.selected).length || 0;

  // --- RENDER STATES ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#05060C]">
        <Loader2 className="h-10 w-10 animate-spin text-[#00D2A8] mb-4" />
        <p className="text-[#7A83A8] font-medium">Đang tải giỏ hàng của bạn...</p>
      </div>
    );
  }

  if (error || !cartData?.cartItemResponses?.length) {
    return (
      <div className="min-h-screen bg-[#05060C] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-[#0C0D17] rounded-full flex items-center justify-center mx-auto mb-6  border border-white/[.07]">
            <ShoppingBag className="h-10 w-10 text-[#3D4466]" />
          </div>
          <h2 className="text-2xl font-bold text-[#E8EAFF] mb-2">Giỏ hàng đang trống</h2>
          <p className="text-[#7A83A8] mb-8">Có vẻ như bạn chưa thêm sản phẩm nào. Hãy khám phá cửa hàng ngay!</p>
          <Link 
            to="/store" 
            className="inline-flex items-center justify-center px-8 py-3 bg-[#00D2A8] text-[#03050A] font-bold rounded-xl hover:bg-[#00B894] transition-all hover:scale-105"
          >
            Mua sắm ngay <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05060C] pt-20 pb-12 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-[#E8EAFF]">Giỏ hàng <span className="text-lg font-medium text-[#7A83A8] ml-2">({totalItems} sản phẩm)</span></h1>
          <Link to="/store" className="hidden md:flex items-center text-sm font-semibold text-[#00D2A8] hover:text-[#00D2A8]">
            <ArrowLeft className="mr-1 h-4 w-4" /> Tiếp tục mua sắm
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: Cart Items */}
          <div className="lg:w-2/3 space-y-4">
            {cartData.cartItemResponses.map((item) => {
              const isUpdating = updatingItems.has(item.id);
              return (
                <div 
                  key={item.id} 
                  // Thêm onClick vào thẻ cha và cursor-pointer
                  onClick={() => handleToggleSelection(item.id, item.selected)}
                  className={`group relative bg-[#0C0D17] rounded-2xl p-4 border border-white/[.09]  transition-all hover:shadow-md cursor-pointer ${!item.selected ? 'opacity-70 bg-white/[.03]' : 'ring-1 ring-[#00D2A8]/20'}`}
                >
                  <div className="flex gap-4 sm:gap-6 items-center">
                    {/* Checkbox */}
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        // Stop propagation để tránh gọi onClick của cha 2 lần (dù logic toggle giống nhau)
                        onClick={(e) => e.stopPropagation()} 
                        onChange={() => handleToggleSelection(item.id, item.selected)}
                        disabled={isUpdating}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/[.12] transition-all checked:border-blue-600 checked:bg-[#00D2A8] disabled:cursor-not-allowed"
                      />
                      <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-[#03050A] opacity-0 peer-checked:opacity-100" />
                    </div>

                    {/* Image */}
                    {/* Khi click vào ảnh vẫn cho phép điều hướng, cần stopPropagation */}
                    <Link 
                        to={`/product/detail/${item.productId}`} 
                        onClick={(e) => e.stopPropagation()}
                        className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-white/[.07] bg-[#F0F1F5]"
                    >
                      <img
                        src={item.productImage || 'https://via.placeholder.com/150'}
                        alt={item.productName}
                        className="h-full w-full object-cover object-center"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex flex-1 flex-col justify-between sm:flex-row sm:items-center">
                      <div className="pr-4">
                        <Link 
                            to={`/product/detail/${item.productId}`} 
                            onClick={(e) => e.stopPropagation()}
                            className="font-bold text-[#E8EAFF] hover:text-[#00D2A8] transition-colors line-clamp-1 text-lg"
                        >
                          {item.productName}
                        </Link>
                        <p className="mt-1 text-sm text-[#7A83A8]">Màu sắc: {item.color || 'Tiêu chuẩn'}</p>
                        <p className="mt-1 font-bold text-[#E8EAFF] sm:hidden">{formatVND(item.price)}</p>
                      </div>

                      {/* Quantity & Price (Desktop) */}
                      <div className="mt-4 flex items-center justify-between sm:mt-0 sm:gap-6">
                        <div
                            className="flex items-center rounded-xl border border-white/[.12] bg-[#12141F] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => handleQuantityChange(e, item.id, item.quantity - 1)}
                            disabled={isUpdating}
                            className="w-9 h-9 flex items-center justify-center text-[#7A83A8] hover:bg-white/[.06] hover:text-[#E8EAFF] disabled:opacity-40 transition-all"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <div className="w-10 text-center text-sm font-bold text-[#E8EAFF] border-x border-white/[.08]">
                            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mx-auto text-[#00D2A8]" /> : item.quantity}
                          </div>
                          <button
                            onClick={(e) => handleQuantityChange(e, item.id, item.quantity + 1)}
                            disabled={isUpdating}
                            className="w-9 h-9 flex items-center justify-center text-[#7A83A8] hover:bg-white/[.06] hover:text-[#E8EAFF] disabled:opacity-40 transition-all"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="text-right hidden sm:block">
                          <p className="text-lg font-bold text-[#E8EAFF]">{formatVND(item.price * item.quantity)}</p>
                          {item.quantity > 1 && <p className="text-xs text-[#3D4466]">{formatVND(item.price)} / sản phẩm</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button (Absolute top-right) */}
                  <button 
                    onClick={(e) => handleRemoveItem(e, item.id)}
                    className="absolute top-4 right-4 text-[#3D4466] hover:text-red-500 transition-colors p-1"
                    title="Xóa sản phẩm"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 bg-[#0C0D17] rounded-2xl border border-white/[.09]  p-6">
              <h2 className="text-xl font-bold text-[#E8EAFF] mb-6">Tổng đơn hàng</h2>
              
              <div className="space-y-4 pb-6 border-b border-white/[.07]">
                <div className="flex justify-between text-[#7A83A8]">
                  <span>Tạm tính ({selectedCount} sản phẩm)</span>
                  <span className="font-medium text-[#E8EAFF]">{formatVND(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#7A83A8]">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-[#34D399]">Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-6 mb-8">
                <span className="text-lg font-bold text-[#E8EAFF]">Tổng cộng</span>
                <div className="text-right">
                  <span className="block text-2xl font-black text-[#00D2A8]">{formatVND(total)}</span>
                  <span className="text-xs text-[#7A83A8]">(Đã bao gồm VAT)</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/pay')}
                disabled={selectedCount === 0}
                className="w-full bg-[#00D2A8] text-[#03050A] font-bold py-4 rounded-xl hover:bg-[#00B894] transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Tiến hành thanh toán <ArrowRight className="h-5 w-5" />
              </button>

              <div className="mt-6 text-center">
                <p className="text-xs text-[#7A83A8] flex items-center justify-center gap-2">
                  <ShieldCheckIcon /> Bảo mật thanh toán 100%
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Icon component nhỏ
const ShieldCheckIcon = () => (
  <svg className="w-4 h-4 text-[#34D399]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default ShoppingCart;