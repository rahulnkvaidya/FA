import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';

function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const countPerPage = 10;

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3005/api/customer/list", {
                params: {
                    page: page,
                    count: countPerPage,
                },
            });

            setCustomers(response.data.customers || []);
            setTotalPages(response.data.totalPages || 1);
            setLoading(false);
        } catch (err) {
            setError("Failed to load customers.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [page]);

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

    return (
        <div className="container p-2" style={{ backgroundColor: "#f8f9fa" }}>
            <div className="row mt-2">
                <div className="col-12">
                    <div className="p-3 bg-info text-white rounded d-flex justify-content-between align-items-center">
                        <h2>Customers</h2>
                        <Nav.Link as={Link} to="/newcustomer">
                            Add Customer
                        </Nav.Link>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm mt-2">
                        {loading && <p>Loading customers...</p>}
                        {error && <p className="text-danger">{error}</p>}
                        {!loading && !error && (
                            <>
                                <div className="table-responsive">
                                    <table className="table table-striped table-bordered">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Phone</th>
                                                <th>Email</th>
                                                <th>Address</th>
                                                <th>Actions</th> {/* 👈 New Column */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {customers.map((cust) => (
                                                <tr key={cust.id}>
                                                    <td>{cust.id}</td>
                                                    <td>
                                                        {/* Link to Customer Ledger */}
                                                        <Link to={`/customer/${cust.id}/ledger`} style={{ textDecoration: 'none' }}>
                                                            {cust.name}
                                                        </Link>
                                                    </td>
                                                    <td>{cust.phone}</td>
                                                    <td>{cust.email}</td>
                                                    <td>{cust.address}</td>
                                                    <td>
                                                        <Button
                                                            as={Link}
                                                            to={`/editcustomer/${cust.id}`}
                                                            variant="warning"
                                                            size="sm"
                                                        >
                                                            Edit
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <Button variant="secondary" onClick={handlePrev} disabled={page === 1}>
                                        ◀ Previous
                                    </Button>
                                    <span>Page {page} of {totalPages}</span>
                                    <Button variant="secondary" onClick={handleNext} disabled={page === totalPages}>
                                        Next ▶
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomersPage;
