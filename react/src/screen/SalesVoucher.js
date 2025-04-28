import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SalesVoucher = () => {
  const [customerLedgers, setCustomerLedgers] = useState([]);
  const [itemsList, setItemsList] = useState([]); // List of items to populate in dropdown
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ item_id: '', quantity: '', rate: '' }]);
  const [invoiceDate, setInvoiceDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('id=',customerId);
    // Fetch ledger list on component mount
    const fetchLedgers = async () => {
      try {
        const response = await axios.get('http://localhost:3005/api/ledgers?count=50');
        console.log(response.data);
        setCustomerLedgers(response.data.ledgers);
      } catch (error) {
        console.error('Error fetching customer ledgers:', error);
      }
    };

    // Fetch available items for dropdown
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:3005/api/items'); // Assuming this API returns a list of items
        setItemsList(response.data.items);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchLedgers();
    fetchItems();
  }, []);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
  
    // Check if the field being changed is the 'item_id' and set the rate accordingly
    if (field === 'item_id') {
      const selectedItem = itemsList.find(item => item.id === value);
  
      // If an item is selected, update the rate
      if (selectedItem) {
        // Use the item's default rate, or handle customer-specific rates if needed
        newItems[index].rate = selectedItem.default_rate || 0;
      } else {
        newItems[index].rate = 0; // If no item selected, set rate to 0
      }
    }
  
    setItems(newItems);
  };
  

  const addItem = () => {
    setItems([...items, { item_id: '', quantity: '', rate: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3005/api/sales-voucher', {
        ledger_id: Number(customerId),
        items: items.map(item => ({
          item_id: Number(item.item_id),
          quantity: Number(item.quantity),
          rate: Number(item.rate)
        })),
        invoice_date: invoiceDate,
        due_date: dueDate
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error creating sales voucher.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Sales Voucher</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Customer Ledger</label>
          <select
            className="form-control"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          >
            <option value="">Select Customer</option>
            {customerLedgers.map((ledger) => (
              <option key={ledger.id} value={ledger.id}>
                {ledger.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Invoice Date</label>
          <input type="date" className="form-control" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Due Date</label>
          <input type="date" className="form-control" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>

        <h4>Items</h4>
        {items.map((item, index) => (
          <div className="row mb-3" key={index}>
            <div className="col">
              <select
                className="form-control"
                value={item.item_id}
                onChange={(e) => handleItemChange(index, 'item_id', e.target.value)}
                required
              >
                <option value="">Select Item</option>
                {itemsList.map((itemData) => (
                  <option key={itemData.id} value={itemData.id}>
                    {itemData.name} - {itemData.description}
                  </option>
                ))}
              </select>
            </div>
            <div className="col">
              <input type="number" placeholder="Quantity" className="form-control" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} required />
            </div>
            <div className="col">
              <input type="number" placeholder="Rate" className="form-control" value={item.rate} onChange={(e) => handleItemChange(index, 'rate', e.target.value)} required />
            </div>
          </div>
        ))}

        <button type="button" className="btn btn-secondary mb-3" onClick={addItem}>Add Another Item</button>

        <div>
          <button type="submit" className="btn btn-primary">Create Sales Voucher</button>
        </div>
      </form>
    </div>
  );
};

export default SalesVoucher;
