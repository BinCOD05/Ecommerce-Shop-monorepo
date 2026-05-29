import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const bootstrap = useCallback(async () => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) { setLoading(false); return; }

    const stored = sessionStorage.getItem('userInfo');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignored */ }
    }

    try {
      const res = await api.get('/api/users/me');
      const u = res.result;
      setUser(u);
      sessionStorage.setItem('userInfo', JSON.stringify(u));
    } catch {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('userInfo');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
    const handleExpired = () => {
      setUser(null);
      navigate('/signin', { replace: true });
    };
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, [bootstrap, navigate]);

  const login = async (username, password) => {
    const tokenRes = await api.post('/auth/access-token', { username, password });
    const token = tokenRes.accessToken;
    if (!token) throw new Error('Không nhận được token từ server');
    sessionStorage.setItem('accessToken', token);
    const profileRes = await api.get('/api/users/me');
    const u = profileRes.result;
    setUser(u);
    sessionStorage.setItem('userInfo', JSON.stringify(u));
    window.dispatchEvent(new Event('authChanged'));
    return u;
  };

  const logout = useCallback(() => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userInfo');
    setUser(null);
    window.dispatchEvent(new Event('authChanged'));
    navigate('/signin', { replace: true });
  }, [navigate]);

  const isAdmin = Boolean(user?.roleTypes?.some(r => r === 'ADMIN'));

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, refreshUser: bootstrap }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
