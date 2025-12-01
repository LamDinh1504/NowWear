// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import OrderHistory from "../components/OrderHistory.jsx";
// import { User, Mail, Phone, Calendar, CreditCard, Edit, Camera, Lock, Save, X, Shield, Check } from "lucide-react";
// import { toast } from "react-toastify";

// const Profile = () => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [editing, setEditing] = useState(false);
//     const [formData, setFormData] = useState({ fullName: "", username: "", email: "", phone: "" });
//     const [showChangePassword, setShowChangePassword] = useState(false);
//     const [otp, setOtp] = useState("");
//     const [newPassword, setNewPassword] = useState("");
//     const [sendingOtp, setSendingOtp] = useState(false);

//     const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

//     useEffect(() => {
//         const fetchProfile = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 if (!token) {
//                     setError("Bạn chưa đăng nhập.");
//                     setLoading(false);
//                     return;
//                 }

//                 const response = await axios.get(`${backendURL}/api/profile`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 setUser(response.data);
//                 setFormData({
//                     fullName: response.data.fullName,
//                     username: response.data.username,
//                     email: response.data.email,
//                     phone: response.data.phone,
//                 });
//                 setLoading(false);
//             } catch (err) {
//                 console.error(err);
//                 setError(err.response?.data?.message || "Không thể tải thông tin người dùng.");
//                 setLoading(false);
//             }
//         };

//         fetchProfile();
//     }, []);

//     const handleChange = (e) => {
//         setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//     };

//     const handleSaveProfile = async () => {
//         try {
//             const token = localStorage.getItem("token");
//             const res = await axios.put(`${backendURL}/api/profile`, formData, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             toast.success(res.data);
//             setUser({ ...user, ...formData });
//             setEditing(false);
//         } catch (err) {
//             console.error(err);
//             toast.error(err.response?.data || "Cập nhật thất bại!");
//         }
//     };

//     const handleSendOtp = async () => {
//         if (!user?.email) return;
//         setSendingOtp(true);
//         try {
//             await axios.post(`${backendURL}/api/auth/forgot-password`, { email: user.email });
//             toast.success("OTP đã được gửi vào email của bạn!");
//             setShowChangePassword(true);
//         } catch (err) {
//             console.error(err);
//             toast.error(err.response?.data || "Gửi OTP thất bại!");
//         }
//         setSendingOtp(false);
//     };

//     const handleResetPassword = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.post(`${backendURL}/api/auth/reset-password`, { otp, newPassword });
//             toast.success("Mật khẩu đã được thay đổi!");
//             setShowChangePassword(false);
//             setOtp("");
//             setNewPassword("");
//         } catch (err) {
//             console.error(err);
//             toast.error(err.response?.data || "Đổi mật khẩu thất bại!");
//         }
//     };

//     if (loading)
//         return (
//             <div className="flex flex-col justify-center items-center h-screen bg-linear-to-br from-gray-50 to-slate-100">
//                 <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mb-4"></div>
//                 <p className="text-gray-600 text-lg font-medium">Đang tải thông tin...</p>
//             </div>
//         );

//     if (error)
//         return (
//             <div className="flex flex-col justify-center items-center h-screen bg-linear-to-br from-gray-50 to-slate-100">
//                 <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
//                     <X className="w-10 h-10 text-red-500" />
//                 </div>
//                 <p className="text-red-600 text-lg font-semibold">{error}</p>
//             </div>
//         );

//     return (
//         <div className="min-h-screen bg-linear-to-br from-gray-50 via-slate-50 to-gray-100 px-4 sm:px-6 lg:px-8 py-12">
//             {/* Decorative background */}
//             <div className="fixed inset-0 overflow-hidden pointer-events-none">
//                 <div className="absolute top-20 right-20 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
//                 <div className="absolute bottom-20 left-20 w-96 h-96 bg-slate-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }}></div>
//             </div>

//             <div className="max-w-6xl mx-auto space-y-8 relative">
//                 {/* Header Section */}
//                 <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
//                     {/* Decorative corner */}
//                     <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-gray-100 to-transparent rounded-bl-full opacity-50"></div>

//                     {/* Avatar */}
//                     <div className="relative shrink-0 group">
//                         <div className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-gray-200 shadow-lg flex items-center justify-center bg-linear-to-br from-gray-100 to-slate-100 group-hover:border-gray-900 transition-all duration-300">
//                             {user.avatar ? (
//                                 <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
//                             ) : (
//                                 <User className="text-gray-400 w-16 h-16" />
//                             )}
//                         </div>
//                         <button className="absolute -bottom-2 -right-2 bg-gray-900 p-3 rounded-xl shadow-xl hover:bg-black transition-all duration-300 hover:scale-110 group">
//                             <Camera className="text-white w-5 h-5" />
//                         </button>
//                         {/* Online badge */}
//                         <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
//                             <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
//                             Active
//                         </div>
//                     </div>

