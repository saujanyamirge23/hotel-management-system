import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Alert } from 'react-bootstrap';
import { menuAPI } from '../../services/api';

function MenuView() {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filters, setFilters] = useState({
    isVegetarian: false,
    isVegan: false,
    isSpicy: false
  });

  const categories = ['APPETIZER', 'SOUP', 'SALAD', 'MAIN_COURSE', 'DESSERT', 'BEVERAGE', 'SPECIAL'];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    filterMenuItems();
  }, [menuItems, searchTerm, selectedCategory, filters]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getAvailableMenuItems();
      setMenuItems(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load menu items');
      console.error('Menu error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterMenuItems = () => {
    let filtered = menuItems;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Dietary filters
    if (filters.isVegetarian) {
      filtered = filtered.filter(item => item.isVegetarian);
    }
    if (filters.isVegan) {
      filtered = filtered.filter(item => item.isVegan);
    }
    if (filters.isSpicy) {
      filtered = filtered.filter(item => item.isSpicy);
    }

    setFilteredItems(filtered);
  };

  const handleFilterChange = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setFilters({
      isVegetarian: false,
      isVegan: false,
      isSpicy: false
    });
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const getCategoryDisplay = (category) => {
    return category.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center">
          <h2>Loading menu...</h2>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col md={12}>
          <h1 className="mb-4">Our Menu</h1>
          {error && <Alert variant="danger">{error}</Alert>}
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Filter Menu Items</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Search</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Search menu items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {getCategoryDisplay(category)}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Label>Dietary Preferences</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="checkbox"
                      label="Vegetarian"
                      checked={filters.isVegetarian}
                      onChange={() => handleFilterChange('isVegetarian')}
                    />
                    <Form.Check
                      inline
                      type="checkbox"
                      label="Vegan"
                      checked={filters.isVegan}
                      onChange={() => handleFilterChange('isVegan')}
                    />
                    <Form.Check
                      inline
                      type="checkbox"
                      label="Spicy"
                      checked={filters.isSpicy}
                      onChange={() => handleFilterChange('isSpicy')}
                    />
                  </div>
                  <Button variant="outline-secondary" size="sm" className="mt-2" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Menu Items */}
      <Row>
        <Col md={12}>
          <h4 className="mb-3">
            Menu Items ({filteredItems.length})
          </h4>
          {filteredItems.length === 0 ? (
            <Alert variant="info">
              No menu items found matching your criteria.
            </Alert>
          ) : (
            <Row>
              {filteredItems.map((item) => (
                <Col md={6} lg={4} key={item.id} className="mb-4">
                  <Card className="h-100 menu-item-card">
                    {item.imageUrl && (
                      <Card.Img variant="top" src={item.imageUrl} style={{height: '200px', objectFit: 'cover'}} />
                    )}
                    <Card.Body className="d-flex flex-column">
                      <div className="mb-2">
                        <Badge bg="secondary" className="me-2">
                          {getCategoryDisplay(item.category)}
                        </Badge>
                        {item.isVegetarian && <Badge bg="success" className="me-1">Vegetarian</Badge>}
                        {item.isVegan && <Badge bg="success" className="me-1">Vegan</Badge>}
                        {item.isSpicy && <Badge bg="danger" className="me-1">Spicy 🌶️</Badge>}
                      </div>
                      
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text className="flex-grow-1">
                        {item.description}
                      </Card.Text>
                      
                      {item.ingredients && (
                        <div className="mb-2">
                          <small className="text-muted">
                            <strong>Ingredients:</strong> {item.ingredients}
                          </small>
                        </div>
                      )}
                      
                      {item.allergens && (
                        <div className="mb-2">
                          <small className="text-danger">
                            <strong>Allergens:</strong> {item.allergens}
                          </small>
                        </div>
                      )}
                      
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <div>
                          <div className="price-tag">{formatPrice(item.price)}</div>
                          {item.calories && (
                            <small className="text-muted">{item.calories} cal</small>
                          )}
                        </div>
                        {item.preparationTime && (
                          <small className="text-muted">
                            ⏱️ {item.preparationTime} min
                          </small>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default MenuView;
