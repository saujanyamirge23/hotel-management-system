import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert, Badge, Form, Button } from 'react-bootstrap';
import { feedbackAPI } from '../../services/api';

function FeedbackView() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    feedbackType: '',
    rating: '',
    days: 30
  });

  const feedbackTypes = [
    { value: '', label: 'All Types' },
    { value: 'GENERAL', label: 'General' },
    { value: 'COMPLAINT', label: 'Complaint' },
    { value: 'COMPLIMENT', label: 'Compliment' },
    { value: 'SUGGESTION', label: 'Suggestion' }
  ];

  const ratingOptions = [
    { value: '', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' }
  ];

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch feedback and analytics
      const [feedbackResponse, analyticsResponse] = await Promise.all([
        feedbackAPI.getRecentFeedback(filters.days),
        feedbackAPI.getFeedbackAnalytics()
      ]);

      let feedbackData = feedbackResponse.data;

      // Apply filters
      if (filters.feedbackType) {
        feedbackData = feedbackData.filter(f => f.feedbackType === filters.feedbackType);
      }
      if (filters.rating) {
        feedbackData = feedbackData.filter(f => f.overallRating === parseInt(filters.rating));
      }

      setFeedbacks(feedbackData);
      setAnalytics(analyticsResponse.data);
      setError('');
    } catch (err) {
      setError('Failed to load feedback data');
      console.error('Fetch feedback error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : '0.0';
  };

  const getTypeColor = (type) => {
    const colors = {
      'GENERAL': 'primary',
      'COMPLAINT': 'danger',
      'COMPLIMENT': 'success',
      'SUGGESTION': 'info'
    };
    return colors[type] || 'secondary';
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'success';
    if (rating >= 3) return 'warning';
    return 'danger';
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center">
          <h2>Loading feedback...</h2>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col md={12}>
          <h1 className="mb-4">Customer Feedback</h1>
          {error && <Alert variant="danger">{error}</Alert>}
        </Col>
      </Row>

      {/* Analytics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stats-card text-center">
            <Card.Body>
              <div className="stats-number text-primary">
                {analytics.totalFeedback || 0}
              </div>
              <div className="stats-label">Total Feedback</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card text-center">
            <Card.Body>
              <div className="stats-number rating-stars">
                {formatRating(analytics.averageOverallRating)} ⭐
              </div>
              <div className="stats-label">Average Rating</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card text-center">
            <Card.Body>
              <div className="stats-number text-success">
                {formatRating(analytics.averageFoodRating)}
              </div>
              <div className="stats-label">Food Rating</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card text-center">
            <Card.Body>
              <div className="stats-number text-info">
                {formatRating(analytics.averageServiceRating)}
              </div>
              <div className="stats-label">Service Rating</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Filters</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Feedback Type</Form.Label>
                    <Form.Select
                      name="feedbackType"
                      value={filters.feedbackType}
                      onChange={handleFilterChange}
                    >
                      {feedbackTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Rating</Form.Label>
                    <Form.Select
                      name="rating"
                      value={filters.rating}
                      onChange={handleFilterChange}
                    >
                      {ratingOptions.map(rating => (
                        <option key={rating.value} value={rating.value}>
                          {rating.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Time Period</Form.Label>
                    <Form.Select
                      name="days"
                      value={filters.days}
                      onChange={handleFilterChange}
                    >
                      <option value={7}>Last 7 days</option>
                      <option value={30}>Last 30 days</option>
                      <option value={90}>Last 90 days</option>
                      <option value={365}>Last year</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3} className="d-flex align-items-end">
                  <Button variant="outline-primary" onClick={fetchData} className="w-100">
                    🔄 Refresh
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Feedback List */}
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">Feedback Details ({feedbacks.length})</h4>
            </Card.Header>
            <Card.Body>
              {feedbacks.length === 0 ? (
                <p className="text-muted text-center">No feedback found for the selected criteria</p>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Type</th>
                      <th>Overall Rating</th>
                      <th>Detailed Ratings</th>
                      <th>Comments</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.map((feedback) => (
                      <tr key={feedback.id}>
                        <td>
                          <div>
                            <strong>{feedback.customerName || 'Anonymous'}</strong>
                            {feedback.customerEmail && (
                              <div>
                                <small className="text-muted">{feedback.customerEmail}</small>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <Badge bg={getTypeColor(feedback.feedbackType)}>
                            {feedback.feedbackType}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <Badge bg={getRatingColor(feedback.overallRating)} className="me-2">
                              {feedback.overallRating}
                            </Badge>
                            <span className="rating-stars">
                              {renderStars(feedback.overallRating)}
                            </span>
                          </div>
                        </td>
                        <td>
                          <small>
                            <div>Food: {renderStars(feedback.foodRating)}</div>
                            <div>Service: {renderStars(feedback.serviceRating)}</div>
                            <div>Ambiance: {renderStars(feedback.ambianceRating)}</div>
                          </small>
                        </td>
                        <td>
                          <div style={{ maxWidth: '300px' }}>
                            <div className="mb-1">
                              <strong>Comments:</strong>
                              <div>{feedback.comments}</div>
                            </div>
                            {feedback.suggestions && (
                              <div>
                                <strong>Suggestions:</strong>
                                <div className="text-muted">{feedback.suggestions}</div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div>
                            {formatDateTime(feedback.createdAt)}
                            {feedback.visitDate && (
                              <div>
                                <small className="text-muted">
                                  Visit: {new Date(feedback.visitDate).toLocaleDateString()}
                                </small>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Summary Statistics */}
      {feedbacks.length > 0 && (
        <Row className="mt-4">
          <Col md={12}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Summary Statistics</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <div className="text-center">
                      <h6>Feedback Types</h6>
                      {feedbackTypes.slice(1).map(type => {
                        const count = feedbacks.filter(f => f.feedbackType === type.value).length;
                        return count > 0 ? (
                          <div key={type.value}>
                            <Badge bg={getTypeColor(type.value)} className="me-2">
                              {type.label}: {count}
                            </Badge>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h6>Rating Distribution</h6>
                      {[5, 4, 3, 2, 1].map(rating => {
                        const count = feedbacks.filter(f => f.overallRating === rating).length;
                        return count > 0 ? (
                          <div key={rating}>
                            <Badge bg={getRatingColor(rating)} className="me-2">
                              {rating} ⭐: {count}
                            </Badge>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="text-center">
                      <h6>Average Ratings (Current Filter)</h6>
                      <Row>
                        <Col>
                          <div>Overall: <strong>{formatRating(feedbacks.reduce((sum, f) => sum + f.overallRating, 0) / feedbacks.length)}</strong></div>
                        </Col>
                        <Col>
                          <div>Food: <strong>{formatRating(feedbacks.reduce((sum, f) => sum + f.foodRating, 0) / feedbacks.length)}</strong></div>
                        </Col>
                        <Col>
                          <div>Service: <strong>{formatRating(feedbacks.reduce((sum, f) => sum + f.serviceRating, 0) / feedbacks.length)}</strong></div>
                        </Col>
                        <Col>
                          <div>Ambiance: <strong>{formatRating(feedbacks.reduce((sum, f) => sum + f.ambianceRating, 0) / feedbacks.length)}</strong></div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default FeedbackView;
