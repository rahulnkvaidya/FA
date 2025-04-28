import React, { useEffect, useState } from "react";
import axios from "axios";

const ItemRatePage = ({ customerId }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3005/api/itemrates?customer_id=${customerId}`)
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Failed to fetch item rates:", err));
  }, [customerId]);

  return (
    <div className="container mt-3">
      <h2>Customer Item Rates</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Item Name</th>
            <th>Unit</th>
            <th>GST Rate (%)</th>
            <th>Customer Rate (₹)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.item_id}>
              <td>{i + 1}</td>
              <td>{item.item_name}</td>
              <td>{item.unit}</td>
              <td>{item.gst_rate}</td>
              <td>{item.rate !== null ? `₹${item.rate}` : "Not Set"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemRatePage;
