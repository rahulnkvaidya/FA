import React, { useState, useEffect } from "react";
import axios from "axios";

const PurchaseVoucherForm = () => {
  const [date, setDate] = useState("");
  const [supplierLedgerId, setSupplierLedgerId] = useState("");
  const [purchaseLedgerId, setPurchaseLedgerId] = useState("");
  const [amount, setAmount] = useState(0);
  const [narration, setNarration] = useState("");
  const [ledgers, setLedgers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3005/api/ledgers")
      .then((res) => setLedgers(res.data.ledgers))
      .catch((err) => {
        console.error("Error fetching ledgers:", err);
        alert("Ledger list load nahi ho paayi.");
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!supplierLedgerId || !purchaseLedgerId || amount <= 0) {
      alert("Saare fields valid hone chahiye.");
      return;
    }

    const entries = [
      { ledger_id: purchaseLedgerId, type: "debit", amount: parseFloat(amount) },
      { ledger_id: supplierLedgerId, type: "credit", amount: parseFloat(amount) },
    ];

    const data = {
      date,
      voucher_type: "Purchase Invoice",
      narration,
      entries,
    };

    axios
      .post("http://localhost:3005/api/transactions", data)
      .then((res) => {
        alert("Purchase voucher successfully add hua!");
        setDate("");
        setSupplierLedgerId("");
        setPurchaseLedgerId("");
        setAmount(0);
        setNarration("");
      })
      .catch((err) => {
        console.error("Transaction error:", err);
        alert("Voucher add karne mein error aayi.");
      });
  };

  return (
    <div className="container mt-4 p-3 border rounded bg-light">
      <h4 className="text-primary mb-3">Purchase Voucher</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-2">
          <label>Date</label>
          <input
            type="date"
            className="form-control form-control-sm"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group mb-2">
          <label>Supplier Ledger</label>
          <select
            className="form-control form-control-sm"
            value={supplierLedgerId}
            onChange={(e) => setSupplierLedgerId(e.target.value)}
            required
          >
            <option value="">Select Supplier</option>
            {ledgers.map((ledger) => (
              <option key={ledger.id} value={ledger.id}>
                {ledger.name} ({ledger.group_name})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group mb-2">
          <label>Purchase Ledger</label>
          <select
            className="form-control form-control-sm"
            value={purchaseLedgerId}
            onChange={(e) => setPurchaseLedgerId(e.target.value)}
            required
          >
            <option value="">Select Purchase Ledger</option>
            {ledgers.map((ledger) => (
              <option key={ledger.id} value={ledger.id}>
                {ledger.name} ({ledger.group_name})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group mb-2">
          <label>Amount</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Narration</label>
          <textarea
            className="form-control form-control-sm"
            value={narration}
            onChange={(e) => setNarration(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-success btn-sm">
          Save Purchase Voucher
        </button>
      </form>
    </div>
  );
};

export default PurchaseVoucherForm;
