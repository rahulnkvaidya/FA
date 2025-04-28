import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';

const Header = () => {
  const [expanded, setExpanded] = useState(false);

  const handleNavbarToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="row">
      
      <Navbar bg="dark" expand="lg" variant="dark" expanded={expanded}>
        <Navbar.Brand as={Link} to="/" className="mt-0 mb-0 mr-auto"></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleNavbarToggle} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto pr-2 pl-2">
            <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>🏠 Home</Nav.Link>
            <Nav.Link as={Link} to="/rates" onClick={() => setExpanded(false)}>Rates</Nav.Link>
            <Nav.Link as={Link} to="/transaction" onClick={() => setExpanded(false)}>transaction</Nav.Link>
            <Nav.Link as={Link} to="/transactionlist" onClick={() => setExpanded(false)}>tran List</Nav.Link>
            <Nav.Link as={Link} to="/ledger-transactions" onClick={() => setExpanded(false)}>LedgerTran</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
