import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const NavBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // 🔥 Clear everything from localStorage
    navigate('/login');   // 🚀 Redirect to login page
    window.location.reload(); // 🧹 Refresh to reset states (optional, but clean)
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        {/* Logo on the left side */}
        <Navbar.Brand className="fw-bold text-dark">
          <Link to="/" className="text-decoration-none text-dark">
            Grishma Investment Admin Panel
          </Link>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Right side - Logout button */}
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Button
            variant="primary"
            className="ms-2"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
