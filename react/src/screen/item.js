import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';

function ItemsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const countPerPage = 10;

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3005/api/items", {
                params: {
                    page: page,
                    count: countPerPage,
                },
            });

            setItems(response.data.items || []);
            setTotalPages(response.data.totalPages || 1);
            setLoading(false);
        } catch (err) {
            setError("Failed to load items.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
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
                    <div className="p-3 bg-success text-white rounded">
                        <h2>Items</h2>
                        <Nav.Link as={Link} to="/newitem" >New</Nav.Link>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm mt-2">
                        {loading && <p>Loading items...</p>}
                        {error && <p className="text-danger">{error}</p>}
                        {!loading && !error && (
                            <>
                                <div className="table-responsive">
                                    <table className="table table-striped table-bordered">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Category</th>
                                                <th>Price</th>
                                                <th>Unit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.id}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.category}</td>
                                                    <td>{item.default_rat}</td>
                                                    <td>{item.unit}</td>
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

export default ItemsPage;
