import React, { useContext } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { ToastContainer } from 'react-toastify';
import { FilterProvider } from "./context/FilterContext";
import { AuthProvider, AuthContext } from "./context/AuthContext";

import Home from './pages/Home.jsx';
import Collection from './pages/Collection.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Product from './pages/Product.jsx';
import Cart from './pages/Cart.jsx';
import Login from './pages/Login.jsx';
import PlaceOrder from './pages/PlaceOrder.jsx';
import Orders from './pages/Orders.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import VnpayRedirect from './pages/VnpayRedirect.jsx'

import Dashboard from './pages/Dashboard.jsx';
import ProductList from './pages/ProductList.jsx';
import Accounts from './pages/Accounts.jsx';
import HomeDashBoard from './pages/HomeDashBoard.jsx'
import OrderDashBoard from './pages/OrderDashBoard.jsx'
import RevenueDashBoard from './pages/RevenueDashBoard.jsx'

// Bảo vệ route admin
const AdminRoute = ({ children }) => {
  const { authState } = useContext(AuthContext);
  const { role } = authState;
  const isAdmin = Array.isArray(role) && role.includes("ADMIN");

  if (!isAdmin) return <Navigate to="/" />;
  return children;
};

// Dashboard layout với Outlet để nested route hiển thị
const DashboardLayout = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
    <Outlet /> {/* Đây là nơi render ProductList / AddProduct / EditProduct */}
  </div>
);

const AppRoutes = () => (
  <>
    <Navbar />
    <ToastContainer />
    <Routes>
      {/* Public routes */}
      <Route path='/' element={<Home />} />
      <Route path='/collection' element={<FilterProvider><Collection /></FilterProvider>} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/product/:productId' element={<Product />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/login' element={<Login />} />
      <Route path='/place-order' element={<PlaceOrder />} />
      <Route path='/orders' element={<Orders />} />
      <Route path='/register' element={<Register />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/reset-password' element={<ResetPassword />} />
      <Route path="/payment/vnpay-return" element={<VnpayRedirect />} />

      {/* Admin routes nested */}
      <Route path='/dashboard' element={<AdminRoute><Dashboard /></AdminRoute>}>
        <Route index element={<HomeDashBoard />} />          {/* /dashboard */}
        <Route path='products' element={<ProductList />} />  {/* /dashboard/products */}
        <Route path='accounts' element={<Accounts />} />     {/* /dashboard/accounts */}
        <Route path='home' element={<HomeDashBoard/>} />
        <Route path='orders' element={<OrderDashBoard/>} />
        <Route path='revenue' element={<RevenueDashBoard/>} />
      </Route>
    </Routes>
    <Footer />
  </>
);

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;

