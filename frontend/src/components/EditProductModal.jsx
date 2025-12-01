import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const categoryOptions = [
  { id: 1, name: "Nam" },
  { id: 2, name: "Nữ" },
  { id: 3, name: "Trẻ em" },
];

const subCategoryOptions = [
  { id: 1, name: "Áo" },
  { id: 2, name: "Quần" },
  { id: 3, name: "Đồ mùa đông" },
];

const EditProductModal = ({ productId, initialData, onClose, onSuccess }) => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [productInventory, setProductInventory] = useState([]);

  useEffect(() => {
    if (initialData) {
      setProductName(initialData.productName || "");
      setProductDescription(initialData.productDescription || "");
      setPrice(initialData.price?.toString() || "");

      const cat = categoryOptions.find(c => c.name === initialData.categoryName);
      setCategoryId(cat?.id || "");

      const sub = subCategoryOptions.find(s => s.name === initialData.subCategoryName);
      setSubCategoryId(sub?.id || "");

      setProductInventory(
        initialData.productInventory?.map(inv => ({
          size: inv.size,
          stockQuantity: inv.stockQuantity?.toString() || "0",
        })) || []
      );
    }
  }, [initialData]);

  const handleInventoryChange = (index, field, value) => {
    const updated = [...productInventory];
    updated[index][field] = value; 
    setProductInventory(updated);
  };

  const addInventoryRow = () => {
    setProductInventory([...productInventory, { size: "", stockQuantity: "0" }]);
  };

  const removeInventoryRow = (index) => {
    const updated = [...productInventory];
    updated.splice(index, 1);
    setProductInventory(updated);
  };

  const handleSave = async () => {
    try {
      const payload = {
        productName,
        productDescription,
        price: Number(price) || 0,
        categoryId,
        subCategoryId,
        images: [
          {
            url: initialData.productImageUrl || "",
            displayOrder: 1,
          },
        ],
        productInventory: productInventory.map(inv => ({
          size: inv.size,
          stockQuantity: Number(inv.stockQuantity) || 0,
        })),
      };

      await axios.put(
        `http://localhost:8080/api/products/${productId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Cập nhật sản phẩm thành công!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Lỗi chi tiết:", err.response?.data || err.message);
      toast.error("Cập nhật sản phẩm thất bại!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Toaster position="top-right" />
      <div className="bg-white p-6 rounded-xl w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">Chỉnh sửa sản phẩm</h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            className="border p-2 rounded"
            placeholder="Tên sản phẩm"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />

          <textarea
            className="border p-2 rounded"
            placeholder="Mô tả"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />

          <input
            type="number"
            className="border p-2 rounded"
            placeholder="Giá"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <select
            className="border p-2 rounded"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
          >
            <option value="">-- Chọn danh mục --</option>
            {categoryOptions.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={subCategoryId}
            onChange={(e) => setSubCategoryId(Number(e.target.value))}
          >
            <option value="">-- Chọn loại sản phẩm --</option>
            {subCategoryOptions.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <h3 className="font-semibold mt-3">Nhập kho (Size & Số lượng)</h3>
          {productInventory.map((inv, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                className="border p-1 rounded flex-1"
                placeholder="Size"
                value={inv.size}
                onChange={(e) => handleInventoryChange(idx, "size", e.target.value)}
              />
              <input
                type="number"
                className="border p-1 rounded w-24"
                placeholder="Số lượng"
                value={inv.stockQuantity}
                onChange={(e) => handleInventoryChange(idx, "stockQuantity", e.target.value)}
              />
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => removeInventoryRow(idx)}
              >
                X
              </button>
            </div>
          ))}
          <button
            className="bg-green-500 text-white px-2 py-1 rounded w-fit"
            onClick={addInventoryRow}
          >
            + Thêm size
          </button>

          <div className="flex justify-end gap-2 mt-4">
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>Hủy</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSave}>Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;

