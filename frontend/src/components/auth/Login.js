import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(credentials);
      navigate('/');
    } catch (error) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    if (role === 'manager') {
      setCredentials({
        email: 'manager@hotel.com',
        password: 'manager123'
      });
    } else {
      setCredentials({
        email: 'customer@example.com',
        password: 'customer123'
      });
    }
  };

  return (
    <div className="login-page" style={{
      height: '100vh',
      background: `
        linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)),
        url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><pattern id="food" patternUnits="userSpaceOnUse" width="200" height="200"><rect width="200" height="200" fill="%23d4a574"/><text x="50" y="50" font-size="30" fill="%238b4513">🍽️</text><text x="150" y="100" font-size="25" fill="%23a0522d">🥗</text><text x="30" y="150" font-size="28" fill="%23654321">🍝</text><text x="120" y="180" font-size="24" fill="%238b4513">🍰</text></pattern></defs><rect width="100%" height="100%" fill="url(%23food)"/></svg>')
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      overflow: 'hidden'
    }}>
      <Container fluid>
        <Row className="justify-content-center align-items-center" style={{ height: '100vh' }}>
          <Col xs={11} sm={10} md={8} lg={6} xl={5}>
            <Card className="login-card shadow-lg border-0" style={{
              borderRadius: '25px',
              overflow: 'hidden',
              backdropFilter: 'blur(15px)',
              background: 'rgba(255, 255, 255, 0.98)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              {/* Header Section */}
              <div className="login-header text-center py-3" style={{
                background: 'linear-gradient(135deg, #d4a574 0%, #8b4513 100%)',
                color: 'white',
                position: 'relative'
              }}>
                <div style={{ 
                  position: 'absolute',
                  top: '10px',
                  left: '20px',
                  fontSize: '1.5rem',
                  opacity: '0.3'
                }}>🍽️</div>
                <div style={{ 
                  position: 'absolute',
                  top: '15px',
                  right: '25px',
                  fontSize: '1.2rem',
                  opacity: '0.3'
                }}>🥂</div>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.3rem' }}>🏨</div>
                <h2 className="mb-1" style={{ fontWeight: '700', textShadow: '2px 2px 4px rgba(0,0,0,0.3)', fontSize: '1.5rem' }}>
                  Grand Palace Hotel
                </h2>
                <p className="mb-0 opacity-90" style={{ fontSize: '14px' }}>
                  🍴 Fine Dining Experience Awaits
                </p>
              </div>

              <Card.Body className="p-3">
                {/* Browse as Guest - Top Priority */}
                <div className="text-center mb-3" style={{
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  borderRadius: '15px',
                  padding: '12px',
                  border: '2px solid #20c997',
                  boxShadow: '0 8px 20px rgba(40, 167, 69, 0.3)'
                }}>
                  <div className="mb-2">
                    <span style={{ fontSize: '1.5rem' }}>🌐</span>
                    <h6 className="text-white mb-1" style={{ fontWeight: '700', fontSize: '16px' }}>
                      Explore Without Signing In
                    </h6>
                    <p className="text-white mb-2" style={{ fontSize: '12px', opacity: '0.9' }}>
                      Browse our menu and check table availability instantly
                    </p>
                  </div>
                  <Button
                    variant="light"
                    onClick={() => navigate('/')}
                    className="w-100"
                    style={{
                      borderRadius: '12px',
                      padding: '10px',
                      fontSize: '14px',
                      fontWeight: '700',
                      background: 'white',
                      color: '#28a745',
                      border: 'none',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    🚀 Browse as Guest - No Login Required
                  </Button>
                </div>

                {error && (
                  <Alert variant="danger" className="border-0" style={{
                    borderRadius: '12px',
                    background: 'rgba(220, 53, 69, 0.1)',
                    border: '1px solid rgba(220, 53, 69, 0.2)'
                  }}>
                    <strong>⚠️ {error}</strong>
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-2">
                    <Form.Label className="fw-semibold text-dark">📧 Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={credentials.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      required
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e9ecef',
                        padding: '12px 16px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#d4a574'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold text-dark">🔒 Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e9ecef',
                        padding: '12px 16px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#d4a574'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={loading}
                    style={{
                      borderRadius: '12px',
                      padding: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      background: 'linear-gradient(135deg, #d4a574 0%, #8b4513 100%)',
                      border: 'none',
                      boxShadow: '0 4px 15px rgba(212, 165, 116, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(212, 165, 116, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(212, 165, 116, 0.4)';
                    }}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        🚀 Sign In
                      </>
                    )}
                  </Button>
                </Form>

                {/* Demo Accounts Section - Food Themed & Prominent */}
                <div className="demo-section" style={{
                  background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b35 100%)',
                  borderRadius: '15px',
                  padding: '15px',
                  border: '3px solid #ff8c42',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 10px 25px rgba(255, 107, 53, 0.4)',
                  marginBottom: '8px'
                }}>
                  {/* Food decorative elements */}
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '20px',
                    fontSize: '2rem',
                    opacity: '0.2'
                  }}>🍽️</div>
                  <div style={{
                    position: 'absolute',
                    bottom: '15px',
                    left: '15px',
                    fontSize: '1.5rem',
                    opacity: '0.2'
                  }}>🍰</div>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '10px',
                    fontSize: '1.2rem',
                    opacity: '0.15'
                  }}>🥗</div>

                  <div className="text-center mb-3">
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '20px',
                      padding: '6px 15px',
                      display: 'inline-block',
                      marginBottom: '10px',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                    }}>
                      <span style={{
                        fontSize: '16px',
                        fontWeight: '800',
                        color: '#d63031',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                      }}>
                        🎯 INSTANT DEMO ACCESS 🎯
                      </span>
                    </div>
                    <h4 className="mb-2 text-white" style={{ 
                      fontWeight: '800',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                      fontSize: '1.2rem'
                    }}>
                      🍴 No Registration Required!
                    </h4>
                    <p className="mb-3 text-white" style={{ 
                      fontSize: '14px', 
                      opacity: '0.95',
                      fontWeight: '500',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                    }}>
                      Choose your dining experience and explore our system
                    </p>
                  </div>

                  <Row className="g-4">
                    <Col xs={6}>
                      <Button
                        className="w-100 demo-btn"
                        onClick={() => fillDemoCredentials('manager')}
                        style={{
                          borderRadius: '15px',
                          fontWeight: '700',
                          padding: '12px 8px',
                          fontSize: '13px',
                          background: 'linear-gradient(135deg, #00b894 0%, #00a085 100%)',
                          border: '3px solid #ffffff',
                          boxShadow: '0 8px 25px rgba(0, 184, 148, 0.5)',
                          transition: 'all 0.3s ease',
                          color: 'white'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-5px) scale(1.02)';
                          e.target.style.boxShadow = '0 12px 30px rgba(0, 184, 148, 0.7)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0) scale(1)';
                          e.target.style.boxShadow = '0 8px 25px rgba(0, 184, 148, 0.5)';
                        }}
                      >
                        <div style={{ fontSize: '2rem', marginBottom: '5px' }}>👨‍🍳</div>
                        <div style={{ fontSize: '14px', fontWeight: '800' }}>CHEF MANAGER</div>
                        <div style={{ fontSize: '12px', opacity: '0.9', fontWeight: '600' }}>Full Kitchen Control</div>
                      </Button>
                    </Col>
                    <Col xs={6}>
                      <Button
                        className="w-100 demo-btn"
                        onClick={() => fillDemoCredentials('customer')}
                        style={{
                          borderRadius: '15px',
                          fontWeight: '700',
                          padding: '12px 8px',
                          fontSize: '13px',
                          background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
                          border: '3px solid #ffffff',
                          boxShadow: '0 8px 25px rgba(108, 92, 231, 0.5)',
                          transition: 'all 0.3s ease',
                          color: 'white'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-5px) scale(1.02)';
                          e.target.style.boxShadow = '0 12px 30px rgba(108, 92, 231, 0.7)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0) scale(1)';
                          e.target.style.boxShadow = '0 8px 25px rgba(108, 92, 231, 0.5)';
                        }}
                      >
                        <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🍽️</div>
                        <div style={{ fontSize: '14px', fontWeight: '800' }}>FOOD LOVER</div>
                        <div style={{ fontSize: '12px', opacity: '0.9', fontWeight: '600' }}>Dining Experience</div>
                      </Button>
                    </Col>
                  </Row>

                  <div className="text-center mt-3">
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      padding: '8px',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <small className="text-white" style={{ 
                        fontSize: '11px', 
                        fontWeight: '600',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                      }}>
                        🌟 Manager controls everything, Customer enjoys dining
                      </small>
                    </div>
                  </div>
                </div>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
