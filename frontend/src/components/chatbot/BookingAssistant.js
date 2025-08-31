import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { tableAPI, bookingAPI } from '../../services/mockAPI';
import { useAuth } from '../../contexts/AuthContext';

const BookingAssistant = ({ onBookingComplete, onClose }) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    partySize: 2,
    specialRequests: ''
  });
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (step === 2) {
      fetchAvailableTables();
    }
  }, [step, bookingData.date, bookingData.time]);

  const fetchAvailableTables = async () => {
    setLoading(true);
    try {
      const response = await tableAPI.getAllTables();
      const tables = response.data.filter(table => 
        table.status === 'available' && table.capacity >= bookingData.partySize
      );
      setAvailableTables(tables);
    } catch (err) {
      setError('Failed to fetch available tables');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!bookingData.date || !bookingData.time) {
        setError('Please select both date and time');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
    setError('');
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
  };

  const handleBookingSubmit = async () => {
    if (!selectedTable) {
      setError('Please select a table');
      return;
    }

    setLoading(true);
    try {
      const booking = {
        userId: user.id,
        tableId: selectedTable.id,
        date: bookingData.date,
        time: bookingData.time,
        partySize: bookingData.partySize,
        specialRequests: bookingData.specialRequests,
        status: 'confirmed'
      };

      await bookingAPI.createBooking(booking);
      onBookingComplete({
        ...booking,
        tableName: selectedTable.name,
        tableCapacity: selectedTable.capacity
      });
    } catch (err) {
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 11; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  return (
    <Card className="border-0" style={{ maxHeight: '500px', overflowY: 'auto' }}>
      <Card.Header 
        className="d-flex justify-content-between align-items-center"
        style={{ background: 'linear-gradient(135deg, #d4a574 0%, #8b4513 100%)', color: 'white' }}
      >
        <h6 className="mb-0">🍽️ Table Booking Assistant</h6>
        <small>Step {step} of 3</small>
      </Card.Header>

      <Card.Body className="p-4">
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        {/* Step 1: Date, Time, Party Size */}
        {step === 1 && (
          <div>
            <h6 className="mb-3">📅 When would you like to dine?</h6>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={bookingData.date}
                    min={getTomorrowDate()}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Time</Form.Label>
                  <Form.Select
                    value={bookingData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                  >
                    <option value="">Select time</option>
                    {getTimeSlots().map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Party Size</Form.Label>
              <Form.Select
                value={bookingData.partySize}
                onChange={(e) => handleInputChange('partySize', parseInt(e.target.value))}
              >
                {[1,2,3,4,5,6,7,8].map(size => (
                  <option key={size} value={size}>{size} {size === 1 ? 'person' : 'people'}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="outline-secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleNextStep}
                style={{ background: 'linear-gradient(135deg, #d4a574 0%, #8b4513 100%)', border: 'none' }}
              >
                Next: Select Table
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Table Selection */}
        {step === 2 && (
          <div>
            <h6 className="mb-3">🪑 Choose your table</h6>
            
            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" />
                <p className="mt-2">Finding available tables...</p>
              </div>
            ) : availableTables.length === 0 ? (
              <Alert variant="warning">
                No tables available for your selected time and party size. Please try a different time.
              </Alert>
            ) : (
              <div>
                <p className="text-muted mb-3">
                  Found {availableTables.length} available tables for {bookingData.partySize} people on {bookingData.date} at {bookingData.time}
                </p>
                
                <Row>
                  {availableTables.map(table => (
                    <Col md={6} key={table.id} className="mb-3">
                      <Card 
                        className={`cursor-pointer ${selectedTable?.id === table.id ? 'border-primary' : ''}`}
                        onClick={() => handleTableSelect(table)}
                        style={{ 
                          cursor: 'pointer',
                          borderWidth: selectedTable?.id === table.id ? '2px' : '1px'
                        }}
                      >
                        <Card.Body className="text-center">
                          <h6>{table.name}</h6>
                          <p className="mb-1">Capacity: {table.capacity} people</p>
                          <p className="mb-0 text-muted">{table.location}</p>
                          {selectedTable?.id === table.id && (
                            <div className="mt-2">
                              <span className="badge bg-primary">Selected</span>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            <div className="d-flex justify-content-between mt-3">
              <Button variant="outline-secondary" onClick={handlePreviousStep}>
                Back
              </Button>
              <Button 
                onClick={handleNextStep}
                disabled={!selectedTable}
                style={{ background: 'linear-gradient(135deg, #d4a574 0%, #8b4513 100%)', border: 'none' }}
              >
                Next: Confirm Booking
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div>
            <h6 className="mb-3">✅ Confirm your booking</h6>
            
            <Card className="mb-3" style={{ background: '#f8f9fa' }}>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <strong>Date:</strong> {bookingData.date}<br/>
                    <strong>Time:</strong> {bookingData.time}<br/>
                    <strong>Party Size:</strong> {bookingData.partySize} people
                  </Col>
                  <Col md={6}>
                    <strong>Table:</strong> {selectedTable?.name}<br/>
                    <strong>Location:</strong> {selectedTable?.location}<br/>
                    <strong>Capacity:</strong> {selectedTable?.capacity} people
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Form.Group className="mb-3">
              <Form.Label>Special Requests (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Any dietary restrictions, special occasions, or other requests..."
                value={bookingData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="outline-secondary" onClick={handlePreviousStep}>
                Back
              </Button>
              <Button 
                onClick={handleBookingSubmit}
                disabled={loading}
                style={{ background: 'linear-gradient(135deg, #d4a574 0%, #8b4513 100%)', border: 'none' }}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Confirming...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default BookingAssistant;
