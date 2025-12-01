import React, { useState, useContext } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";
import { assets } from '../assets/assets.js';
import { FaUser, FaLock } from 'react-icons/fa';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
  const { authState, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendURL}/api/auth/login`, { username, password });
      if (response.status === 200 && response.data?.token) {
        login(username, response.data.token);
        toast.success("Đăng nhập thành công!");
        setTimeout(() => navigate("/"), 800);
      } else {
        toast.error("Lỗi đăng nhập: Token không tồn tại");
      }
    } catch (error) {
      toast.error(error.response?.data || "Lỗi đăng nhập. Vui lòng thử lại!");
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất!");
    navigate("/login");
  };

  if (authState.isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <h2 className="text-3xl font-bold text-black mb-6">Xin chào, {authState.user}!</h2>
        <button
          onClick={handleLogout}
          className="bg-black hover:bg-gray-800 text-white font-semibold text-lg py-3 px-6 rounded-lg shadow-md transition"
        >
          Đăng xuất
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans bg-white">
      
      {/* Bên trái - hình nền + chào mừng */}
      <div
        className="hidden md:flex md:w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: `url('${assets.contact_img}')` }}
      >
        <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col justify-center items-center px-12">
          <h1 className="text-5xl font-bold mb-4 text-black text-center drop-shadow-md">
            Chào mừng trở lại!
          </h1>
          <p className="text-gray-700 text-lg text-center drop-shadow-sm max-w-sm">
            Đăng nhập để quản lý đơn hàng, theo dõi sản phẩm yêu thích và khám phá các trang phục mới nhất.
          </p>
        </div>
      </div>

      {/* Bên phải - form login */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-8 md:px-16 py-12">
        <form 
          onSubmit={handleLogin} 
          className="bg-white w-full max-w-md p-10 rounded-3xl shadow-lg border border-gray-200"
        >
          <h3 className="text-4xl font-bold mb-10 text-center text-black">Đăng nhập</h3>

          <div className="relative mb-6">
            <FaUser className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Tên tài khoản"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-base border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black transition-all"
              required
            />
          </div>

          <div className="relative mb-4">
            <FaLock className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-base border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black transition-all"
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm mb-6">
            <label className="flex items-center space-x-2 text-gray-600">
              <input type="checkbox" className="accent-black w-4 h-4" />
              <span>Ghi nhớ tài khoản</span>
            </label>
            <a href="/forgot-password" className="text-black hover:underline">
              Quên mật khẩu?
            </a>
          </div>

          <button 
            type="submit" 
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold text-lg py-3 rounded-xl shadow-md transition"
          >
            Đăng nhập
          </button>

          <p className="text-gray-600 text-sm mt-6 text-center">
            Chưa có tài khoản?{' '}
            <a href="/register" className="text-black font-semibold hover:underline">
              Đăng ký ở đây!
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
