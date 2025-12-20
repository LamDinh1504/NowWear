import React, { useEffect, useState } from 'react';
import Title from './Title.jsx';
import ProductItem from './ProductItem.jsx';
import axios from 'axios';

const LatestCollection = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/products")
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        setError(error.message);
      });
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      setLatestProducts(products.slice(0, 10));
    }
  }, [products]);

  return (
    <section className="my-16 px-4 sm:px-8 lg:px-16">
      
      {/* Heading */}
      <div className="text-center mb-12">
        <Title text1="BỘ SƯU TẬP" text2="MỚI NHẤT" />
        <p className="mt-4 text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
          Khám phá những mẫu thời trang mới nhất, thiết kế hiện đại và thanh lịch, được lựa chọn nhiều nhất bởi khách hàng NowWear.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.length > 0 ? (
          latestProducts.map((item) => (
            <ProductItem 
              key={item.productId} 
              id={item.productId} 
              image={item.productImageUrl} 
              name={item.productName} 
              price={item.price} 
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">Không có sản phẩm mới.</p>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-center mt-6">{error}</p>
      )}
    </section>
  );
};

export default LatestCollection;

