import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateLedger = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [groupName, setGroupName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [ledgerTypes, setLedgerTypes] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    // Ledger Types fetch
    axios.get('http://localhost:3005/api/ledgers/types')
      .then(response => {
        console.log(response.data)
        setLedgerTypes(response.data);
      })
      .catch(error => {
        console.error('Error fetching ledger types:', error);
      });

    // Customers fetch
    axios.get('http://localhost:3005/api/customer/list')
      .then(response => {
        setCustomers(response.data.customers);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3005/api/ledgers', {
      name,
      type,
      group_name: groupName,
      customer_id: customerId
    })
    .then(response => {
      alert('Ledger created successfully!');
      // Form reset
      setName('');
      setType('');
      setGroupName('');
      setCustomerId('');
    })
    .catch(error => {
      console.error('Error creating ledger:', error);
    });
  };

  return (
    <div className="container mt-4">
      <h2>Create New Ledger</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded">
        <div className="mb-3">
          <label className="form-label">Ledger Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Ledger Type:</label>
          <select
            className="form-select"
            value={type}
            onChange={e => setType(e.target.value)}
            required
          >
            <option value="">-- Select Ledger Type --</option>
            {ledgerTypes.map((ledgerType, index) => (
              <option key={index} value={ledgerType}>
                {ledgerType.charAt(0).toUpperCase() + ledgerType.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Group Name:</label>
          <input
            type="text"
            className="form-control"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Customer:</label>
          <select
            className="form-select"
            value={customerId}
            onChange={e => setCustomerId(e.target.value)}
          >
            <option value="">-- Select Customer (optional) --</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Create Ledger</button>
      </form>
    </div>
  );
};

export default CreateLedger;
