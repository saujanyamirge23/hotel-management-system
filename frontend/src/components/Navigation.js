import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isManager, isCustomer } = useAuth();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Don't show navigation on login page
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          🏨 Hotel Management
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={isActive('/') && location.pathname === '/' ? 'active' : ''}
            >
              🏠 Home
            </Nav.Link>
            
            {/* Browse Menu - Public access */}
            <Nav.Link 
              as={Link} 
              to="/browse/menu" 
              className={isActive('/browse/menu') ? 'active' : ''}
            >
              🍽️ Menu
            </Nav.Link>
            
            {/* Browse Tables - Public access */}
            <Nav.Link 
              as={Link} 
              to="/browse/tables" 
              className={isActive('/browse/tables') ? 'active' : ''}
            >
              🪑 Tables
            </Nav.Link>
            
            {isAuthenticated() ? (
              <>
                {/* Customer Portal - Available to all authenticated users */}
                <NavDropdown title="👥 Customer Portal" id="customer-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/customer">
                    Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/customer/menu">
                    Browse Menu
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/customer/booking">
                    Book Table
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/customer/feedback">
                    Give Feedback
                  </NavDropdown.Item>
                </NavDropdown>

                {/* Manager Portal - Only for managers */}
                {isManager() && (
                  <NavDropdown title="👨‍💼 Manager Portal" id="manager-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/manager">
                      Dashboard
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/manager/chefs">
                      Chef Management
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/manager/tables">
                      Table Management
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/manager/menu">
                      Menu Management
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/manager/feedback">
                      View Feedback
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </>
            ) : null}
          </Nav>

          {isAuthenticated() ? (
            <Nav>
              <NavDropdown 
                title={
                  <span>
                    {isManager() ? '👨‍💼' : '👤'} {user.name}
                  </span>
                } 
                id="user-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item disabled>
                  <small className="text-muted">
                    Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </small>
                </NavDropdown.Item>
                <NavDropdown.Item disabled>
                  <small className="text-muted">
                    {user.email}
                  </small>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  🚪 Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            <Nav className="ms-auto">
              <Button variant="outline-light" onClick={() => navigate('/login')}>
                👤 Sign In
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
