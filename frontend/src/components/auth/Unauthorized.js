import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="text-center shadow">
            <Card.Body className="p-5">
              <div className="mb-4">
                <h1 className="display-1">🚫</h1>
                <h2 className="text-danger">Access Denied</h2>
                <p className="text-muted">
                  You don't have permission to access this page.
                </p>
                {user && (
                  <p className="text-info">
                    Logged in as: <strong>{user.name}</strong> ({user.role})
                  </p>
                )}
              </div>
              
              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/')}
                >
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => navigate(-1)}
                >
                  Go Back
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Unauthorized;
