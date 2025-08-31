import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Button, Badge, Spinner, Modal } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { chatbotAPI } from '../../services/mockAPI';
import BookingAssistant from './BookingAssistant';

const ChatBot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm your hotel assistant. I can help you with:\n• Table bookings\n• Menu information\n• Hotel policies\n• General questions\n\nHow can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBookingAssistant, setShowBookingAssistant] = useState(false);
  const messagesEndRef = useRef(null);
  const { user, isAuthenticated } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await chatbotAPI.sendMessage({
        message: inputMessage,
        userId: user?.id,
        context: {
          isAuthenticated: isAuthenticated(),
          userRole: user?.role
        }
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.message,
        sender: 'bot',
        timestamp: new Date(),
        actions: response.data.actions || []
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again later or contact our support team.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action) => {
    if (action.includes('reservation') || action.includes('Book')) {
      if (isAuthenticated()) {
        setShowBookingAssistant(true);
      } else {
        setInputMessage(action);
      }
    } else {
      setInputMessage(action);
    }
  };

  const handleBookingComplete = (bookingDetails) => {
    setShowBookingAssistant(false);
    const confirmationMessage = {
      id: Date.now(),
      text: `🎉 Booking confirmed!\n\n📅 ${bookingDetails.date} at ${bookingDetails.time}\n🪑 Table: ${bookingDetails.tableName}\n👥 Party size: ${bookingDetails.partySize}\n\nYou'll receive a confirmation email shortly. Looking forward to serving you!`,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmationMessage]);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const quickActions = [
    "Book a table for tonight",
    "Show me the menu",
    "What's your cancellation policy?",
    "Check table availability",
    "Contact information"
  ];

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '380px',
      height: '600px',
      zIndex: 1050,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      borderRadius: '20px',
      overflow: 'hidden',
      background: 'white'
    }}>
      <Card className="h-100 border-0">
        {/* Header */}
        <Card.Header 
          className="d-flex justify-content-between align-items-center py-3"
          style={{
            background: 'linear-gradient(135deg, #d4a574 0%, #8b4513 100%)',
            color: 'white',
            borderRadius: '20px 20px 0 0'
          }}
        >
          <div className="d-flex align-items-center">
            <div style={{ fontSize: '1.5rem', marginRight: '10px' }}>🤖</div>
            <div>
              <h6 className="mb-0" style={{ fontWeight: '600' }}>Hotel Assistant</h6>
              <small style={{ opacity: '0.9' }}>
                {isTyping ? 'Typing...' : 'Online'}
              </small>
            </div>
          </div>
          <Button
            variant="link"
            className="text-white p-0"
            onClick={onClose}
            style={{ fontSize: '1.5rem', textDecoration: 'none' }}
          >
            ×
          </Button>
        </Card.Header>

        {/* Messages */}
        <Card.Body 
          className="p-0"
          style={{ 
            height: '400px', 
            overflowY: 'auto',
            background: '#f8f9fa'
          }}
        >
          <div className="p-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-3 d-flex ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div
                  className="px-3 py-2"
                  style={{
                    maxWidth: '80%',
                    borderRadius: message.sender === 'user' ? '18px 18px 5px 18px' : '18px 18px 18px 5px',
                    background: message.sender === 'user' 
                      ? 'linear-gradient(135deg, #d4a574 0%, #8b4513 100%)'
                      : 'white',
                    color: message.sender === 'user' ? 'white' : '#333',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  <div>{message.text}</div>
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-2">
                      {message.actions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline-primary"
                          size="sm"
                          className="me-2 mb-1"
                          onClick={() => handleQuickAction(action.text)}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                  <small 
                    className="d-block mt-1"
                    style={{ 
                      opacity: '0.7',
                      fontSize: '0.75rem'
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </small>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="mb-3 d-flex justify-content-start">
                <div
                  className="px-3 py-2"
                  style={{
                    borderRadius: '18px 18px 18px 5px',
                    background: 'white',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Spinner size="sm" className="me-2" />
                  <small className="text-muted">Assistant is typing...</small>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </Card.Body>

        {/* Quick Actions */}
        <div className="px-3 py-2" style={{ background: '#f8f9fa', borderTop: '1px solid #e9ecef' }}>
          <small className="text-muted d-block mb-2">Quick actions:</small>
          <div className="d-flex flex-wrap gap-1">
            {quickActions.slice(0, 3).map((action, index) => (
              <Badge
                key={index}
                bg="light"
                text="dark"
                className="cursor-pointer"
                style={{ 
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                  padding: '4px 8px'
                }}
                onClick={() => handleQuickAction(action)}
              >
                {action}
              </Badge>
            ))}
          </div>
        </div>

        {/* Input */}
        <Card.Footer className="p-3" style={{ background: 'white' }}>
          <div className="d-flex gap-2">
            <Form.Control
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
              style={{
                borderRadius: '20px',
                border: '2px solid #e9ecef',
                padding: '10px 15px'
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              style={{
                borderRadius: '50%',
                width: '45px',
                height: '45px',
                background: 'linear-gradient(135deg, #d4a574 0%, #8b4513 100%)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isTyping ? (
                <Spinner size="sm" />
              ) : (
                <span style={{ fontSize: '1.2rem' }}>📤</span>
              )}
            </Button>
          </div>
        </Card.Footer>
      </Card>
      
      {/* Booking Assistant Modal */}
      <Modal 
        show={showBookingAssistant} 
        onHide={() => setShowBookingAssistant(false)}
        size="lg"
        centered
      >
        <BookingAssistant 
          onBookingComplete={handleBookingComplete}
          onClose={() => setShowBookingAssistant(false)}
        />
      </Modal>
    </div>
  );
};

export default ChatBot;
