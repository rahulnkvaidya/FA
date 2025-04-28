import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const LedgerTransactionsPage = ({ customerId }) => {
    const [ledgers, setLedgers] = useState([]);
    const [entries, setEntries] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [selectedLedgerId, setSelectedLedgerId] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchLedgers(customerId);
        fetchTransactions();
    }, [customerId]);

    const fetchLedgers = async (customerId) => {
        const res = await axios.get(`http://localhost:3005/api/ledgers?customerId=${customerId}`);
        setLedgers(res.data.ledgers || []);
    };

    const fetchTransactions = async () => {
        const res = await axios.get("http://localhost:3005/api/transactions");
        setTransactions(res.data.transactions || []);
    };

    // Other methods and the table code go here...

    return (
        <div className="container mt-4">
            {/* Rest of the code for displaying the ledger details */}
        </div>
    );
};

export default LedgerTransactionsPage;
