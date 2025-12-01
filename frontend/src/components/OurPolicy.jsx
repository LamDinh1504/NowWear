import React from 'react';
import { assets } from '../assets/assets';

const OurPolicy = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-6 text-center py-20 text-sm sm:text-base md:text-lg text-gray-700">
      
      {/* Chính sách đổi trả */}
      <div className="flex flex-col items-center gap-3">
        <img src={assets.exchange_icon} className="w-14 sm:w-16 mb-3" alt="Đổi trả dễ dàng" />
        <p className="font-bold text-lg sm:text-xl">Chính sách đổi trả dễ dàng</p>
        <p className="text-gray-500">Chúng tôi cung cấp chính sách đổi trả nhanh chóng và thuận tiện</p>
      </div>

      {/* Chính sách hoàn trả 7 ngày */}
      <div className="flex flex-col items-center gap-3">
        <img src={assets.quality_icon} className="w-14 sm:w-16 mb-3" alt="Hoàn trả 7 ngày" />
        <p className="font-bold text-lg sm:text-xl">Hoàn trả trong 7 ngày</p>
        <p className="text-gray-500">Khách hàng có thể hoàn trả sản phẩm miễn phí trong vòng 7 ngày</p>
      </div>

      {/* Hỗ trợ khách hàng */}
      <div className="flex flex-col items-center gap-3">
        <img src={assets.support_img} className="w-14 sm:w-16 mb-3" alt="Hỗ trợ khách hàng" />
        <p className="font-bold text-lg sm:text-xl">Hỗ trợ khách hàng tốt nhất</p>
        <p className="text-gray-500">Chúng tôi cung cấp dịch vụ hỗ trợ khách hàng 24/7</p>
      </div>

    </div>
  );
}

export default OurPolicy;
