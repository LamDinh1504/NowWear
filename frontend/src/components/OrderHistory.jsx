import React, { useEffect, useState } from "react";
import axios from "axios";
import { Package, Calendar, CheckCircle, Clock, Search, Eye, TrendingUp, AlertCircle, ShoppingBag } from "lucide-react";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
  const token = localStorage.getItem("token");

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem đơn hàng.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${backendURL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
        setFilteredOrders(res.data);
      } catch (err) {
        console.error(err);
        const msg =
          err.response?.data?.message ||
          err.response?.data ||
          "Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [backendURL, token]);

  // Filter and search logic
  useEffect(() => {
    let result = orders;

    if (filterStatus !== "all") {
      result = result.filter(order =>
        filterStatus === "paid" ? order.paid : !order.paid
      );
    }

    if (searchTerm) {
      result = result.filter(order =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(result);
  }, [searchTerm, filterStatus, orders]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VND";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Calculate stats
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const paidOrders = orders.filter(o => o.paid).length;
  const pendingOrders = orders.filter(o => !o.paid).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-black"></div>
          <p className="mt-4 text-gray-700 font-medium text-lg">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Không thể tải đơn hàng</h3>
          <p className="text-center text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-black rounded-xl">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lịch sử đơn hàng</h1>
              <p className="text-gray-600 mt-1">Quản lý và theo dõi tất cả đơn hàng của bạn</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Tổng đơn</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Package className="w-5 h-5 text-gray-700" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Đã thanh toán</p>
                  <p className="text-2xl font-bold text-gray-900">{paidOrders}</p>
                </div>
                <div className="p-3 bg-black rounded-lg">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Chờ thanh toán</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
                </div>
                <div className="p-3 bg-gray-200 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-700" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Tổng chi tiêu</p>
                  <p className="text-lg font-bold text-gray-900">{formatPrice(totalSpent)}</p>
                </div>
                <div className="p-3 bg-gray-900 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                />
              </div>

              {/* Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${filterStatus === "all"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilterStatus("paid")}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${filterStatus === "paid"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  Đã thanh toán
                </button>
                <button
                  onClick={() => setFilterStatus("pending")}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${filterStatus === "pending"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  Chưa thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <div className="flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || filterStatus !== "all" ? "Không tìm thấy đơn hàng" : "Chưa có đơn hàng nào"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== "all"
                ? "Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                : "Bạn chưa thực hiện đơn hàng nào. Hãy bắt đầu mua sắm ngay!"}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <a
                href="/collection"
                className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Khám phá sản phẩm
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${order.paid ? "bg-black" : "bg-gray-200"}`}>
                        {order.paid ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <Clock className="w-6 h-6 text-gray-700" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">STT: {order.orderId}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">Mã đơn hàng</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900 mb-2">
                        {formatPrice(order.totalAmount)}
                      </p>
                      {order.status == 'Đã thanh toán' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black text-white text-xs font-medium">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Đã thanh toán
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-200 text-gray-700 text-xs font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          Chờ thanh toán
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(order.createdAt)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedOrder(order.orderId === selectedOrder ? null : order.orderId)}
                      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      {selectedOrder === order.orderId ? "Ẩn chi tiết" : "Xem chi tiết"}
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {selectedOrder === order.orderId && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm">Thông tin chi tiết</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 min-w-[90px]">Mã đơn:</span>
                            <span className="font-mono font-medium text-gray-900">{order.orderId}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 min-w-[90px]">Tổng tiền:</span>
                            <span className="font-semibold text-gray-900">{formatPrice(order.totalAmount)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 min-w-[90px]">Ngày đặt:</span>
                            <span className="font-medium text-gray-900">{formatDate(order.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 min-w-[90px]">Giờ đặt:</span>
                            <span className="font-medium text-gray-900">{formatTime(order.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2 sm:col-span-2">
                            <span className="text-gray-600 min-w-[90px]">Thanh toán:</span>

                            <span className="font-medium text-gray-900">
                              {order.paymentMethod === "Tiền mặt"
                                ? "Tiền mặt"
                                : order.paymentMethod === "vnpay"
                                  ? "Thanh toán VNPAY"
                                  : "Chuyển khoản ngân hàng"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;