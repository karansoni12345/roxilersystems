import React, { useState, useEffect } from "react";
import axios from "axios";

function Statistics({ selectedMonth }) {
  const [stats, setStats] = useState({ totalSales: 0, soldItems: 0, unsoldItems: 0 });

  const fetchStatistics = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/statistics", {
        params: { month: selectedMonth },
      });
      setStats(data);
    } catch (error) {
      console.error("Error fetching statistics", error);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [selectedMonth]);

  return (
    <div className="mb-4">
      <h3>Statistics</h3>
      <div className="d-flex gap-4">
        <div>Total Sales: ${stats.totalSales.toFixed(2)}</div>
        <div>Sold Items: {stats.soldItems}</div>
        <div>Unsold Items: {stats.unsoldItems}</div>
      </div>
    </div>
  );
}

export default Statistics;
