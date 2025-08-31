import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { chefAPI, tableAPI, menuAPI, feedbackAPI } from '../../services/api';

function ManagerDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    chefs: { active: 0, total: 0 },
    tables: { available: 0, occupied: 0, total: 0 },
    bookings: { waiting: 0, total: 0 },
    menu: { available: 0, total: 0 },
    feedback: { total: 0, averageRating: 0 }
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [
        chefsResponse,
        tablesResponse,
        waitingInfoResponse,
        bookingsResponse,
        menuResponse,
        feedbackAnalyticsResponse,
        recentFeedbackResponse
      ] = await Promise.all([
        chefAPI.getActiveChefs(),
        tableAPI.getAllTables(),
        tableAPI.getWaitingTimeInfo(),
        tableAPI.getWaitingBookings(),
        menuAPI.getAllMenuItems(),
        feedbackAPI.getFeedbackAnalytics(),
        feedbackAPI.getRecentFeedback(7)
      ]);

      // Process the data
      setDashboardData({
        chefs: {
          active: chefsResponse.data.length,
          total: chefsResponse.data.length // We only get active chefs from this endpoint
        },
        tables: {
          available: waitingInfoResponse.data.availableTableCount || 0,
          occupied: waitingInfoResponse.data.occupiedTableCount || 0,
          total: tablesResponse.data.length
        },
        bookings: {
          waiting: waitingInfoResponse.data.currentWaitingCount || 0,
          total: bookingsResponse.data.length
        },
        menu: {
          available: menuResponse.data.filter(item => item.isAvailable).length,
          total: menuResponse.data.length
        },
        feedback: {
          total: feedbackAnalyticsResponse.data.totalFeedback || 0,
          averageRating: feedbackAnalyticsResponse.data.averageOverallRating || 0
        }
      });

      setRecentBookings(bookingsResponse.data.slice(0, 5));
      setRecentFeedback(recentFeedbackResponse.data.slice(0, 5));
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : '0.0';
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'WAITING': 'warning',
      'SEATED': 'success',
      'COMPLETED': 'secondary',
      'CANCELLED': 'danger'
    };
    return statusColors[status] || 'secondary';
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Manager Dashboard</h1>
            <Button variant="outline-primary" onClick={fetchDashboardData}>
              🔄 Refresh Data
            </Button>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
        </Col>
      </Row>

      {/* Key Metrics */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stats-card text-center">
            <Card.Body>
              <div className="stats-number text-primary">
                {dashboardData.chefs.active}
              </div>
              <div className="stats-label">Active Chefs</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card text-center">
            <Card.Body>
              <div className="stats-number available-tables">
                {dashboardData.tables.available}
              </div>
              <div className="stats-label">Available Tables</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card text-center">
            <Card.Body>
              <div className="stats-number waiting-time">
                {dashboardData.bookings.waiting}
              </div>
              <div className="stats-label">Waiting Customers</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card text-center">
            <Card.Body>
              <div className="stats-number rating-stars">
                {formatRating(dashboardData.feedback.averageRating)} ⭐
              </div>
              <div className="stats-label">Average Rating</div>
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
                    onClick={() => navigate('/manager/chefs')}
                  >
                    👨‍🍳 Manage Chefs
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button 
                    variant="success" 
                    size="lg" 
                    className="w-100"
                    onClick={() => navigate('/manager/tables')}
                  >
                    🪑 Manage Tables
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button 
                    variant="info" 
                    size="lg" 
                    className="w-100"
                    onClick={() => navigate('/manager/menu')}
                  >
                    📋 Manage Menu
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button 
                    variant="warning" 
                    size="lg" 
                    className="w-100"
                    onClick={() => navigate('/manager/feedback')}
                  >
                    💬 View Feedback
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Bookings</h5>
            </Card.Header>
            <Card.Body>
              {recentBookings.length === 0 ? (
                <p className="text-muted">No recent bookings</p>
              ) : (
                <Table responsive size="sm">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Party Size</th>
                      <th>Status</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.customerName}</td>
                        <td>{booking.partySize}</td>
                        <td>
                          <span className={`badge bg-${getStatusBadge(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>{formatDateTime(booking.bookingTime)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Feedback</h5>
            </Card.Header>
            <Card.Body>
              {recentFeedback.length === 0 ? (
                <p className="text-muted">No recent feedback</p>
              ) : (
                <div>
                  {recentFeedback.map((feedback) => (
                    <div key={feedback.id} className="mb-3 p-2 border-bottom">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong>{feedback.customerName || 'Anonymous'}</strong>
                          <div className="rating-stars">
                            {'★'.repeat(feedback.overallRating)}{'☆'.repeat(5-feedback.overallRating)}
                          </div>
                        </div>
                        <small className="text-muted">
                          {formatDateTime(feedback.createdAt)}
                        </small>
                      </div>
                      <p className="mb-0 mt-1">
                        {feedback.comments.length > 100 
                          ? feedback.comments.substring(0, 100) + '...' 
                          : feedback.comments}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ManagerDashboard;
