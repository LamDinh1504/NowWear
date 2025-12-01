// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Bar } from "react-chartjs-2";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const RevenueChart = () => {
//   const [revenueData, setRevenueData] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:8080/api/revenue") // backend URL
//       .then((res) => {
//         setRevenueData(res.data);
//       })
//       .catch((err) => console.error(err));
//   }, []);

//   // Xử lý dữ liệu để đưa vào biểu đồ
//   const months = revenueData.map((r) => `${r.revenueMonth}/${r.revenueYear}`);
//   const income = revenueData.map((r) => r.income);
//   const outcome = revenueData.map((r) => r.outcome);

//   const data = {
//     labels: months,
//     datasets: [
//       {
//         label: "Income",
//         data: income,
//         backgroundColor: "rgba(75, 192, 192, 0.7)",
//       },
//       {
//         label: "Outcome",
//         data: outcome,
//         backgroundColor: "rgba(255, 99, 132, 0.7)",
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       title: {
//         display: true,
//         text: "Monthly Revenue Chart",
//       },
//     },
//   };

//   return <Bar data={data} options={options} />;
// };

// export default RevenueChart;

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