//                     {/* Info Preview */}
//                     <div className="flex-1 relative">
//                         <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
//                             <div>
//                                 <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.fullName}</h1>
//                                 <p className="text-gray-500 flex items-center gap-2">
//                                     <CreditCard className="w-4 h-4" />
//                                     @{user.username}
//                                 </p>
//                             </div>
//                             <div className="flex gap-2">
//                                 {editing ? (
//                                     <>
//                                         <button
//                                             onClick={handleSaveProfile}
//                                             className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//                                         >
//                                             <Save className="w-4 h-4" /> Lưu
//                                         </button>
//                                         <button
//                                             onClick={() => setEditing(false)}
//                                             className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
//                                         >
//                                             <X className="w-4 h-4" /> Hủy
//                                         </button>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <button
//                                             onClick={() => setEditing(true)}
//                                             className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white font-bold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
//                                         >
//                                             <Edit className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Chỉnh sửa
//                                         </button>
//                                         <button
//                                             onClick={handleSendOtp}
//                                             className={`flex items-center gap-2 bg-linear-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${sendingOtp ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
//                                             disabled={sendingOtp}
//                                         >
//                                             <Lock className="w-4 h-4" /> Đổi mật khẩu
//                                         </button>
//                                     </>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                             <InfoItem
//                                 icon={<User className="w-5 h-5" />}
//                                 label="Họ và tên"
//                                 value={editing ? (
//                                     <input
//                                         type="text"
//                                         name="fullName"
//                                         className="border-2 border-gray-200 p-2.5 rounded-xl w-full focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
//                                         value={formData.fullName}
//                                         onChange={handleChange}
//                                     />
//                                 ) : (
//                                     user.fullName
//                                 )}
//                             />
//                             <InfoItem
//                                 icon={<CreditCard className="w-5 h-5" />}
//                                 label="Username"
//                                 value={
//                                     <div className="flex items-center gap-2">
//                                         <span>{user.username}</span>
//                                         <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs font-bold rounded-full">Fixed</span>
//                                     </div>
//                                 }
//                             />
//                             <InfoItem
//                                 icon={<Mail className="w-5 h-5" />}
//                                 label="Email"
//                                 value={editing ? (
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         className="border-2 border-gray-200 p-2.5 rounded-xl w-full focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
//                                         value={formData.email}
//                                         onChange={handleChange}
//                                     />
//                                 ) : (
//                                     user.email
//                                 )}
//                             />
//                             <InfoItem
//                                 icon={<Calendar className="w-5 h-5" />}
//                                 label="Ngày tạo tài khoản"
//                                 value={new Date(user.createdAt).toLocaleDateString('vi-VN')}
//                                 colSpan={2}
//                             />
//                         </div>

//                         {/* Change Password Form */}
//                         {showChangePassword && (
//                             <div className="mt-6 bg-linear-to-br from-gray-50 to-slate-50 p-6 rounded-xl border-2 border-gray-900 shadow-lg relative overflow-hidden">
//                                 <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-gray-900 via-gray-600 to-gray-900"></div>
//                                 <div className="flex items-center gap-3 mb-5">
//                                     <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
//                                         <Shield className="w-5 h-5 text-white" />
//                                     </div>
//                                     <h3 className="text-xl font-bold text-gray-900">Đổi mật khẩu</h3>
//                                 </div>
//                                 <div className="space-y-4">
//                                     <div>
//                                         <label className="block text-sm font-bold text-gray-900 mb-2">Mã OTP</label>
//                                         <input
//                                             type="text"
//                                             placeholder="Nhập 6 số OTP từ email"
//                                             className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
//                                             value={otp}
//                                             onChange={(e) => setOtp(e.target.value)}
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-bold text-gray-900 mb-2">Mật khẩu mới</label>
//                                         <input
//                                             type="password"
//                                             placeholder="Nhập mật khẩu mới"
//                                             className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
//                                             value={newPassword}
//                                             onChange={(e) => setNewPassword(e.target.value)}
//                                         />
//                                     </div>
//                                     <button
//                                         onClick={handleResetPassword}
//                                         className="w-full bg-gray-900 text-white p-3.5 rounded-xl hover:bg-black transition-all font-bold shadow-lg flex items-center justify-center gap-2 group"
//                                     >
//                                         <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
//                                         Xác nhận đổi mật khẩu
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Order History Section */}
//                 <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
//                     <div className="absolute top-0 left-0 w-24 h-24 bg-linear-to-br from-gray-100 to-transparent rounded-br-full opacity-50"></div>
//                     <div className="flex items-center gap-3 mb-6 relative">
//                         <div className="w-10 h-10 rounded-xl bg-linear-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-lg">
//                             <Calendar className="w-5 h-5 text-white" />
//                         </div>
//                         <h2 className="text-2xl font-bold text-gray-900">
//                             Lịch sử <span className="font-normal text-gray-600">đơn hàng</span>
//                         </h2>
//                     </div>
//                     <OrderHistory />
//                 </div>
//             </div>
//         </div>
//     );
// };

