import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoimage from '../assets/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // Track scrolling for header appearance change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg py-2' : 'bg-gradient-to-r from-blue-50 to-white py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="relative overflow-hidden rounded-lg group w-48 h-16">
            <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg"></div>
            <img
              src={logoimage}
              alt="Law-Firm Logo"
              className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105"
            />
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-2 lg:space-x-3">
          {[
            { path: '/', label: 'HOME' },
            { path: '/AdvocatePage', label: 'PROFILE' },
            { path: '/services', label: 'SERVICES' },
            { path: '/AppointmentPage', label: 'APPOINTMENT' },
            { path: '/ContactPage', label: 'CONTACT' }
          ].map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`px-4 py-3 text-sm font-extrabold tracking-wide rounded-lg transition-all duration-200 transform hover:scale-105 ${
                isActive(item.path) 
                  ? 'text-white bg-blue-600 shadow-md hover:bg-blue-700'
                  : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        {/* Contact Information with Login Icon */}
        <div className="hidden lg:flex items-center space-x-4">
          <a href="tel:9811222333" className="flex items-center text-sm font-bold text-gray-600 hover:text-blue-700 transition-all duration-200 group">
            <span className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-2 group-hover:bg-blue-200 transition-colors duration-200 shadow-md">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </span>
            <span className="group-hover:underline">9811222333</span>
          </a>
          <a href="mailto:info@gmail.com" className="flex items-center text-sm font-bold text-gray-600 hover:text-blue-700 transition-all duration-200 group">
            <span className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-2 group-hover:bg-blue-200 transition-colors duration-200 shadow-md">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <span className="group-hover:underline">info@gmail.com</span>
          </a>
          
          {/* Login Icon Button (replacing text button) */}
          <Link 
            to="/login" 
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 transform hover:scale-110 ${
              isActive('/login') 
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-blue-700 text-white hover:bg-blue-800 shadow-md'
            }`}
            title="Login to your account"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          {/* Mobile Login Icon Button */}
          <Link 
            to="/login" 
            className={`flex items-center justify-center w-10 h-10 rounded-full mr-2 transition-all duration-200 transform hover:scale-110 ${
              isActive('/login') 
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-blue-700 text-white hover:bg-blue-800 shadow-md'
            }`}
            title="Login to your account"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
          </Link>
          
          <button
            onClick={toggleMenu}
            className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200 focus:outline-none shadow-md"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu with animation */}
      <div className={`md:hidden bg-white absolute left-0 right-0 shadow-xl transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col space-y-2">
            {[
              { path: '/', label: 'HOME' },
              { path: '/Team', label: 'TEAM' },
              { path: '/services', label: 'SERVICES' },
              { path: '/AppointmentPage', label: 'APPOINTMENT' },
              { path: '/case-space', label: 'CASE SPACE' },
              { path: '/ContactPage', label: 'CONTACT' }
            ].map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`px-4 py-3 rounded-lg transition-colors duration-200 flex items-center font-bold ${
                  isActive(item.path) 
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col space-y-4">
            <a href="tel:9811222333" className="flex items-center font-bold text-gray-600 hover:text-blue-700 transition-colors duration-200 group">
              <span className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-3 shadow-md">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <span className="group-hover:underline">9811222333</span>
            </a>
            <a href="mailto:info@gmail.com" className="flex items-center font-bold text-gray-600 hover:text-blue-700 transition-colors duration-200 group">
              <span className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-3 shadow-md">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <span className="group-hover:underline">info@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 md:hidden z-40" 
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
};

export default Header;