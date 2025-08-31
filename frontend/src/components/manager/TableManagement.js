import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Badge, Tab, Tabs } from 'react-bootstrap';
import { tableAPI } from '../../services/api';

function TableManagement() {
  const [tables, setTables] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showTableModal, setShowTableModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [activeTab, setActiveTab] = useState('tables');
  const [tableFormData, setTableFormData] = useState({
    tableNumber: '',
    capacity: '',
    location: '',
    status: 'AVAILABLE'
  });

  const tableStatuses = [
    { value: 'AVAILABLE', label: 'Available', color: 'success' },
    { value: 'OCCUPIED', label: 'Occupied', color: 'danger' },
    { value: 'RESERVED', label: 'Reserved', color: 'warning' },
    { value: 'OUT_OF_ORDER', label: 'Out of Order', color: 'secondary' }
  ];

  const bookingStatuses = [
    { value: 'WAITING', label: 'Waiting', color: 'warning' },
    { value: 'SEATED', label: 'Seated', color: 'success' },
    { value: 'COMPLETED', label: 'Completed', color: 'secondary' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'danger' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tablesResponse, bookingsResponse] = await Promise.all([
        tableAPI.getAllTables(),
        tableAPI.getAllBookings()
      ]);
      setTables(tablesResponse.data);
      setBookings(bookingsResponse.data);
      setError('');
    } catch (err) {
      setError('Failed to load data');
      console.error('Fetch data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTableInputChange = (e) => {
    const { name, value } = e.target;
    setTableFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTableSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const tableData = {
        ...tableFormData,
        capacity: parseInt(tableFormData.capacity)
      };

      if (editingTable) {
        await tableAPI.updateTable(editingTable.id, tableData);
        setSuccess('Table updated successfully');
      } else {
        await tableAPI.createTable(tableData);
        setSuccess('Table added successfully');
      }

      setShowTableModal(false);
      setEditingTable(null);
      resetTableForm();
      fetchData();
    } catch (err) {
      setError('Failed to save table');
      console.error('Save table error:', err);
    }
  };

  const handleEditTable = (table) => {
    setEditingTable(table);
    setTableFormData({
      tableNumber: table.tableNumber,
      capacity: table.capacity.toString(),
      location: table.location,
      status: table.status
    });
    setShowTableModal(true);
  };

  const handleDeleteTable = async (tableId) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      try {
        await tableAPI.deleteTable(tableId);
        setSuccess('Table deleted successfully');
        fetchData();
      } catch (err) {
        setError('Failed to delete table');
        console.error('Delete table error:', err);
      }
    }
  };

  const handleSeatCustomer = async (bookingId, tableId) => {
    try {
      await tableAPI.seatBooking(bookingId, tableId);
      setSuccess('Customer seated successfully');
      fetchData();
    } catch (err) {
      setError('Failed to seat customer');
      console.error('Seat customer error:', err);
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      await tableAPI.completeBooking(bookingId);
      setSuccess('Booking completed successfully');
      fetchData();
    } catch (err) {
      setError('Failed to complete booking');
      console.error('Complete booking error:', err);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await tableAPI.cancelBooking(bookingId);
        setSuccess('Booking cancelled successfully');
        fetchData();
      } catch (err) {
        setError('Failed to cancel booking');
        console.error('Cancel booking error:', err);
      }
    }
  };

  const resetTableForm = () => {
    setTableFormData({
      tableNumber: '',
      capacity: '',
      location: '',
      status: 'AVAILABLE'
    });
  };

  const handleAddNewTable = () => {
    setEditingTable(null);
    resetTableForm();
    setShowTableModal(true);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status, type = 'table') => {
    const statuses = type === 'table' ? tableStatuses : bookingStatuses;
    const statusInfo = statuses.find(s => s.value === status);
    return statusInfo ? statusInfo.color : 'secondary';
  };

  const getAvailableTables = () => {
    return tables.filter(table => table.status === 'AVAILABLE');
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center">
          <h2>Loading table management...</h2>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col md={12}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Table Management</h1>
            <Button variant="primary" onClick={handleAddNewTable}>
              + Add New Table
            </Button>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        <Tab eventKey="tables" title={`Tables (${tables.length})`}>
          <Card>
            <Card.Body>
              {tables.length === 0 ? (
                <p className="text-muted text-center">No tables found</p>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Table #</th>
                      <th>Capacity</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tables.map((table) => (
                      <tr key={table.id}>
                        <td><strong>#{table.tableNumber}</strong></td>
                        <td>{table.capacity} people</td>
                        <td>{table.location}</td>
                        <td>
                          <Badge bg={getStatusBadge(table.status, 'table')}>
                            {table.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td>{formatDateTime(table.createdAt)}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEditTable(table)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteTable(table.id)}
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
        </Tab>

        <Tab eventKey="bookings" title={`Bookings (${bookings.length})`}>
          <Card>
            <Card.Body>
              {bookings.length === 0 ? (
                <p className="text-muted text-center">No bookings found</p>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Phone</th>
                      <th>Party Size</th>
                      <th>Booking Time</th>
                      <th>Table</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td><strong>{booking.customerName}</strong></td>
                        <td>{booking.customerPhone}</td>
                        <td>{booking.partySize} people</td>
                        <td>{formatDateTime(booking.bookingTime)}</td>
                        <td>
                          {booking.table ? `#${booking.table.tableNumber}` : 'Not assigned'}
                        </td>
                        <td>
                          <Badge bg={getStatusBadge(booking.status, 'booking')}>
                            {booking.status}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            {booking.status === 'WAITING' && (
                              <Form.Select
                                size="sm"
                                style={{ width: '120px' }}
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleSeatCustomer(booking.id, e.target.value);
                                  }
                                }}
                                defaultValue=""
                              >
                                <option value="">Seat at...</option>
                                {getAvailableTables().map(table => (
                                  <option key={table.id} value={table.id}>
                                    Table #{table.tableNumber}
                                  </option>
                                ))}
                              </Form.Select>
                            )}
                            {booking.status === 'SEATED' && (
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => handleCompleteBooking(booking.id)}
                              >
                                Complete
                              </Button>
                            )}
                            {(booking.status === 'WAITING' || booking.status === 'SEATED') && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                Cancel
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
        </Tab>
      </Tabs>

      {/* Add/Edit Table Modal */}
      <Modal show={showTableModal} onHide={() => setShowTableModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTable ? 'Edit Table' : 'Add New Table'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleTableSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Table Number *</Form.Label>
                  <Form.Control
                    type="text"
                    name="tableNumber"
                    value={tableFormData.tableNumber}
                    onChange={handleTableInputChange}
                    placeholder="e.g., 1, A1, VIP-1"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Capacity *</Form.Label>
                  <Form.Control
                    type="number"
                    name="capacity"
                    value={tableFormData.capacity}
                    onChange={handleTableInputChange}
                    placeholder="Number of people"
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={tableFormData.location}
                onChange={handleTableInputChange}
                placeholder="e.g., Main Hall, Terrace, VIP Section"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={tableFormData.status}
                onChange={handleTableInputChange}
              >
                {tableStatuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTableModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingTable ? 'Update Table' : 'Add Table'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default TableManagement;
