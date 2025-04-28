// setupDB.js
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("accounting.db");

db.serialize(() => {
  // Ledgers
  db.run(`
    CREATE TABLE IF NOT EXISTS ledgers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL, -- 'asset', 'liability', 'income', 'expense'
      group_name TEXT,
      customer_id INTEGER, -- yeh naya field hoga
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    )
  `);

  db.run(`
      CREATE TABLE tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

  // Customers
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      address TEXT
    )
  `);

  // Items
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      unit TEXT,
      gst_rate REAL,
      default_rate REAL DEFAULT 0 
    )
  `);

  // Customer-specific Rate List
  db.run(`
    CREATE TABLE IF NOT EXISTS rates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      item_id INTEGER,
      rate REAL NOT NULL,
      FOREIGN KEY(customer_id) REFERENCES customers(id),
      FOREIGN KEY(item_id) REFERENCES items(id)
    )
  `);

  // Transactions (Voucher level)
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      voucher_type TEXT NOT NULL,
      narration TEXT
    )
  `);

  // Transaction Entries (Double-entry lines)
  db.run(`
    CREATE TABLE IF NOT EXISTS transaction_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_id INTEGER,
      ledger_id INTEGER,
      type TEXT CHECK(type IN ('debit', 'credit')) NOT NULL,
      amount REAL NOT NULL,
      FOREIGN KEY(transaction_id) REFERENCES transactions(id),
      FOREIGN KEY(ledger_id) REFERENCES ledgers(id)
    )
  `);

  // Invoices
  db.run(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ledger_id INTEGER,
      invoice_date TEXT NOT NULL,
      due_date TEXT,
      total REAL,
      FOREIGN KEY(ledger_id) REFERENCES ledgers(id)
    )
  `);

  // Invoice Items
  db.run(`
    CREATE TABLE IF NOT EXISTS invoice_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER,
      item_id INTEGER,
      quantity REAL NOT NULL,
      rate REAL NOT NULL,
      amount REAL NOT NULL,
      FOREIGN KEY(invoice_id) REFERENCES invoices(id),
      FOREIGN KEY(item_id) REFERENCES items(id)
    )
  `);

  console.log("✅ Database setup complete!");
});

db.close();
