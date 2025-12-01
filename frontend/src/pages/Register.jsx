import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          fullname: formData.fullname,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );

      toast.success(res.data.message || "Đăng ký thành công!");
      setFormData({
        fullname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-white text-black">
      {/* Cột trái - giới thiệu */}
      <div className="hidden md:flex flex-col justify-center w-1/2 px-16 bg-gray-50">
        <h1 className="text-5xl font-extrabold mb-6 leading-tight text-black drop-shadow-sm">
          Tham gia cùng chúng tôi
        </h1>

        <p className="text-lg text-gray-700 leading-relaxed max-w-lg mb-6">
          Tạo tài khoản để khám phá thế giới trang phục, theo dõi đơn hàng và nhận ưu đãi độc quyền từ{" "}
          <span className="font-semibold">Forever</span>.
        </p>

        <p className="text-base text-gray-600">
          Đã có tài khoản?{" "}
          <a
            href="/login"
            className="text-black font-semibold hover:underline"
          >
            Đăng nhập ngay
          </a>
        </p>
      </div>

      {/* Cột phải - form đăng ký */}
      <div className="flex justify-center items-center w-full md:w-1/2 px-8 md:px-16 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-md p-10 rounded-3xl shadow-xl border border-gray-200"
        >
          <h3 className="text-3xl font-bold text-black mb-10 text-center">
            Đăng ký tài khoản
          </h3>

          {/* Fullname */}
          <div className="mb-4">
            <label className="block text-black font-semibold mb-2 text-lg">
              Họ và tên
            </label>
            <input
              type="text"
              name="fullname"
              placeholder="Nhập họ và tên"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
              required
            />
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-black font-semibold mb-2 text-lg">
              Tên tài khoản
            </label>
            <input
              type="text"
              name="username"
              placeholder="Nhập tên tài khoản"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-black font-semibold mb-2 text-lg">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-black font-semibold mb-2 text-lg">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-black font-semibold mb-2 text-lg">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
              required
            />
          </div>

          {/* Nút đăng ký */}
          <button
            type="submit"
            disabled={loading}
            className="bg-black hover:bg-gray-800 text-white font-semibold text-lg py-3 w-full rounded-xl shadow-md transition duration-300"
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
