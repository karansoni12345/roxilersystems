import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ selectedMonth }) {
  const [data, setData] = useState([]);

  const fetchPieChartData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/pie-chart?month=${selectedMonth}`);
      const pieData = await response.json();
      setData(pieData);
    } catch (error) {
      console.error("Error fetching pie chart data", error);
    }
  };

  useEffect(() => {
    fetchPieChartData();
  }, [selectedMonth]);

  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#66BB6A",
          "#9575CD",
          "#FF7043",
        ],
      },
    ],
  };

  return <Pie data={chartData} />;
}

export default PieChart;
