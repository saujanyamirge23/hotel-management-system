import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { user, isManager, isCustomer, isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <h1 className="hero-title">🏨 Grand Palace Hotel</h1>
          <p className="hero-subtitle">
            Experience luxury dining and exceptional hospitality in the heart of the city
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => navigate('/customer')}
              className="px-4 py-2"
            >
              🍽️ Dine With Us
            </Button>
            {isManager() && (
              <Button 
                variant="outline-light" 
                size="lg" 
                onClick={() => navigate('/manager')}
                className="px-4 py-2"
              >
                👨‍💼 Management Portal
              </Button>
            )}
          </div>
          
          {user && (
            <div className="text-center mt-3">
              <p className="text-light">
                Welcome back, <strong>{user.name}</strong>! 
                {isManager() ? ' You have full access to both customer and manager features.' : ' Enjoy your dining experience!'}
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* Features Section */}
      <Container className="py-5">
        <Row className="text-center mb-5">
          <Col>
            <h2 className="display-4 mb-3" style={{ color: 'var(--primary-dark)' }}>
              Welcome to Our Restaurant
            </h2>
            <p className="lead text-muted">
              Discover exquisite cuisine, seamless table booking, and exceptional service
            </p>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={4}>
            <Card className="feature-card h-100">
              <Card.Body>
                <div className="feature-icon">🍽️</div>
                <h4>Gourmet Dining</h4>
                <p className="text-muted">
                  Savor our chef's signature dishes crafted with the finest ingredients. 
                  From appetizers to desserts, every bite is a culinary journey.
                </p>
                <Button 
                  variant="outline-primary" 
                  onClick={() => navigate('/browse/menu')}
                >
                  View Menu
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="feature-card h-100">
              <Card.Body>
                <div className="feature-icon">📅</div>
                <h4>Easy Reservations</h4>
                <p className="text-muted">
                  Book your table instantly with our smart reservation system. 
                  Real-time availability and estimated waiting times.
                </p>
                <Button 
                  variant="outline-primary" 
                  onClick={() => navigate('/browse/tables')}
                >
                  Check Availability
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="feature-card h-100">
              <Card.Body>
                <div className="feature-icon">⭐</div>
                <h4>Premium Service</h4>
                <p className="text-muted">
                  Our experienced staff ensures every guest receives personalized attention. 
                  Share your feedback to help us serve you better.
                </p>
                <Button 
                  variant="outline-primary" 
                  onClick={() => {
                    if (isAuthenticated()) {
                      navigate('/customer/feedback');
                    } else {
                      navigate('/login');
                    }
                  }}
                >
                  {isAuthenticated() ? 'Give Feedback' : 'Sign in for Feedback'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Restaurant Stats */}
        <Row className="mt-5 py-5">
          <Col>
            <Card>
              <Card.Header className="text-center">
                <h3>Why Choose Grand Palace Hotel?</h3>
              </Card.Header>
              <Card.Body>
                <Row className="text-center">
                  <Col md={3}>
                    <div className="stats-card p-4">
                      <div className="stats-number text-primary">50+</div>
                      <div className="stats-label">Gourmet Dishes</div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="stats-card p-4">
                      <div className="stats-number text-success">25</div>
                      <div className="stats-label">Expert Chefs</div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="stats-card p-4">
                      <div className="stats-number text-warning">100+</div>
                      <div className="stats-label">Dining Tables</div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="stats-card p-4">
                      <div className="stats-number text-info">4.8⭐</div>
                      <div className="stats-label">Customer Rating</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Menu Highlights */}
        <Row className="mt-5">
          <Col>
            <h3 className="text-center mb-4" style={{ color: 'var(--primary-dark)' }}>
              🍴 Today's Special Menu
            </h3>
          </Col>
        </Row>
        
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100">
              <Card.Body className="text-center">
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🥗</div>
                <h5>Fresh Salads</h5>
                <p className="text-muted">
                  Garden-fresh ingredients with house-made dressings
                </p>
                <Badge className="bg-success">Vegetarian</Badge>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100">
              <Card.Body className="text-center">
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🍝</div>
                <h5>Pasta Perfection</h5>
                <p className="text-muted">
                  Handmade pasta with authentic Italian flavors
                </p>
                <Badge className="bg-info">Chef's Special</Badge>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100">
              <Card.Body className="text-center">
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🍰</div>
                <h5>Decadent Desserts</h5>
                <p className="text-muted">
                  Sweet endings to your perfect dining experience
                </p>
                <Badge className="bg-warning">Popular</Badge>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Call to Action */}
        <Row className="mt-5 py-4">
          <Col className="text-center">
            <Card className="bg-light">
              <Card.Body className="py-5">
                <h3 className="mb-3">Ready for an Unforgettable Dining Experience?</h3>
                <p className="lead mb-4">
                  Join us today and discover why Grand Palace Hotel is the city's premier dining destination
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={() => {
                      if (isAuthenticated()) {
                        navigate('/customer/booking');
                      } else {
                        navigate('/browse/tables');
                      }
                    }}
                  >
                    🎯 {isAuthenticated() ? 'Reserve Your Table' : 'Check Availability'}
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    size="lg" 
                    onClick={() => navigate('/browse/menu')}
                  >
                    📋 Explore Menu
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
