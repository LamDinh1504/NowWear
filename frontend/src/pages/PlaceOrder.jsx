import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import CartTotal from "../components/CartTotal.jsx";
import { QRCodeCanvas } from "qrcode.react";
import { MapPin, CreditCard, Wallet, Sparkles, Scan } from "lucide-react";

const locations = [
  { 
    province: "TP. Hồ Chí Minh", 
    districts: [
      "Quận 1", 
      "Quận 3", 
      "Quận 4", 
      "Quận 5",
      "Quận 7",
      "Quận 10",
      "Quận 12",
      "Gò Vấp",
      "Bình Thạnh",
      "Tân Bình",
      "Tân Phú",
      "Phú Nhuận",
      "Thủ Đức"
    ] 
  },

  { 
    province: "Bình Dương", 
    districts: [
      "Thủ Dầu Một",
      "Dĩ An",
      "Thuận An",
      "Tân Uyên",
      "Bến Cát",
      "Phú Giáo",
      "Dầu Tiếng",
      "Bàu Bàng"
    ] 
  },

  { 
    province: "Đồng Nai", 
    districts: [
      "Biên Hòa",
      "Long Khánh",
      "Long Thành",
      "Nhơn Trạch",
      "Trảng Bom",
      "Vĩnh Cửu",
      "Thống Nhất",
      "Xuân Lộc",
      "Cẩm Mỹ",
      "Tân Phú",
      "Định Quán"
    ] 
  }
];

const Title = ({ text1, text2, icon: Icon }) => (
  <div className="flex items-center gap-3 mb-6">
    {Icon && (
      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-lg">
        <Icon className="w-5 h-5 text-white" />
      </div>
    )}
    <h2 className="text-2xl font-bold text-gray-900">
      {text1} <span className="font-normal text-gray-600">{text2}</span>
    </h2>
  </div>
);

const PlaceOrder = () => {
  const location = useLocation();
  const cartData = location.state?.cartData || [];

  const [street, setStreet] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [districtsList, setDistrictsList] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");
  const [loading, setLoading] = useState(false);
  const [vnpayUrl, setVnpayUrl] = useState("");
  const [loadingQR, setLoadingQR] = useState(false);

  const token = localStorage.getItem("token");
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
  const navigate = useNavigate();

  useEffect(() => {
    const selected = locations.find((loc) => loc.province === province);
    setDistrictsList(selected?.districts || []);
    setDistrict("");
  }, [province]);

  const handleCreateVNPayQR = async () => {
    if (!token) return toast.error("Bạn cần đăng nhập để thanh toán VNPay!");
    if (!street.trim() || !province || !district) return toast.error("Vui lòng điền đầy đủ thông tin địa chỉ!");
    if (!phone.trim()) return toast.error("Vui lòng nhập số điện thoại!");

    try {
      setLoadingQR(true);
      const amount = cartData.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const res = await axios.post(
        `${backendURL}/api/payment/vnpay`,
        { amount }, // gửi số tiền theo backend
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.data) {
        // Lưu orderId hoặc info nếu cần
        localStorage.setItem("lastOrderId", cartData[0]?.orderId || Date.now()); // ví dụ
        // Redirect sang VNPay hoặc hiển thị QR
        window.location.href = res.data.data;
      } else {
        toast.error("Không tạo được QR VNPay!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tạo QR VNPay!");
    } finally {
      setLoadingQR(false);
    }
  };

  // Xử lý đặt hàng
  const handlePlaceOrder = async () => {
    if (paymentMethod === "Chuyển khoản ngân hàng") return handleCreateVNPayQR();

    if (!token) return toast.error("Bạn cần đăng nhập để đặt hàng!");
    if (!street.trim() || !province || !district) return toast.error("Vui lòng điền đầy đủ thông tin địa chỉ!");
    if (!phone.trim()) return toast.error("Vui lòng nhập số điện thoại!");

    const orderRequest = {
      city: province,
      district,
      street: street.trim(),
      paymentMethod,
      phone: phone.trim()
    };

    try {
      setLoading(true);
      await axios.post(`${backendURL}/api/orders`, orderRequest, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Đặt hàng thành công!");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data || "Đặt hàng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-slate-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster
        position="top-right"
        toastOptions={{
          success: { duration: 3000, style: { background: '#10b981', color: '#fff' } },
          error: { duration: 4000, style: { background: '#ef4444', color: '#fff' } }
        }}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form giao hàng */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50 hover:shadow-2xl transition-all duration-300">
          <Title text1="THÔNG TIN" text2="GIAO HÀNG" icon={MapPin} />
          <div className="space-y-4">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ chi tiết</label>
              <input
                placeholder="Số nhà, tên đường, phường/xã..."
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
              <input
                placeholder="Nhập số điện thoại..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tỉnh/Thành phố</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Chọn tỉnh/thành</option>
                  {locations.map((loc) => (
                    <option key={loc.province} value={loc.province}>{loc.province}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quận/Huyện</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  disabled={!province}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 bg-white text-gray-900 disabled:opacity-50"
                >
                  <option value="">Chọn quận/huyện</option>
                  {districtsList.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Cart + Payment */}
        <div className="flex flex-col gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <CartTotal cartData={cartData} />
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <Title text1="PHƯƠNG THỨC" text2="THANH TOÁN" icon={CreditCard} />

            <div className="space-y-3">
              {[
                { method: "Tiền mặt", icon: Wallet, desc: "Thanh toán khi nhận hàng" },
                { method: "Chuyển khoản ngân hàng", icon: Scan, desc: "Thanh toán qua VNPay QR" }
              ].map(({ method, icon: Icon, desc }) => (
                <div
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === method ? "border-gray-900 bg-gray-50 shadow-lg" : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{method}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || loadingQR}
              className="mt-6 w-full py-4 rounded-xl bg-gray-900 hover:bg-black text-white font-bold shadow-xl flex items-center justify-center gap-2"
            >
              {paymentMethod === "Chuyển khoản ngân hàng" ? (
                loadingQR ? "Đang tạo QR..." : "TẠO QR VNPay"
              ) : loading ? "Đang xử lý..." : "ĐẶT HÀNG NGAY"}
            </button>

            {vnpayUrl && (
              <div className="mt-6 p-6 bg-gray-50 rounded-xl border-2 border-gray-900">
                <div className="flex flex-col items-center">
                  <QRCodeCanvas value={vnpayUrl} size={220} />
                  <p className="font-bold mt-4">Quét mã QR để thanh toán</p>
                  <p className="text-xs text-gray-500">Có hiệu lực trong 15 phút</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;

