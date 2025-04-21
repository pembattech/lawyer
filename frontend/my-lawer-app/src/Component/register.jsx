// RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../api';
import Header from './Header';
import Footer from './Footer';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    age: '',
    sex: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    if (name === 'password' || name === 'confirmPassword') {
      const newValue = name === 'password' ? value : formData.password;
      const compareValue = name === 'confirmPassword' ? value : formData.confirmPassword;
      setPasswordsMatch(newValue === compareValue || compareValue === '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.register({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        first_name: formData.first_name,
        last_name: formData.last_name,
        address: formData.address,
        age: formData.age,
        sex: formData.sex
      });

      navigate('/login', { state: { registrationSuccess: true } });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <section className="relative bg-blue-900 text-white mt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/400')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Create Your Account</h1>
          <p className="text-xl max-w-2xl mx-auto">Join our platform to access legal services and document management in one secure place.</p>
        </div>
      </section>

      <div className="bg-white py-3 shadow-sm">
        <div className="container mx-auto px-4">
          <p className="text-sm">
            <a href="/" className="text-blue-700 hover:underline">Home</a> {'>'} 
            <span className="text-gray-600 ml-1">Register</span>
          </p>
        </div>
      </div>

      <section className="py-12 flex-grow">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:shadow-xl">
              <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-6 px-8 rounded-t-xl">
                <h2 className="text-2xl font-bold">Create New Account</h2>
                <p className="mt-2 opacity-90">Fill in your details to register</p>
              </div>

              <div className="p-8">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <input name="first_name" value={formData.first_name} onChange={handleChange} className="w-full px-4 py-2 border rounded" placeholder="First Name" required />
                  <input name="last_name" value={formData.last_name} onChange={handleChange} className="w-full px-4 py-2 border rounded" placeholder="Last Name" required />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded" placeholder="Email" required />
                  <input name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border rounded" placeholder="Address" />
                  <input name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-2 border rounded" placeholder="Age" type="number" />
                  <select name="sex" value={formData.sex} onChange={handleChange} className="w-full px-4 py-2 border rounded">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border rounded" placeholder="Password" required />
                  <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2 border rounded" placeholder="Confirm Password" required />
                  {!passwordsMatch && <p className="text-sm text-red-500">Passwords do not match.</p>}

                  <div className="flex items-center">
                    <input id="agreeTerms" name="agreeTerms" type="checkbox" checked={formData.agreeTerms} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-900">
                      I agree to the <Link to="/terms" className="text-blue-600 hover:underline">terms and conditions</Link>
                    </label>
                  </div>

                  <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg" disabled={isLoading}>
                    {isLoading ? 'Registering...' : 'Register'}
                  </button>
                </form>

                <p className="mt-6 text-sm text-center">
                  Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RegisterPage;
