const express = require("express");
const axios = require("axios");
const Transaction = require("../models/Transaction");

const router = express.Router();

// Initialize Database
router.get("/initialize", async (req, res) => {
    try {
      const { data } = await axios.get(
        "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
      );
  
      // Add the month field to each transaction data item
      const updatedData = data.map((transaction) => {
        const transactionDate = new Date(transaction.dateOfSale); // Assuming there is a `date` field
        const month = transactionDate.getMonth() + 1; // getMonth() returns 0-based month (0 = January, 11 = December)
        // Add the month as a new field in the transaction object
        return {
          ...transaction,
          month: month,
        };
      });
  
      // Clear existing data
      await Transaction.deleteMany();
  
      // Insert the updated data
      await Transaction.insertMany(updatedData);
  
      res.status(200).send("Database initialized successfully");
    } catch (err) {
      res.status(500).send("Error initializing database");
    }
});

// Get Transactions
router.get("/transactions", async (req, res) => {
    const { page = 1, perPage = 10, search = "", month } = req.query;
  
    // Create the query object
    const query = {};
  
    // Add search filters (case-insensitive)
    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        // Ensure price is parsed as a number; skip invalid searches
        { price: isNaN(parseFloat(search)) ? null : parseFloat(search) },
      ];
    }
  
    // Add month filter (if provided)
    if (month) {
      query.month = month;
    }
  
    try {
      // Fetch transactions based on query, pagination, and sorting
      const transactions = await Transaction.find(query)
        .skip((page - 1) * perPage) // Skip records for pagination
        .limit(+perPage) // Limit to the number of items per page
        .sort({ dateOfSale: -1 }); // Sort transactions by date (most recent first)
  
      // Fetch total count of matching records
      const total = await Transaction.countDocuments(query);
  
      // Respond with transactions and total count
      res.status(200).json({
        transactions,
        total,
        currentPage: +page,
        totalPages: Math.ceil(total / perPage),
      });
    } catch (err) {
      console.error("Error fetching transactions:", err);
      res.status(500).json({ error: "Error fetching transactions" });
    }
  });

// Statistics API
router.get("/statistics", async (req, res) => {
  const { month } = req.query;
  if (!month) return res.status(400).send("Month is required");

  try {
    const transactions = await Transaction.find({
      month: month,
    });

    const totalSales = transactions.reduce((acc, item) => acc + item.price, 0);
    const soldItems = transactions.filter((item) => item.sold).length;
    const unsoldItems = transactions.filter((item) => !item.sold).length;

    res.status(200).json({ totalSales, soldItems, unsoldItems });
  } catch (err) {
    res.status(500).send("Error fetching statistics");
  }
});

// Bar Chart API
router.get("/bar-chart", async (req, res) => {
  const { month } = req.query;
  if (!month) return res.status(400).send("Month is required");

  try {
    const transactions = await Transaction.find({
      month: month,
    });

    const ranges = [
      [0, 100],
      [101, 200],
      [201, 300],
      [301, 400],
      [401, 500],
      [501, 600],
      [601, 700],
      [701, 800],
      [801, 900],
      [901, Infinity],
    ];

    const barData = ranges.map(([min, max]) => ({
      range: `${min}-${max === Infinity ? "above" : max}`,
      count: transactions.filter((item) => item.price >= min && item.price <= max)
        .length,
    }));

    res.status(200).json(barData);
  } catch (err) {
    res.status(500).send("Error fetching bar chart data");
  }
});

// Pie Chart API
router.get("/pie-chart", async (req, res) => {
  const { month } = req.query;
  if (!month) return res.status(400).send("Month is required");

  try {
    const transactions = await Transaction.find({
      month: month,
    });

    const categoryCounts = transactions.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    const pieData = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    }));

    res.status(200).json(pieData);
  } catch (err) {
    res.status(500).send("Error fetching pie chart data");
  }
});

// Combined API
router.get("/combined", async (req, res) => {
  const { month } = req.query;
  try {
    const [transactions, statistics, barChart, pieChart] = await Promise.all([
      Transaction.find({}),
      axios.get(`http://localhost:5000/api/statistics?month=${month}`),
      axios.get(`http://localhost:5000/api/bar-chart?month=${month}`),
      axios.get(`http://localhost:5000/api/pie-chart?month=${month}`),
    ]);

    res.status(200).json({
      transactions,
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data,
    });
  } catch (err) {
    res.status(500).send("Error fetching combined data");
  }
});

module.exports = router;
