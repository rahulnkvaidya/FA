import React, { useEffect, useState } from "react";
import axios from "axios";

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch transactions with pagination
    axios
      .get(`http://localhost:3005/api/transactions?page=${page}&count=10`)
      .then((res) => {
        console.log(res.data);
        setTransactions(res.data.transactions);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch transactions:", err);
        setLoading(false);
      });
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return; // Prevent invalid page
    setPage(newPage);
  };

  return (
    <div className="container mt-4">
      <h2>Transactions</h2>
      {loading && <p>Loading transactions...</p>}

      {!loading && transactions.length === 0 && <p>No transactions found.</p>}

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Voucher Type</th>
            <th>Narration</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn, index) => (
            <tr key={txn.id}>
              <td>{index + 1}</td>
              <td>{txn.date}</td>
              <td>{txn.voucher_type}</td>
              <td>{txn.narration}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className="page-item">
            <button className="page-link" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
              Previous
            </button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li key={index} className={`page-item ${page === index + 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li className="page-item">
            <button className="page-link" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default TransactionPage;
