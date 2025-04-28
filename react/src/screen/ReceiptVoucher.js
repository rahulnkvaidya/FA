import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReceiptVoucher = () => {
  const [customerLedgers, setCustomerLedgers] = useState([]);
  const [selectedLedgerId, setSelectedLedgerId] = useState('');
  const [amount, setAmount] = useState('');
  const [receiptMethod, setReceiptMethod] = useState('cash');
  const [receiptDate, setReceiptDate] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Ledger list ko fetch karna
    const fetchCustomerLedgers = async () => {
      try {
        const response = await axios.get('http://localhost:3005/api/ledgers?count=50');
        setCustomerLedgers(response.data.ledgers);
      } catch (error) {
        console.error('Error fetching customer ledgers:', error);
      }
    };

    fetchCustomerLedgers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3005/api/receipt-voucher', {
        customer_id: Number(selectedLedgerId),
        amount: Number(amount),
        receipt_method: receiptMethod,
        receipt_date: receiptDate
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error creating receipt voucher.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Receipt Voucher</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Customer Ledger</label>
          <select className="form-control" value={selectedLedgerId} onChange={(e) => setSelectedLedgerId(e.target.value)} required>
            <option value="">Select Customer Ledger</option>
            {customerLedgers.map((ledger) => (
              <option key={ledger.id} value={ledger.id}>
                {ledger.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Amount</label>
          <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Receipt Method</label>
          <select className="form-control" value={receiptMethod} onChange={(e) => setReceiptMethod(e.target.value)} required>
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Receipt Date</label>
          <input type="date" className="form-control" value={receiptDate} onChange={(e) => setReceiptDate(e.target.value)} required />
        </div>

        <div>
          <button type="submit" className="btn btn-success">Create Receipt Voucher</button>
        </div>
      </form>
    </div>
  );
};

export default ReceiptVoucher;
