import React from 'react';
import { ShoppingCart, Eye, Heart } from 'lucide-react';

const ProductItem = ({ id, image, name, price }) => {
  const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', }).format(price);

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-300 transition-all duration-300 flex flex-col hover:shadow-2xl">

      {/* Badge "NEW" */}
      <div className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1 rounded-full z-10">
        NEW
      </div>

      {/* Hình sản phẩm */}
      <div className="relative overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={name}
          className="w-full h-72 object-cover transition-all duration-500 ease-out group-hover:scale-110"
        />

        {/* Overlay với quick actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <button className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-110 transition-all duration-200">
            <Heart className="w-5 h-5 text-gray-700" />
          </button>
          <a
            href={`/product/${id}`}
            className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-110 transition-all duration-200"
          >
            <Eye className="w-5 h-5 text-gray-700" />
          </a>
          <button className="bg-black p-3 rounded-full shadow-lg hover:bg-gray-800 transform hover:scale-110 transition-all duration-200">
            <ShoppingCart className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Nội dung */}
      <div className="p-5 flex flex-col flex-1">
        {/* Tên sản phẩm */}
        <h3 className="text-gray-800 text-base font-medium mb-2 line-clamp-2 min-h-12 group-hover:text-black transition-colors">
          {name}
        </h3>

        {/* Đánh giá sao */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
          <span className="text-xs text-gray-500 ml-1">(4.5)</span>
        </div>

        {/* Giá */}
        <div className="flex items-baseline gap-2 mb-4">
          <p className="text-black font-bold text-xl">
            {formattedPrice}
          </p>
          <p className="text-gray-400 text-sm line-through">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(price * 1.3)}
          </p>
        </div>

        {/* Nút xem chi tiết */}
        <a
          href={`/product/${id}`}
          className="mt-auto w-full py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
        >
          <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          Xem chi tiết
        </a>
      </div>
    </div>
  );
};

export default ProductItem;