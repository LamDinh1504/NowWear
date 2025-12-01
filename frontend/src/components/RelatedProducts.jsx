import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductItem from './ProductItem.jsx';
import Title from './Title.jsx';

const RelatedProducts = ({ categoryName, subCategoryName }) => {
  const [related, setRelated] = useState([]);
  const [error, setError] = useState(null);

  console.log("Category nhận từ props:", categoryName);

  // 🧩 Ánh xạ tên tiếng Việt → tên category trong backend
  const categoryMap = {
    'nam': 'men',
    'nữ': 'women',
    'nu': 'women',
    'trẻ em': 'kids',
    'tre em': 'kids',
  };

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setError(null);
        if (!categoryName) return;

        let url = '';

        // 🪄 Chuẩn hóa tên category để khớp với backend
        const categoryKey = categoryName.toLowerCase().trim();
        const mappedCategory = categoryMap[categoryKey] || categoryKey; // nếu không có map thì giữ nguyên
        console.log("Mapped category:", mappedCategory);

        url = `http://localhost:8080/api/categories/${mappedCategory}/products`;

        const res = await axios.get(url);
        let products = res.data;

        setRelated(products.slice(0, 5)); // Giới hạn 5 sản phẩm liên quan
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm liên quan:", err);
        setError('Không thể tải sản phẩm liên quan.');
      }
    };

    fetchRelatedProducts();
  }, [categoryName, subCategoryName]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (related.length === 0) return null;

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item) => (
          <ProductItem
            key={item.productId}
            id={item.productId}
            name={item.productName}
            price={item.price}
            image={item.productImageUrl} // Đảm bảo đúng field trong DTO
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
