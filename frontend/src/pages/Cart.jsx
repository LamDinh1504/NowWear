import React, { useEffect, useState } from "react";
import axios from "axios";
import Title from "../components/Title.jsx";
import CartTotal from "../components/CartTotal.jsx";
import { assets } from "../assets/assets";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus, Heart, ArrowRight, Package } from "lucide-react";

const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDeleting, setIsDeleting] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

  const fetchCart = async () => {
    setLoading(true);
    try {
      if (!token) {
        setError("Bạn chưa đăng nhập.");
        setLoading(false);
        return;
      }
      const response = await axios.get(`${backendURL}/api/carts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartData(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Không thể tải giỏ hàng.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productInventoryId, newQuantity) => {
    if (newQuantity <= 0) return;

    setCartData((prev) =>
      prev.map((item) =>
        item.productInventoryId === productInventoryId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    try {
      await axios.post(
        `${backendURL}/api/carts/add`,
        { productInventoryId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Cập nhật thành công!", { duration: 2000 });
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại!");
      fetchCart();
    }
  };

  const removeItem = async (productInventoryId) => {
    setIsDeleting(productInventoryId);
    try {
      await axios.delete(`${backendURL}/api/carts/${productInventoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Đã xóa sản phẩm!");
      fetchCart();
    } catch (err) {
      console.error(err);
      toast.error("Xóa sản phẩm thất bại!");
    } finally {
      setIsDeleting(null);
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedItems.length === cartData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartData.map((item) => item.productInventoryId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 font-medium">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
          <p className="text-red-500 mb-6">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 px-4 sm:px-8 lg:px-16 py-12">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: "12px", fontWeight: "500" },
          success: {
            icon: "✅",
            style: { border: "2px solid #4ade80", background: "#f0fdf4", color: "#166534" },
          },
          error: {
            icon: "❌",
            style: { border: "2px solid #f87171", background: "#fef2f2", color: "#b91c1c" },
          },
        }}
      />

      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Title text1="GIỎ" text2="HÀNG" />
            <p className="mt-3 text-gray-600 text-lg">
              Bạn có{" "}
              <span className="font-bold text-gray-900">{cartData.length}</span> sản phẩm trong
              giỏ hàng
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md">
            <Package className="w-5 h-5 text-gray-700" />
            <span className="font-semibold text-gray-900">{cartData.length} items</span>
          </div>
        </div>
      </div>

      {cartData.length === 0 ? (
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Giỏ hàng trống</h3>
            <p className="text-gray-600 mb-8 text-lg">Hãy thêm sản phẩm yêu thích vào giỏ hàng!</p>
            <button
              onClick={() => navigate("/collection")}
              className="bg-linear-to-r from-gray-900 to-gray-700 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              Khám phá sản phẩm
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-4 flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.length === cartData.length}
                  onChange={selectAll}
                  className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span className="font-semibold text-gray-900">
                  Chọn tất cả ({cartData.length})
                </span>
              </label>
              {selectedItems.length > 0 && (
                <span className="text-sm text-gray-600">Đã chọn: {selectedItems.length}</span>
              )}
            </div>

            {cartData.map((item, index) => (
              <div
                key={item.productInventoryId}
                className="bg-white shadow-lg rounded-2xl p-5 flex flex-col sm:flex-row items-start gap-5 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
                style={{
                  animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="absolute top-5 left-5 z-10">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.productInventoryId)}
                    onChange={() => toggleSelectItem(item.productInventoryId)}
                    className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
                  />
                </div>

                <div className="absolute inset-0 bg-linear-to-r from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative shrink-0 ml-8 sm:ml-0">
                  <img
                    src={
                      item.productImageUrl
                        ? `${backendURL}${item.productImageUrl}`
                        : assets.placeholder
                    }
                    alt={item.productName}
                    className="w-32 h-32 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                  </button>
                </div>

                <div className="flex-1 flex flex-col sm:flex-row sm:justify-between items-start w-full gap-4 relative z-10">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                      {item.productName}
                    </h3>
                    <p className="text-xl font-bold text-gray-900 mb-1">
                      {item.price.toLocaleString("vi-VN")}{" "}
                      <span className="text-sm font-normal">VND</span>
                    </p>
                    {item.size && (
                      <p className="text-sm text-gray-600">
                        Kích thước: <span className="font-semibold">{item.size}</span>
                      </p>
                    )}
                    {item.color && (
                      <p className="text-sm text-gray-600">
                        Màu sắc: <span className="font-semibold">{item.color}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.productInventoryId, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4 text-gray-700" />
                      </button>

                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (val > 0) updateQuantity(item.productInventoryId, val);
                        }}
                        className="w-16 text-center font-bold text-gray-900 bg-transparent focus:outline-none"
                      />

                      <button
                        onClick={() =>
                          updateQuantity(item.productInventoryId, item.quantity + 1)
                        }
                        className="p-2 hover:bg-white rounded-lg transition"
                      >
                        <Plus className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productInventoryId)}
                      disabled={isDeleting === item.productInventoryId}
                      className="bg-red-50 hover:bg-red-100 rounded-xl p-3 transition-all disabled:opacity-50 group/delete"
                    >
                      {isDeleting === item.productInventoryId ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-500 border-t-transparent"></div>
                      ) : (
                        <Trash2 className="w-5 h-5 text-red-600 group-hover/delete:scale-110 transition-transform" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ORDER SUMMARY — TONE TRẮNG ĐEN */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl p-8 shadow-xl text-gray-900 border border-gray-200">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-gray-900" />
                Tóm tắt đơn hàng
              </h3>

              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                <CartTotal cartData={cartData} />
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Miễn phí vận chuyển cho đơn trên 500.000đ</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Đổi trả trong 7 ngày</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Thanh toán an toàn & bảo mật</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/place-order", { state: { cartData } })}
                className="w-full bg-gray-900 text-white font-bold px-6 py-4 rounded-xl hover:bg-gray-800 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 group"
              >
                TIẾN HÀNH THANH TOÁN
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/collection")}
                className="w-full mt-3 bg-transparent border-2 border-gray-300 text-gray-900 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-all"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;
