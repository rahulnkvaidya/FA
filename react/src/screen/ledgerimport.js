import React, { useState } from 'react';
import axios from 'axios';

function LedgerImportPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3005/api/import/upload-ledgers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(response.data.message + ` Total Imported: ${response.data.totalImported}`);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Import Ledgers from Excel</h2>
      <div className="mb-3">
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="form-control" />
      </div>
      <button onClick={handleUpload} className="btn btn-primary">Upload</button>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}

export default LedgerImportPage;
