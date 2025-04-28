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


router.get('/', (req, res) => {
    const { page = 1, count = 10, type } = req.query; // Default page is 1, count is 10
    const offset = (page - 1) * count;

    let query = "SELECT * FROM ledgers";
    let params = [count, offset];

    if (type) {
        query += " WHERE type = ?";
        params.unshift(type);
    }

    query += " LIMIT ? OFFSET ?";

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).send(err.message);

        // Get the total count of ledgers
        db.get("SELECT COUNT(*) AS total FROM ledgers", [], (err, result) => {
            if (err) return res.status(500).send(err.message);

            const total = result.total;
            const totalPages = Math.ceil(total / count);

            res.json({
                page: parseInt(page),
                count: parseInt(count),
                totalPages,
                total,
                ledgers: rows
            });
        });
    });
});

router.post('/', (req, res) => {
    const { name, type, group_name, customer_id } = req.body;
    db.run(
        `INSERT INTO ledgers (name, type, group_name, customer_id) VALUES (?, ?, ?, ?)`,
        [name, type, group_name, customer_id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID });
        }
    );
});

router.get('/types', (req, res) => {
    // Static types bhej rahe hai, future mein database se bhi aa sakta hai
    const types = ['asset', 'liability', 'income', 'expense', 'equity', 'revenue', 'purchase', 'sales'];
    res.json(types);
});

// Update Ledger
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { name, type, group_name } = req.body;

    const query = `
        UPDATE ledgers
        SET name = ?, type = ?, group_name = ?
        WHERE id = ?
    `;

    db.run(query, [name, type, group_name, id], function (err) {
        if (err) {
            console.error('Error updating ledger:', err);
            return res.status(500).json({ message: 'Failed to update ledger' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: 'Ledger not found' });
        }

        res.json({ message: 'Ledger updated successfully' });
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
  
    const query = `SELECT * FROM ledgers WHERE id = ?`;
  
    db.get(query, [id], (err, row) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ message: 'Database query error' });
        }
  
        if (!row) {
            return res.status(404).json({ message: 'ledger not found' });
        }
  
        res.json(row);
    });
  });


  router.get('/customerid/:id', (req, res) => {
    const id = req.params.id;
  
    const query = `SELECT * FROM ledgers WHERE customer_id = ?`;
  
    db.get(query, [id], (err, row) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ message: 'Database query error' });
        }
  
        if (!row) {
            return res.status(404).json({ message: 'ledger not found' });
        }
  
        res.json(row);
    });
  });

module.exports = router;
