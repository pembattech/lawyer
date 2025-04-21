import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../api';
import Header from './Header';
import Footer from './Footer';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const data = await authService.login(formData.email, formData.password);
      
      // Store tokens if using JWT
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      
      // Navigate to dashboard
      navigate('/clientdashboard', { replace: true });
      
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section with Background Image */}
      <section className="relative bg-blue-900 text-white mt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/400')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sign In to Your Account</h1>
          <p className="text-xl max-w-2xl mx-auto">Access all your case information and legal documents in one secure place.</p>
        </div>
      </section>
      
      {/* Breadcrumb */}
      <div className="bg-white py-3 shadow-sm">
        <div className="container mx-auto px-4">
          <p className="text-sm">
            <a href="/" className="text-blue-700 hover:underline">Home</a> {'>'} 
            <span className="text-gray-600 ml-1">Sign In</span>
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <section className="py-12 flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:shadow-xl">
              <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-6 px-8 rounded-t-xl">
                <h2 className="text-2xl font-bold flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Account Login
                </h2>
                <p className="mt-2 opacity-90">Enter your credentials to access your account</p>
              </div>
              
              <div className="p-8">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Email address"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="rememberMe"
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 transform hover:translate-y-px shadow-lg hover:shadow-xl ${
                        isLoading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <svg className={`h-5 w-5 text-blue-500 group-hover:text-blue-400 ${isLoading ? 'animate-spin' : ''}`} 
                             xmlns="http://www.w3.org/2000/svg" 
                             viewBox="0 0 20 20" 
                             fill="currentColor" 
                             aria-hidden="true">
                          {isLoading ? (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          )}
                        </svg>
                      </span>
                      {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                  </div>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                      Register now
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center mt-8">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Legal Assistance?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">Our team of experienced lawyers is ready to help you with your legal needs.</p>
          <Link to="/ContactPage" className="bg-white text-blue-800 hover:bg-blue-100 font-bold py-3 px-8 rounded-lg transition duration-300 inline-flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Contact Us
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default LoginPage;