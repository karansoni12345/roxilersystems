import React, { useState, useEffect } from "react";
import axios from "axios";

function TransactionsTable({ selectedMonth }) {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch transactions from the API
  const fetchTransactions = async (queryParams = {}) => {
    try {
      const params = {
        page,
        perPage: 10,
        month: selectedMonth,
        ...queryParams, // Merge any additional query parameters
      };

      const response = await axios.get("http://localhost:5000/api/transactions", { params });
      setTransactions(response.data.transactions);
      setTotalPages(Math.ceil(response.data.total / 10)); // Calculate total pages
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Fetch transactions when the selected month, search input, or page changes
  useEffect(() => {
    const queryParams = search.trim() ? { search: search.trim() } : {};
    fetchTransactions(queryParams);
  }, [selectedMonth, search, page]);

  // Handle input changes in the search box
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    // Reset to the first page whenever the search input changes
    if (value === "") {
      setPage(1); // Reset to page 1
      fetchTransactions(); // Explicitly fetch default data
    }
  };

  return (
    <div className="mb-4">
      <h3>Transactions</h3>

      {/* Search input */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by title, description, or price..."
        value={search}
        onChange={handleSearchChange}
      />

      {/* Transactions table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id}>
              <td>{txn.title}</td>
              <td>{txn.description}</td>
              <td>${txn.price.toFixed(2)}</td>
              <td>{txn.sold ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-primary"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default TransactionsTable;
