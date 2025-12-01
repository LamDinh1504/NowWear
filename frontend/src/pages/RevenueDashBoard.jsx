import React, { useState, useEffect } from "react";
import axios from "axios";
import RevenueChart from "../components/RevenueChart";

const RevenueDashBoard = () => {
  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);
  const [stats, setStats] = useState({ totalIncome: 0, totalOutcome: 0, totalProfit: 0 });

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/revenue");
        setRevenues(res.data);

        // Lấy năm mới nhất làm mặc định
        const years = [...new Set(res.data.map((r) => r.revenueYear))].sort((a, b) => b - a);
        setSelectedYear(years[0] || null);
      } catch (err) {
        console.error("Lỗi fetch revenue:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  const filteredRevenues = revenues.filter((r) => r.revenueYear === selectedYear);
  const years = [...new Set(revenues.map((r) => r.revenueYear))].sort((a, b) => b - a);

  // Tính toán thống kê
  useEffect(() => {
    if (filteredRevenues.length > 0) {
      const totalIncome = filteredRevenues.reduce((sum, r) => sum + r.income, 0);
      const totalOutcome = filteredRevenues.reduce((sum, r) => sum + r.outcome, 0);
      setStats({
        totalIncome,
        totalOutcome,
        totalProfit: totalIncome - totalOutcome
      });
    }
  }, [selectedYear, revenues]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📊 Báo Cáo Doanh Thu
          </h1>
          <p className="text-gray-600">Theo dõi và phân tích hiệu quả kinh doanh</p>
        </div>

        {/* Year Selector */}
        {years.length > 0 && (
          <div className="mb-6 flex items-center gap-4 bg-white rounded-xl shadow-sm p-4">
            <label className="text-gray-700 font-semibold flex items-center gap-2">
              <span className="text-2xl">📅</span>
              Năm:
            </label>
            <select
              value={selectedYear || ""}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border-2 border-indigo-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-700 font-medium cursor-pointer hover:border-indigo-300 transition-colors"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : filteredRevenues.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg">Chưa có dữ liệu cho năm này</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Income */}
              <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold opacity-90">Tổng Thu Nhập</h3>
                  <span className="text-3xl">💰</span>
                </div>
                <p className="text-3xl font-bold mb-1">
                  {stats.totalIncome.toLocaleString()} ₫
                </p>
                <p className="text-sm opacity-80">
                  {filteredRevenues.length} tháng
                </p>
              </div>

              {/* Total Outcome */}
              <div className="bg-linear-to-br from-red-500 to-pink-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold opacity-90">Tổng Chi Phí</h3>
                  <span className="text-3xl">💸</span>
                </div>
                <p className="text-3xl font-bold mb-1">
                  {stats.totalOutcome.toLocaleString()} ₫
                </p>
                <p className="text-sm opacity-80">
                  Hoạt động & vận hành
                </p>
              </div>

              {/* Total Profit */}
              <div className="bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold opacity-90">Lợi Nhuận</h3>
                  <span className="text-3xl">📈</span>
                </div>
                <p className="text-3xl font-bold mb-1">
                  {stats.totalProfit.toLocaleString()} ₫
                </p>
                <p className="text-sm opacity-80">
                  {stats.totalIncome > 0 ? ((stats.totalProfit / stats.totalIncome) * 100).toFixed(1) : 0}% biên lợi nhuận
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📉</span>
                Biểu Đồ Doanh Thu Năm {selectedYear}
              </h2>
              <RevenueChart data={filteredRevenues} />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 bg-linear-to-r from-indigo-500 to-purple-600">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span>📋</span>
                  Chi Tiết Theo Tháng
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Tháng
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Thu Nhập
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Chi Phí
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Lợi Nhuận
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Tỷ Lệ LN
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredRevenues.map((r, index) => {
                      const profit = r.income - r.outcome;
                      const profitMargin = r.income > 0 ? ((profit / r.income) * 100).toFixed(1) : 0;
                      return (
                        <tr 
                          key={r.revenueId} 
                          className={`hover:bg-indigo-50 transition-colors ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800">
                              Tháng {r.revenueMonth}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-green-600 font-semibold">
                            {r.income.toLocaleString()} ₫
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-red-600 font-semibold">
                            {r.outcome.toLocaleString()} ₫
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className={`font-bold text-lg ${
                              profit >= 0 ? 'text-blue-600' : 'text-red-600'
                            }`}>
                              {profit.toLocaleString()} ₫
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                              parseFloat(profitMargin) >= 20 
                                ? 'bg-green-100 text-green-800' 
                                : parseFloat(profitMargin) >= 10
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {profitMargin}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-indigo-50 font-bold border-t-2 border-indigo-200">
                      <td className="px-6 py-4 text-gray-800">
                        Tổng Cộng
                      </td>
                      <td className="px-6 py-4 text-right text-green-700">
                        {stats.totalIncome.toLocaleString()} ₫
                      </td>
                      <td className="px-6 py-4 text-right text-red-700">
                        {stats.totalOutcome.toLocaleString()} ₫
                      </td>
                      <td className="px-6 py-4 text-right text-blue-700 text-lg">
                        {stats.totalProfit.toLocaleString()} ₫
                      </td>
                      <td className="px-6 py-4 text-center text-indigo-700">
                        {stats.totalIncome > 0 ? ((stats.totalProfit / stats.totalIncome) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RevenueDashBoard;
