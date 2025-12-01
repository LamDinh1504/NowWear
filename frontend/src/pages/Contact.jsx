import React from 'react';
import Title from '../components/Title.jsx';
import NewsletterBox from '../components/NewsletterBox.jsx';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';
import { assets } from '../assets/assets';

const Contact = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 py-16 text-gray-900">
      <div className="max-w-6xl w-full px-6 space-y-16">

        {/* Tiêu đề */}
        <div className="text-center mb-12 text-4xl sm:text-5xl font-extrabold">
          <Title text1="LIÊN HỆ" text2="NOWWEAR" />
        </div>

        {/* Nội dung chính */}
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Hình minh họa */}
          <div className="flex justify-center">
            <img
              src={assets.contact_img} // đổi thành ảnh thật
              alt="NowWear Contact"
              className="w-full h-72 sm:h-96 object-cover rounded-xl shadow-lg"
            />
          </div>

          {/* Thông tin liên hệ */}
          <div className="space-y-10">

            {/* Cửa hàng */}
            <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                Cửa hàng chính
              </h3>
              <p className="flex items-center gap-2 text-gray-700">
                <FaMapMarkerAlt className="text-pink-500" /> KTX KHU B, Đ. Mạc Đĩnh Chi, Khu phố Tân Hòa, Dĩ An, Bình Dương
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <FaPhoneAlt className="text-purple-500" /> 0356724126
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <FaEnvelope className="text-indigo-500" /> lamdv15042005@gmail.com
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <FaClock className="text-pink-400" /> Giờ mở cửa: 08:00 - 20:00 (Tất cả các ngày)
              </p>
            </div>

            {/* Cơ hội nghề nghiệp */}
            <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                Gia nhập đội ngũ NowWear
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi luôn tìm kiếm những người đam mê sáng tạo, nhiệt huyết với thời trang và công nghệ. Khám phá các vị trí tuyển dụng hiện có để cùng phát triển cùng chúng tôi.
              </p>
              <button className="px-6 py-2 rounded-md font-semibold text-white bg-black hover:bg-gray-800 hover:scale-105 transition-transform duration-300 shadow-md">
                Xem việc làm
              </button>
            </div>

            {/* Liên hệ nhanh */}
            <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                Liên hệ nhanh
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Gửi yêu cầu hoặc thắc mắc của bạn, chúng tôi sẽ phản hồi nhanh chóng.
              </p>
              <form className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Họ và tên"
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <textarea
                  placeholder="Nội dung"
                  rows="4"
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                ></textarea>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-md font-semibold text-white bg-black hover:bg-gray-800 hover:scale-105 transition-transform duration-300 shadow-md"
                >
                  Gửi
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-20">
          <NewsletterBox />
        </div>

      </div>
    </div>
  );
};

export default Contact;
