// pages/TransactionImportPage.js
import React, { useState } from 'react';
import axios from 'axios';

const TransactionImportPage = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      return alert('Please select a file first.');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3005/api/import/import-transactions', formData);
      alert('✅ Transactions imported successfully!');
    } catch (error) {
      console.error(error);
      alert('❌ Error importing transactions.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Import Transactions</h2>
      <input
        type="file"
        onChange={handleFileChange}
        accept=".xlsx, .xls"
        className="form-control"
      />
      <button className="btn btn-primary mt-3" onClick={handleUpload}>
        Upload Transactions
      </button>
    </div>
  );
};

export default TransactionImportPage;
