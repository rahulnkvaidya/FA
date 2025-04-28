const express = require('express');
const router = express.Router();
const axios = require('axios');
const _ = require("underscore");
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let dbPath = "";


dbPath = path.join(__dirname, '../accounting.db');


console.log("Database Path:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database opening error:", err.message);
  } else {
    console.log("Database opened successfully");
  }
});

router.get('/list', (req, res) => {
  const { page = 1, count = 10 } = req.query; // Default page is 1, count is 10

  const offset = (page - 1) * count;

  db.all("SELECT * FROM customers LIMIT ? OFFSET ?", [count, offset], (err, rows) => {
    if (err) return res.status(500).send(err.message);

    // Get the total count of customers
    db.get("SELECT COUNT(*) AS total FROM customers", [], (err, result) => {
      if (err) return res.status(500).send(err.message);

      const total = result.total;
      const totalPages = Math.ceil(total / count);
      console.log('hello')
      res.json({
        page: parseInt(page),
        count: parseInt(count),
        totalPages,
        total,
        customers: rows
      });
    });
  });
});

router.post('/new', (req, res) => {
  const { name, phone, email, address } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  db.run(
    `INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)`,
    [name, phone, email, address],
    function (err) {
      if (err) return res.status(500).send(err.message);

      res.json({ id: this.lastID, message: "Customer added successfully" });
    }
  );
});

router.get('/:id', (req, res) => {
  const id = req.params.id;

  const query = `SELECT * FROM customers WHERE id = ?`;

  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ message: 'Database query error' });
    }

    if (!row) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(row);
  });
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { name, phone, email, address } = req.body;

  const query = `
      UPDATE customers
      SET name = ?, phone = ?, email = ?, address = ?
      WHERE id = ?
  `;

  db.run(query, [name, phone, email, address, id], function (err) {
    if (err) {
      console.error('Error updating customer:', err);
      return res.status(500).json({ message: 'Database update error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Customer updated successfully' });
  });
});


module.exports = router;