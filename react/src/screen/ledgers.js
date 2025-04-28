import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // navigate ke liye
import * as gameAction from "../store/action/gameAction";
import axios from "axios";

function LedgerPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // navigate hook add kiya
  const game = useSelector((state) => state.game);
  const Stages = game?.[0]?.matches || [];

  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state

  useEffect(() => {
    if (!game) {
      dispatch(gameAction.fetchLiveScore());
    }

    // Fetching data based on the current page
    axios
      .get("http://localhost:3005/api/ledgers", {
        params: {
          page: page,
          count: 10, // Number of records per page
        },
      })
      .then((response) => {
        setLedgers(response.data.ledgers);
        setTotalPages(response.data.totalPages); // Assuming the backend sends totalPages
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load ledgers.");
        setLoading(false);
      });
  }, [dispatch, game, page]); // Adding page as a dependency

  const handleEdit = (id) => {
    navigate(`/ledgeredit/${id}`);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="container mt-0 p-1" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="row mt-1">
        <div className="col-12">
          <div className="p-1 m-1 bg-warning text-white rounded">
            <h2>Ledgers</h2>
          </div>
          <div className="bg-white p-3 rounded shadow-sm mt-2">
            {loading && <p>Loading ledgers...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && (
              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead className="thead-dark">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Group Name</th>
                      <th>Action</th> {/* 👈 New column for Action */}
                    </tr>
                  </thead>
                  <tbody>
                    {ledgers.map((ledger) => (
                      <tr key={ledger.id}>
                        <td>{ledger.id}</td>
                        <td>{ledger.name}</td>
                        <td>{ledger.type}</td>
                        <td>{ledger.group_name}</td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleEdit(ledger.id)}
                          >
                            Edit
                          </button>
                        </td> {/* 👈 Edit button */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            <nav aria-label="Page navigation">
              <ul className="pagination">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                </li>

                {/* Dynamic page numbers */}
                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${page === index + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${page === totalPages ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LedgerPage;
