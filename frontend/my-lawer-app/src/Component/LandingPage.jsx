import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import corporateImage from "../assets/corporate.jpg";
import familyImage from "../assets/family.jpg";
import moneyImage from "../assets/money.jpg";

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone must be 10 digits.";
    if (!formData.message.trim()) newErrors.message = "Message is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/contact-messages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", phone: "", message: "" });
        setFormSubmitted(true);
        setErrors({});
      } else {
        alert("Failed to submit. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <Header />

      {/* Hero Section with Parallax Effect */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-network-pattern opacity-10"></div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Trusted Legal Expertise{" "}
              <span className="text-blue-300">in Nepal</span>
            </h1>
            <p className="text-xl mb-10 leading-relaxed text-blue-100">
              We help clients navigate complex legal proceedings in Nepal's
              jurisdiction. Expert guidance on all legal matters, accessible and
              free of charge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/AppointmentPage"
                className="bg-white text-blue-900 hover:bg-blue-100 font-medium px-8 py-4 rounded-lg shadow-lg transition duration-300 text-center transform hover:-translate-y-1"
              >
                Get Free Consultation
              </Link>
              <Link
                to="/services"
                className="border-2 border-white text-white hover:bg-white/10 font-medium px-8 py-4 rounded-lg transition duration-300 text-center transform hover:-translate-y-1"
              >
                Explore Services
              </Link>
            </div>
          </motion.div>
        </div>
        <div
          className="absolute bottom-0 left-0 w-full h-16 bg-white"
          style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
        ></div>
      </section>

      {/* Service Areas Section with Card Hover Effects */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              OUR EXPERTISE
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Practice Areas
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Money Laundering */}
            <motion.div
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden shadow-lg group"
            >
              <div className="h-56 overflow-hidden relative">
                <img
                  src={moneyImage}
                  alt="Money Laundering"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Money Laundering
                </h3>
                <p className="text-gray-600 mb-6">
                  Expert legal counsel for complex financial regulations and
                  compliance in Nepal's evolving regulatory landscape.
                </p>
                <Link
                  to="/services/money-laundering"
                  className="inline-flex items-center text-blue-800 font-medium group"
                >
                  <span className="mr-2">Learn More</span>
                  <span className="transform transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </Link>
              </div>
            </motion.div>

            {/* Family */}
            <motion.div
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden shadow-lg group"
            >
              <div className="h-56 overflow-hidden relative">
                <img
                  src={familyImage}
                  alt="Family Law"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Family Law
                </h3>
                <p className="text-gray-600 mb-6">
                  Compassionate legal support for family matters including
                  divorce, custody, and inheritance disputes.
                </p>
                <Link
                  to="/services/family"
                  className="inline-flex items-center text-blue-800 font-medium group"
                >
                  <span className="mr-2">Learn More</span>
                  <span className="transform transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </Link>
              </div>
            </motion.div>

            {/* Corporate */}
            <motion.div
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden shadow-lg group"
            >
              <div className="h-56 overflow-hidden relative">
                <img
                  src={corporateImage}
                  alt="Corporate Law"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Corporate Law
                </h3>
                <p className="text-gray-600 mb-6">
                  Strategic legal guidance for businesses operating in Nepal,
                  including formation, compliance, and dispute resolution.
                </p>
                <Link
                  to="/services/corporate"
                  className="inline-flex items-center text-blue-800 font-medium group"
                >
                  <span className="mr-2">Learn More</span>
                  <span className="transform transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Nepali Difference with Statistics */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-network-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 bg-blue-800 text-blue-200 rounded-full text-sm font-medium mb-4">
              WHY CHOOSE US
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              The Nepali Difference
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                "Over three decades of legal expertise in Nepali law",
                "Extensive network of influential key-persons",
                "Comprehensive legal services for all types of immigration",
                "Committed to providing exceptional client service",
                "Highly regarded in the domestic legal profession",
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start bg-blue-800/30 p-4 rounded-lg"
                >
                  <span className="text-blue-300 mr-3 text-xl">✓</span>
                  <span className="text-lg">{item}</span>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20"
            >
              <blockquote className="text-xl italic">
                "Whatever path your legal matter may take, we are prepared to
                serve as your dedicated advocate. When you work with our firm,
                you can be confident that we will provide you with personalized
                guidance throughout every stage of your legal proceedings."
                <footer className="mt-6 flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-700 flex items-center justify-center text-xl font-bold mr-4">
                    RK
                  </div>
                  <div>
                    <div className="text-white font-medium">Ramesh K.</div>
                    <div className="text-blue-300 text-sm">Senior Partner</div>
                  </div>
                </footer>
              </blockquote>
            </motion.div>
          </div>

          <div className="mt-12 text-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/AppointmentPage"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg inline-block transition duration-300 font-medium"
              >
                MEET OUR ATTORNEYS
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Process with Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              HOW WE WORK
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Process
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-blue-100 transform -translate-x-1/2"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {[
                {
                  number: "01",
                  title: "Initial Consultation",
                  description:
                    "Free initial meeting with our team where we listen carefully to understand your unique legal needs.",
                },
                {
                  number: "02",
                  title: "Case Strategy",
                  description:
                    "We develop a tailored strategy for your specific case, creating a comprehensive winning plan.",
                },
                {
                  number: "03",
                  title: "Execution",
                  description:
                    "We handle the entire legal process with aggressive advocacy and regular updates on your case.",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center relative"
                >
                  <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-blue-800 text-white flex items-center justify-center z-10"></div>
                  <div className="bg-blue-50 rounded-xl p-8 h-full flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-800 text-white text-2xl font-bold mb-6">
                      {step.number}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Link
              to="/ContactPage"
              className="bg-blue-800 hover:bg-blue-900 text-white font-medium px-8 py-4 rounded-lg shadow-lg transition duration-300 inline-block transform hover:-translate-y-1"
            >
              TAKE THE FIRST STEP
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Contact Form with Better UI */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-network-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 bg-blue-800 text-blue-200 rounded-full text-sm font-medium mb-4">
              GET IN TOUCH
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">Contact Us</h2>
            <p className="mt-4 text-blue-200 max-w-2xl mx-auto">
              Let us know how we can help with your legal matter. We'll get back
              to you within 24 hours.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
            <form
              onSubmit={handleSubmit}
              className="p-8 space-y-6"
            >
              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-white"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-white"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-white"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-white"
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-white text-blue-900 hover:bg-blue-100 font-medium px-8 py-4 rounded-lg shadow-lg transition duration-300 transform hover:-translate-y-1"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
