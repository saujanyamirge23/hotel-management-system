import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { feedbackAPI } from '../../services/api';

function FeedbackForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [feedbackData, setFeedbackData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    overallRating: 5,
    foodRating: 5,
    serviceRating: 5,
    ambianceRating: 5,
    comments: '',
    suggestions: '',
    feedbackType: 'GENERAL',
    isAnonymous: false,
    visitDate: ''
  });

  const feedbackTypes = [
    { value: 'GENERAL', label: 'General Feedback' },
    { value: 'COMPLAINT', label: 'Complaint' },
    { value: 'COMPLIMENT', label: 'Compliment' },
    { value: 'SUGGESTION', label: 'Suggestion' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFeedbackData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRatingChange = (ratingType, value) => {
    setFeedbackData(prev => ({
      ...prev,
      [ratingType]: parseInt(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!feedbackData.isAnonymous && !feedbackData.customerName.trim()) {
      setError('Customer name is required for non-anonymous feedback');
      return;
    }

    if (!feedbackData.comments.trim()) {
      setError('Please provide some comments');
      return;
    }

    try {
      setLoading(true);
      const feedback = {
        ...feedbackData,
        visitDate: feedbackData.visitDate ? new Date(feedbackData.visitDate).toISOString() : null
      };

      await feedbackAPI.createFeedback(feedback);
      setSuccess('Thank you for your feedback! Your input helps us improve our service.');
      
      // Reset form
      setFeedbackData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        overallRating: 5,
        foodRating: 5,
        serviceRating: 5,
        ambianceRating: 5,
        comments: '',
        suggestions: '',
        feedbackType: 'GENERAL',
        isAnonymous: false,
        visitDate: ''
      });
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error('Feedback error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStarRating = (ratingType, currentRating) => {
    return (
      <div className="d-flex align-items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`btn btn-link p-0 me-1 ${star <= currentRating ? 'text-warning' : 'text-muted'}`}
            onClick={() => handleRatingChange(ratingType, star)}
            style={{ fontSize: '1.5rem', textDecoration: 'none' }}
          >
            ★
          </button>
        ))}
        <span className="ms-2">({currentRating}/5)</span>
      </div>
    );
  };

  return (
    <Container>
      <Row>
        <Col md={12}>
          <h1 className="mb-4">Share Your Feedback</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
        </Col>
      </Row>

      <Row>
        <Col md={8} className="mx-auto">
          <Card className="feedback-form">
            <Card.Header>
              <h4 className="mb-0">We Value Your Opinion</h4>
              <small className="text-muted">Help us improve by sharing your dining experience</small>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {/* Anonymous Feedback Option */}
                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    name="isAnonymous"
                    label="Submit anonymous feedback"
                    checked={feedbackData.isAnonymous}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                {/* Customer Information */}
                {!feedbackData.isAnonymous && (
                  <Row className="mb-4">
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Your Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="customerName"
                          value={feedbackData.customerName}
                          onChange={handleInputChange}
                          placeholder="Enter your name"
                          required={!feedbackData.isAnonymous}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email (Optional)</Form.Label>
                        <Form.Control
                          type="email"
                          name="customerEmail"
                          value={feedbackData.customerEmail}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone (Optional)</Form.Label>
                        <Form.Control
                          type="tel"
                          name="customerPhone"
                          value={feedbackData.customerPhone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                {/* Visit Information */}
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Feedback Type</Form.Label>
                      <Form.Select
                        name="feedbackType"
                        value={feedbackData.feedbackType}
                        onChange={handleInputChange}
                      >
                        {feedbackTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Visit Date (Optional)</Form.Label>
                      <Form.Control
                        type="date"
                        name="visitDate"
                        value={feedbackData.visitDate}
                        onChange={handleInputChange}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Ratings */}
                <div className="mb-4">
                  <h5 className="mb-3">Rate Your Experience</h5>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Overall Rating</Form.Label>
                        {renderStarRating('overallRating', feedbackData.overallRating)}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Food Quality</Form.Label>
                        {renderStarRating('foodRating', feedbackData.foodRating)}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Service Quality</Form.Label>
                        {renderStarRating('serviceRating', feedbackData.serviceRating)}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Ambiance</Form.Label>
                        {renderStarRating('ambianceRating', feedbackData.ambianceRating)}
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                {/* Comments */}
                <Form.Group className="mb-3">
                  <Form.Label>Comments *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="comments"
                    value={feedbackData.comments}
                    onChange={handleInputChange}
                    placeholder="Please share your experience with us..."
                    required
                  />
                </Form.Group>

                {/* Suggestions */}
                <Form.Group className="mb-4">
                  <Form.Label>Suggestions for Improvement</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="suggestions"
                    value={feedbackData.suggestions}
                    onChange={handleInputChange}
                    placeholder="How can we improve? Any suggestions are welcome..."
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button 
                    variant="secondary" 
                    onClick={() => navigate('/customer')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default FeedbackForm;
