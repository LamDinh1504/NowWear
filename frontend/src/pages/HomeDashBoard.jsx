import React from "react";

const HomeDashBoard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mt-6">
        <h1 className="text-4xl font-bold text-gray-800 drop-shadow-md">
          Chào mừng đến bạn quay trở lại
        </h1>
        <p className="text-gray-600 mt-2">Quản lý cửa hàng của bạn dễ dàng và trực quan</p>
      </div>

      {/* 4 section chính */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {/* Section 1: Sản phẩm */}
        <div className="relative bg-linear-to-r from-green-400 to-green-200 p-10 rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer">
          <h2 className="text-2xl font-bold text-white mb-2">Quản lý sản phẩm</h2>
          <p className="text-white text-sm">
            Thêm, sửa, xóa sản phẩm và quản lý kho hàng một cách nhanh chóng.
          </p>
          <div className="absolute top-4 right-4 text-white text-5xl opacity-20">📦</div>
        </div>

        {/* Section 2: Đơn hàng */}
        <div className="relative bg-linear-to-r from-blue-400 to-blue-200 p-10 rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer">
          <h2 className="text-2xl font-bold text-white mb-2">Quản lý đơn hàng</h2>
          <p className="text-white text-sm">
            Theo dõi đơn hàng, trạng thái thanh toán và xử lý nhanh chóng.
          </p>
          <div className="absolute top-4 right-4 text-white text-5xl opacity-20">🛒</div>
        </div>

        {/* Section 3: Tài khoản */}
        <div className="relative bg-linear-to-r from-purple-400 to-purple-200 p-10 rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer">
          <h2 className="text-2xl font-bold text-white mb-2">Quản lý tài khoản</h2>
          <p className="text-white text-sm">
            Quản lý nhân viên, quyền truy cập và thông tin người dùng.
          </p>
          <div className="absolute top-4 right-4 text-white text-5xl opacity-20">👤</div>
        </div>

        {/* Section 4: Doanh thu */}
        <div className="relative bg-linear-to-r from-yellow-400 to-yellow-200 p-10 rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer">
          <h2 className="text-2xl font-bold text-white mb-2">Quản lý doanh thu</h2>
          <p className="text-white text-sm">
            Xem tổng doanh thu, thanh toán và thống kê bán hàng.
          </p>
          <div className="absolute top-4 right-4 text-white text-5xl opacity-20">💰</div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashBoard;
