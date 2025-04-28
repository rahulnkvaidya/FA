import React, { useState } from 'react';
import axios from 'axios';

function NewItemForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unit: '',
    gst_rate: ''
  });

  const units = ["Pcs", "kg", "gm", "month", "day", "week"]; // Pre-defined units

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3005/api/items', formData);
      alert('Item added successfully! ID: ' + response.data.itemId);
      setFormData({ name: '', description: '', unit: '', gst_rate: '' }); // Reset form
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-2">
          <label>Name:</label>
          <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group mb-2">
          <label>Description:</label>
          <textarea className="form-control" name="description" value={formData.description} onChange={handleChange}></textarea>
        </div>

        <div className="form-group mb-2">
          <label>Unit:</label>
          <select className="form-control" name="unit" value={formData.unit} onChange={handleChange} required>
            <option value="">Select Unit</option>
            {units.map((unit, index) => (
              <option key={index} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group mb-2">
          <label>GST Rate (%):</label>
          <input type="number" step="0.01" className="form-control" name="gst_rate" value={formData.gst_rate} onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-primary">Add Item</button>
      </form>
    </div>
  );
}

export default NewItemForm;
