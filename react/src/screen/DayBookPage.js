import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DayBookPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchDayBook();
  }, [selectedDate]);

  const fetchDayBook = async () => {
    try {
      const response = await axios.get(`http://localhost:3005/api/day-book?date=${selectedDate}`);
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching day book:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Day Book</h2>

      <div className="mb-3">
        <label>Select Date:</label>
        <input
          type="date"
          className="form-control"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Particulars</th>
            <th>Voucher Type</th>
            <th>Debit (Dr)</th>
            <th>Credit (Cr)</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((txn) => (
              <tr key={txn.id}>
                <td>{txn.date}</td>
                <td>{txn.particulars}</td>
                <td>{txn.voucher_type}</td>
                <td>{txn.debit_amount || '-'}</td>
                <td>{txn.credit_amount || '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No transactions for selected date.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DayBookPage;
