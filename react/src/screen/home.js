import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';

function HomePage(props) {
  return (
    <div className="container mt-0 mb-0 p-1" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="row mt-2">

        {/* Academic Topics (Left Column) */}
        <div className="col-md-5 p-2">
          <div className="p-3 bg-primary text-white rounded">
            <h2>Items</h2>
            <ul className="list-group text-decoration-none">
              <li className="list-group-item border">
                <Nav.Link as={Link} className="text-dark text-decoration-none" to="/item">➔ Item List</Nav.Link>
              </li>
              <li className="list-group-item border">
                <Nav.Link as={Link} className="text-dark text-decoration-none" to="/newitem">➔ New Item</Nav.Link>
              </li>
              <li className="list-group-item border">
                <Nav.Link as={Link} className="text-dark text-decoration-none" to="/ledgerimport">➔ Ledger Import</Nav.Link>
              </li>
              <li className="list-group-item border">
                <Nav.Link as={Link} className="text-dark text-decoration-none" to="/bankimport">➔ Bank Import</Nav.Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-md-5 p-2">
          <div className="p-3 bg-primary text-white rounded">
            <h2>Task</h2>
            <ul className="list-group text-decoration-none">
              <li className="list-group-item border">
                <Nav.Link as={Link} className="text-dark text-decoration-none" to="/tasks">➔ Tasks</Nav.Link>
              </li>
              
            </ul>
          </div>
        </div>

        <div className="col-md-5 p-2">
          <div className="p-3 bg-primary text-white rounded">
            <h2>Customer</h2>
            <ul className="list-group text-decoration-none">
              <li className="list-group-item border">
                <Nav.Link as={Link} className="text-dark text-decoration-none" to="/customer">➔ Customer</Nav.Link>
              </li>
              <li className="list-group-item border">
                <Nav.Link as={Link} className="text-dark text-decoration-none" to="/newcustomer">➔ New Customer</Nav.Link>
              </li>

              <li className="list-group-item border">
                <Nav.Link as={Link} className="text-dark text-decoration-none" to="/invoicelist">➔ Invoice List</Nav.Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-md-5 p-2">
          <div className="p-3 bg-primary text-white rounded">
            <h2>Report</h2>
            <ul className="list-group text-decoration-none">
              <li className="list-group-item border">
                <Nav.Link as={Link} className="text-dark text-decoration-none" to="/cash-ladger">➔ Cash Ladger</Nav.Link>
              </li>
              <li className="list-group-item border">
                <Nav.Link as={Link} className="text-dark text-decoration-none" to="/ledger">➔ Ledgers</Nav.Link>
              </li>
              <li className="list-group-item border">
                <Nav.Link as={Link} className="text-dark text-decoration-none" to="/daybook">➔ Daybook</Nav.Link>
              </li>
              <li className="list-group-item border">
                <Nav.Link as={Link} className="text-dark text-decoration-none" to="/balancecustomer">➔ Customer Balance</Nav.Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-md-5 p-2">
          <div className="p-3 bg-primary text-white rounded">
            <h2>Voucher</h2>
            <ul className="list-group text-decoration-none">
              <li className="list-group-item border">
                <Nav.Link as={Link} className="text-dark text-decoration-none" to="/transactionform">➔ Jenoral Voucher</Nav.Link>
              </li>
              <li className="list-group-item border">
                <Nav.Link as={Link} className="text-dark text-decoration-none" to="/pvoucher">➔ PurchaseVoucher</Nav.Link>
              </li>
              <li className="list-group-item border">
                <Nav.Link as={Link} className="text-dark text-decoration-none" to="/payment">➔ Payment Voucher</Nav.Link>
              </li>

              <li className="list-group-item border">
                <Nav.Link as={Link} className="text-dark text-decoration-none" to="/sales-voucher">➔ sales-voucher</Nav.Link>
              </li>
              <li className="list-group-item border">
                <Nav.Link as={Link} className="text-dark text-decoration-none" to="/receipt-voucher">➔ receipt-voucher</Nav.Link>
              </li>
            </ul>
          </div>

        </div>
        <div className="col-md-5 p-2">
          <div className="p-3 bg-primary text-white rounded">
            <h2>Ledger</h2>
            <ul className="list-group text-decoration-none">
              <li className="list-group-item border">
                <Nav.Link as={Link} className="text-dark text-decoration-none" to="/ledgernew">➔ New Ledger</Nav.Link>
                <Nav.Link as={Link} className="text-dark text-decoration-none" to="/ledger">➔ Ledger</Nav.Link>
              </li>
              
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}

export default HomePage;
