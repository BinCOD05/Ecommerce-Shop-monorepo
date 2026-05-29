import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Truck, Shield, RotateCcw, Check, Minus, Plus, Loader2 } from 'lucide-react';

function Details() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8081/api/products/${id}`);
        if (!res.ok) throw new Error('Lỗi tải sản phẩm');
        const data = await res.json();
        
        // Lấy object product từ result
        const prod = data.result; 
        setProduct(prod);
        
        // LOGIC CHỌN ẢNH MẶC ĐỊNH:
        // Tìm ảnh nào có primary = true, nếu không có thì lấy ảnh đầu tiên
        if (prod.images && prod.images.length > 0) {
            const primaryImg = prod.images.find(img => img.primary);
            setSelectedImage(primaryImg ? primaryImg.imageUrl : prod.images[0].imageUrl);
        } else {
            setSelectedImage('https://via.placeholder.com/600?text=No+Image');
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = sessionStorage.getItem('accessToken');
      const body = {
        productId: Number(product.id),
        quantity: Number(quantity),
      };

      const res = await fetch('http://localhost:8081/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Thêm thất bại');
      
      window.dispatchEvent(new Event('cartUpdated'));
      alert('Đã thêm sản phẩm vào giỏ hàng');
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center font-sans">Đang tải...</div>;
  if (error || !product) return <div className="min-h-screen flex justify-center items-center font-sans text-[#F87171]">Sản phẩm không tồn tại.</div>;

  const price = product.price ? product.price.toLocaleString('vi-VN') : 'Liên hệ';
  const inStock = product.stock > 0;

  return (
    <main className="min-h-screen bg-[#05060C] pt-24 pb-20 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-[#7A83A8] mb-8 space-x-2">
            <Link to="/" className="hover:text-[#E8EAFF] transition">Trang chủ</Link>
            <span>/</span>
            {/* Sửa: Lấy category.name từ JSON */}
            <span className="hover:text-[#E8EAFF] transition cursor-pointer">{product.category?.name}</span>
            <span>/</span>
            <span className="text-[#E8EAFF] font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* CỘT TRÁI: ẢNH SẢN PHẨM */}
            <div className="space-y-4">
                {/* Ảnh lớn đang chọn */}
                <div className="aspect-square bg-[#F0F1F5] rounded-3xl overflow-hidden border border-white/[.07] flex items-center justify-center p-6 relative group">
                    <img
                        src={selectedImage}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {product.images && product.images.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {product.images.map((img, idx) => (
                            <button
                                key={img.id || idx}
                                onClick={() => setSelectedImage(img.imageUrl)}
                                className={`w-20 h-20 flex-shrink-0 rounded-xl border-2 overflow-hidden p-1.5 transition-all bg-[#F0F1F5] ${
                                    selectedImage === img.imageUrl
                                    ? 'border-[#00D2A8] shadow-[0_0_12px_rgba(0,210,168,0.3)]'
                                    : 'border-transparent hover:border-white/20'
                                }`}
                            >
                                <img src={img.imageUrl} alt="thumbnail" className="w-full h-full object-contain" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* CỘT PHẢI: THÔNG TIN */}
            <div className="flex flex-col">
                <div className="mb-2">
                    {/* Sửa: Lấy brand.name từ JSON */}
                    <span className="inline-block px-3 py-1 bg-[#00D2A8]/[.08] text-[#00D2A8] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                        {product.brand?.name || 'Chính hãng'}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black text-[#E8EAFF] leading-tight mb-2">
                        {product.name}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-[#7A83A8]">
                        <span>Mã SP: <span className="text-[#E8EAFF] font-mono">#{product.id}</span></span>
                        <span>|</span>
                        <span className={inStock ? "text-[#34D399] font-bold flex items-center gap-1" : "text-[#F87171] font-bold"}>
                            {inStock ? <><Check size={14}/> Còn hàng ({product.stock})</> : "Hết hàng"}
                        </span>
                    </div>
                </div>

                <div className="py-6 border-b border-white/[.07]">
                    <p className="text-4xl font-black text-[#E8EAFF]">{price} <span className="text-xl align-top text-[#7A83A8] font-medium">₫</span></p>
                </div>

                {/* Các thuộc tính (Màu, Dung lượng) */}
                <div className="py-6 space-y-4">
                    {(product.color || product.storage) && (
                        <div className="flex flex-wrap gap-3">
                            {product.color && (
                                <div className="px-4 py-2 border rounded-lg bg-white/[.04] text-sm">
                                    <span className="text-[#7A83A8] mr-2">Màu sắc:</span>
                                    <span className="font-bold text-[#E8EAFF]">{product.color}</span>
                                </div>
                            )}
                            {product.storage && (
                                <div className="px-4 py-2 border rounded-lg bg-white/[.04] text-sm">
                                    <span className="text-[#7A83A8] mr-2">Dung lượng:</span>
                                    <span className="font-bold text-[#E8EAFF]">{product.storage}</span>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Mô tả ngắn */}
                    {product.description && (
                         <p className="text-[#7A83A8] leading-relaxed text-base">
                            {product.description}
                        </p>
                    )}
                </div>

                {/* Nút Mua Hàng */}
                <div className="mt-auto pt-6">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-sm font-bold text-[#E8EAFF]">Số lượng</span>
                        <div className="flex items-center bg-[#12141F] border border-white/[.12] rounded-xl overflow-hidden h-11">
                            <button
                                onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                                className="w-10 h-full flex items-center justify-center text-[#7A83A8] hover:bg-white/[.06] hover:text-[#E8EAFF] transition-all">
                                <Minus size={14} />
                            </button>
                            <span className="w-10 h-full flex items-center justify-center text-sm font-bold text-[#E8EAFF] border-x border-white/[.08]">
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity(q => q + 1)}
                                className="w-10 h-full flex items-center justify-center text-[#7A83A8] hover:bg-white/[.06] hover:text-[#E8EAFF] transition-all">
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>

                    <button 
                        onClick={handleAddToCart}
                        disabled={!inStock}
                        className="w-full bg-[#00D2A8] hover:bg-[#00B894] text-[#03050A] text-lg font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-[0_0_24px_rgba(0,210,168,0.3)] hover:shadow-[0_0_36px_rgba(0,210,168,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ShoppingCart size={22} />
                        {inStock ? "Thêm vào giỏ hàng" : "Tạm hết hàng"}
                    </button>

                    {/* Chính sách (Giữ nguyên icon) */}
                    <div className="grid grid-cols-3 gap-2 mt-8 pt-8 border-t border-white/[.07]">
                        <div className="text-center group">
                            <div className="w-10 h-10 bg-[#00D2A8]/[.08] rounded-full flex items-center justify-center mx-auto mb-2 text-[#00D2A8] group-hover:scale-110 transition">
                                <Truck size={20} />
                            </div>
                            <p className="text-xs font-bold text-[#E8EAFF]">Freeship</p>
                            <p className="text-[10px] text-[#7A83A8]">Đơn trên 500k</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-10 h-10 bg-[#34D399]/[.1] rounded-full flex items-center justify-center mx-auto mb-2 text-[#34D399] group-hover:scale-110 transition">
                                <Shield size={20} />
                            </div>
                            <p className="text-xs font-bold text-[#E8EAFF]">Bảo hành</p>
                            <p className="text-[10px] text-[#7A83A8]">12 Tháng</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-10 h-10 bg-[#A78BFA]/[.1] rounded-full flex items-center justify-center mx-auto mb-2 text-[#A78BFA] group-hover:scale-110 transition">
                                <RotateCcw size={20} />
                            </div>
                            <p className="text-xs font-bold text-[#E8EAFF]">Đổi trả</p>
                            <p className="text-[10px] text-[#7A83A8]">30 Ngày</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* BẢNG THÔNG SỐ KỸ THUẬT */}
        {/* Sửa: Dùng product.specs từ JSON */}
        {product.specs && product.specs.length > 0 && (
            <div className="mt-20 border-t border-white/[.07] pt-16 animate-fadeIn">
                <h2 className="text-2xl font-black text-[#E8EAFF] mb-8 text-center">Thông số kỹ thuật</h2>
                <div className="max-w-3xl mx-auto bg-white/[.04] rounded-2xl p-6 md:p-8 shadow-sm">
                    <table className="w-full text-sm text-left">
                        <tbody>
                            {product.specs.map((spec, idx) => (
                                <tr key={spec.id || idx} className="border-b border-white/[.09] last:border-0 hover:bg-white/[.06] transition">
                                    <td className="py-4 px-4 font-medium text-[#7A83A8] w-1/3 align-top">{spec.name}</td>
                                    <td className="py-4 px-4 font-bold text-[#E8EAFF] align-top">{spec.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </div>
    </main>
  );
}

export default Details;