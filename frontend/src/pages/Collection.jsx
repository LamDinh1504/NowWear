import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { assets } from '../assets/assets';
import axios from 'axios';
import { useFilter } from "../context/FilterContext";

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchKeyword = searchParams.get("search")?.trim() || "";

  const { filters, updateCategory, updateType } = useFilter();

  const categoryMap = { Nam: "men", Nữ: "women", "Trẻ em": "kids" };
  const typeMap = { "Áo": "topwear", "Quần": "bottomwear", "Đồ mùa đông": "winterwear" };

  // --- FETCH FUNCTIONS ---
  const fetchProductsByCategories = async (categories) => {
    try {
      const allProducts = [];
      if (categories.length === 0) return [];
      for (const category of categories) {
        const res = await axios.get(`${backendURL}/api/categories/${category}/products`);
        allProducts.push(...res.data);
      }
      return allProducts;
    } catch (err) { console.error(err); setError(err.message); return []; }
  };

  const fetchProductsByTypes = async (types) => {
    try {
      const allProducts = [];
      if (types.length === 0) return [];
      for (const type of types) {
        const res = await axios.get(`${backendURL}/api/subcategories/${type}/products`);
        allProducts.push(...res.data);
      }
      return allProducts;
    } catch (err) { console.error(err); setError(err.message); return []; }
  };

  const fetchSearchProducts = async (keyword) => {
    try {
      const res = await axios.get(`${backendURL}/api/search`, { params: { keyword } });
      return res.data;
    } catch (err) { console.error(err); setError(err.message); return []; }
  };

  const fetchAllProducts = async () => {
    setError(null);
    try {
      if (searchKeyword) {
        const searchResults = await fetchSearchProducts(searchKeyword);
        setProducts(searchResults);
        return;
      }
      const productsByCategory = await fetchProductsByCategories(filters.categories);
      const productsByType = await fetchProductsByTypes(filters.types);
      let combinedProducts;
      if (filters.categories.length > 0 && filters.types.length > 0) {
        const typeSet = new Set(productsByType.map(p => p.productId));
        combinedProducts = productsByCategory.filter(p => typeSet.has(p.productId));
      } else if (filters.categories.length > 0) {
        combinedProducts = productsByCategory;
      } else if (filters.types.length > 0) {
        combinedProducts = productsByType;
      } else {
        const res = await axios.get(`${backendURL}/api/products`);
        combinedProducts = res.data;
      }
      setProducts(combinedProducts);
    } catch (err) { console.error(err); setError(err.message); }
  };

  useEffect(() => { fetchAllProducts(); }, [filters.categories, filters.types, searchKeyword]);

  const handleCategoryChange = (e) => {
    const displayName = e.target.value;
    const backendCategory = categoryMap[displayName];
    updateCategory(backendCategory, e.target.checked);
  };

  const handleTypeChange = (e) => {
    const displayName = e.target.value;
    const backendType = typeMap[displayName];
    updateType(backendType, e.target.checked);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 pt-10 border-t">

      {/* SIDEBAR FILTER */}
      <aside className="w-full sm:w-60 shrink-0">
        <div className="bg-white shadow-md rounded-2xl p-5 sticky top-20">
          <p className="text-xl font-semibold mb-4 flex items-center justify-between">
            BỘ LỌC
            <img className="h-3 sm:hidden" src={assets.dropdown_icon} />
          </p>

          {/* CATEGORY */}
          <div className="mb-6">
            <p className="text-sm font-bold mb-2 text-black uppercase">Danh mục</p>
            <div className="flex flex-col gap-2">
              {Object.keys(categoryMap).map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer text-gray-800 hover:text-black transition">
                  <input
                    type="checkbox"
                    value={cat}
                    checked={filters.categories.includes(categoryMap[cat])}
                    onChange={handleCategoryChange}
                    className="w-4 h-4 accent-black rounded"
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {/* TYPE */}
          <div>
            <p className="text-sm font-bold mb-2 text-black uppercase">Loại sản phẩm</p>
            <div className="flex flex-col gap-2">
              {Object.keys(typeMap).map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer text-gray-800 hover:text-black transition">
                  <input
                    type="checkbox"
                    value={type}
                    checked={filters.types.includes(typeMap[type])}
                    onChange={handleTypeChange}
                    className="w-4 h-4 accent-black rounded"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* PRODUCT LIST */}
      <main className="flex-1">
        <div className="flex justify-between items-center mb-6">
          {searchKeyword ? (
            <Title text1="TÌM KIẾM" text2={`"${searchKeyword}"`} />
          ) : (
            <Title text1="TẤT CẢ" text2="SẢN PHẨM" />
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : products.length === 0 ? (
            <p>Không có sản phẩm nào.</p>
          ) : (
            products.map(item => (
              <ProductItem
                key={item.productId}
                name={item.productName}
                id={item.productId}
                price={item.price}
                image={item.productImageUrl || item.url}
              />
            ))
          )}
        </div>
      </main>

    </div>
  );
};

export default Collection;

