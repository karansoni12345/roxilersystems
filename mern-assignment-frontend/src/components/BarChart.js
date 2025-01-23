import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function BarChart({ selectedMonth }) {
  const [data, setData] = useState([]);

  const fetchBarChartData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/bar-chart?month=${selectedMonth}`);
      const chartData = await response.json();
      setData(chartData);
    } catch (error) {
      console.error("Error fetching bar chart data", error);
    }
  };

  useEffect(() => {
    fetchBarChartData();
  }, [selectedMonth]);

  const chartData = {
    labels: data.map((d) => d.range),
    datasets: [
      {
        label: "Items",
        data: data.map((d) => d.count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return <Bar data={chartData} />;
}

export default BarChart;
