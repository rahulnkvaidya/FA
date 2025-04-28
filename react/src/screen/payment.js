import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentVoucher = () => {
  const [supplierLedger, setSupplierLedger] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch all suppliers from your API
    axios.get('http://localhost:3005/api/ledgers?type=liability') // Assuming 'liability' type is for suppliers
      .then(response => {
        console.log(response.data);
        setSupplierLedger(response.data.ledgers); // Set suppliers
      })
      .catch(error => {
        console.error('Error fetching suppliers:', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || !paymentDate || !selectedSupplier) {
      setMessage('All fields are required!');
      return;
    }

    // Make payment entry in the database (payment entry to supplier and cash/bank)
    const paymentData = {
      supplier_id: selectedSupplier,
      amount: parseFloat(amount),
      payment_method: paymentMethod,
      payment_date: paymentDate,
    };

    // Call backend API to store the payment entry
    axios.post('http://localhost:3005/api/payment-voucher', paymentData)
      .then(response => {
        setMessage('Payment recorded successfully!');
        // Optionally reset the form
        setAmount('');
        setPaymentDate('');
        setSelectedSupplier('');
        setPaymentMethod('cash');
      })
      .catch(error => {
        console.error('Error making payment:', error);
        setMessage('Failed to record payment!');
      });
  };

  return (
    <div className="container mt-4">
      <h4 className="text-center">Payment Voucher</h4>
      <form onSubmit={handleSubmit}>
        {/* Supplier selection */}
        <div className="mb-3">
          <label className="form-label">Select Supplier:</label>
          <select
            className="form-select"
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            required
          >
            <option value="">-- Select Supplier --</option>
            {supplierLedger.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount field */}
        <div className="mb-3">
          <label className="form-label">Amount (₹):</label>
          <input
            type="number"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        {/* Payment Date field */}
        <div className="mb-3">
          <label className="form-label">Payment Date:</label>
          <input
            type="date"
            className="form-control"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
          />
        </div>

        {/* Payment Method */}
        <div className="mb-3">
          <label className="form-label">Payment Method:</label>
          <select
            className="form-select"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
          </select>
        </div>

        {/* Submit button */}
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary">
            Record Payment
          </button>
        </div>
      </form>

      {/* Success or Error Message */}
      {message && (
        <div className="mt-3 text-center">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentVoucher;
