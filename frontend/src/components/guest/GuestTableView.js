import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Modal } from 'react-bootstrap';
import { tableAPI } from '../../services/mockAPI';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const GuestTableView = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [waitingTime, setWaitingTime] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTableData();
  }, []);

  const fetchTableData = async () => {
    try {
      setLoading(true);
      const [tablesResponse, waitingResponse] = await Promise.all([
        tableAPI.getAllTables(),
        tableAPI.getWaitingTime()
      ]);
      
      setTables(tablesResponse.data);
      setWaitingTime(waitingResponse.data.waitingTime);
      setError('');
    } catch (err) {
      setError('Failed to load table information');
      console.error('Error fetching tables:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingClick = () => {
    if (isAuthenticated()) {
      navigate('/customer/booking');
    } else {
      setShowLoginPrompt(true);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'occupied': return 'danger';
      case 'reserved': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return '✅';
      case 'occupied': return '🔴';
      case 'reserved': return '⏰';
      default: return '❓';
    }
  };

  const availableTables = tables.filter(table => table.status === 'available');
  const occupiedTables = tables.filter(table => table.status === 'occupied');
  const reservedTables = tables.filter(table => table.status === 'reserved');

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Checking table availability...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="text-center">
            <h1 className="display-4 text-primary mb-3">🪑 Table Availability</h1>
            <p className="lead text-muted">
              Check real-time table availability and current waiting times
            </p>
            {!isAuthenticated() && (
              <Alert variant="info" className="mt-3">
                <strong>👋 Browsing as Guest</strong> - View table availability in real-time. 
                <Button variant="link" className="p-0 ms-2" onClick={() => navigate('/login')}>
                  Sign in to make reservations
                </Button>
              </Alert>
            )}
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h3 className="text-success">{availableTables.length}</h3>
              <p className="mb-0">Available Tables</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h3 className="text-danger">{occupiedTables.length}</h3>
              <p className="mb-0">Occupied Tables</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h3 className="text-warning">{reservedTables.length}</h3>
              <p className="mb-0">Reserved Tables</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h3 className="text-info">{waitingTime}</h3>
              <p className="mb-0">Minutes Wait Time</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Available Tables */}
      {availableTables.length > 0 && (
        <>
          <Row className="mb-3">
            <Col>
              <h3 className="text-success">✅ Available Tables</h3>
              <p className="text-muted">These tables are ready for immediate seating</p>
            </Col>
          </Row>
          <Row className="g-3 mb-4">
            {availableTables.map(table => (
              <Col key={table.id} md={4} lg={3}>
                <Card className="h-100 border-success">
                  <Card.Body className="text-center">
                    <h5 className="text-success">
                      {getStatusIcon(table.status)} Table {table.number}
                    </h5>
                    <p className="mb-2">
                      <strong>Capacity:</strong> {table.capacity} people
                    </p>
                    <p className="mb-3 text-muted small">
                      📍 {table.location}
                    </p>
                    <Button 
                      variant="success" 
                      size="sm" 
                      onClick={handleBookingClick}
                      className="w-100"
                    >
                      {isAuthenticated() ? 'Book Now' : 'Sign in to Book'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      {/* Reserved Tables */}
      {reservedTables.length > 0 && (
        <>
          <Row className="mb-3">
            <Col>
              <h3 className="text-warning">⏰ Reserved Tables</h3>
              <p className="text-muted">These tables have upcoming reservations</p>
            </Col>
          </Row>
          <Row className="g-3 mb-4">
            {reservedTables.map(table => (
              <Col key={table.id} md={4} lg={3}>
                <Card className="h-100 border-warning">
                  <Card.Body className="text-center">
                    <h5 className="text-warning">
                      {getStatusIcon(table.status)} Table {table.number}
                    </h5>
                    <p className="mb-2">
                      <strong>Capacity:</strong> {table.capacity} people
                    </p>
                    <p className="mb-2 text-muted small">
                      📍 {table.location}
                    </p>
                    {table.reservedBy && (
                      <p className="mb-3 small">
                        <Badge bg="warning">Reserved by {table.reservedBy}</Badge>
                      </p>
                    )}
                    <Button 
                      variant="outline-warning" 
                      size="sm" 
                      onClick={handleBookingClick}
                      className="w-100"
                    >
                      {isAuthenticated() ? 'Join Waitlist' : 'Sign in to Waitlist'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      {/* Occupied Tables */}
      {occupiedTables.length > 0 && (
        <>
          <Row className="mb-3">
            <Col>
              <h3 className="text-danger">🔴 Occupied Tables</h3>
              <p className="text-muted">These tables are currently in use</p>
            </Col>
          </Row>
          <Row className="g-3 mb-4">
            {occupiedTables.map(table => (
              <Col key={table.id} md={4} lg={3}>
                <Card className="h-100 border-danger">
                  <Card.Body className="text-center">
                    <h5 className="text-danger">
                      {getStatusIcon(table.status)} Table {table.number}
                    </h5>
                    <p className="mb-2">
                      <strong>Capacity:</strong> {table.capacity} people
                    </p>
                    <p className="mb-3 text-muted small">
                      📍 {table.location}
                    </p>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      disabled
                      className="w-100"
                    >
                      Currently Occupied
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      {/* Call to Action */}
      <Row className="mt-5">
        <Col>
          <Card className="bg-light">
            <Card.Body className="text-center py-4">
              <h4>Ready to Reserve Your Table?</h4>
              <p className="mb-3">
                {availableTables.length > 0 
                  ? `${availableTables.length} tables available for immediate seating!`
                  : `Current wait time: ${waitingTime} minutes`
                }
              </p>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleBookingClick}
                className="me-3"
              >
                🎯 Make Reservation
              </Button>
              {!isAuthenticated() && (
                <Button 
                  variant="outline-primary" 
                  size="lg" 
                  onClick={() => navigate('/login')}
                >
                  👤 Sign In
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Login Prompt Modal */}
      <Modal show={showLoginPrompt} onHide={() => setShowLoginPrompt(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🔐 Sign In Required</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>To make a table reservation, please sign in to your account.</p>
          <p className="text-muted">This helps us manage your bookings and provide better service.</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="primary" onClick={() => navigate('/login')}>
            Sign In Now
          </Button>
          <Button variant="outline-secondary" onClick={() => setShowLoginPrompt(false)}>
            Continue Browsing
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GuestTableView;
