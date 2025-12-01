import React, { useState, useEffect } from 'react';
import Title from './Title';
import ProductItem from './ProductItem';
import axios from 'axios';

const BestSeller = () => {
  const [bestSeller, setBestSeller] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/products")
      .then(response => {
        const filtered = response.data
          .filter(item => item.bestSeller === true)
          .slice(0, 5); // Lấy 5 sản phẩm bán chạy nhất
        setBestSeller(filtered);
      })
      .catch(error => {
        setError(error.message);
      });
  }, []);

  return (
    <section className="my-16 px-4 sm:px-8 lg:px-16">
      
      {/* Heading */}
      <div className="text-center mb-12">
        <Title text1="BÁN" text2="CHẠY NHẤT" />
        <p className="mt-4 text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
          Khám phá những sản phẩm được khách hàng yêu thích nhất, thiết kế nổi bật và bán chạy nhất tại NowWear.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestSeller.length > 0 ? (
          bestSeller.map((item) => (
            <ProductItem 
              key={item.productId} 
              id={item.productId} 
              image={item.productImageUrl} 
              name={item.productName} 
              price={item.price} 
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">Không có sản phẩm bán chạy.</p>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-center mt-6">{error}</p>
      )}
    </section>
  );
};

export default BestSeller;
