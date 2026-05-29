import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Loader2, Check } from 'lucide-react';
import api from '../api/axiosInstance';
import { useToast } from '../context/ToastContext';
import { formatVND } from '../utils/format';

export default function ProductCard({ product }) {
  const [adding, setAdding] = useState(false);
  const [added,  setAdded]  = useState(false);
  const toast = useToast();

  const thumbnail = product.thumbnailUrl || product.image || null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding) return;
    if (!sessionStorage.getItem('accessToken')) {
      toast.warning('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }
    setAdding(true);
    try {
      await api.post('/api/cart', { productId: Number(product.id), quantity: 1 });
      window.dispatchEvent(new Event('cartUpdated'));
      setAdded(true);
      toast.success(`Đã thêm "${product.name}" vào giỏ hàng`);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      toast.error(err?.message || 'Không thể thêm vào giỏ hàng');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link to={`/product/detail/${product.id}`}
      className="group relative flex flex-col bg-[#0C0D17] rounded-2xl border border-white/[.07] overflow-hidden
        transition-all duration-300 hover:border-[#00D2A8]/30
        hover:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,210,168,0.08)]
        hover:-translate-y-1">

      {/* Image — nền trắng nhạt để ảnh sản phẩm hiển thị đúng màu */}
      <div className="relative aspect-square overflow-hidden bg-[#F0F1F5] p-5">
        {thumbnail ? (
          <img src={thumbnail} alt={product.name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <span className="text-5xl font-display font-black text-[#CBD5E1]">
              {product.brandName?.charAt(0) || 'S'}
            </span>
          </div>
        )}

        {/* Hover overlay — add to cart */}
        <div className="absolute inset-x-3 bottom-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
          transition-all duration-300 ease-out">
          <button onClick={handleAddToCart} disabled={adding}
            className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5
              transition-all duration-200 active:scale-95
              ${added
                ? 'bg-[#34D399] text-[#03050A] shadow-[0_0_16px_rgba(52,211,153,0.4)]'
                : 'bg-[#00D2A8] text-[#03050A] shadow-[0_0_16px_rgba(0,210,168,0.4)] hover:bg-[#00B894]'
              }`}>
            {adding  ? <Loader2 size={13} className="animate-spin" />
             : added  ? <Check size={13} />
             :           <ShoppingCart size={13} />}
            {added ? 'Đã thêm ✓' : 'Thêm vào giỏ'}
          </button>
        </div>

        {product.stock === 0 && (
          <div className="absolute top-2 left-2 bg-[#F87171]/[.15] text-[#F87171] border border-[#F87171]/25
            text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
            Hết hàng
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 border-t border-white/[.04]">
        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#00D2A8] mb-1.5">
          {product.brandName}
        </span>
        <h3 className="text-sm font-semibold text-[#B0B8D4] line-clamp-2 leading-snug flex-1
          group-hover:text-[#E8EAFF] transition-colors duration-200">
          {product.name}
        </h3>
        <div className="mt-3 pt-3 border-t border-white/[.04] flex items-center justify-between">
          <span className="font-display font-black text-base text-[#F59E0B]">
            {product.price ? formatVND(product.price) : 'Liên hệ'}
          </span>
          {product.color && (
            <span className="text-[9px] text-[#3D4466] bg-white/[.04] border border-white/[.06] px-2 py-0.5 rounded-full">
              {product.color}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
