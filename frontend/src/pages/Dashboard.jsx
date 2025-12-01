import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar cố định */}
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col justify-between shadow-lg fixed top-16 left-0 h-[calc(100vh-64px)]">
        <div>
          <h1 className="text-4xl font-extrabold mb-10 text-center tracking-wider text-transparent bg-clip-text bg-linear-to-r from-green-400 to-green-200 drop-shadow-lg">
            Admin
          </h1>

          <nav className="flex flex-col gap-2">
            <NavLink
              to="home"
              className={({ isActive }) =>
                `p-3 rounded-md hover:bg-gray-700 transition-colors ${
                  isActive ? "bg-gray-700 font-semibold" : ""
                }`
              }
            >
              Trang chủ
            </NavLink>

            <NavLink
              to="products"
              className={({ isActive }) =>
                `p-3 rounded-md hover:bg-gray-700 transition-colors ${
                  isActive ? "bg-gray-700 font-semibold" : ""
                }`
              }
            >
              Quản lý sản phẩm
            </NavLink>

            <NavLink
              to="accounts"
              className={({ isActive }) =>
                `p-3 rounded-md hover:bg-gray-700 transition-colors ${
                  isActive ? "bg-gray-700 font-semibold" : ""
                }`
              }
            >
              Quản lý tài khoản
            </NavLink>

            <NavLink
              to="orders"
              className={({ isActive }) =>
                `p-3 rounded-md hover:bg-gray-700 transition-colors ${
                  isActive ? "bg-gray-700 font-semibold" : ""
                }`
              }
            >
              Quản lý đơn hàng
            </NavLink>

            <NavLink
              to="revenue"
              className={({ isActive }) =>
                `p-3 rounded-md hover:bg-gray-700 transition-colors ${
                  isActive ? "bg-gray-700 font-semibold" : ""
                }`
              }
            >
              Quản lý doanh thu
            </NavLink>
          </nav>
        </div>

        <div className="text-sm text-gray-400 mt-6 text-center">
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

