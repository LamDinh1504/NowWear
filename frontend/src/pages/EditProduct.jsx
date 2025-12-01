import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    productName: "",
    productDescription: "",
    categoryId: 1,
    subCategoryId: 1,
    price: 0,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${productId}`);
        setForm(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/products/${productId}`, form);
      navigate("/dashboard/products");
    } catch (err) {
      console.error("Cập nhật lỗi:", err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Cập nhật sản phẩm</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
        <input
          className="p-2 border"
          type="text"
          name="productName"
          value={form.productName}
          onChange={handleChange}
          required
        />
        <textarea
          className="p-2 border"
          name="productDescription"
          value={form.productDescription}
          onChange={handleChange}
          required
        />
        <input
          className="p-2 border"
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="p-2 border"
        >
          <option value={1}>Men</option>
          <option value={2}>Women</option>
          <option value={3}>Kids</option>
        </select>
        <select
          name="subCategoryId"
          value={form.subCategoryId}
          onChange={handleChange}
          className="p-2 border"
        >
          <option value={1}>Topwear</option>
          <option value={2}>Bottomwear</option>
          <option value={3}>Winterwear</option>
        </select>
        <button className="bg-blue-500 text-white px-3 py-2 rounded">
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
