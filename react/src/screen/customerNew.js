import React, { useState } from "react";
import axios from "axios";
import "./TallyVoucherForm.css"; // Same CSS use karenge for styling

const AddCustomerForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const customerData = {
      name,
      phone,
      email,
      address,
    };

    axios
      .post("http://localhost:3005/api/customer/new", customerData)
      .then((response) => {
        console.log("Customer Added:", response.data);
        alert("Customer added successfully!");
        setName("");
        setPhone("");
        setEmail("");
        setAddress("");
      })
      .catch((error) => {
        console.error("Error adding customer:", error);
        alert("Failed to add customer");
      });
  };

  return (
    <div className="container">
      <h2 className="form-title">Add New Customer</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control form-control-sm"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            className="form-control form-control-sm"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control form-control-sm"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            className="form-control form-control-sm"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-success btn-sm mt-3">
          Add Customer
        </button>
      </form>
    </div>
  );
};

export default AddCustomerForm;
