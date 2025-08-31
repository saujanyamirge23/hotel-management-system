import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Alert, Modal } from 'react-bootstrap';
import { menuAPI } from '../../services/mockAPI';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const GuestMenuView = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDietary, setSelectedDietary] = useState('All');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    filterMenuItems();
  }, [menuItems, searchTerm, selectedCategory, selectedDietary]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getAllMenuItems();
      setMenuItems(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load menu items');
      console.error('Error fetching menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterMenuItems = () => {
    let filtered = menuItems.filter(item => item.isAvailable);

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (selectedDietary !== 'All') {
      filtered = filtered.filter(item =>
        item.dietaryInfo && item.dietaryInfo.includes(selectedDietary)
      );
    }

    setFilteredItems(filtered);
  };

  const handleOrderClick = () => {
    if (isAuthenticated()) {
      navigate('/customer/booking');
    } else {
      setShowLoginPrompt(true);
    }
  };

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  const dietaryOptions = ['All', 'Vegetarian', 'Vegan', 'Gluten-Free'];

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading our delicious menu...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="text-center">
            <h1 className="display-4 text-primary mb-3">🍽️ Our Menu</h1>
            <p className="lead text-muted">
              Discover our chef's signature dishes crafted with the finest ingredients
            </p>
            {!isAuthenticated() && (
              <Alert variant="info" className="mt-3">
                <strong>👋 Browsing as Guest</strong> - You can view our menu and availability. 
                <Button variant="link" className="p-0 ms-2" onClick={() => navigate('/login')}>
                  Sign in to place orders
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

      {/* Filters */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>🔍 Search Menu</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>📂 Category</Form.Label>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>🥗 Dietary Preferences</Form.Label>
            <Form.Select
              value={selectedDietary}
              onChange={(e) => setSelectedDietary(e.target.value)}
            >
              {dietaryOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Menu Items */}
      <Row className="g-4">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <Col key={item.id} md={6} lg={4}>
              <Card className="h-100 shadow-sm menu-item-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title text-primary">{item.name}</h5>
                    <span className="badge bg-success fs-6">${item.price}</span>
                  </div>
                  
                  <p className="text-muted small mb-3">{item.description}</p>
                  
                  <div className="mb-3">
                    <Badge bg="secondary" className="me-2">{item.category}</Badge>
                    {item.dietaryInfo && item.dietaryInfo.map(diet => (
                      <Badge key={diet} bg="info" className="me-1">{diet}</Badge>
                    ))}
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      ⏱️ {item.preparationTime} mins
                    </small>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={handleOrderClick}
                    >
                      {isAuthenticated() ? 'Order Now' : 'Sign in to Order'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <div className="text-center py-5">
              <h4 className="text-muted">No menu items found</h4>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          </Col>
        )}
      </Row>

      {/* Call to Action */}
      <Row className="mt-5">
        <Col>
          <Card className="bg-light">
            <Card.Body className="text-center py-4">
              <h4>Ready to Dine With Us?</h4>
              <p className="mb-3">Reserve your table and enjoy our exquisite cuisine</p>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleOrderClick}
                className="me-3"
              >
                🎯 Book Your Table
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
          <p>To place an order or make a reservation, please sign in to your account.</p>
          <p className="text-muted">Don't have an account? You can create one during the sign-in process.</p>
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

export default GuestMenuView;
