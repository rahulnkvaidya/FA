import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TransactionList.css";

const LedgerTransactionsPage = () => {
  const [entries, setEntries] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Cash Ledger ka ID fix kar diya (maan lo Cash ledger ka id = 1)
  const cashLedgerId = 1;

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, page]);

  const fetchTransactions = async () => {
    const res = await axios.get("http://localhost:3005/api/transactions");
    setTransactions(res.data.transactions || []);
  };
 console.log(entries);
  const fetchEntries = async () => {
    const params = {
      page,
      count: 10, 
      ledgerId: cashLedgerId,
      fromDate,
      toDate
    };

    const res = await axios.get("http://localhost:3005/api/transaction-entries", { params });
    setEntries(res.data.transactionEntries || []);
    setTotalPages(res.data.totalPages || 1);
  };

  const getTransactionDetail = (transactionId) => {
    return transactions.find(t => t.id === transactionId) || {};
  };

  const totalDr = entries
    .filter(e => e.type === "debit")
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const totalCr = entries
    .filter(e => e.type === "credit")
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const closingBalance = totalDr - totalCr;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleResetDate = () => {
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  return (
    <div className="container mt-4">
      <h4 className="text-center mb-4">Cash Ledger Transactions</h4>

      {/* Date Range Filters */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label fw-bold">From Date:</label>
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-bold">To Date:</label>
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <button
            className="btn btn-secondary"
            onClick={handleResetDate}
          >
            Reset Date
          </button>
        </div>
      </div>

      {/* Entries Table */}
      {entries.length === 0 ? (
        <p>No entries found for Cash ledger in selected date range.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm table-bordered text-center mt-3">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Particular</th>
                <th>Voucher Type</th>
                <th>Debit (₹)</th>
                <th>Credit (₹)</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                const transaction = getTransactionDetail(entry.transaction_id);
                return (
                  <tr key={entry.id}>
                    <td>{transaction.date || '-'}</td>
                    <td>{transaction.narration || '-'}</td>
                    <td>{transaction.voucher_type || '-'}</td>
                    <td>{entry.type === "debit" ? entry.amount : "-"}</td>
                    <td>{entry.type === "credit" ? entry.amount : "-"}</td>
                  </tr>
                );
              })}
              <tr className="fw-bold bg-light">
                <td colSpan="3" className="text-end">Total</td>
                <td>{totalDr.toFixed(2)}</td>
                <td>{totalCr.toFixed(2)}</td>
              </tr>
              <tr className="fw-bold bg-warning">
                <td colSpan="3" className="text-end">Closing Balance</td>
                <td colSpan="2" className="text-center">
                  {closingBalance > 0
                    ? `${closingBalance.toFixed(2)} Dr`
                    : `${Math.abs(closingBalance).toFixed(2)} Cr`}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Pagination */}
          <div className="d-flex justify-content-center align-items-center my-3">
            <button
              className="btn btn-sm btn-outline-primary mx-1"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="mx-2 fw-bold">Page {page} of {totalPages}</span>
            <button
              className="btn btn-sm btn-outline-primary mx-1"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LedgerTransactionsPage;
