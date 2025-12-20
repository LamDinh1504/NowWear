import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddProductModal = ({ onClose, onSuccess }) => {
  const categories = [
    { categoryId: 1, categoryName: "Nam" },
    { categoryId: 2, categoryName: "Nữ" },
    { categoryId: 3, categoryName: "Trẻ em" }
  ];

  const subCategories = [
    { subCategoryId: 1, subCategoryName: "Áo" },
    { subCategoryId: 2, subCategoryName: "Quần" },
    { subCategoryId: 3, subCategoryName: "Đồ mùa đông" }
  ];

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [inventory, setInventory] = useState([]);
  const [images, setImages] = useState([]); 
  const [loading, setLoading] = useState(false);

  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

  // Upload ảnh
  const handleImageFileChange = async (e) => {
    const token = localStorage.getItem("token");
    const files = Array.from(e.target.files);
    const uploadedImages = [...images];

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        const res = await axios.post(`${backendURL}/api/upload/images`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        });

        uploadedImages.push({
          url: res.data, 
          displayOrder: uploadedImages.length + 1
        });
      }

      setImages(uploadedImages);
      toast.success("Upload ảnh thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Upload ảnh thất bại!");
    }
  };

  const handleImageOrderChange = (index, value) => {
    const newImages = [...images];
    newImages[index].displayOrder = parseInt(value) || 1;
    setImages(newImages);
  };

  const removeImage = (index) => setImages(images.filter((_, i) => i !== index));

  const addInventory = () => setInventory([...inventory, { size: "", stockQuantity: "" }]);
  const removeInventory = (index) => setInventory(inventory.filter((_, i) => i !== index));
  const handleInventoryChange = (index, field, value) => {
    const newInv = [...inventory];
    newInv[index][field] = value;
    setInventory(newInv);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!images.length) {
      toast.error("Cần ít nhất 1 ảnh sản phẩm");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Bạn chưa đăng nhập hoặc token hết hạn");
      return;
    }

    setLoading(true);
    try {
      const productCreateDTO = {
        productName,
        productDescription,
        categoryId,
        subCategoryId,
        price: parseFloat(price),
        productInventory: inventory,
        images
      };

      const res = await axios.post(`${backendURL}/api/products`, productCreateDTO, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(res.data || "Thêm sản phẩm thành công");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data || "Thêm sản phẩm thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-auto p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Thêm sản phẩm mới</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <input type="text" placeholder="Tên sản phẩm" value={productName} onChange={e => setProductName(e.target.value)} required className="border px-3 py-2 rounded" />
          <textarea placeholder="Mô tả sản phẩm" value={productDescription} onChange={e => setProductDescription(e.target.value)} className="border px-3 py-2 rounded" />

          <div className="flex gap-3">
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required className="border px-3 py-2 rounded flex-1">
              <option value="">Chọn danh mục</option>
              {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
            </select>
            <select value={subCategoryId} onChange={e => setSubCategoryId(e.target.value)} required className="border px-3 py-2 rounded flex-1">
              <option value="">Chọn loại sản phẩm</option>
              {subCategories.map(sc => <option key={sc.subCategoryId} value={sc.subCategoryId}>{sc.subCategoryName}</option>)}
            </select>
          </div>

          <input type="number" placeholder="Giá sản phẩm" value={price} onChange={e => setPrice(e.target.value)} required className="border px-3 py-2 rounded" />

          {/* Inventory */}
          <div>
            <h3 className="font-semibold mb-2">Kho hàng</h3>
            {inventory.map((inv, i) => (
              <div key={i} className="flex gap-2 mb-2 items-center">
                <input type="text" placeholder="Size" value={inv.size} onChange={e => handleInventoryChange(i, "size", e.target.value)} required className="border px-3 py-2 rounded flex-1" />
                <input type="number" placeholder="Số lượng" value={inv.stockQuantity} onChange={e => handleInventoryChange(i, "stockQuantity", e.target.value)} required className="border px-3 py-2 rounded flex-1" />
                <button type="button" className="px-3 py-1 rounded bg-red-600 text-white font-bold hover:bg-red-700 transition" onClick={() => removeInventory(i)}>Xóa</button>
              </div>
            ))}
            <button type="button" className="px-3 py-1 font-bold text-white bg-green-600 rounded hover:bg-green-700 transition mb-2" onClick={addInventory}>+ Thêm size</button>
          </div>

          {/* Upload ảnh */}
          <div>
            <label className="block mb-2 font-medium">Hình ảnh sản phẩm</label>
            <input type="file" multiple accept="image/*" onChange={handleImageFileChange} className="w-full border px-3 py-2 rounded" />
            {images.length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                {images.map((img, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <img src={img.url} alt={`img-${i}`} className="w-20 h-20 object-cover border" />
                    <input type="number" value={img.displayOrder} min={1} onChange={e => handleImageOrderChange(i, e.target.value)} className="border px-2 py-1 w-20 rounded" />
                    <button type="button" className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700" onClick={() => removeImage(i)}>Xóa</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500 transition" onClick={onClose} disabled={loading}>Hủy</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition" disabled={loading}>{loading ? "Đang thêm..." : "Thêm"}</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
