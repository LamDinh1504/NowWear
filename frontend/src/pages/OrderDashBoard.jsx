import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import OrderDetailModal from "../components/OrderDetailModal";
import React, { useState, useEffect } from "react";

const OrderDashBoard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [detailOrderId, setDetailOrderId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/orders/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Lấy danh sách đơn hàng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSelect = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // ------------------ UPDATE PROCESS ------------------
  const updateOrderProcess = async (orderId, newProcess) => {
    try {
      await axios.put(
        `http://localhost:8080/api/orders/${orderId}/update-process`,
        null,
        {
          params: { process: newProcess },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success("Cập nhật tiến trình thành công!");

      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, orderProcess: newProcess } : o
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật tiến trình thất bại!");
    }
  };

  // ------------------ MARK PAID ------------------
  const handleMarkSelectedPaid = async () => {
    if (!selectedOrders.length)
      return toast.error("Chọn ít nhất một đơn hàng!");

    try {
      await Promise.all(
        selectedOrders.map((orderId) =>
          axios.put(
            `http://localhost:8080/api/orders/${orderId}/mark-paid`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
        )
      );

      toast.success("Các đơn đã được xác nhận thanh toán!");

      setOrders((prev) =>
        prev.map((o) =>
          selectedOrders.includes(o.orderId)
            ? { ...o, status: "Đã thanh toán" }
            : o
        )
      );

      setSelectedOrders([]);
    } catch {
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  // ------------------ MARK UNPAID ------------------
  const handleMarkSelectedUnpaid = async () => {
    if (!selectedOrders.length)
      return toast.error("Chọn ít nhất một đơn hàng!");

    try {
      await Promise.all(
        selectedOrders.map((orderId) =>
          axios.put(
            `http://localhost:8080/api/orders/${orderId}/mark-unpaid`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
        )
      );

      toast.success("Các đơn đã được đặt lại trạng thái Chưa thanh toán!");

      setOrders((prev) =>
        prev.map((o) =>
          selectedOrders.includes(o.orderId)
            ? { ...o, status: "Chưa thanh toán" }
            : o
        )
      );

      setSelectedOrders([]);
    } catch {
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center mb-4 space-x-2">
        <h2 className="text-3xl font-bold">Quản lý đơn hàng</h2>
        <div className="flex gap-2">
          <button
            onClick={handleMarkSelectedPaid}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Xác nhận thanh toán
          </button>

          <button
            onClick={handleMarkSelectedUnpaid}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Chưa thanh toán
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="w-full border-collapse text-base">
          <thead className="bg-gray-100 text-gray-700 text-lg">
            <tr>
              <th className="border p-4 text-center">
                <input
                  type="checkbox"
                  checked={
                    selectedOrders.length === orders.length && orders.length > 0
                  }
                  onChange={(e) =>
                    setSelectedOrders(
                      e.target.checked ? orders.map((o) => o.orderId) : []
                    )
                  }
                />
              </th>
              <th className="border p-4 text-left">ID</th>
              <th className="border p-4 text-left">Người đặt</th>
              <th className="border p-4 text-left">Ngày đặt</th>
              <th className="border p-4 text-left">Tổng tiền</th>
              <th className="border p-4 text-left">Phương thức</th>
              <th className="border p-4 text-center">Trạng thái</th>
              <th className="border p-4 text-center">Tiến trình</th>
              <th className="border p-4 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody className="text-base">
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-lg">
                  Đang tải...
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.orderId}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="border p-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.orderId)}
                      onChange={() => handleSelect(order.orderId)}
                    />
                  </td>

                  <td className="border p-4">{order.orderId}</td>
                  <td className="border p-4">{order.fullName}</td>
                  <td className="border p-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="border p-4 font-semibold">
                    {order.totalAmount?.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>

                  <td className="border p-4">
                    {order.paymentMethod === "vnpay" ? "VNPAY" : "Tiền mặt"}
                  </td>

                  <td className="border p-4 text-center">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-white text-sm ${order.status === "Đã thanh toán"
                        ? "bg-green-500"
                        : "bg-red-500"
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* -------- TIẾN TRÌNH -------- */}
                  <td className="border p-4 text-center">
                    <select
                      value={order.orderProcess || "Chờ xử lý"}
                      onChange={(e) =>
                        updateOrderProcess(order.orderId, e.target.value)
                      }
                      disabled={order.orderProcess === "Đã hủy"}
                      className={`border px-2 py-1 rounded bg-gray-100 cursor-pointer ${order.orderProcess === "Đã hủy"
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:bg-gray-200"
                        }`}
                    >
                      <option value="Chờ xử lý">Chờ xử lý</option>
                      <option value="Đang giao">Đang giao</option>
                      <option value="Hoàn tất">Hoàn tất</option>

                      {/* KHÔNG CHO CHỌN ĐÃ HỦY */}
                      <option value="Đã hủy" disabled>
                        Đã hủy
                      </option>
                    </select>
                  </td>

                  <td className="border p-4 text-center">
                    <button
                      onClick={() => setDetailOrderId(order.orderId)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-base"
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-6 text-lg">
                  Không có đơn hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {detailOrderId && (
        <OrderDetailModal
          orderId={detailOrderId}
          onClose={() => setDetailOrderId(null)}
        />
      )}
    </div>
  );
};

export default OrderDashBoard;

