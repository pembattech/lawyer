import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import moneyImage from "../assets/money.jpg";
import citizenshipImage from "../assets/citizenship.jpg";
import visaImage from "../assets/visa.jpg";
import propertyImage from "../assets/property.jpg";
import taxImage from "../assets/tax.jpg";
import employmentImage from "../assets/profile.jpg";

const ServicesPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    setFormSubmitted(true);
    // Reset form after successful submission
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", message: "" });
      setFormSubmitted(false);
    }, 3000);
  };

  const services = [
    {
      id: 1,
      title: "Money laundering",
      image: moneyImage,
      description: "Specialized advice for businesses and individuals on anti-money laundering regulations and compliance frameworks.",
    },
    {
      id: 2,
      title: "Citizenship",
      image: citizenshipImage,
      description: "Comprehensive assistance with citizenship applications, naturalization processes, and related legal matters.",
    },
    {
      id: 3,
      title: "Visas",
      image: visaImage,
      description: "Expert guidance on visa applications, extensions, and immigration matters for individuals and businesses.",
    },
    {
      id: 4,
      title: "Property and Real Estate",
      image: propertyImage,
      description: "Legal counsel for property transactions, leasing, disputes, and real estate development projects.",
    },
    {
      id: 5,
      title: "Tax Advisory",
      image: taxImage,
      description: "Strategic tax planning, compliance assistance, and representation in tax disputes and audits.",
    },
    {
      id: 6,
      title: "Employment and Labor",
      image: employmentImage,
      description: "Guidance on employment contracts, workplace policies, labor disputes, and regulatory compliance.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Services Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-6">Practice Areas</h1>
          <p className="text-xl text-center max-w-3xl mx-auto text-blue-100">
            Our team of experienced attorneys provides comprehensive legal services
            across a wide range of practice areas to meet the diverse needs of our clients.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Services List */}
            <div className="md:w-2/3">
              <div className="space-y-8">
                {services.map((service) => (
                  <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row">
                    <div className="sm:w-1/4">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-48 sm:h-full object-cover"
                      />
                    </div>
                    <div className="sm:w-3/4 p-6">
                      <h2 className="text-xl font-bold text-blue-800 mb-3">{service.title}</h2>
                      <p className="text-gray-700 mb-4">{service.description}</p>
                      <button className="bg-blue-800 hover:bg-blue-900 text-white py-2 px-4 rounded-md text-sm uppercase tracking-wider transition duration-300">
                        READ MORE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar - Contact Form */}
            <div className="md:w-1/3">
              <div className="bg-blue-500 rounded-lg shadow-lg sticky top-4">
                <div className="bg-blue-600 text-white py-4 px-6 rounded-t-lg">
                  <h2 className="text-xl font-semibold">Contact Us</h2>
                </div>
                <div className="p-6">
                  {formSubmitted ? (
                    <div className="bg-white bg-opacity-20 border border-blue-300 text-white px-4 py-3 rounded">
                      <p className="font-medium">Thank you for reaching out!</p>
                      <p>We'll get back to you as soon as possible.</p>
                    </div>
                  ) : (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your Name"
                          className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          required
                        />
                      </div>
                      <div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Your Email"
                          className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          required
                        />
                      </div>
                      <div>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Your Phone Number"
                          className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>
                      <div>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Your Message"
                          rows="4"
                          className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          required
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-blue-800 hover:bg-blue-900 text-white font-medium py-3 rounded-lg transition duration-300"
                      >
                        SUBMIT
                      </button>
                    </form>
                  )}

                  {/* Practice Areas Quick Links */}
                  <div className="mt-8">
                    <h3 className="text-white font-semibold mb-3">Practice Areas</h3>
                    <ul className="bg-white rounded-lg divide-y divide-gray-200">
                      <li>
                        <a href="#" className="block px-4 py-2 hover:bg-blue-50 transition">Money Laundering</a>
                      </li>
                      <li>
                        <a href="#" className="block px-4 py-2 hover:bg-blue-50 transition">Citizenship</a>
                      </li>
                      <li>
                        <a href="#" className="block px-4 py-2 hover:bg-blue-50 transition">Visas</a>
                      </li>
                      <li>
                        <a href="#" className="block px-4 py-2 hover:bg-blue-50 transition">Property and Real Estate</a>
                      </li>
                      <li>
                        <a href="#" className="block px-4 py-2 hover:bg-blue-50 transition">Tax Advisory</a>
                      </li>
                      <li>
                        <a href="#" className="block px-4 py-2 hover:bg-blue-50 transition">Family and Adoption</a>
                      </li>
                      <li>
                        <a href="#" className="block px-4 py-2 hover:bg-blue-50 transition">Employment and Labor</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">Why Choose Our Legal Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-blue-800 text-4xl mb-4">⚖️</div>
              <h3 className="text-xl font-semibold mb-3">Expert Legal Team</h3>
              <p className="text-gray-700">
                Our attorneys have decades of combined experience in various practice areas
                and are dedicated to providing the highest quality legal representation.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-blue-800 text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-3">Client-Centered Approach</h3>
              <p className="text-gray-700">
                We prioritize your needs and goals, providing personalized legal solutions
                tailored to your specific situation and circumstances.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-blue-800 text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold mb-3">Global Perspective</h3>
              <p className="text-gray-700">
                With international experience and connections, we offer legal services that
                bridge borders and navigate complex international legal frameworks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Discuss Your Legal Matter?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Schedule a confidential consultation with our legal team to discuss your needs
            and how we can assist you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              className="bg-white text-blue-800 hover:bg-blue-100 px-6 py-3 rounded-lg font-medium transition duration-300"
            >
              Request Consultation
            </button>
            <a
              href="tel:9273839451"
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
            >
              Call Now: 927-383-9451
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;