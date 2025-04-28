const express = require('express');
const router = express.Router();
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
  const page = parseInt(req.query.page) || 1; // Default page is 1 if not provided
  const limit = parseInt(req.query.limit) || 10; // Default limit is 10 invoices per page
  const offset = (page - 1) * limit;

  // Query to get the invoices with pagination
  const query = `
    SELECT invoices.id, invoices.invoice_date, invoices.due_date, invoices.total, 
           customers.name AS customer_name, invoices.status
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    LIMIT ? OFFSET ?
  `;

  db.all(query, [limit, offset], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Count total number of invoices for pagination
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM invoices
    `;
    db.get(countQuery, [], (err, countRow) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const totalInvoices = countRow.total;
      const totalPages = Math.ceil(totalInvoices / limit);

      res.json({
        invoices: rows,
        pagination: {
          currentPage: page,
          totalPages,
          totalInvoices
        }
      });
    });
  });
});

router.get('/api/invoices/:id', (req, res) => {
  const invoiceId = req.params.id;
  const query = `
    SELECT invoices.id, invoices.invoice_date, invoices.due_date, invoices.total, 
           invoices.status, customers.name AS customer_name, customers.phone, customers.email,
           invoice_items.item_id, invoice_items.quantity, invoice_items.rate, invoice_items.amount
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    LEFT JOIN invoice_items ON invoices.id = invoice_items.invoice_id
    WHERE invoices.id = ?
  `;

  db.get(query, [invoiceId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json({ invoice: row });
  });
});


router.put('/api/invoices/:id', (req, res) => {
  const invoiceId = req.params.id;
  const { due_date, total, status } = req.body;

  const query = `
    UPDATE invoices
    SET due_date = ?, total = ?, status = ?
    WHERE id = ?
  `;

  db.run(query, [due_date, total, status, invoiceId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Invoice updated successfully' });
  });
});


router.delete('/api/invoices/:id', (req, res) => {
  const invoiceId = req.params.id;

  const query = `
    DELETE FROM invoices
    WHERE id = ?
  `;

  db.run(query, [invoiceId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Invoice deleted successfully' });
  });
});

router.patch('/api/invoices/:id/status', (req, res) => {
  const invoiceId = req.params.id;
  const { status } = req.body; // 'paid' or 'unpaid'

  const query = `
    UPDATE invoices
    SET status = ?
    WHERE id = ?
  `;

  db.run(query, [status, invoiceId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Invoice status updated successfully' });
  });
});



module.exports = router;
