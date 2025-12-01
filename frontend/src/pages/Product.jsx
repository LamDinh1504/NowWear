import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Package, 
  RefreshCw, 
  Shield, 
  Truck,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Info
} from "lucide-react";
import RelatedProducts from "../components/RelatedProducts";
import toast, { Toaster } from "react-hot-toast";

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [inventoryData, setInventoryData] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
  const token = localStorage.getItem("token");

  const fetchProductData = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/products/${productId}`);
      const data = res.data;
      setProductData(data);
      setSelectedImage(data?.productImageUrl || data?.images?.[0] || "");
    } catch (err) {
      console.error("Không thể tải sản phẩm:", err);
      toast.error("Không thể tải sản phẩm!");
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/products/${productId}/inventory`);
      setInventoryData(res.data);
      if (res.data.length > 0) setSelectedSize(res.data[0].size);
    } catch (err) {
      console.error("Không thể tải tồn kho:", err);
      toast.error("Không thể tải tồn kho!");
    }
  };

  useEffect(() => {
    fetchProductData();
    fetchInventory();
    window.scrollTo(0, 0);
  }, [productId]);

  const handleAddToCart = async () => {
    if (!token) {
      toast.error("Vui lòng đăng nhập trước khi thêm sản phẩm!");
      return;
    }
    if (!selectedSize) {
      toast.error("Vui lòng chọn size!");
      return;
    }
    const selectedInventory = inventoryData.find((inv) => inv.size === selectedSize);
    if (!selectedInventory) {
      toast.error("Size không hợp lệ!");
      return;
    }
    if (selectedInventory.stockQuantity <= 0) {
      toast.error("Size này đã hết hàng!");
      return;
    }
    if (quantity > selectedInventory.stockQuantity) {
      toast.error(`Chỉ còn ${selectedInventory.stockQuantity} sản phẩm!`);
      return;
    }

    setAdding(true);
    try {
      await axios.post(
        `${backendURL}/api/carts/add`,
        { productInventoryId: selectedInventory.productInventoryId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Lỗi khi thêm vào giỏ hàng!");
    } finally {
      setAdding(false);
    }
  };

  const handleImageSelect = (img, idx) => {
    setSelectedImage(img);
    setSelectedImageIndex(idx);
  };

  const handlePrevImage = () => {
    const images = productData?.images || [];
    const newIndex = (selectedImageIndex - 1 + images.length) % images.length;
    setSelectedImage(images[newIndex]);
    setSelectedImageIndex(newIndex);
  };

  const handleNextImage = () => {
    const images = productData?.images || [];
    const newIndex = (selectedImageIndex + 1) % images.length;
    setSelectedImage(images[newIndex]);
    setSelectedImageIndex(newIndex);
  };

  const handleQuantityChange = (delta) => {
    const selectedInventory = inventoryData.find((inv) => inv.size === selectedSize);
    const maxStock = selectedInventory?.stockQuantity || 1;
    const newQuantity = Math.max(1, Math.min(quantity + delta, maxStock));
    setQuantity(newQuantity);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: productData?.productName,
        text: productData?.productDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép link sản phẩm!");
    }
  };

  if (!productData)
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-black mb-4"></div>
          <p className="text-gray-700 font-medium text-lg">Đang tải sản phẩm...</p>
        </div>
      </div>
    );

  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(productData.price);

  const selectedInventory = inventoryData.find((inv) => inv.size === selectedSize);
  const isInStock = selectedInventory?.stockQuantity > 0;
  const stockLevel = selectedInventory?.stockQuantity || 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" reverseOrder={false} toastOptions={{ duration: 3000 }} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => navigate("/")} className="hover:text-black transition-colors">
              Trang chủ
            </button>
            <span>/</span>
            <span className="text-black font-medium">{productData.productName}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden group">
              <div className="aspect-square relative">
                <img
                  src={selectedImage}
                  alt={productData.productName}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    isZoomed ? "scale-150" : "group-hover:scale-105"
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
                
                {/* Image Navigation */}
                {productData?.images?.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-900" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-900" />
                    </button>
                  </>
                )}

                {/* Badge */}
                {!isInStock && (
                  <div className="absolute top-4 left-4 bg-gray-900 text-white px-4 py-2 rounded-full font-medium">
                    Hết hàng
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {productData?.images?.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {productData.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleImageSelect(img, idx)}
                    className={`relative aspect-square rounded-xl overflow-hidden transition-all ${
                      selectedImage === img
                        ? "ring-4 ring-black scale-105 shadow-lg"
                        : "ring-2 ring-gray-200 hover:ring-gray-400"
                    }`}
                  >
                    <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                {productData.productName}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">4.0 (122 đánh giá)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-bold text-gray-900">{formattedPrice}</p>
              </div>
            </div>

            {/* Stock Status */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                {isInStock ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Còn hàng</p>
                      <p className="text-sm text-gray-600">
                        {stockLevel <= 5 ? `Chỉ còn ${stockLevel} sản phẩm` : "Sẵn sàng giao hàng"}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Hết hàng</p>
                      <p className="text-sm text-gray-600">Vui lòng chọn size khác</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Size Selection */}
            {inventoryData.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-lg text-gray-900">Chọn size:</p>
                  <button className="text-sm text-gray-600 hover:text-black flex items-center gap-1">
                    <Info className="w-4 h-4" />
                    Hướng dẫn chọn size
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {inventoryData.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(item.size)}
                      disabled={item.stock <= 0}
                      className={`relative px-4 py-3 rounded-xl font-medium transition-all ${
                        selectedSize === item.size
                          ? "bg-black text-white shadow-lg ring-2 ring-black ring-offset-2"
                          : item.stock > 0
                          ? "bg-white border-2 border-gray-200 hover:border-gray-400 text-gray-900"
                          : "bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {item.size}
                      {item.stock <= 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-0.5 bg-gray-400 transform rotate-45"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <p className="font-semibold text-lg text-gray-900">Số lượng:</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={!isInStock || quantity >= stockLevel}
                    className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {isInStock && stockLevel <= 10 && (
                  <span className="text-sm text-orange-600 font-medium">
                    Chỉ còn {stockLevel} sản phẩm
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={adding || !isInStock}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                  adding || !isInStock
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {adding ? "ĐANG THÊM..." : isInStock ? "THÊM VÀO GIỎ HÀNG" : "HẾT HÀNG"}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    isFavorite
                      ? "bg-red-50 text-red-600 border-2 border-red-600"
                      : "bg-white border-2 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-600" : ""}`} />
                  Yêu thích
                </button>
                <button
                  onClick={handleShare}
                  className="py-3 rounded-xl font-medium bg-white border-2 border-gray-200 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Chia sẻ
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <Truck className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Miễn phí vận chuyển</p>
                  <p className="text-sm text-gray-600">Cho đơn hàng trên 500.000đ</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <RefreshCw className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Đổi trả dễ dàng</p>
                  <p className="text-sm text-gray-600">Trong vòng 7 ngày</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <Shield className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sản phẩm chính hãng</p>
                  <p className="text-sm text-gray-600">100% authentic</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("description")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "description"
                    ? "text-black border-b-4 border-black bg-gray-50"
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                }`}
              >
                Mô tả sản phẩm
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "reviews"
                    ? "text-black border-b-4 border-black bg-gray-50"
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                }`}
              >
                Đánh giá (122)
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "shipping"
                    ? "text-black border-b-4 border-black bg-gray-50"
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                }`}
              >
                Vận chuyển
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === "description" && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {productData.productDescription}
                  </p>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="text-center py-8">
                  <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600">Chưa có đánh giá nào</p>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-4 text-gray-700">
                  <p>• Giao hàng toàn quốc</p>
                  <p>• Thời gian giao hàng: 2-5 ngày làm việc</p>
                  <p>• Miễn phí ship cho đơn hàng trên 500.000đ</p>
                  <p>• Hỗ trợ thanh toán khi nhận hàng (COD)</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <RelatedProducts
            categoryName={productData?.categoryName || ""}
            subCategoryName={productData?.subCategoryName || ""}
          />
        </div>
      </div>
    </div>
  );
};

export default Product;