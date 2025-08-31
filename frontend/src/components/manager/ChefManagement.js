import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { chefAPI } from '../../services/api';

function ChefManagement() {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingChef, setEditingChef] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    experienceYears: '',
    hireDate: ''
  });

  useEffect(() => {
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    try {
      setLoading(true);
      const response = await chefAPI.getAllChefs();
      setChefs(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load chefs');
      console.error('Fetch chefs error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const chefData = {
        ...formData,
        experienceYears: parseInt(formData.experienceYears),
        hireDate: formData.hireDate ? new Date(formData.hireDate).toISOString() : null
      };

      if (editingChef) {
        await chefAPI.updateChef(editingChef.id, chefData);
        setSuccess('Chef updated successfully');
      } else {
        await chefAPI.createChef(chefData);
        setSuccess('Chef added successfully');
      }

      setShowModal(false);
      setEditingChef(null);
      resetForm();
      fetchChefs();
    } catch (err) {
      setError('Failed to save chef');
      console.error('Save chef error:', err);
    }
  };

  const handleEdit = (chef) => {
    setEditingChef(chef);
    setFormData({
      name: chef.name,
      email: chef.email,
      phone: chef.phone,
      specialty: chef.specialty,
      experienceYears: chef.experienceYears.toString(),
      hireDate: chef.hireDate ? new Date(chef.hireDate).toISOString().split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (chefId) => {
    if (window.confirm('Are you sure you want to deactivate this chef?')) {
      try {
        await chefAPI.deleteChef(chefId);
        setSuccess('Chef deactivated successfully');
        fetchChefs();
      } catch (err) {
        setError('Failed to deactivate chef');
        console.error('Delete chef error:', err);
      }
    }
  };

  const handleReactivate = async (chefId) => {
    try {
      await chefAPI.reactivateChef(chefId);
      setSuccess('Chef reactivated successfully');
      fetchChefs();
    } catch (err) {
      setError('Failed to reactivate chef');
      console.error('Reactivate chef error:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialty: '',
      experienceYears: '',
      hireDate: ''
    });
  };

  const handleAddNew = () => {
    setEditingChef(null);
    resetForm();
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center">
          <h2>Loading chefs...</h2>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col md={12}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Chef Management</h1>
            <Button variant="primary" onClick={handleAddNew}>
              + Add New Chef
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
              <h4 className="mb-0">All Chefs ({chefs.length})</h4>
            </Card.Header>
            <Card.Body>
              {chefs.length === 0 ? (
                <p className="text-muted text-center">No chefs found</p>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Specialty</th>
                      <th>Experience</th>
                      <th>Hire Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chefs.map((chef) => (
                      <tr key={chef.id}>
                        <td>
                          <strong>{chef.name}</strong>
                        </td>
                        <td>{chef.email}</td>
                        <td>{chef.phone}</td>
                        <td>
                          <Badge bg="info">{chef.specialty}</Badge>
                        </td>
                        <td>{chef.experienceYears} years</td>
                        <td>{formatDate(chef.hireDate)}</td>
                        <td>
                          <Badge bg={chef.isActive ? 'success' : 'secondary'}>
                            {chef.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEdit(chef)}
                            >
                              Edit
                            </Button>
                            {chef.isActive ? (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(chef.id)}
                              >
                                Deactivate
                              </Button>
                            ) : (
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => handleReactivate(chef.id)}
                              >
                                Reactivate
                              </Button>
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

      {/* Add/Edit Chef Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingChef ? 'Edit Chef' : 'Add New Chef'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter chef's name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Specialty *</Form.Label>
                  <Form.Control
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    placeholder="e.g., Italian Cuisine, Pastry, Grill"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Experience (Years) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleInputChange}
                    placeholder="Enter years of experience"
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hire Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="hireDate"
                    value={formData.hireDate}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
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
              {editingChef ? 'Update Chef' : 'Add Chef'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default ChefManagement;
