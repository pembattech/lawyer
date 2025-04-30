import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { MapPin, Phone, Mail, Clock, MessageSquare, User, AtSign } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.email) newErrors.email = 'Email is required.';
    if (!formData.phone) newErrors.phone = 'Phone number is required.';
    if (!formData.message) newErrors.message = '2Message is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/contact-messages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("Successfully submitted!");
        setFormData({ name: "", email: "", phone: "", message: "" });
        setFormSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({ name: '', email: '', phone: '', message: '' });
          setFormSubmitted(false);
        }, 3000);
      } else {
        alert("Failed to submit, please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // FAQ data for easier management
  const faqItems = [
    {
      question: "How quickly can I expect a response?",
      answer: "We aim to respond to all inquiries within 24 business hours. Urgent matters are prioritized for faster response."
    },
    {
      question: "Do you offer free consultations?",
      answer: "Yes, we offer an initial 30-minute consultation to discuss your case and determine how we can best assist you."
    },
    {
      question: "Can I schedule an appointment online?",
      answer: "Yes, you can use our contact form or call our office directly to schedule an appointment with one of our attorneys."
    },
    {
      question: "What areas of law do you practice?",
      answer: "Our firm specializes in corporate law, civil litigation, family law, immigration, property law, and criminal defense."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Section with Background Image */}
      <section className="relative bg-blue-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/400')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-2xl mx-auto">We're here to help with all your legal needs. Reach out to our team of experienced lawyers today.</p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white py-3 shadow-sm">
        <div className="container mx-auto px-4">
          <p className="text-sm">
            <a href="/" className="text-blue-700 hover:underline">Home</a> {'>'}
            <span className="text-gray-600 ml-1">Contact Us</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Contact Information */}
            <div className="lg:w-1/2 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-8 transform transition duration-500 hover:shadow-xl">
                <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
                  <span className="bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
                    <MessageSquare size={20} />
                  </span>
                  Nepali Lawyer
                </h2>

                <div className="space-y-5">
                  <div className="flex items-start bg-blue-50 p-4 rounded-lg transition-all duration-300 hover:bg-blue-100">
                    <div className="bg-blue-700 text-white rounded-full p-2 mr-4">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-800">Office Address:</p>
                      <p className="text-gray-700">123 Legal Street, Kathmandu, Nepal</p>
                    </div>
                  </div>

                  <div className="flex items-start bg-blue-50 p-4 rounded-lg transition-all duration-300 hover:bg-blue-100">
                    <div className="bg-blue-700 text-white rounded-full p-2 mr-4">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-800">Phone Number:</p>
                      <p className="text-gray-700">+977 9876543210</p>
                      <a href="tel:+9779876543210" className="text-blue-600 hover:underline font-medium text-sm">Call us now</a>
                    </div>
                  </div>

                  <div className="flex items-start bg-blue-50 p-4 rounded-lg transition-all duration-300 hover:bg-blue-100">
                    <div className="bg-blue-700 text-white rounded-full p-2 mr-4">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-800">Email Address:</p>
                      <p className="text-gray-700">info@nepalilawyer.com</p>
                      <a href="mailto:info@nepalilawyer.com" className="text-blue-600 hover:underline font-medium text-sm">Email us now</a>
                    </div>
                  </div>

                  <div className="flex items-start bg-blue-50 p-4 rounded-lg transition-all duration-300 hover:bg-blue-100">
                    <div className="bg-blue-700 text-white rounded-full p-2 mr-4">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-800">Business Hours:</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                        <span className="text-gray-700">Monday - Friday:</span>
                        <span className="text-gray-700">9:00 AM - 5:00 PM</span>
                        <span className="text-gray-700">Saturday:</span>
                        <span className="text-gray-700">10:00 AM - 2:00 PM</span>
                        <span className="text-gray-700">Sunday:</span>
                        <span className="text-gray-700">Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Map Embed */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-80 transition-all duration-500 hover:shadow-xl">
                <div className="h-full w-full bg-gray-200 relative">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.311687189518!2d85.32266147464271!3d27.707661225479058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1908434cb3c5%3A0x1fdf1a6d41d2512d!2sIslington%20College!5e0!3m2!1sen!2snp!4v1744861764008!5m2!1sen!2snp" width="600" height="450" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold text-blue-800 mb-6">Contact Us</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                    {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-600"
                      rows="4"
                    />
                    {errors.message && <p className="text-red-500 text-xs">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-blue-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-800 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-6">
                <p className="font-semibold text-blue-800">{item.question}</p>
                <p className="text-gray-700 mt-2">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
