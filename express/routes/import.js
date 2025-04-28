const express = require('express');
const router = express.Router();
const axios = require('axios');
const _ = require("underscore");
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const xlsx = require('xlsx');
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
// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ dest: 'uploads/' });

// Route for uploading ledger excel
router.post('/upload-ledgers', upload.single('file'), (req, res) => {
    console.log("upload")
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(worksheet);

    if (rows.length === 0) {
        return res.status(400).json({ message: 'Excel file is empty or invalid format' });
    }

    const insertLedger = db.prepare(`
    INSERT INTO ledgers (name, type, group_name, customer_id)
    VALUES (?, ?, ?, ?)
  `);

    db.serialize(() => {
        rows.forEach((row) => {
            if (!row.Name || !row.Type) return; // Basic validation

            insertLedger.run([
                row.Name,
                row.Type,
                row.GroupName || null,
                row.CustomerID || null
            ]);
        });

        insertLedger.finalize();
        res.json({ message: 'Ledgers imported successfully!', totalImported: rows.length });
    });
});

// File upload setup
//const upload = multer({ dest: 'uploads/' });
router.post('/import-transactions', upload.single('file'), (req, res) => {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: false });

    db.serialize(() => {
        data.forEach(entry => {
            const { Date, Particulars, Debit, Credit, Narration, BankLedgerName, CounterLedgerName } = entry;

            // Fix Date conversion (convert Excel serial number to JS Date object)
            let transactionDate = null;
            if (Date) {
                transactionDate = xlsx.utils.format_cell({ v: Date, t: 'd' }); // format to JavaScript Date
            }


            // Create or find Bank Ledger
            db.get(`SELECT id FROM ledgers WHERE name = ?`, [BankLedgerName], (err, row) => {
                if (!row) {
                    db.run(`INSERT INTO ledgers (name, type) VALUES (?, ?)`, [BankLedgerName, 'asset'], function (err) {
                        const bankLedgerId = this.lastID;

                        // Create or find Counter Ledger
                        db.get(`SELECT id FROM ledgers WHERE name = ?`, [CounterLedgerName || 'Suspense Account'], (err, row) => {
                            if (!row) {
                                db.run(`INSERT INTO ledgers (name, type) VALUES (?, ?)`, [CounterLedgerName || 'Suspense Account', 'asset'], function (err) {
                                    const counterLedgerId = this.lastID;
                                    insertTransaction(transactionDate, Narration, Debit, Credit, bankLedgerId, counterLedgerId);
                                });
                            } else {
                                const counterLedgerId = row.id;
                                insertTransaction(transactionDate, Narration, Debit, Credit, bankLedgerId, counterLedgerId);
                            }
                        });
                    });
                } else {
                    const bankLedgerId = row.id;
                    // Create or find Counter Ledger
                    db.get(`SELECT id FROM ledgers WHERE name = ?`, [CounterLedgerName || 'Suspense Account'], (err, row) => {
                        if (!row) {
                            db.run(`INSERT INTO ledgers (name, type) VALUES (?, ?)`, [CounterLedgerName || 'Suspense Account', 'asset'], function (err) {
                                const counterLedgerId = this.lastID;
                                insertTransaction(transactionDate, Narration, Debit, Credit, bankLedgerId, counterLedgerId);
                            });
                        } else {
                            const counterLedgerId = row.id;
                            insertTransaction(transactionDate, Narration, Debit, Credit, bankLedgerId, counterLedgerId);
                        }
                    });
                }
            });
        });
    });

    res.send('✅ Transactions imported successfully!');
});

// Function to insert transaction
const insertTransaction = (date, narration, debit, credit, bankLedgerId, counterLedgerId) => {
    db.run(`
      INSERT INTO transactions (date, voucher_type, narration)
      VALUES (?, 'Bank Import', ?)
    `, [date, narration], function (err) {
        const transactionId = this.lastID;

        if (debit && debit > 0) {
            // Debit to Bank, Credit to Counter
            db.run(`INSERT INTO transaction_entries (transaction_id, ledger_id, type, amount) VALUES (?, ?, 'debit', ?)`,
                [transactionId, bankLedgerId, debit]);
            db.run(`INSERT INTO transaction_entries (transaction_id, ledger_id, type, amount) VALUES (?, ?, 'credit', ?)`,
                [transactionId, counterLedgerId, debit]);
        } else if (credit && credit > 0) {
            // Credit to Bank, Debit to Counter
            db.run(`INSERT INTO transaction_entries (transaction_id, ledger_id, type, amount) VALUES (?, ?, 'credit', ?)`,
                [transactionId, bankLedgerId, credit]);
            db.run(`INSERT INTO transaction_entries (transaction_id, ledger_id, type, amount) VALUES (?, ?, 'debit', ?)`,
                [transactionId, counterLedgerId, credit]);
        }
    });
};

module.exports = router;