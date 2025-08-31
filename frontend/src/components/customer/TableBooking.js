import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { tableAPI } from '../../services/api';

function TableBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const [availableTables, setAvailableTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    customerName: '',
    customerPhone: '',
    partySize: 2,
    bookingTime: '',
    specialRequests: ''
  });

  const selectedTable = location.state?.selectedTable;

  useEffect(() => {
    fetchAvailableTables();
    if (bookingData.partySize) {
      getWaitTimeEstimate(bookingData.partySize);
    }
  }, []);

  useEffect(() => {
    if (bookingData.partySize) {
      getWaitTimeEstimate(bookingData.partySize);
    }
  }, [bookingData.partySize]);

  const fetchAvailableTables = async () => {
    try {
      const response = await tableAPI.getAvailableTables();
      setAvailableTables(response.data);
    } catch (err) {
      setError('Failed to load available tables');
      console.error('Tables error:', err);
    }
  };

  const getWaitTimeEstimate = async (partySize) => {
    try {
      const response = await tableAPI.getEstimatedWaitTime(partySize);
      setEstimatedWaitTime(response.data.estimatedWaitTime);
    } catch (err) {
      console.error('Wait time error:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!bookingData.customerName.trim()) {
      setError('Customer name is required');
      return;
    }
    if (!bookingData.customerPhone.trim()) {
      setError('Phone number is required');
      return;
    }
    if (!bookingData.bookingTime) {
      setError('Booking time is required');
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmBooking = async () => {
    try {
      setLoading(true);
      const booking = {
        ...bookingData,
        bookingTime: new Date(bookingData.bookingTime).toISOString()
      };

      const response = await tableAPI.createBooking(booking);
      setSuccess(`Booking confirmed! Your booking ID is ${response.data.id}. Estimated wait time: ${estimatedWaitTime} minutes.`);
      setShowConfirmModal(false);
      
      // Reset form
      setBookingData({
        customerName: '',
        customerPhone: '',
        partySize: 2,
        bookingTime: '',
        specialRequests: ''
      });
    } catch (err) {
      setError('Failed to create booking. Please try again.');
      console.error('Booking error:', err);
      setShowConfirmModal(false);
    } finally {
      setLoading(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Minimum 30 minutes from now
    return now.toISOString().slice(0, 16);
  };

  return (
    <Container>
      <Row>
        <Col md={12}>
          <h1 className="mb-4">Book a Table</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">Booking Details</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Customer Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="customerName"
                        value={bookingData.customerName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="customerPhone"
                        value={bookingData.customerPhone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Party Size *</Form.Label>
                      <Form.Select
                        name="partySize"
                        value={bookingData.partySize}
                        onChange={handleInputChange}
                        required
                      >
                        {[1,2,3,4,5,6,7,8,9,10].map(size => (
                          <option key={size} value={size}>{size} {size === 1 ? 'person' : 'people'}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Preferred Time *</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="bookingTime"
                        value={bookingData.bookingTime}
                        onChange={handleInputChange}
                        min={getMinDateTime()}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Special Requests</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={handleInputChange}
                    placeholder="Any special requests or dietary requirements..."
                  />
                </Form.Group>

                <Button type="submit" variant="primary" size="lg" disabled={loading}>
                  {loading ? 'Processing...' : 'Book Table'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          {/* Wait Time Info */}
          <Card className="mb-3">
            <Card.Header>
              <h5 className="mb-0">Wait Time Estimate</h5>
            </Card.Header>
            <Card.Body className="text-center">
              {estimatedWaitTime !== null ? (
                <>
                  <div className="stats-number waiting-time">
                    {estimatedWaitTime} min
                  </div>
                  <div className="stats-label">
                    Estimated wait time for {bookingData.partySize} {bookingData.partySize === 1 ? 'person' : 'people'}
                  </div>
                </>
              ) : (
                <p>Select party size to see estimate</p>
              )}
            </Card.Body>
          </Card>

          {/* Available Tables */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">Available Tables ({availableTables.length})</h5>
            </Card.Header>
            <Card.Body>
              {availableTables.length === 0 ? (
                <Alert variant="warning" className="mb-0">
                  No tables currently available. You can still book and join the waiting list.
                </Alert>
              ) : (
                <div>
                  {availableTables.slice(0, 5).map((table) => (
                    <div key={table.id} className="mb-2 p-2 border rounded">
                      <strong>Table #{table.tableNumber}</strong><br />
                      <small>Capacity: {table.capacity} people</small><br />
                      <small className="text-muted">{table.locationDescription || 'Main dining area'}</small>
                    </div>
                  ))}
                  {availableTables.length > 5 && (
                    <small className="text-muted">
                      +{availableTables.length - 5} more tables available
                    </small>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Booking Details:</h5>
          <p><strong>Name:</strong> {bookingData.customerName}</p>
          <p><strong>Phone:</strong> {bookingData.customerPhone}</p>
          <p><strong>Party Size:</strong> {bookingData.partySize} {bookingData.partySize === 1 ? 'person' : 'people'}</p>
          <p><strong>Time:</strong> {new Date(bookingData.bookingTime).toLocaleString()}</p>
          {bookingData.specialRequests && (
            <p><strong>Special Requests:</strong> {bookingData.specialRequests}</p>
          )}
          <p><strong>Estimated Wait Time:</strong> {estimatedWaitTime} minutes</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmBooking} disabled={loading}>
            {loading ? 'Confirming...' : 'Confirm Booking'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default TableBooking;
