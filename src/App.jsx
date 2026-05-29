import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider }  from './context/ToastContext';
import { AuthProvider }   from './context/AuthContext';
import { CartProvider }   from './context/CartContext';
import Header      from './Components/Header';
import Landing     from './Pages/Landing';
import Home        from './Pages/Home';
import SignIn      from './Pages/Signin';
import ShoppingCart from './Pages/ShoppingCart';
import Category    from './Pages/Category';
import Profile     from './Pages/Profile';
import Details     from './Pages/Details';
import Payment     from './Pages/Payment';
import Orders      from './Pages/Orders';
import OrderDetail from './Pages/OrderDetail';
import Admin       from './Pages/Admin';

function AppContent() {
  const location = useLocation();
  const isAdmin  = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Header />}
      <Routes>
        <Route path="/"                    element={<Landing />} />
        <Route path="/store"               element={<Home />} />
        <Route path="/signin"              element={<SignIn />} />
        <Route path="/category"            element={<Category />} />
        <Route path="/Shopping-Cart"       element={<ShoppingCart />} />
        <Route path="/profile"             element={<Profile />} />
        <Route path="/product/detail/:id"  element={<Details />} />
        <Route path="/pay"                 element={<Payment />} />
        <Route path="/orders"              element={<Orders />} />
        <Route path="/orders/:id"          element={<OrderDetail />} />
        <Route path="/admin"               element={<Admin />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
