import React, { useState } from "react";
import TransactionsTable from "./components/TransactionsTable";
import Statistics from "./components/Statistics";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [selectedMonth, setSelectedMonth] = useState(3); // Default: March

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center">MERN Stack Coding Challenge</h1>

      <div className="mb-4">
        <label htmlFor="month-select" className="form-label">
          Select Month:
        </label>
        <select
          id="month-select"
          className="form-select"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
            <option key={month} value={month}>
              {new Date(2023, month - 1).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
      </div>

      <TransactionsTable selectedMonth={selectedMonth} />
      <Statistics selectedMonth={selectedMonth} />
      <div className="row">
        <div className="col-md-6">
          <BarChart selectedMonth={selectedMonth} />
        </div>
        <div className="col-md-6">
          <PieChart selectedMonth={selectedMonth} />
        </div>
      </div>
    </div>
  );
}

export default App;
