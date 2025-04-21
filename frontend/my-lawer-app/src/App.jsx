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
import AdminDashboard from './Component/admin/AdminDashboard';
import AdminAppointment from './Component/admin/AdminAppointment';
import AdminContactMessage from './Component/admin/AdminContactMessage';
import AdminCaseSummary from './Component/admin/AdminCaseSummary';

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

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path='/admin/appointment' element={<AdminAppointment />} />
          <Route path="/admin/contact-message" element={<AdminContactMessage />} />
          <Route path="/admin/case" element={<AdminCaseSummary />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;