import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Component/LandingPage';
import AdvocatePage from './Component/AdvocatePage';
import ServicesPage from './Component/Servicespage';
import ContactPage from './Component/ContactPage';
import LoginPage from './Component/login';
import RegisterPage from './Component/register';
import ClientDashboard from './Component/clientsection/clientdashboard';
import './index.css';
import './App.css';
import AppointmentPage from './Component/AppointmentPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/AdvocatePage" element={<AdvocatePage />} />
      
          {/* Other routes */}
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/AppointmentPage" element={<AppointmentPage />} />
          <Route path="/ContactPage" element={<ContactPage/>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/clientdashboard" element={<ClientDashboard />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;