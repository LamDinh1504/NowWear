import React, { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  LogOut,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition-all
     hover:bg-gray-700
     ${isActive ? "bg-gray-700 font-semibold" : "text-gray-300"}`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col justify-between shadow-lg fixed top-16 left-0 h-[calc(100vh-64px)]">
        <div>
          <h1 className="text-4xl font-extrabold mb-10 text-center tracking-wider text-transparent bg-clip-text bg-linear-to-r from-green-400 to-green-200 drop-shadow-lg">
            Admin
          </h1>

          <nav className="flex flex-col gap-2">
            <NavLink to="home" className={linkClass}>
              <LayoutDashboard size={20} />
              Trang chủ
            </NavLink>

            <NavLink to="products" className={linkClass}>
              <Package size={20} />
              Quản lý sản phẩm
            </NavLink>

            <NavLink to="accounts" className={linkClass}>
              <Users size={20} />
              Quản lý tài khoản
            </NavLink>

            <NavLink to="orders" className={linkClass}>
              <ShoppingCart size={20} />
              Quản lý đơn hàng
            </NavLink>

            <NavLink to="revenue" className={linkClass}>
              <BarChart3 size={20} />
              Quản lý doanh thu
            </NavLink>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all mt-4"
            >
              <LogOut size={20} />
              Đăng xuất
            </button>
          </nav>
        </div>

        <div className="text-sm text-gray-400 text-center">
          © 2025 NowWear
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto ml-64">
        <div className="bg-white p-6 rounded-xl shadow-md min-h-[70vh]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
