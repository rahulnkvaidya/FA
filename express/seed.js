const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("accounting.db");

db.serialize(() => {
  // Insert sample ledgers (Assets, Liabilities, Income, Expenses)
  db.run(`
    INSERT INTO ledgers (name, type, group_name) VALUES
    ('Cash', 'asset', 'Current Assets'),
    ('Bank', 'asset', 'Current Assets'),
    ('Capital', 'liability', 'Owner Equity'),
    ('Sales', 'income', 'Revenue'),
    ('Rent Expense', 'expense', 'Operating Expenses'),
    ('Electricity Expense', 'expense', 'Operating Expenses')
  `);

  // Insert sample customers
  db.run(`
    INSERT INTO customers (name, phone, email, address) VALUES
    ('Rahul Sharma', '1234567890', 'rahul@example.com', '123 Main St'),
    ('Amit Verma', '0987654321', 'amit@example.com', '456 Side St')
  `);

  // Insert sample items
  db.run(`
    INSERT INTO items (name, description, unit, gst_rate) VALUES
    ('Shirt', 'Cotton shirt', 'Piece', 18),
    ('Pants', 'Cotton pants', 'Piece', 18),
    ('Bedsheet', 'Cotton bedsheet', 'Piece', 12)
  `);

  // Insert sample rates for customers
  db.run(`
    INSERT INTO rates (customer_id, item_id, rate) VALUES
    (1, 1, 150), -- Rahul Sharma for Shirt
    (1, 2, 200), -- Rahul Sharma for Pants
    (2, 1, 140), -- Amit Verma for Shirt
    (2, 3, 300)  -- Amit Verma for Bedsheet
  `);

  // Insert sample transactions (Voucher level)
  db.run(`
    INSERT INTO transactions (date, voucher_type, narration) VALUES
    ('2023-04-01', 'Sales Invoice', 'Sale of shirts and pants to Rahul Sharma'),
    ('2023-04-02', 'Purchase Invoice', 'Purchased stock from supplier')
  `);

  // Insert sample transaction entries (Double-entry)
  db.run(`
    INSERT INTO transaction_entries (transaction_id, ledger_id, type, amount) VALUES
    (1, 1, 'debit', 1500),  -- Debit to Cash for sale
    (1, 4, 'credit', 1500), -- Credit to Sales for sale
    (2, 2, 'debit', 500),   -- Debit to Bank for purchase
    (2, 5, 'credit', 500)   -- Credit to Rent Expense
  `);

  // Insert sample invoices
  db.run(`
    INSERT INTO invoices (customer_id, invoice_date, due_date, total) VALUES
    (1, '2023-04-01', '2023-04-15', 1500),  -- Invoice to Rahul Sharma
    (2, '2023-04-02', '2023-04-16', 1300)   -- Invoice to Amit Verma
  `);

  // Insert sample invoice items
  db.run(`
    INSERT INTO invoice_items (invoice_id, item_id, quantity, rate, amount) VALUES
    (1, 1, 10, 150, 1500),  -- 10 Shirts for Rahul Sharma
    (2, 2, 5, 200, 1000)    -- 5 Pants for Amit Verma
  `);

  console.log("✅ Data seeding complete!");
});

db.close();
