import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalInvoices: 0,
  });
  const navigate = useNavigate();
console.log(invoices);
  useEffect(() => {
    // Fetch invoices with pagination
    axios.get('http://localhost:3005/api/invoices', {
      params: {
        page: pagination.currentPage,
        limit: 10, // You can adjust the limit based on your preference
      }
    })
      .then((response) => {
        setInvoices(response.data.invoices);
        setPagination({
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
          totalInvoices: response.data.pagination.totalInvoices,
        });
      })
      .catch((error) => {
        console.error('There was an error fetching the invoices!', error);
      });
  }, [pagination.currentPage]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleViewInvoice = (invoiceId) => {
    navigate(`/invoices/${invoiceId}`);
  };

  const handleDeleteInvoice = (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      axios.delete(`http://localhost:3005/api/invoice/${invoiceId}`)
        .then((response) => {
          setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
        })
        .catch((error) => {
          console.error('Error deleting invoice:', error);
        });
    }
  };

  const handleStatusChange = (invoiceId, status) => {
    axios.patch(`http://localhost:3005/api/invoice/${invoiceId}/status`, { status })
      .then((response) => {
        setInvoices(invoices.map(invoice =>
          invoice.id === invoiceId ? { ...invoice, status } : invoice
        ));
      })
      .catch((error) => {
        console.error('Error updating invoice status:', error);
      });
  };

  return (
    <div className="container mt-4">
      <h4 className="text-center mb-4">Invoice List</h4>

      <table className="table table-bordered text-center">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Invoice Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.customer_name} {invoice.ledger_name}</td>
              <td>{invoice.invoice_date}</td>
              <td>{invoice.total}</td>
              <td>{invoice.status}</td>
              <td>
                <button className="btn btn-info btn-sm" onClick={() => handleViewInvoice(invoice.id)}>
                  View
                </button>
                <button className="btn btn-warning btn-sm" onClick={() => handleStatusChange(invoice.id, 'paid')}>
                  Mark as Paid
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteInvoice(invoice.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(pagination.currentPage - 1)}>Previous</button>
          </li>

          {/* Page Numbers */}
          {[...Array(pagination.totalPages)].map((_, index) => (
            <li key={index} className={`page-item ${pagination.currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}

          <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(pagination.currentPage + 1)}>Next</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default InvoiceList;
