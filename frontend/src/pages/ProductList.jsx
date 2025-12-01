import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import AddProductModal from "../components/AddProoductModal.jsx";
import EditProductModal from "../components/EditProductModal.jsx";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // State confirm xóa
  const [confirmDelete, setConfirmDelete] = useState({ show: false, productId: null });

  const fetchProducts = async (keyword = "") => {
    setLoading(true);
    try {
      const res = keyword
        ? await axios.get(
            `http://localhost:8080/api/products/search?keyword=${encodeURIComponent(keyword)}`
          )
        : await axios.get("http://localhost:8080/api/products");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Lấy sản phẩm thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchProducts(value);
  };

  const handleEditClick = async (productId) => {
    try {
      const [productRes, inventoryRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/products/${productId}`),
        axios.get(`http://localhost:8080/api/products/${productId}/inventory`),
      ]);
      setEditProduct({
        ...productRes.data,
        productInventory: inventoryRes.data || [],
      });
    } catch (err) {
      console.error(err);
      toast.error("Lấy thông tin sản phẩm thất bại");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:8080/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.includes("thành công")) {
        toast.success(res.data);
        fetchProducts(searchTerm);
      } else {
        toast.error(res.data || "Xóa thất bại!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Xóa thất bại!");
    } finally {
      setConfirmDelete({ show: false, productId: null });
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-xl relative overflow-x-auto">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="border p-2 rounded w-full sm:w-64"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            className="bg-green-600 text-white font-bold px-4 py-2 rounded hover:bg-green-700 transition"
            onClick={() => setShowAddModal(true)}
          >
            + Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse bg-white shadow-lg rounded-xl overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border p-3 text-center">Ảnh</th>
            <th className="border p-3 text-left">Tên</th>
            <th className="border p-3 text-right">Giá</th>
            <th className="border p-3 text-center">Xử lý</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="text-center py-4">Đang tải...</td>
            </tr>
          ) : products.length > 0 ? (
            products.map((p) => (
              <tr key={p.productId} className="hover:bg-gray-50 transition duration-200">
                <td className="border p-2 text-center">
                  <img
                    src={p.productImageUrl || "https://via.placeholder.com/50"}
                    alt={p.productName}
                    className="h-16 w-16 object-cover rounded border"
                  />
                </td>
                <td className="border p-3">{p.productName}</td>
                <td className="border p-3 text-right">{Number(p.price).toLocaleString()}₫</td>
                <td className="border p-3 text-center">
                  <div className="flex flex-col sm:flex-row justify-center gap-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-1 rounded font-semibold hover:bg-blue-600 transition"
                      onClick={() => handleEditClick(p.productId)}
                    >
                      Sửa
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded font-semibold hover:bg-red-600 transition"
                      onClick={() => setConfirmDelete({ show: true, productId: p.productId })}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-4">Không có sản phẩm</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => fetchProducts(searchTerm)}
        />
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <EditProductModal
          productId={editProduct.productId}
          initialData={editProduct}
          onClose={() => setEditProduct(null)}
          onSuccess={() => fetchProducts(searchTerm)}
        />
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 text-center">
            <h3 className="text-lg font-bold mb-4">Xác nhận xóa</h3>
            <p className="mb-4">Bạn có chắc muốn xóa sản phẩm này không?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => setConfirmDelete({ show: false, productId: null })}
              >
                Hủy
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => handleDelete(confirmDelete.productId)}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;


