import React from 'react';
import { Button } from 'react-bootstrap';

const ChatBotToggle = ({ onClick, hasUnread = false }) => {
  // Check if we're on the login page
  const isLoginPage = window.location.pathname === '/login';
  
  return (
    <Button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: isLoginPage 
          ? 'linear-gradient(135deg, #ff6b35 0%, #ff9a56 100%)'
          : 'linear-gradient(135deg, #d4a574 0%, #8b4513 100%)',
        border: isLoginPage ? '3px solid #ffffff' : 'none',
        boxShadow: isLoginPage 
          ? '0 12px 35px rgba(255, 107, 53, 0.8), 0 0 20px rgba(255, 255, 255, 0.5)'
          : '0 8px 25px rgba(212, 165, 116, 0.4)',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        transition: 'all 0.3s ease',
        animation: hasUnread || isLoginPage ? 'pulse 2s infinite' : 'none'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.1)';
        if (isLoginPage) {
          e.target.style.boxShadow = '0 15px 40px rgba(255, 107, 53, 1), 0 0 25px rgba(255, 255, 255, 0.7)';
        } else {
          e.target.style.boxShadow = '0 12px 30px rgba(212, 165, 116, 0.6)';
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        if (isLoginPage) {
          e.target.style.boxShadow = '0 12px 35px rgba(255, 107, 53, 0.8), 0 0 20px rgba(255, 255, 255, 0.5)';
        } else {
          e.target.style.boxShadow = '0 8px 25px rgba(212, 165, 116, 0.4)';
        }
      }}
    >
      💬
      {hasUnread && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '12px',
            height: '12px',
            background: '#ff4757',
            borderRadius: '50%',
            border: '2px solid white'
          }}
        />
      )}
      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 8px 25px rgba(212, 165, 116, 0.4);
          }
          50% {
            box-shadow: 0 8px 25px rgba(212, 165, 116, 0.8);
          }
          100% {
            box-shadow: 0 8px 25px rgba(212, 165, 116, 0.4);
          }
        }
      `}</style>
    </Button>
  );
};

export default ChatBotToggle;
