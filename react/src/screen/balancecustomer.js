import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomersWithBalance = () => {
  const [customers, setCustomers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCustomersWithBalance = async () => {
      try {
        const response = await axios.get('http://localhost:3005/api/customers-with-balance');
        console.log(response.data);
        // Check if the response contains the data in the expected structure
        if (Array.isArray(response.data)) {
          setCustomers(response.data);
        } else {
          setMessage('Unexpected response format');
        }
      } catch (error) {
        setMessage('Error fetching customers with balance');
      }
    };

    fetchCustomersWithBalance();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Customers with Balance</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      {customers.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.customer_id}>
                <td>{customer.customer_name}</td>
                <td>₹{customer.balance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No customers with remaining balance</div>
      )}
    </div>
  );
};

export default CustomersWithBalance;
