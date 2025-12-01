import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Mật khẩu mới
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Step 1: Gửi email nhận OTP
  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendURL}/api/auth/forgot-password`, { email });
      toast.success("OTP đã được gửi đến email của bạn!");
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data || "Gửi email thất bại!");
    }
  };

  // Step 2: Xác thực OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendURL}/api/auth/verify-otp`, { otp });
      if (response.data === true) {
        toast.success("OTP hợp lệ!");
        setStep(3);
      } else {
        toast.error("OTP không hợp lệ hoặc đã hết hạn!");
      }
    } catch (error) {
      toast.error(error.response?.data || "Xác thực OTP thất bại!");
    }
  };

  // Step 3: Đặt mật khẩu mới
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendURL}/api/auth/reset-password`, {
        token: otp,
        newPassword,
      });
      toast.success("Mật khẩu đã được thay đổi!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data || "Đặt lại mật khẩu thất bại!");
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md">
        {/* Step 1: Nhập email */}
        {step === 1 && (
          <form onSubmit={handleSendEmail}>
            <h2 className="text-2xl font-bold mb-6">Quên mật khẩu</h2>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="w-full p-3 mb-4 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-black text-white p-3 rounded hover:bg-gray-800 transition"
            >
              Gửi OTP
            </button>
          </form>
        )}

        {/* Step 2: Nhập OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <h2 className="text-2xl font-bold mb-6">Nhập OTP</h2>
            <input
              type="text"
              placeholder="Nhập OTP"
              className="w-full p-3 mb-4 border rounded"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-black text-white p-3 rounded hover:bg-gray-800 transition"
            >
              Xác thực OTP
            </button>
          </form>
        )}

        {/* Step 3: Nhập mật khẩu mới */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <h2 className="text-2xl font-bold mb-6">Đặt mật khẩu mới</h2>
            <input
              type="password"
              placeholder="Mật khẩu mới"
              className="w-full p-3 mb-4 border rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-black text-white p-3 rounded hover:bg-gray-800 transition"
            >
              Đặt lại mật khẩu
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
