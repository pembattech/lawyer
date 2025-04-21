import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-blue-900 to-blue-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold mb-4 border-b border-blue-700 pb-2">
              Contact Us
            </h3>
            <div className="flex items-center mb-2 hover:translate-x-1 transition duration-300">
              <span className="mr-2 bg-blue-800 p-1 rounded-full text-sm">📍</span>
              <span className="text-sm">Kathmandu - Nepal</span>
            </div>
            <div className="flex items-center mb-2 hover:translate-x-1 transition duration-300">
              <span className="mr-2 bg-blue-800 p-1 rounded-full text-sm">📞</span>
              <span className="text-sm">9811222333</span>
            </div>
            <div className="flex items-center hover:translate-x-1 transition duration-300">
              <span className="mr-2 bg-blue-800 p-1 rounded-full text-sm">✉️</span>
              <span className="text-sm">firm@khadka@gmail.com</span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold mb-4 border-b border-blue-700 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li className="transition-transform duration-300 hover:translate-x-2">
                <Link to="/" className="flex items-center hover:text-blue-300 text-sm">
                  <span className="mr-1 text-blue-400">›</span>Home
                </Link>
              </li>
              <li className="transition-transform duration-300 hover:translate-x-2">
                <Link to="/AdvocatePage" className="flex items-center hover:text-blue-300 text-sm">
                  <span className="mr-1 text-blue-400">›</span>Our Team
                </Link>
              </li>
              <li className="transition-transform duration-300 hover:translate-x-2">
                <Link to="/services" className="flex items-center hover:text-blue-300 text-sm">
                  <span className="mr-1 text-blue-400">›</span>Services
                </Link>
              </li>
              <li className="transition-transform duration-300 hover:translate-x-2">
                <Link to="/contact" className="flex items-center hover:text-blue-300 text-sm">
                  <span className="mr-1 text-blue-400">›</span>Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter Signup */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold mb-4 border-b border-blue-700 pb-2">
              Newsletter
            </h3>
            <p className="mb-2 text-sm">Subscribe for legal updates</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="p-2 rounded-md text-gray-800 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Social Media Links */}
        <div className="flex justify-center space-x-4 mt-6 pt-4 border-t border-blue-800">
          <a href="#" aria-label="Facebook" className="hover:text-blue-400 transition-colors duration-300">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-blue-400 transition-colors duration-300">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.926 4.926 0 00-8.391 4.482 13.981 13.981 0 01-10.157-5.147 4.926 4.926 0 001.526 6.574 4.998 4.998 0 01-2.232-.617v.06a4.923 4.923 0 003.95 4.829 4.996 4.996 0 01-2.224.084 4.932 4.932 0 004.6 3.42 9.875 9.875 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"></path></svg>
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-blue-400 transition-colors duration-300">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"></path></svg>
          </a>
        </div>
        
        {/* Copyright */}
        <div className="mt-6 pt-4 text-center text-xs text-blue-200">
          <p>© {new Date().getFullYear()} Law Firm Serving Clients in NEPAL. All rights reserved.</p>
          <div className="mt-1 flex justify-center space-x-3">
            <Link to="/privacy" className="hover:text-white text-xs">Privacy Policy</Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-white text-xs">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;