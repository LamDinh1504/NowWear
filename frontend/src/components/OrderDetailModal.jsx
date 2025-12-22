import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Package, MapPin, User, Phone, X, ShoppingBag } from "lucide-react";

const OrderDetailModal = ({ orderId, order, onClose }) => {
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

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl w-full max-w-5xl shadow-2xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* Decorative top border */}
        <div className="h-1.5 bg-linear-to-r from-gray-700 via-gray-900 to-black"></div>
        
        {/* Header */}
        <div className="px-8 py-6 bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-linear-to-br from-gray-800 to-black p-3 rounded-2xl shadow-lg">
                <ShoppingBag className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-linear-to-r from-gray-800 to-black bg-clip-text text-transparent">
                  Chi tiết đơn hàng
                </h2>
                <p className="text-gray-700 text-sm font-medium mt-1">
                  Mã đơn hàng: <span className="font-bold">{orderId}</span>
                </p>
              </div>
            </div>
            <button
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2.5 transition-all duration-200"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-8 bg-linear-to-b from-gray-50 to-white">
          {/* Địa chỉ giao hàng */}
          {order && (
            <div className="mb-8 bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-linear-to-br from-gray-700 to-gray-900 p-2.5 rounded-xl">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-xl text-gray-800">
                  Thông tin giao hàng
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-linear-to-r from-gray-50 to-gray-100 rounded-xl">
                  <span className="text-2xl"></span>
                  <div className="flex-1">
                    <p className="text-gray-700 leading-relaxed font-medium">
                      {order.street}, {order.district}, {order.city}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 bg-white px-5 py-3.5 rounded-xl border border-gray-200 shadow-sm">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <User className="w-4 h-4 text-gray-700" />
                    </div>
                    <span className="text-gray-800 font-semibold">
                      {order.fullName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-white px-5 py-3.5 rounded-xl border border-gray-200 shadow-sm">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <Phone className="w-4 h-4 text-gray-700" />
                    </div>
                    <span className="text-gray-800 font-semibold">
                      {order.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Danh sách sản phẩm */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-md">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-800"></div>
                <div className="absolute inset-0 rounded-full bg-gray-400 opacity-20 blur-xl"></div>
              </div>
              <p className="text-gray-600 mt-6 font-medium text-lg">Đang tải dữ liệu...</p>
            </div>
          ) : items.length > 0 ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="bg-linear-to-br from-gray-700 to-gray-900 p-2.5 rounded-xl">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-xl text-gray-800">
                  Danh sách sản phẩm
                </h3>
              </div>
              
              <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-linear-to-r from-gray-100 to-gray-200">
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                          Mã SP
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                          Tên sản phẩm
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                          Số lượng
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                          Đơn giá
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {items.map((item, index) => (
                        <tr
                          key={item.orderItemId}
                          className={`hover:bg-linear-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200 ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                        >
                          <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                            {item.orderItemId}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-gray-800">
                              {item.productName}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center justify-center bg-linear-to-r from-gray-700 to-black text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-gray-700 font-medium">
                            {item.price.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-gray-900">
                            {(item.price * item.quantity).toLocaleString(
                              "vi-VN",
                              {
                                style: "currency",
                                currency: "VND",
                              }
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tổng cộng */}
              <div className="relative bg-linear-to-r from-gray-800 via-gray-900 to-black rounded-2xl p-8 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-gray-700 to-gray-900 opacity-20"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="relative flex justify-between items-center">
                  <div>
                    <p className="text-gray-300 text-sm font-medium mb-1">Tổng thanh toán</p>
                    <span className="text-white text-4xl font-extrabold tracking-tight">
                      {totalAmount.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </div>
                  <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-sm">
                    <Package className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-md">
              <div className="bg-linear-to-br from-gray-100 to-gray-200 p-6 rounded-3xl mb-6">
                <Package className="w-20 h-20 text-gray-400" />
              </div>
              <p className="text-gray-500 text-xl font-medium">Chưa có sản phẩm nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;