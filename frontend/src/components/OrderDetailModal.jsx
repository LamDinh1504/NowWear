import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const OrderDetailModal = ({ orderId, onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrderItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/orders/${orderId}/items`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Lấy chi tiết đơn hàng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderItems();
  }, [orderId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-3xl shadow-xl overflow-y-auto max-h-[85vh]">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold transition"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Chi tiết đơn hàng {orderId}
        </h2>

        {loading ? (
          <p className="text-center py-10 text-lg text-gray-500">Đang tải...</p>
        ) : items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg text-sm sm:text-base">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border p-3 text-left">ID</th>
                  <th className="border p-3 text-left">Sản phẩm</th>
                  <th className="border p-3 text-center">Số lượng</th>
                  <th className="border p-3 text-right">Giá</th>
                  <th className="border p-3 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.orderItemId} className="hover:bg-gray-50 transition duration-200">
                    <td className="border p-3">{item.orderItemId}</td>
                    <td className="border p-3">{item.productName}</td>
                    <td className="border p-3 text-center">{item.quantity}</td>
                    <td className="border p-3 text-right">
                      {item.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                    </td>
                    <td className="border p-3 text-right">
                      {(item.price * item.quantity).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-10 text-lg text-gray-500">Không có sản phẩm</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetailModal;
