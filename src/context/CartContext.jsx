import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../api/axiosInstance';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!sessionStorage.getItem('accessToken')) { setCount(0); return; }
    try {
      const res = await api.get('/api/cart');
      setCount(res.result?.cartItemResponses?.length ?? 0);
    } catch { setCount(0); }
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener('cartUpdated', refresh);
    window.addEventListener('authChanged', refresh);
    return () => {
      window.removeEventListener('cartUpdated', refresh);
      window.removeEventListener('authChanged', refresh);
    };
  }, [refresh]);

  return (
    <CartContext.Provider value={{ count, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