// const InfoItem = ({ icon, label, value, colSpan = 1 }) => (
//     <div className={`flex items-start gap-3 p-4 bg-linear-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all group ${colSpan === 2 ? "sm:col-span-2" : ""}`}>
//         <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
//             {icon}
//         </div>
//         <div className="flex-1 min-w-0">
//             <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">{label}</p>
//             <div className="font-semibold text-gray-900 wrap-break-word">{value}</div>
//         </div>
//     </div>
// );

// export default Profile;

import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderHistory from "../components/OrderHistory.jsx";
import {
  User,
  Mail,
  Calendar,
  CreditCard,
  Edit,
  Camera,
  Lock,
  Save,
  X,
  Shield,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", username: "", email: "", phone: "" });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);

  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Bạn chưa đăng nhập.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${backendURL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        setFormData({
          fullName: response.data.fullName,
          username: response.data.username,
          email: response.data.email,
          phone: response.data.phone,
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Không thể tải thông tin người dùng.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${backendURL}/api/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data);
      setUser({ ...user, ...formData });
      setEditing(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data || "Cập nhật thất bại!");
    }
  };

  const handleSendOtp = async () => {
    if (!user?.email) return;
    setSendingOtp(true);
    try {
      await axios.post(`${backendURL}/api/auth/forgot-password`, { email: user.email });
      toast.success("OTP đã được gửi vào email của bạn!");
      setShowChangePassword(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data || "Gửi OTP thất bại!");
    }
    setSendingOtp(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendURL}/api/auth/reset-password`, { otp, newPassword });
      toast.success("Mật khẩu đã được thay đổi!");
      setShowChangePassword(false);
      setOtp("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data || "Đổi mật khẩu thất bại!");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Đang tải thông tin...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <X className="w-10 h-10 text-red-500" />
        </div>
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300 relative">
          {/* Avatar */}
          <div className="relative shrink-0 group">
            <div className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-gray-200 shadow-lg flex items-center justify-center bg-gray-100 transition-all">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="text-gray-400 w-16 h-16" />
              )}
            </div>
            <button className="absolute -bottom-2 -right-2 bg-gray-900 p-3 rounded-xl shadow-xl hover:bg-black transition-all duration-300 hover:scale-110 group">
              <Camera className="text-white w-5 h-5" />
            </button>
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              Active
            </div>
          </div>

          {/* Info & Controls */}
          <div className="flex-1 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.fullName}</h1>
                <p className="text-gray-500 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> @{user.username}
                </p>
              </div>
              <div className="flex gap-2">
                {editing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <Save className="w-4 h-4" /> Lưu
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <X className="w-4 h-4" /> Hủy
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white font-bold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                    >
                      <Edit className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Chỉnh sửa
                    </button>
                    <button
                      onClick={handleSendOtp}
                      disabled={sendingOtp}
                      className={`flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all duration-300 ${
                        sendingOtp ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                      }`}
                    >
                      <Lock className="w-4 h-4" /> Đổi mật khẩu
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InfoItem
                icon={<User className="w-5 h-5" />}
                label="Họ và tên"
                value={
                  editing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                    />
                  ) : (
                    user.fullName
                  )
                }
              />
              <InfoItem
                icon={<CreditCard className="w-5 h-5" />}
                label="Username"
                value={
                  <div className="flex items-center gap-2">
                    <span>{user.username}</span>
                    <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs font-bold rounded-full">Fixed</span>
                  </div>
                }
              />
              <InfoItem
                icon={<Mail className="w-5 h-5" />}
                label="Email"
                value={
                  editing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                    />
                  ) : (
                    user.email
                  )
                }
              />
              <InfoItem
                icon={<Calendar className="w-5 h-5" />}
                label="Ngày tạo tài khoản"
                value={new Date(user.createdAt).toLocaleDateString("vi-VN")}
                colSpan={2}
              />
            </div>

            {/* Change Password */}
            {showChangePassword && (
              <div className="mt-6 bg-gray-50 p-6 rounded-xl border-2 border-gray-900 shadow-lg">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Đổi mật khẩu</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Mã OTP</label>
                    <input
                      type="text"
                      placeholder="Nhập OTP từ email"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Mật khẩu mới</label>
                    <input
                      type="password"
                      placeholder="Nhập mật khẩu mới"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                    />
                  </div>
                  <button
                    onClick={handleResetPassword}
                    className="w-full bg-gray-900 text-white p-3.5 rounded-xl hover:bg-black transition-all font-bold flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Xác nhận đổi mật khẩu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Lịch sử <span className="font-normal text-gray-600">đơn hàng</span>
            </h2>
          </div>
          <OrderHistory />
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value, colSpan = 1 }) => (
  <div
    className={`flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all ${
      colSpan === 2 ? "sm:col-span-2" : ""
    }`}
  >
    <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-white shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">{label}</p>
      <div className="font-semibold text-gray-900">{value}</div>
    </div>
  </div>
);

export default Profile;
