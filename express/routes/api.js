const express = require('express');
const router = express.Router();
const axios = require('axios');
const _ = require("underscore");
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

dbPath = path.join(__dirname, '../accounting.db');


console.log("Database Path:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database opening error:", err.message);
  } else {
    console.log("Database opened successfully");
  }
});


router.get('/customers', (req, res) => {
  const { page = 1, count = 10 } = req.query; // Default page is 1, count is 10

  const offset = (page - 1) * count;

  db.all("SELECT * FROM customers LIMIT ? OFFSET ?", [count, offset], (err, rows) => {
    if (err) return res.status(500).send(err.message);

    // Get the total count of customers
    db.get("SELECT COUNT(*) AS total FROM customers", [], (err, result) => {
      if (err) return res.status(500).send(err.message);

      const total = result.total;
      const totalPages = Math.ceil(total / count);

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

router.post('/items', (req, res) => {
  console.log('items')
  const { name, description, unit, gst_rate } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const query = `
    INSERT INTO items (name, description, unit, gst_rate)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [name, description, unit, gst_rate], function (err) {
    if (err) {
      console.error('Error inserting item:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(201).json({
      message: 'Item added successfully',
      itemId: this.lastID
    });
  });
});

router.get('/items', (req, res) => {
  const { page = 1, count = 10 } = req.query; // Default page is 1, count is 10

  const offset = (page - 1) * count;

  db.all("SELECT * FROM items LIMIT ? OFFSET ?", [count, offset], (err, rows) => {
    if (err) return res.status(500).send(err.message);

    // Get the total count of items
    db.get("SELECT COUNT(*) AS total FROM items", [], (err, result) => {
      if (err) return res.status(500).send(err.message);

      const total = result.total;
      const totalPages = Math.ceil(total / count);

      res.json({
        page: parseInt(page),
        count: parseInt(count),
        totalPages,
        total,
        items: rows
      });
    });
  });
});

router.get("/itemrates", (req, res) => {
  const customerId = req.query.customer_id;

  if (!customerId) {
    return res.status(400).json({ error: "customer_id is required" });
  }

  const query = `
    SELECT 
      items.id AS item_id,
      items.name AS item_name,
      items.unit,
      items.gst_rate,
      rates.rate
    FROM items
    LEFT JOIN rates 
      ON items.id = rates.item_id AND rates.customer_id = ?
  `;

  db.all(query, [customerId], (err, rows) => {
    if (err) {
      console.error("Error fetching item rates:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.json(rows);
  });
});

router.get('/rates', (req, res) => {
  const { page = 1, count = 10, customerId, itemId } = req.query; // Default page is 1, count is 10

  const offset = (page - 1) * count;

  let query = "SELECT * FROM rates";
  let params = [count, offset];

  if (customerId) {
    query += " WHERE customer_id = ?";
    params.unshift(customerId);
  }

  if (itemId) {
    query += customerId ? " AND item_id = ?" : " WHERE item_id = ?";
    params.unshift(itemId);
  }

  query += " LIMIT ? OFFSET ?";

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).send(err.message);

    // Get the total count of rates
    db.get("SELECT COUNT(*) AS total FROM rates", [], (err, result) => {
      if (err) return res.status(500).send(err.message);

      const total = result.total;
      const totalPages = Math.ceil(total / count);

      res.json({
        page: parseInt(page),
        count: parseInt(count),
        totalPages,
        total,
        rates: rows
      });
    });
  });
});

router.get('/transactions', (req, res) => {
  const { page = 1, count = 10 } = req.query; // Default page is 1, count is 10

  const offset = (page - 1) * count;

  db.all("SELECT * FROM transactions LIMIT ? OFFSET ?", [count, offset], (err, rows) => {
    if (err) return res.status(500).send(err.message);

    // Get the total count of transactions
    db.get("SELECT COUNT(*) AS total FROM transactions", [], (err, result) => {
      if (err) return res.status(500).send(err.message);

      const total = result.total;
      const totalPages = Math.ceil(total / count);

      res.json({
        page: parseInt(page),
        count: parseInt(count),
        totalPages,
        total,
        transactions: rows
      });
    });
  });
});

router.get('/transaction-entries', (req, res) => {
  const { page = 1, count = 10, ledgerId, fromDate, toDate } = req.query;

  const offset = (page - 1) * count;
  const params = [];
  let whereClauses = [];

  if (ledgerId) {
    whereClauses.push("ledger_id = ?");
    params.push(ledgerId);
  }

  if (fromDate) {
    whereClauses.push("transaction_id IN (SELECT id FROM transactions WHERE date >= ?)");
    params.push(fromDate);
  }

  if (toDate) {
    whereClauses.push("transaction_id IN (SELECT id FROM transactions WHERE date <= ?)");
    params.push(toDate);
  }

  const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const query = `SELECT * FROM transaction_entries ${whereSQL} LIMIT ? OFFSET ?`;
  params.push(count, offset);

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).send(err.message);

    // Get the total count for pagination
    const countQuery = `SELECT COUNT(*) AS total FROM transaction_entries ${whereSQL}`;
    db.get(countQuery, params.slice(0, -2), (err, result) => {
      if (err) return res.status(500).send(err.message);

      const total = result.total;
      const totalPages = Math.ceil(total / count);

      res.json({
        page: parseInt(page),
        count: parseInt(count),
        totalPages,
        total,
        transactionEntries: rows,
      });
    });
  });
});


// Add a new transaction (voucher)
router.post("/transactions", (req, res) => {
  const { date, voucher_type, narration, entries } = req.body;

  // Insert the transaction
  const sql = `INSERT INTO transactions (date, voucher_type, narration) VALUES (?, ?, ?)`;
  db.run(sql, [date, voucher_type, narration], function (err) {
    if (err) {
      return res.status(500).json({ error: "Failed to add transaction" });
    }

    const transactionId = this.lastID;

    // Insert the entries
    const entrySql = `INSERT INTO transaction_entries (transaction_id, ledger_id, type, amount) VALUES (?, ?, ?, ?)`;
    const promises = entries.map((entry) => {
      return new Promise((resolve, reject) => {
        db.run(entrySql, [transactionId, entry.ledger_id, entry.type, entry.amount], function (err) {
          if (err) reject(err);
          resolve();
        });
      });
    });

    Promise.all(promises)
      .then(() => {
        res.status(200).json({ message: "Transaction added successfully", transactionId });
      })
      .catch((err) => {
        res.status(500).json({ error: "Failed to add transaction entries" });
      });
  });
});


router.get('/invoices', (req, res) => {
  const { page = 1, count = 10, customerId } = req.query;

  const offset = (page - 1) * count;

  let query = `
    SELECT 
      invoices.*, 
      customers.name AS customer_name,
      ledgers.name AS ledger_name
    FROM invoices
    LEFT JOIN customers ON invoices.ledger_id = customers.id
    LEFT JOIN ledgers ON invoices.ledger_id = ledgers.id
  `;
  let params = [];

  if (customerId) {
    query += " WHERE invoices.ledger_id = ?";
    params.push(customerId);
  }

  query += " LIMIT ? OFFSET ?";
  params.push(parseInt(count), parseInt(offset));

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).send(err.message);

    let countQuery = "SELECT COUNT(*) AS total FROM invoices";
    let countParams = [];

    if (customerId) {
      countQuery += " WHERE ledger_id = ?";
      countParams.push(customerId);
    }

    db.get(countQuery, countParams, (err, result) => {
      if (err) return res.status(500).send(err.message);

      const total = result.total;
      const totalPages = Math.ceil(total / count);

      res.json({
        page: parseInt(page),
        count: parseInt(count),
        totalPages,
        total,
        invoices: rows
      });
    });
  });
});



router.get('/invoice-items', (req, res) => {
  const { page = 1, count = 10 } = req.query; // Default page is 1, count is 10

  const offset = (page - 1) * count;

  db.all("SELECT * FROM invoice_items LIMIT ? OFFSET ?", [count, offset], (err, rows) => {
    if (err) return res.status(500).send(err.message);

    // Get the total count of invoice items
    db.get("SELECT COUNT(*) AS total FROM invoice_items", [], (err, result) => {
      if (err) return res.status(500).send(err.message);

      const total = result.total;
      const totalPages = Math.ceil(total / count);

      res.json({
        page: parseInt(page),
        count: parseInt(count),
        totalPages,
        total,
        invoiceItems: rows
      });
    });
  });
});



router.post('/payment-voucher', (req, res) => {
  const { supplier_id, amount, payment_method, payment_date, narration } = req.body;
  console.log(req.body);

  if (!supplier_id || !amount || !payment_method || !payment_date) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const paymentLedgerName = payment_method.toLowerCase() === 'cash' ? 'Cash' : 'Bank';

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // Step 1: Insert into transactions table
    db.run(`
      INSERT INTO transactions (date, voucher_type, narration)
      VALUES (?, 'payment', ?)
    `, [payment_date, narration || `Payment to supplier ID ${supplier_id}`], function (err) {
      if (err) {
        console.error('Transaction Insert Error:', err.message);
        db.run('ROLLBACK');
        return res.status(500).json({ message: 'Error creating transaction.', error: err.message });
      }

      const transactionId = this.lastID;
      console.log('Transaction created with ID:', transactionId);

      // Step 2: Insert supplier ledger DEBIT entry
      db.run(`
        INSERT INTO transaction_entries (transaction_id, ledger_id, type, amount)
        VALUES (?, ?, 'debit', ?)
      `, [transactionId, supplier_id, amount], function (err) {
        if (err) {
          console.error('Supplier Debit Entry Error:', err.message);
          db.run('ROLLBACK');
          return res.status(500).json({ message: 'Error inserting supplier debit.', error: err.message });
        }

        // Step 3: Get Cash/Bank Ledger ID
        db.get(`SELECT id FROM ledgers WHERE name = ? LIMIT 1`, [paymentLedgerName], (err, ledgerRow) => {
          if (err || !ledgerRow) {
            console.error('Ledger Fetch Error:', err ? err.message : 'Ledger not found');
            db.run('ROLLBACK');
            return res.status(500).json({ message: 'Payment ledger not found.', error: err ? err.message : 'Ledger not found' });
          }

          const paymentLedgerId = ledgerRow.id;

          // Step 4: Insert Cash/Bank ledger CREDIT entry
          db.run(`
            INSERT INTO transaction_entries (transaction_id, ledger_id, type, amount)
            VALUES (?, ?, 'credit', ?)
          `, [transactionId, paymentLedgerId, amount], function (err) {
            if (err) {
              console.error('Payment Ledger Credit Entry Error:', err.message);
              db.run('ROLLBACK');
              return res.status(500).json({ message: 'Error inserting payment ledger credit.', error: err.message });
            }

            // Final Step: Commit transaction
            db.run('COMMIT', (err) => {
              if (err) {
                console.error('Commit Error:', err.message);
                db.run('ROLLBACK');
                return res.status(500).json({ message: 'Error committing transaction.', error: err.message });
              }

              console.log('Payment Voucher Successfully Recorded.');
              return res.status(201).json({ message: 'Payment voucher recorded successfully.', transaction_id: transactionId });
            });
          });
        });
      });
    });
  });
});

router.get('/day-book', (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'Date is required.' });
  }

  const query = `
    SELECT 
      t.date,
      l.name as particulars,
      t.voucher_type,
      te.type,
      te.amount
    FROM transaction_entries te
    JOIN transactions t ON te.transaction_id = t.id
    JOIN ledgers l ON te.ledger_id = l.id
    WHERE t.date = ?
    ORDER BY t.date, t.id
  `;

  db.all(query, [date], (err, rows) => {
    if (err) {
      console.error('Day Book Fetch Error:', err.message);
      return res.status(500).json({ message: 'Error fetching day book.', error: err.message });
    }

    const transactions = rows.map((row) => ({
      date: row.date,
      particulars: row.particulars,
      voucher_type: row.voucher_type,
      debit_amount: row.type === 'debit' ? row.amount : null,
      credit_amount: row.type === 'credit' ? row.amount : null,
    }));

    res.json({ transactions });
  });
});


router.post('/sales-voucher', async (req, res) => {
  const { ledger_id, items, invoice_date, due_date } = req.body;

  if (!ledger_id || !items || items.length === 0 || !invoice_date) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      db.run(
        `INSERT INTO invoices (ledger_id, invoice_date, due_date, total) VALUES (?, ?, ?, ?)`,
        [ledger_id, invoice_date, due_date, 0],
        function (err) {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ message: 'Error creating invoice.', error: err.message });
          }

          const invoiceId = this.lastID;
          let totalAmount = 0;

          const insertItem = db.prepare(`
            INSERT INTO invoice_items (invoice_id, item_id, quantity, rate, amount)
            VALUES (?, ?, ?, ?, ?)
          `);

          items.forEach((item) => {
            const itemAmount = item.quantity * item.rate;
            totalAmount += itemAmount;
            insertItem.run(invoiceId, item.item_id, item.quantity, item.rate, itemAmount);
          });

          insertItem.finalize();

          db.run(`UPDATE invoices SET total = ? WHERE id = ?`, [totalAmount, invoiceId]);

          db.run(
            `INSERT INTO transactions (date, voucher_type, narration) VALUES (?, ?, ?)`,
            [invoice_date, 'sales', `Sale to customer ID: ${ledger_id}`],
            function (err) {
              if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ message: 'Error creating transaction.', error: err.message });
              }

              const transactionId = this.lastID;

              const insertEntry = db.prepare(`
                INSERT INTO transaction_entries (transaction_id, ledger_id, type, amount)
                VALUES (?, ?, ?, ?)
              `);

              // Debit Customer
              insertEntry.run(transactionId, ledger_id, 'debit', totalAmount);

              // Credit Sales Ledger
              db.get(`SELECT id FROM ledgers WHERE name = ?`, ['Sales'], (err, salesLedger) => {
                if (err || !salesLedger) {
                  db.run('ROLLBACK');
                  return res.status(500).json({ message: 'Sales Ledger not found.' });
                }

                insertEntry.run(transactionId, salesLedger.id, 'credit', totalAmount);

                insertEntry.finalize();
                db.run('COMMIT');
                return res.status(201).json({ message: 'Sales voucher created successfully.' });
              });
            }
          );
        }
      );
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating sales voucher.', error: error.message });
  }
});

router.get('/customers-with-balance', (req, res) => {
  try {
    // Query to get all customers with their balances
    db.serialize(() => {
      const query = `
        SELECT 
          c.id AS customer_id,
          c.name AS customer_name,
          SUM(CASE WHEN te.type = 'debit' THEN te.amount ELSE 0 END) - 
          SUM(CASE WHEN te.type = 'credit' THEN te.amount ELSE 0 END) AS balance
        FROM 
          customers c
        LEFT JOIN 
          ledgers l ON c.id = l.customer_id
        LEFT JOIN 
          transaction_entries te ON l.id = te.ledger_id
        LEFT JOIN 
          transactions t ON te.transaction_id = t.id
        GROUP BY 
          c.id;
      `;

      db.all(query, [], (err, rows) => {
        if (err) {
          throw err;
        }

        // Send the result to the client as JSON
        res.status(200).json(rows);
      });
    });
  } catch (error) {
    console.error('Error fetching customers with balance:', error);
    res.status(500).json({ message: 'Error fetching customers with balance' });
  }
});


router.get('/customer/:id/transactions', async (req, res) => {
  const customerId = req.params.id;

  try {
    // Fetch customer transactions from the database
    const transactions = await Transaction.find({ customer_id: customerId });

    let totalReceivables = 0;
    let totalPayments = 0;

    transactions.forEach(transaction => {
      if (transaction.type === 'invoice') {
        totalReceivables += transaction.amount; // Pending amounts
      } else if (transaction.type === 'payment') {
        totalPayments += transaction.amount; // Payments made
      }
    });

    // Calculate balance
    const balance = totalReceivables - totalPayments;
    res.json({ balance });
  } catch (error) {
    console.error('Error fetching customer transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});


router.post('/receipt-voucher', async (req, res) => {

  const { customer_id, amount, receipt_method, receipt_date } = req.body;

  if (!customer_id || !amount || !receipt_method || !receipt_date) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    db.run(
      `INSERT INTO transactions (date, voucher_type, narration) VALUES (?, ?, ?)`,
      [receipt_date, 'receipt', `Receipt from customer ID: ${customer_id}`],
      function (err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ message: 'Error creating transaction.', error: err.message });
        }
        const transactionId = this.lastID;

        const insertEntry = db.prepare(`
          INSERT INTO transaction_entries (transaction_id, ledger_id, type, amount)
          VALUES (?, ?, ?, ?)
        `);

        const receiptLedgerName = receipt_method === 'cash' ? 'Cash' : 'Bank';

        db.get(`SELECT id FROM ledgers WHERE name = ?`, [receiptLedgerName], (err, ledger) => {
          if (err || !ledger) {
            db.run('ROLLBACK');
            return res.status(500).json({ message: 'Ledger not found.', error: err?.message || 'Ledger not found' });
          }

          const cashBankLedgerId = ledger.id;

          insertEntry.run(transactionId, cashBankLedgerId, 'debit', amount);
          insertEntry.run(transactionId, customer_id, 'credit', amount);

          insertEntry.finalize((finalizeErr) => {
            if (finalizeErr) {
              db.run('ROLLBACK');
              return res.status(500).json({ message: 'Error finalizing entries.', error: finalizeErr.message });
            }
            db.run('COMMIT', (commitErr) => {
              if (commitErr) {
                db.run('ROLLBACK');
                return res.status(500).json({ message: 'Error committing transaction.', error: commitErr.message });
              }
              // ✅ Jab sab kuch ho jaye tab response aur db.close()
              res.status(201).json({ message: 'Receipt voucher created successfully.' });
              //db.close(); // Yaha close karo
            });
          });
        });
      }
    );
  });
});



module.exports = router;