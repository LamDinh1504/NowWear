import React from 'react';
import { assets } from '../assets/assets.js';

const Hero = () => {
  return (
    <div
      className="relative w-full h-[500px] sm:h-[700px] flex items-center justify-center text-center px-6 sm:px-16"
      style={{
        backgroundImage: `url(${assets.logo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay gradient đen mờ */}
      <div className="absolute inset-0 bg-linear-to-b from-black/50 to-black/70"></div>

      {/* Text */}
      <div className="relative z-10 flex flex-col items-center gap-4 max-w-2xl text-white">
        <span className="uppercase text-gray-300 font-medium text-sm sm:text-base tracking-widest">
          Bộ sưu tập mới
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight">
          Khám phá phong cách <br /> cùng NowWear
        </h1>
        <p className="text-gray-200 text-base sm:text-lg">
          Xu hướng thời trang tối giản, hiện đại và đẳng cấp. Cập nhật ngay hôm nay!
        </p>
        <button className="mt-6 px-8 py-4 bg-black text-white font-bold rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300">
          Mua ngay
        </button>
      </div>
    </div>
  );
};

export default Hero;
