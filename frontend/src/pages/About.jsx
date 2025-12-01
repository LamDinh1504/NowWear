import React from 'react';
import { assets } from '../assets/assets';
import Title from '../components/Title.jsx';
import NewsletterBox from '../components/NewsletterBox.jsx';
import { FaShippingFast, FaMedal, FaHeadset } from 'react-icons/fa';

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-20 text-gray-900 bg-white">

      {/* Tiêu đề chính */}
      <div className="text-center">
        <Title text1="VỀ" text2="CHÚNG TÔI" />
        <p className="mt-4 text-gray-700 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          NowWear không chỉ là một cửa hàng thời trang trực tuyến, mà còn là nơi mang đến trải nghiệm mua sắm tiện lợi, hiện đại và đầy cảm hứng cho mọi khách hàng.
        </p>
      </div>

      {/* Nội dung chính */}
      <div className="flex flex-col md:flex-row items-center gap-12">
        {/* Ảnh minh họa bên trái */}
        <div className="md:w-1/2">
          <img
            src={assets.about_img}
            alt="Về chúng tôi"
            className="w-full h-auto rounded-xl shadow-lg"
          />
        </div>

        {/* Nội dung bên phải */}
        <div className="md:w-1/2 space-y-4">
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
            Chúng tôi được sinh ra từ đam mê thời trang và mong muốn giúp mọi người dễ dàng thể hiện phong cách riêng của mình. Mỗi sản phẩm tại NowWear đều được chọn lọc kỹ lưỡng, đảm bảo chất lượng và phù hợp với xu hướng hiện đại.
          </p>
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
            Với phương châm “Phong cách của bạn, sứ mệnh của chúng tôi”, chúng tôi cam kết mang đến trải nghiệm mua sắm trực tuyến nhanh chóng, tiện lợi và an toàn.
          </p>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Sứ mệnh của chúng tôi</h3>
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
            Sứ mệnh của NowWear là cung cấp những sản phẩm chất lượng, đa dạng và phong cách, giúp khách hàng tự tin thể hiện bản thân và cảm thấy tuyệt vời mỗi ngày.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="text-center space-y-8">
        <Title text1="TẠI SAO" text2="CHỌN CHÚNG TÔI" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow bg-gray-900 text-white flex flex-col items-center gap-4">
            <FaMedal className="text-yellow-400 text-4xl" />
            <h3 className="font-bold text-lg">Chất lượng hàng đầu</h3>
            <p className="text-gray-300 text-center text-base sm:text-lg leading-relaxed">
              Tất cả sản phẩm đều được kiểm định kỹ lưỡng, đảm bảo chất lượng vượt trội.
            </p>
          </div>
          <div className="border rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow bg-gray-900 text-white flex flex-col items-center gap-4">
            <FaShippingFast className="text-blue-400 text-4xl" />
            <h3 className="font-bold text-lg">Giao hàng nhanh chóng</h3>
            <p className="text-gray-300 text-center text-base sm:text-lg leading-relaxed">
              Hệ thống giao nhận nhanh chóng, giúp bạn nhận sản phẩm chỉ trong vài ngày.
            </p>
          </div>
          <div className="border rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow bg-gray-900 text-white flex flex-col items-center gap-4">
            <FaHeadset className="text-pink-500 text-4xl" />
            <h3 className="font-bold text-lg">Hỗ trợ tận tâm</h3>
            <p className="text-gray-300 text-center text-base sm:text-lg leading-relaxed">
              Đội ngũ chăm sóc khách hàng chuyên nghiệp, luôn sẵn sàng hỗ trợ bạn.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Timeline */}
      <div className="space-y-12">
        <Title text1="HÀNH TRÌNH" text2="CỦA CHÚNG TÔI" />
        <div className="relative border-l-2 border-gray-300 ml-4 space-y-8">
          {[ 
            { year: '2019', title: 'Khởi đầu', desc: 'NowWear được thành lập với ý tưởng mang thời trang chất lượng đến mọi người.' },
            { year: '2020', title: 'Mở rộng', desc: 'Mở rộng danh mục sản phẩm, thêm các mặt hàng phụ kiện và thời trang mùa đông.' },
            { year: '2022', title: 'Phát triển trực tuyến', desc: 'Ra mắt nền tảng trực tuyến với trải nghiệm mua sắm tiện lợi và nhanh chóng.' },
            { year: '2025', title: 'Tương lai', desc: 'Tiếp tục đổi mới, mở rộng sản phẩm và nâng cao trải nghiệm khách hàng.' },
          ].map((item, index) => (
            <div key={index} className="relative mb-4 pl-8">
              <div className="absolute -left-5 w-3 h-3 bg-gray-900 rounded-full top-1"></div>
              <p className="text-sm text-gray-500">{item.year}</p>
              <h4 className="font-semibold text-gray-900 text-lg">{item.title}</h4>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="mt-16">
        <NewsletterBox />
      </div>

    </div>
  );
}

export default About;
