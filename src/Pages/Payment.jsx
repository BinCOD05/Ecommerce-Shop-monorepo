import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, Lock, MapPin, Truck, ChevronRight, Plus, ArrowLeft } from 'lucide-react';

const formatVND = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

function Payment() {
  const navigate = useNavigate();
  
  // State
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null); // Lưu thông tin đơn hàng sau khi đặt
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ fullName: '', phone: '', address: '', city: '', district: '', ward: '' });
  
  const [cartData, setCartData] = useState(null);
  const [loadingCart, setLoadingCart] = useState(true);
  const [note, setNote] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [loadingOrder, setLoadingOrder] = useState(false);

  const getAuthToken = () => sessionStorage.getItem('accessToken') || '';

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAuthToken();
        const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
        
        // Fetch Cart
        const cartRes = await fetch('http://localhost:8081/api/cart', { headers });
        if (cartRes.ok) {
          const data = await cartRes.json();
          setCartData(data.result);
        }

        // Fetch Address
        const addrRes = await fetch('http://localhost:8081/api/users/address', { headers });
        if (addrRes.ok) {
          const data = await addrRes.json();
          const list = data.result || [];
          setAddresses(list);
          const def = list.find(a => a.defaultAddress) || list[0];
          if (def) setSelectedAddress(def.id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCart(false);
      }
    };
    fetchData();
  }, []);

  // Helpers
  const selectedItems = cartData?.cartItemResponses?.filter(i => i.selected) || [];
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shipping;
  const currentAddr = addresses.find(a => a.id === selectedAddress);

  const handleAddAddress = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch('http://localhost:8081/api/users/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          recipient: newAddress.fullName,
          phone: newAddress.phone,
          line1: newAddress.address,
          ward: newAddress.ward,
          district: newAddress.district,
          city: newAddress.city,
          defaultAddress: addresses.length === 0
        })
      });
      
      if (res.ok) {
        // Refresh addresses
        const addrRes = await fetch('http://localhost:8081/api/users/address', { headers: { Authorization: `Bearer ${token}` } });
        const data = await addrRes.json();
        setAddresses(data.result || []);
        setShowAddressForm(false);
        setNewAddress({ fullName: '', phone: '', address: '', city: '', district: '', ward: '' });
      }
    } catch (err) {
      alert('Lỗi thêm địa chỉ');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return alert('Vui lòng chọn địa chỉ giao hàng');
    if (selectedItems.length === 0) return alert('Giỏ hàng trống');

    setLoadingOrder(true);
    try {
      const token = getAuthToken();
      const body = {
        addressId: Number(selectedAddress),
        note: note,
        cartItemIds: selectedItems.map(i => i.id),
        voucherCode: voucherCode
      };

      const res = await fetch('http://localhost:8081/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Lỗi đặt hàng');

      setOrderInfo(data.result); // Lưu thông tin đơn hàng trả về
      setOrderPlaced(true);
      window.dispatchEvent(new Event('cartUpdated')); // Update cart count header
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingOrder(false);
    }
  };

  // --- MÀN HÌNH THÀNH CÔNG ---
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#05060C] pt-20 pb-12 flex items-center justify-center font-body">
        <div className="bg-[#0C0D17] p-8 md:p-12 rounded-2xl shadow-xl max-w-lg w-full text-center border border-white/[.07]">
          <div className="w-20 h-20 bg-[#34D399]/[.12] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-[#34D399]" />
          </div>
          <h2 className="text-3xl font-black text-[#E8EAFF] mb-2">Đặt hàng thành công!</h2>
          <p className="text-[#7A83A8] mb-8">Cảm ơn bạn đã mua sắm. Đơn hàng đang được xử lý.</p>
          
          <div className="bg-white/[.03] rounded-xl p-4 mb-8 text-left border border-white/[.09]">
            <div className="flex justify-between mb-2">
              <span className="text-[#7A83A8]">Mã đơn hàng:</span>
              <span className="font-bold text-[#E8EAFF]">#{orderInfo?.id || '---'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A83A8]">Tổng tiền:</span>
              <span className="font-bold text-[#00D2A8]">{formatVND(total)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => navigate('/orders')} 
              className="w-full bg-[#00D2A8] hover:bg-[#00B894] text-[#03050A] font-bold py-3.5 rounded-xl transition transform active:scale-95"
            >
              Xem đơn hàng của tôi
            </button>
            <button 
              onClick={() => navigate('/store')} 
              className="w-full bg-[#0C0D17] hover:bg-white/[.03] text-[#E8EAFF] font-bold py-3.5 rounded-xl border border-white/[.12] transition"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05060C] pt-20 pb-20 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Navigation */}
        <div className="flex items-center gap-2 text-sm text-[#7A83A8] mb-8">
          <span className="cursor-pointer hover:text-[#E8EAFF]" onClick={() => navigate('/Shopping-Cart')}>Giỏ hàng</span>
          <ChevronRight size={16} />
          <span className="font-bold text-[#E8EAFF]">Thanh toán</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: Shipping & Payment */}
          <div className="lg:w-2/3 space-y-6">
            
            {/* 1. Address Section */}
            <div className="bg-[#0C0D17] p-6 rounded-2xl  border border-white/[.09]">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <MapPin className="text-[#00D2A8]" /> Địa chỉ giao hàng
              </h2>

              <div className="space-y-4">
                {addresses.map(addr => (
                  <div 
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr.id)}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedAddress === addr.id 
                        ? 'border-blue-600 bg-[#00D2A8]/[.08]/50' 
                        : 'border-white/[.09] hover:border-white/[.12]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-[#E8EAFF]">{addr.recipient || addr.fullName} <span className="font-normal text-[#7A83A8] text-sm ml-2">({addr.phone})</span></p>
                        <p className="text-[#7A83A8] mt-1 text-sm">{addr.line1 || addr.address}, {addr.ward}, {addr.district}, {addr.city}</p>
                      </div>
                      {selectedAddress === addr.id && <CheckCircle className="text-[#00D2A8]" size={20} />}
                    </div>
                  </div>
                ))}

                {/* Add New Address Button */}
                {!showAddressForm ? (
                  <button 
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-2 text-[#00D2A8] font-bold hover:underline mt-2"
                  >
                    <Plus size={18} /> Thêm địa chỉ mới
                  </button>
                ) : (
                  <div className="mt-4 p-4 bg-white/[.03] rounded-xl border border-white/[.09] animate-fade-in">
                    <h3 className="font-bold mb-4">Thông tin địa chỉ mới</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input placeholder="Họ và tên" className="p-3 border rounded-lg" value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} />
                      <input placeholder="Số điện thoại" className="p-3 border rounded-lg" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} />
                      <input placeholder="Địa chỉ (Số nhà, đường)" className="p-3 border rounded-lg md:col-span-2" value={newAddress.address} onChange={e => setNewAddress({...newAddress, address: e.target.value})} />
                      <input placeholder="Phường/Xã" className="p-3 border rounded-lg" value={newAddress.ward} onChange={e => setNewAddress({...newAddress, ward: e.target.value})} />
                      <input placeholder="Quận/Huyện" className="p-3 border rounded-lg" value={newAddress.district} onChange={e => setNewAddress({...newAddress, district: e.target.value})} />
                      <input placeholder="Tỉnh/Thành phố" className="p-3 border rounded-lg md:col-span-2" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button onClick={handleAddAddress} className="bg-[#00D2A8] text-[#03050A] px-6 py-2 rounded-lg font-bold">Lưu</button>
                      <button onClick={() => setShowAddressForm(false)} className="bg-[#0C0D17] border px-6 py-2 rounded-lg text-[#B0B8D4]">Hủy</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-[#0C0D17] p-6 rounded-2xl  border border-white/[.09]">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <CreditCard className="text-[#00D2A8]" /> Phương thức thanh toán
              </h2>
              <label className="flex items-center gap-4 p-4 border rounded-xl bg-white/[.03] cursor-pointer">
                <input type="radio" checked readOnly className="w-5 h-5 accent-blue-600" />
                <div className="flex-1">
                  <span className="font-bold text-[#E8EAFF] block">Thanh toán khi nhận hàng (COD)</span>
                  <span className="text-sm text-[#7A83A8]">Thanh toán tiền mặt cho nhân viên giao hàng khi nhận được sản phẩm.</span>
                </div>
                <Truck className="text-[#3D4466]" />
              </label>
            </div>

            {/* Note */}
            <div className="bg-[#0C0D17] p-6 rounded-2xl  border border-white/[.09]">
              <h2 className="text-base font-bold mb-2">Ghi chú đơn hàng</h2>
              <textarea 
                className="w-full border border-white/[.12] rounded-xl p-3 focus:ring-2 focus:ring-[#00D2A8] outline-none"
                rows="3"
                placeholder="Ví dụ: Giao hàng vào giờ hành chính..."
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-[#0C0D17] p-6 rounded-2xl  border border-white/[.09] sticky top-24">
              <h2 className="text-xl font-bold mb-6">Tổng quan đơn hàng</h2>
              
              {/* Product List (Condensed) */}
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mb-6 custom-scrollbar">
                {selectedItems.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-14 h-14 bg-white/[.05] rounded-md overflow-hidden flex-shrink-0 border border-white/[.09]">
                      <img src={item.productImage || '/images/placeholder.jpg'} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#E8EAFF] truncate">{item.productName}</p>
                      <p className="text-xs text-[#7A83A8]">{item.color} x {item.quantity}</p>
                    </div>
                    <div className="text-sm font-bold text-[#E8EAFF]">{formatVND(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="space-y-3 pt-6 border-t border-white/[.07]">
                <div className="flex justify-between text-[#7A83A8]">
                  <span>Tạm tính</span>
                  <span>{formatVND(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#7A83A8]">
                  <span>Phí vận chuyển</span>
                  <span className={shipping === 0 ? 'text-[#34D399] font-bold' : ''}>
                    {shipping === 0 ? 'Miễn phí' : formatVND(shipping)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-[#E8EAFF]">Tổng cộng</span>
                  <span className="text-2xl font-black text-[#00D2A8]">{formatVND(total)}</span>
                </div>
              </div>

              {/* Voucher */}
              <div className="mt-6">
                <div className="flex gap-2">
                  <input 
                    className="flex-1 border border-white/[.12] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    placeholder="Mã giảm giá"
                    value={voucherCode}
                    onChange={e => setVoucherCode(e.target.value)}
                  />
                  <button className="bg-white/[.05] text-[#7A83A8] px-4 py-2 rounded-lg font-bold text-sm hover:bg-white/[.08]">Áp dụng</button>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                onClick={handlePlaceOrder}
                disabled={loadingOrder}
                className="w-full bg-[#00D2A8] hover:bg-[#00B894] -black text-[#03050A] font-bold py-4 rounded-xl mt-6 shadow-lg shadow-black/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loadingOrder ? 'Đang xử lý...' : 'Đặt hàng ngay'} <Lock size={18} />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#7A83A8]">
                <Lock size={12} /> Thông tin được bảo mật tuyệt đối
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Payment;