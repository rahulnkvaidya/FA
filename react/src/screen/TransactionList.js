import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TransactionList.css"; // add this line for custom styles

const TransactionListPage = () => {
  const [transactionEntries, setTransactionEntries] = useState([]);
  const [groupedTransactions, setGroupedTransactions] = useState({});
  const [ledgers, setLedgers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [entryRes, ledgerRes] = await Promise.all([
        axios.get("http://localhost:3005/api/transaction-entries"),
        axios.get("http://localhost:3005/api/ledgers?count=50"),
      ]);
      console.log('entryRes.data = ',entryRes.data);
      console.log('ledgerRes.data = ',ledgerRes.data);
      setTransactionEntries(entryRes.data.transactionEntries || []);
      setLedgers(ledgerRes.data.ledgers || []);

      const grouped = {};
      (entryRes.data.transactionEntries || []).forEach((entry) => {
        if (!grouped[entry.transaction_id]) {
          grouped[entry.transaction_id] = [];
        }
        grouped[entry.transaction_id].push(entry);
      });
      setGroupedTransactions(grouped);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const getLedgerName = (id) => {
    const ledger = ledgers.find((l) => l.id === id);
    return ledger ? ledger.name : `Ledger #${id}`;
  };

  return (
    <div className="container mt-4 tally-style">
      <h5 className="text-center mb-4">Transaction List (Tally Style)</h5>
      {Object.keys(groupedTransactions).length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        Object.entries(groupedTransactions).map(([txnId, entries]) => {
          const totalDr = entries
            .filter((e) => e.type === "debit")
            .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
          const totalCr = entries
            .filter((e) => e.type === "credit")
            .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

          return (
            <div key={txnId} className="card mb-3">
              <div className="card-header p-2">
                <small>Transaction ID: {txnId}</small>
              </div>
              <div className="card-body p-2">
                <table className="table table-sm table-bordered text-center small-table">
                  <thead>
                    <tr>
                      <th>Particulars (ledger)</th>
                      <th>Dr (₹)</th>
                      <th>Cr (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry.id}>
                        <td>{getLedgerName(entry.ledger_id)}</td>
                        <td>{entry.type === "debit" ? entry.amount : ""}</td>
                        <td>{entry.type === "credit" ? entry.amount : ""}</td>
                      </tr>
                    ))}
                    <tr className="fw-bold bg-light">
                      <td>Total</td>
                      <td>{totalDr}</td>
                      <td>{totalCr}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TransactionListPage;
