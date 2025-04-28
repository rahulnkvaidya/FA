import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TallyVoucherForm.css"; // Assuming you add the CSS here

const TallyVoucherForm = () => {
  const [date, setDate] = useState("");
  const [voucherType, setVoucherType] = useState("");
  const [narration, setNarration] = useState("");
  const [entries, setEntries] = useState([
    { ledger_id: "", type: "debit", amount: 0 },
    { ledger_id: "", type: "credit", amount: 0 },
  ]);
  const [ledgers, setLedgers] = useState([]);
  const [paymentReceived, setPaymentReceived] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3005/api/ledgers")
      .then((res) => {
        setLedgers(res.data.ledgers);
      })
      .catch((err) => {
        console.error("Error fetching ledgers:", err);
        alert("Failed to load ledger list.");
      });
  }, []);

  const handleAddEntry = () => {
    setEntries([...entries, { ledger_id: "", type: "debit", amount: 0 }]);
  };

  const handleRemoveEntry = (index) => {
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    setEntries(newEntries);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newEntries = [...entries];
    newEntries[index][name] = name === "amount" ? parseFloat(value) : value;
    setEntries(newEntries);
  };

  const handleVoucherTypeChange = (e) => {
    const type = e.target.value;
    setVoucherType(type);

    if (type === "Payment Voucher" || type === "Receipt Voucher") {
      setPaymentReceived(true);
    } else {
      setPaymentReceived(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const totalDebit = entries
      .filter((entry) => entry.type === "debit")
      .reduce((sum, entry) => sum + Number(entry.amount), 0);
    const totalCredit = entries
      .filter((entry) => entry.type === "credit")
      .reduce((sum, entry) => sum + Number(entry.amount), 0);

    if (totalDebit !== totalCredit) {
      alert("Debit and credit amounts do not match.");
      return;
    }

    const transactionData = {
      date,
      voucher_type: voucherType,
      narration,
      entries,
    };

    axios
      .post("http://localhost:3005/api/transactions", transactionData)
      .then((response) => {
        console.log("Transaction Added:", response.data);
        alert("Transaction added successfully!");
      })
      .catch((error) => {
        console.error("Error adding transaction:", error);
        alert("Failed to add transaction");
      });
  };

  return (
    <div className="container">
      <h2 className="form-title">Add Tally-style Voucher</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            className="form-control form-control-sm"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="voucherType">Voucher Type</label>
          <select
            className="form-control form-control-sm"
            id="voucherType"
            value={voucherType}
            onChange={handleVoucherTypeChange}
            required
          >
            <option value="">Select Voucher Type</option>
            <option value="Sales Invoice">Sales Invoice</option>
            <option value="Purchase Invoice">Purchase Invoice</option>
            <option value="Payment Voucher">Payment Voucher</option>
            <option value="Receipt Voucher">Receipt Voucher</option>
            <option value="Journal Voucher">Journal Voucher</option>
          </select>
        </div>

        {voucherType === "Payment Voucher" || voucherType === "Receipt Voucher" ? (
          <div className="form-group">
            <label htmlFor="paymentReceived">
              {voucherType === "Payment Voucher" ? "Payment Made" : "Payment Received"}
            </label>
            <input
              type="checkbox"
              id="paymentReceived"
              checked={paymentReceived}
              onChange={(e) => setPaymentReceived(e.target.checked)}
              className="form-check-input"
            />
          </div>
        ) : null}

        <div className="form-group">
          <label htmlFor="narration">Narration</label>
          <textarea
            className="form-control form-control-sm"
            id="narration"
            value={narration}
            onChange={(e) => setNarration(e.target.value)}
            required
          />
        </div>

        <h3>Transaction Entries</h3>
        {entries.map((entry, index) => (
          <div key={index} className="form-group">
            <div className="row">
              <div className="col-md-3">
                <label>Ledger</label>
                <select
                  className="form-control form-control-sm"
                  name="ledger_id"
                  value={entry.ledger_id}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                >
                  <option value="">Select Ledger</option>
                  {ledgers.map((ledger) => (
                    <option key={ledger.id} value={ledger.id}>
                      {ledger.name} ({ledger.group_name})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label>Type</label>
                <select
                  className="form-control form-control-sm"
                  name="type"
                  value={entry.type}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                >
                  <option value="debit">Debit</option>
                  <option value="credit">Credit</option>
                </select>
              </div>
              <div className="col-md-3">
                <label>Amount</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  name="amount"
                  value={entry.amount}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                />
              </div>
              <div className="col-md-3">
                <button
                  type="button"
                  className="btn btn-danger btn-sm mt-4"
                  onClick={() => handleRemoveEntry(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        <button type="button" className="btn btn-primary btn-sm" onClick={handleAddEntry}>
          Add Entry
        </button>

        <button type="submit" className="btn btn-success btn-sm mt-3">
          Submit Transaction
        </button>
      </form>
    </div>
  );
};

export default TallyVoucherForm;
