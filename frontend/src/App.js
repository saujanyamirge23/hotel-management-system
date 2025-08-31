import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/hotel-theme.css';

// Components
import Navigation from './components/Navigation';
import Home from './components/Home';

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

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="main-content">
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<Home />} />
            
            {/* Customer Routes */}
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/customer/menu" element={<MenuView />} />
            <Route path="/customer/booking" element={<TableBooking />} />
            <Route path="/customer/feedback" element={<FeedbackForm />} />
            
            {/* Manager Routes */}
            <Route path="/manager" element={<ManagerDashboard />} />
            <Route path="/manager/chefs" element={<ChefManagement />} />
            <Route path="/manager/tables" element={<TableManagement />} />
            <Route path="/manager/menu" element={<MenuManagement />} />
            <Route path="/manager/feedback" element={<FeedbackView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
