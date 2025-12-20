import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueChart = ({ data }) => {
  const months = data.map((r) => `${r.revenueMonth}/${r.revenueYear}`);
  const income = data.map((r) => r.income);
  const outcome = data.map((r) => r.outcome);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Thu nhập",
        data: income,
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
      {
        label: "Chi phí",
        data: outcome,
        backgroundColor: "rgba(255, 99, 132, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Biểu đồ doanh thu theo tháng" },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default RevenueChart;

