import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Unauthorized from './components/auth/Unauthorized';

// Customer Components
import CustomerDashboard from './components/customer/CustomerDashboard';
import MenuView from './components/customer/MenuView';
import TableBooking from './components/customer/TableBooking';
import FeedbackForm from './components/customer/FeedbackForm';

// Manager Components
import ManagerDashboard from './components/manager/ManagerDashboard';
import ChefManagement from './components/manager/ChefManagement';
import TableManagement from './components/manager/TableManagement';
import MenuManagement from './components/manager/MenuManagement';
import FeedbackView from './components/manager/FeedbackView';

// Guest Components
import GuestMenuView from './components/guest/GuestMenuView';
import GuestTableView from './components/guest/GuestTableView';

// Chatbot Components
import ChatBot from './components/chatbot/ChatBot';
import ChatBotToggle from './components/chatbot/ChatBotToggle';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/hotel-theme.css';

function App() {
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/" element={<Home />} />
              
              {/* Guest/Public Browse Routes */}
              <Route path="/browse/menu" element={<GuestMenuView />} />
              <Route path="/browse/tables" element={<GuestTableView />} />
              
              {/* Customer Routes - Available to both customers and managers */}
              <Route path="/customer" element={
                <ProtectedRoute>
                  <CustomerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/customer/menu" element={
                <ProtectedRoute>
                  <MenuView />
                </ProtectedRoute>
              } />
              <Route path="/customer/booking" element={
                <ProtectedRoute>
                  <TableBooking />
                </ProtectedRoute>
              } />
              <Route path="/customer/feedback" element={
                <ProtectedRoute>
                  <FeedbackForm />
                </ProtectedRoute>
              } />
              
              {/* Manager Routes - Only for managers */}
              <Route path="/manager" element={
                <ProtectedRoute requireManager={true}>
                  <ManagerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/manager/chefs" element={
                <ProtectedRoute requireManager={true}>
                  <ChefManagement />
                </ProtectedRoute>
              } />
              <Route path="/manager/tables" element={
                <ProtectedRoute requireManager={true}>
                  <TableManagement />
                </ProtectedRoute>
              } />
              <Route path="/manager/menu" element={
                <ProtectedRoute requireManager={true}>
                  <MenuManagement />
                </ProtectedRoute>
              } />
              <Route path="/manager/feedback" element={
                <ProtectedRoute requireManager={true}>
                  <FeedbackView />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          
          {/* Chatbot Components */}
          {!isChatBotOpen && (
            <ChatBotToggle onClick={() => setIsChatBotOpen(true)} />
          )}
          <ChatBot 
            isOpen={isChatBotOpen} 
            onClose={() => setIsChatBotOpen(false)} 
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
