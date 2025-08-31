import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { menuAPI } from '../../services/api';

function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true
  });

  const categories = [
    'APPETIZER', 'MAIN_COURSE', 'DESSERT', 'BEVERAGE', 
    'SALAD', 'SOUP', 'PASTA', 'PIZZA', 'SEAFOOD', 'MEAT'
  ];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getAllMenuItems();
      setMenuItems(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load menu items');
      console.error('Fetch menu items error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const itemData = {
        name: formData.name,
        description: `Delicious ${formData.name.toLowerCase()} from our kitchen`, // Auto-generated description
        price: parseFloat(formData.price),
        category: formData.category,
        preparationTimeMinutes: 15, // Default prep time
        calories: 0, // Default calories
        ingredients: [], // Empty ingredients array
        allergens: [], // Empty allergens array
        isVegetarian: formData.isVegetarian,
        isVegan: formData.isVegan,
        isGlutenFree: formData.isGlutenFree,
        isAvailable: formData.isAvailable
      };

      if (editingItem) {
        await menuAPI.updateMenuItem(editingItem.id, itemData);
        setSuccess('Menu item updated successfully!');
      } else {
        await menuAPI.createMenuItem(itemData);
        setSuccess('Menu item added successfully!');
      }

      setShowModal(false);
      setEditingItem(null);
      resetForm();
      fetchMenuItems();
    } catch (err) {
      setError('Failed to save menu item');
      console.error('Save menu item error:', err);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      isGlutenFree: item.isGlutenFree,
      isAvailable: item.isAvailable
    });
    setShowModal(true);
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await menuAPI.deleteMenuItem(itemId);
        setSuccess('Menu item deleted successfully!');
        fetchMenuItems();
      } catch (err) {
        setError('Failed to delete menu item');
        console.error('Delete menu item error:', err);
      }
    }
  };

  const handleToggleAvailability = async (itemId, currentStatus) => {
    try {
      await menuAPI.toggleAvailability(itemId, !currentStatus);
      setSuccess(`Menu item ${!currentStatus ? 'enabled' : 'disabled'} successfully!`);
      fetchMenuItems();
    } catch (err) {
      setError('Failed to update availability');
      console.error('Toggle availability error:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '',
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isAvailable: true
    });
  };

  const handleAddNew = () => {
    setEditingItem(null);
    resetForm();
    setShowModal(true);
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const getDietaryBadges = (item) => {
    const badges = [];
    if (item.isVegetarian) badges.push(<Badge key="veg" bg="success" className="me-1">Vegetarian</Badge>);
    if (item.isVegan) badges.push(<Badge key="vegan" bg="success" className="me-1">Vegan</Badge>);
    if (item.isGlutenFree) badges.push(<Badge key="gf" bg="info" className="me-1">Gluten-Free</Badge>);
    return badges;
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center">
          <h2>Loading menu items...</h2>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col md={12}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Menu Management</h1>
            <Button variant="primary" onClick={handleAddNew}>
              + Add New Item
            </Button>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">Menu Items ({menuItems.length})</h4>
            </Card.Header>
            <Card.Body>
              {menuItems.length === 0 ? (
                <p className="text-muted text-center">No menu items found</p>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Dietary Options</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.name}</strong>
                        </td>
                        <td>
                          <Badge bg="secondary">
                            {item.category.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td>
                          <strong>{formatPrice(item.price)}</strong>
                        </td>
                        <td>
                          {getDietaryBadges(item)}
                        </td>
                        <td>
                          <Badge bg={item.isAvailable ? 'success' : 'danger'}>
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant={item.isAvailable ? 'outline-warning' : 'outline-success'}
                              size="sm"
                              onClick={() => handleToggleAvailability(item.id, item.isAvailable)}
                            >
                              {item.isAvailable ? 'Disable' : 'Enable'}
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                            >
                              Delete
                            </Button>
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

      {/* Add/Edit Menu Item Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter item name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.replace('_', ' ')}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Dietary Options</Form.Label>
                  <div className="d-flex gap-3">
                    <Form.Check
                      type="checkbox"
                      name="isVegetarian"
                      label="Vegetarian"
                      checked={formData.isVegetarian}
                      onChange={handleInputChange}
                    />
                    <Form.Check
                      type="checkbox"
                      name="isVegan"
                      label="Vegan"
                      checked={formData.isVegan}
                      onChange={handleInputChange}
                    />
                    <Form.Check
                      type="checkbox"
                      name="isGlutenFree"
                      label="Gluten-Free"
                      checked={formData.isGlutenFree}
                      onChange={handleInputChange}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="isAvailable"
                    label="Available"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingItem ? 'Update Item' : 'Add Item'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default MenuManagement;
