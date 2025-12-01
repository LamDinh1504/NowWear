import React from 'react';
import Title from './Title.jsx';
import { ShoppingBag, Truck, Receipt } from 'lucide-react';

const CartTotal = ({ cartData = [] }) => {
  const delivery_fee = 30000;
  const currency = " VND";
  const free_shipping_threshold = 500000;

  const subtotal = Array.isArray(cartData)
    ? cartData.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0)
    : 0;

  const isFreeShipping = subtotal >= free_shipping_threshold;
  const actualDeliveryFee = isFreeShipping ? 0 : delivery_fee;
  const total = subtotal === 0 ? 0 : subtotal + actualDeliveryFee;

  // Calculate progress for free shipping
  const progress = Math.min((subtotal / free_shipping_threshold) * 100, 100);
  const remainingForFreeShip = Math.max(free_shipping_threshold - subtotal, 0);

  return (
    <div className="w-full relative">
      {/* Decorative corner */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-linear-to-bl from-gray-100 to-transparent rounded-full opacity-50 pointer-events-none"></div>
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-lg">
            <Receipt className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            TỔNG <span className="font-normal text-gray-600">TIỀN</span>
          </h2>
        </div>

        {/* Cart items count */}
        <div className="mb-5 p-3 bg-linear-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">
              {cartData.length} sản phẩm
            </p>
            <p className="text-xs text-gray-500">trong giỏ hàng</p>
          </div>
        </div>

        {/* Free shipping progress */}
        {!isFreeShipping && subtotal > 0 && (
          <div className="mb-5 p-4 bg-linear-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4 text-amber-700" />
                <p className="text-xs font-bold text-amber-900">
                  Mua thêm {remainingForFreeShip.toLocaleString('vi-VN')}{currency} để được miễn phí ship!
                </p>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                >
                  <div className="w-full h-full bg-linear-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isFreeShipping && (
          <div className="mb-5 p-4 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-green-900">Miễn phí vận chuyển</p>
                <p className="text-xs text-green-700">Đơn hàng đủ điều kiện</p>
              </div>
            </div>
          </div>
        )}

        {/* Price breakdown */}
        <div className="space-y-4">
          {/* Subtotal */}
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              <p className="font-medium text-gray-600">Tạm tính</p>
            </div>
            <p className="font-bold text-gray-900 text-lg">{subtotal.toLocaleString('vi-VN')}{currency}</p>
          </div>

          {/* Delivery fee */}
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-600" />
              <p className="font-medium text-gray-600">Phí vận chuyển</p>
            </div>
            {isFreeShipping ? (
              <div className="flex items-center gap-2">
                <span className="line-through text-gray-400 text-sm">{delivery_fee.toLocaleString('vi-VN')}{currency}</span>
                <span className="font-bold text-green-600 text-lg">Miễn phí</span>
              </div>
            ) : (
              <p className="font-bold text-gray-900 text-lg">{actualDeliveryFee.toLocaleString('vi-VN')}{currency}</p>
            )}
          </div>

          {/* Total */}
          <div className="mt-6 p-5 bg-linear-to-br from-gray-900 to-gray-800 rounded-xl relative overflow-hidden group">
            {/* Shine effect */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            
            <div className="flex justify-between items-center relative">
              <div>
                <p className="text-sm text-gray-300 mb-1">Tổng thanh toán</p>
                <p className="font-black text-2xl text-white flex items-center gap-2">
                  {total.toLocaleString('vi-VN')}{currency}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Receipt className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Saved amount badge */}
            {isFreeShipping && (
              <div className="mt-3 pt-3 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-xs text-green-300 font-semibold">
                    Bạn đã tiết kiệm được {delivery_fee.toLocaleString('vi-VN')}{currency}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tax note */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
          </svg>
          <span>Giá đã bao gồm VAT</span>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
