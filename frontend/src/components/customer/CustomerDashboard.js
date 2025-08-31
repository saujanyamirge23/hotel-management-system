import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { tableAPI } from '../../services/api';

function CustomerDashboard() {
  const navigate = useNavigate();
  const [waitingInfo, setWaitingInfo] = useState({});
  const [availableTables, setAvailableTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [waitingResponse, tablesResponse] = await Promise.all([
        tableAPI.getWaitingTimeInfo(),
        tableAPI.getAvailableTables()
      ]);
      
      setWaitingInfo(waitingResponse.data);
      setAvailableTables(tablesResponse.data);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center">
          <h2>Loading dashboard...</h2>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col md={12}>
          <h1 className="mb-4">Customer Dashboard</h1>
          {error && <Alert variant="danger">{error}</Alert>}
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stats-card text-center">
            <Card.Body>
              <div className="stats-number available-tables">
                {waitingInfo.availableTableCount || 0}
              </div>
              <div className="stats-label">Available Tables</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card text-center">
            <Card.Body>
              <div className="stats-number waiting-time">
                {waitingInfo.currentWaitingCount || 0}
              </div>
              <div className="stats-label">People Waiting</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card text-center">
            <Card.Body>
              <div className="stats-number">
                {Math.round(waitingInfo.averageWaitTime || 0)} min
              </div>
              <div className="stats-label">Average Wait Time</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card text-center">
            <Card.Body>
              <div className="stats-number">
                {waitingInfo.occupiedTableCount || 0}
              </div>
              <div className="stats-label">Occupied Tables</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">Quick Actions</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="mb-3">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-100"
                    onClick={() => navigate('/customer/booking')}
                  >
                    🪑 Book a Table
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button 
                    variant="success" 
                    size="lg" 
                    className="w-100"
                    onClick={() => navigate('/customer/menu')}
                  >
                    📋 View Menu
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button 
                    variant="info" 
                    size="lg" 
                    className="w-100"
                    onClick={() => fetchDashboardData()}
                  >
                    🔄 Refresh Status
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button 
                    variant="warning" 
                    size="lg" 
                    className="w-100"
                    onClick={() => navigate('/customer/feedback')}
                  >
                    💬 Give Feedback
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Available Tables */}
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">Available Tables ({availableTables.length})</h4>
            </Card.Header>
            <Card.Body>
              {availableTables.length === 0 ? (
                <Alert variant="info">
                  No tables are currently available. Please check back later or join the waiting list.
                </Alert>
              ) : (
                <Row>
                  {availableTables.map((table) => (
                    <Col md={4} key={table.id} className="mb-3">
                      <Card className="h-100">
                        <Card.Body>
                          <h5>Table #{table.tableNumber}</h5>
                          <p className="mb-1">
                            <strong>Capacity:</strong> {table.capacity} people
                          </p>
                          <p className="mb-1">
                            <strong>Location:</strong> {table.locationDescription || 'Main dining area'}
                          </p>
                          <p className="mb-3">
                            <span className="badge bg-success">Available</span>
                          </p>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => navigate('/customer/booking', { state: { selectedTable: table } })}
                          >
                            Book This Table
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CustomerDashboard;
