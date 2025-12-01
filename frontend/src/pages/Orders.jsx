import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Package,
  Clock,
  CreditCard,
  Check,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  AlertCircle,
  Eye,
  XCircle,
} from "lucide-react";

import toast, { Toaster } from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [viewProductsOrder, setViewProductsOrder] = useState(null);

  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem đơn hàng.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${backendURL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
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

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";

  const formatDate = (date) =>
    new Date(date).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
    setViewProductsOrder(null);
  };

  const toggleViewProducts = async (orderId) => {
    if (viewProductsOrder === orderId) {
      setViewProductsOrder(null);
      return;
    }

    try {
      const res = await axios.get(
        `${backendURL}/api/orders/${orderId}/items`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedOrders = orders.map((order) =>
        order.orderId === orderId ? { ...order, products: res.data } : order
      );

      setOrders(updatedOrders);
      setViewProductsOrder(orderId);
    } catch (err) {
      toast.error("Không thể tải sản phẩm đơn hàng.");
    }
  };

  // =========================
  // 🔥 HỦY ĐƠN — CONFIRM QUA TOAST
  // =========================
  const cancelOrder = async (orderId) => {
    toast(
      (t) => (
        <div className="p-1">
          <p className="font-medium text-gray-900">Bạn có chắc muốn hủy đơn?</p>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                handleCancel(orderId);
              }}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Hủy đơn
            </button>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Đóng
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        style: { borderRadius: "10px" },
      }
    );
  };

  const handleCancel = async (orderId) => {
    const loadingToast = toast.loading("Đang hủy đơn...");

    try {
      await axios.put(
        `${backendURL}/api/orders/cancel/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.dismiss(loadingToast);
      toast.success("Hủy đơn thành công!");

      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, orderProcess: "Đã hủy" } : o
        )
      );
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Hủy đơn thất bại!");
    }
  };

  // =========================
  // LOADING UI
  // =========================
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-black mx-auto"></div>
          <p className="mt-6 text-xl font-semibold text-gray-900">
            Đang tải đơn hàng...
          </p>
        </div>
      </div>
    );

  // =========================
  // ERROR UI
  // =========================
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-white">
        <div className="bg-white p-10 rounded-2xl border-2 border-gray-200 shadow-2xl max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-black mb-6">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-gray-900">
            Không thể tải đơn hàng
          </h3>
          <p className="text-gray-600 mb-8 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 text-lg font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg"
          >
            Thử lại
          </button>
        </div>
      </div>
    );

  // =========================
  // UI CHÍNH
  // =========================
  return (
    <>
      <Toaster position="top-center" />

      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="relative bg-black py-20 px-4 sm:px-6 lg:px-8 border-b-2 border-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-white rounded-2xl shadow-lg">
                  <ShoppingBag className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-2">
                    Đơn hàng của tôi
                  </h1>
                  <p className="text-xl text-gray-300">
                    {orders.length > 0 ? (
                      <>
                        Bạn có{" "}
                        <span className="font-bold text-white">
                          {orders.length}
                        </span>{" "}
                        đơn hàng
                      </>
                    ) : (
                      "Chưa có đơn hàng nào"
                    )}
                  </p>
                </div>
              </div>

              {orders.length > 0 && (
                <div className="flex flex-col gap-3 p-6 bg-gray-900 rounded-2xl border-2 border-gray-700">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-300" />
                    <span className="text-sm font-medium text-gray-400">
                      Tổng đơn hàng
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {orders.length}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Orders LIST */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-black mb-6">
                <Package className="w-12 h-12 text-white" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-2 border-black rounded-full flex items-center justify-center bg-white">
                  <span className="text-xs font-bold text-black">0</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                Chưa có đơn hàng
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Khám phá bộ sưu tập và đặt hàng ngay hôm nay!
              </p>
              <a
                href="/collection"
                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-black text-white rounded-full hover:bg-gray-800 shadow-lg transition-all duration-300 hover:scale-105"
              >
                <ShoppingBag className="w-5 h-5" /> Khám phá ngay
              </a>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.orderId}
                className="relative bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-black hover:shadow-2xl transition-all duration-300"
              >
                {/* Status Bar */}
                <div
                  className={`h-2 ${order.status === "Đã thanh toán"
                    ? "bg-black"
                    : "bg-gray-300"
                    }`}
                ></div>

                {/* Order HEADER */}
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="px-4 py-2 bg-black text-white rounded-lg font-mono font-bold text-sm tracking-wider">
                          {order.orderId}
                        </div>

                        {order.status === "Đã thanh toán" ? (
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-700 text-white text-sm font-semibold">
                            <Check className="w-4 h-4" /> ĐÃ THANH TOÁN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-700 text-white text-sm font-semibold">
                            <Clock className="w-4 h-4" /> CHƯA THANH TOÁN
                          </span>
                        )}

                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-black text-sm font-semibold">
                          <Package className="w-4 h-4" /> {order.orderProcess}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-700" />
                        <span className="text-gray-900 font-medium">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 justify-end">
                      <CreditCard className="w-5 h-5 text-gray-700" />
                      <span className="text-2xl font-bold text-black">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                      {order.username || "Khách hàng"}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                      {order.paymentMethod === "Tiền mặt"
                        ? "Tiền mặt"
                        : order.paymentMethod === "vnpay"
                          ? "Thanh toán VNPAY"
                          : "Chuyển khoản"}
                    </span>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between gap-3">
                    {/* Xem chi tiết */}
                    <button
                      onClick={() => toggleExpand(order.orderId)}
                      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium text-sm transition-colors"
                    >
                      {expandedOrder === order.orderId
                        ? "Thu gọn"
                        : "Xem chi tiết"}
                      {expandedOrder === order.orderId ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {/* Xem sản phẩm */}
                    <button
                      onClick={() => toggleViewProducts(order.orderId)}
                      className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                    >
                      <Eye
                        className={`w-5 h-5 ${viewProductsOrder === order.orderId
                          ? "text-black"
                          : "text-gray-700"
                          }`}
                      />
                    </button>

                    {/* Hủy đơn */}
                    {order.orderProcess === "Chờ xử lý" && (
                      <button
                        onClick={() => cancelOrder(order.orderId)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm transition-colors"
                      >
                        <XCircle className="w-4 h-4" /> Hủy đơn
                      </button>
                    )}

                    {order.orderProcess === "Đang giao" && (
                      <button
                        onClick={() =>
                          toast.error("Không thể hủy đơn khi đang giao hàng.", {
                            duration: 3000,
                          })
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed font-medium text-sm"
                      >
                        <XCircle className="w-4 h-4" /> Hủy đơn
                      </button>
                    )}

                    {order.orderProcess === "Hoàn tất" && (
                      <p className="text-sm text-gray-500 italic mt-1">
                        Đơn hàng đã hoàn tất thành công.
                      </p>
                    )}
                  </div>

                  {/* Expanded Info */}
                  {expandedOrder === order.orderId && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex justify-between mb-2">
                        <span>Mã đơn hàng:</span>
                        <span className="font-semibold">{order.orderId}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Ngày tạo:</span>
                        <span className="font-semibold">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Trạng thái đơn:</span>
                        <span className="font-semibold">{order.orderProcess}</span>
                      </div>
                      <div className="flex justify-between mt-2 pt-2 border-t">
                        <span>Tổng thanh toán:</span>
                        <span className="font-bold text-black">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Product List */}
                  {viewProductsOrder === order.orderId &&
                    order.products?.length > 0 && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                        <h5 className="font-semibold text-gray-800 mb-3">
                          Sản phẩm trong đơn:
                        </h5>
                        <div className="space-y-2">
                          {order.products.map((p) => (
                            <div
                              key={p.orderItemId}
                              className="flex justify-between items-center px-3 py-2 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
                            >
                              <span className="font-medium text-gray-900">
                                {p.productName}
                              </span>
                              <span className="text-gray-700">
                                {p.quantity} × {formatPrice(p.price)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;
