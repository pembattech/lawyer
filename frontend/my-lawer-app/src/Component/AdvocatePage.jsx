import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import moneyImage from "../assets/profile.jpg";

const AdvocatePage = () => {
  const [activeTab, setActiveTab] = useState("background");
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Advocate Hero Section with improved visual appeal */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 mb-6 md:mb-0 relative">
              <div className="w-56 h-56 mx-auto relative">
                <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
                <img
                  src={moneyImage}
                  alt="Ramesh Khadka"
                  className="rounded-full w-48 h-48 object-cover absolute inset-0 m-auto border-4 border-white shadow-lg"
                />
              </div>
            </div>
            <div className="w-full md:w-2/3 text-center md:text-left px-4 md:px-8 py-6 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 rounded-2xl shadow-lg">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3 break-words">
                Ramesh Khadka
              </h1>
              <p className="text-xl md:text-2xl text-blue-200 mb-4 font-medium">
                Senior Attorney & Legal Consultant
              </p>
              <p className="text-sm md:text-base text-blue-100 max-w-2xl mb-6">
                With over 20 years of experience in corporate law, commercial litigation, and international business transactions,
                Mr. Khadka provides strategic legal counsel to businesses and individuals in Nepal and internationally.
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-5">
                <a
                  href="tel:9273839451"
                  className="flex items-center bg-white text-blue-900 hover:bg-blue-100 px-4 py-2 rounded-full shadow-md transition duration-300 text-sm md:text-base font-semibold"
                >
                  <span className="mr-2">📞</span> Call Now
                </a>
                <a
                  href="mailto:ramesh@khadka.com"
                  className="flex items-center bg-white text-blue-900 hover:bg-blue-100 px-4 py-2 rounded-full shadow-md transition duration-300 text-sm md:text-base font-semibold"
                >
                  <span className="mr-2">✉️</span> Email Me
                </a>
                <a
                  href="#contact-form"
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-md transition duration-300 text-sm md:text-base font-semibold"
                >
                  <span className="mr-2">📝</span> Request Consultation
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with improved layout */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Contact Form */}
            <div className="lg:w-1/3 order-2 lg:order-1">
              <div id="contact-form" className="bg-white p-6 rounded-lg shadow-lg mb-8 sticky top-4">
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">Contact Us</h2>
                {formSubmitted ? (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    <p className="font-medium">Thank you for reaching out!</p>
                    <p>We'll get back to you as soon as possible.</p>
                  </div>
                ) : (
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
                )}

                {/* Contact Information Card */}
                <div className="mt-8 bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Office Location</h3>
                  <p className="text-gray-700 mb-4">123 Legal Avenue, Kathmandu, Nepal</p>

                  <h3 className="font-semibold text-blue-800 mb-2">Business Hours</h3>
                  <p className="text-gray-700">Monday - Friday: 9:00 AM - 5:00 PM</p>
                  <p className="text-gray-700 mb-4">Weekends: By appointment only</p>

                  <h3 className="font-semibold text-blue-800 mb-2">Direct Contact</h3>
                  <p className="text-gray-700">Phone: +977 9273839451</p>
                  <p className="text-gray-700">Email: ramesh@khadka.com</p>
                </div>
              </div>
            </div>

            {/* Main Content Area with tabs for better organization */}
            <div className="lg:w-2/3 order-1 lg:order-2">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                {/* Tab Navigation */}
                <div className="flex flex-wrap border-b border-gray-200 mb-6">
                  <button
                    className={`px-4 py-2 font-medium rounded-t-lg mr-2 ${activeTab === "background" ? "bg-blue-100 text-blue-800 border-b-2 border-blue-800" : "text-gray-600 hover:text-blue-800"}`}
                    onClick={() => setActiveTab("background")}
                  >
                    Background
                  </button>
                  <button
                    className={`px-4 py-2 font-medium rounded-t-lg mr-2 ${activeTab === "practice" ? "bg-blue-100 text-blue-800 border-b-2 border-blue-800" : "text-gray-600 hover:text-blue-800"}`}
                    onClick={() => setActiveTab("practice")}
                  >
                    Practice Areas
                  </button>
                  <button
                    className={`px-4 py-2 font-medium rounded-t-lg mr-2 ${activeTab === "education" ? "bg-blue-100 text-blue-800 border-b-2 border-blue-800" : "text-gray-600 hover:text-blue-800"}`}
                    onClick={() => setActiveTab("education")}
                  >
                    Education
                  </button>
                  <button
                    className={`px-4 py-2 font-medium rounded-t-lg ${activeTab === "memberships" ? "bg-blue-100 text-blue-800 border-b-2 border-blue-800" : "text-gray-600 hover:text-blue-800"}`}
                    onClick={() => setActiveTab("memberships")}
                  >
                    Memberships
                  </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                  {/* Background Tab */}
                  {activeTab === "background" && (
                    <div>
                      <h2 className="text-2xl font-bold text-blue-800 mb-4">Professional Background</h2>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        Mr. Ramesh Khadka has been practicing law for over 20 years and is a recognized expert in
                        corporate law, commercial litigation, and international business transactions in Nepal.
                      </p>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        After graduating with honors from Tribhuvan University Law School, he continued his education
                        at Harvard Law School, where he earned his LLM in International Business Law.
                      </p>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        Mr. Khadka's clientele includes major corporations, financial institutions, and high-net-worth
                        individuals from Nepal and around the world. He is known for his strategic approach to complex legal
                        matters and his dedication to achieving favorable outcomes for his clients.
                      </p>

                      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold text-blue-800 mb-3">Why Choose Attorney Khadka?</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-start">
                            <div className="bg-blue-800 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                              <span>✓</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">Experienced Counsel</h4>
                              <p className="text-gray-700">Over two decades of legal practice in complex matters</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="bg-blue-800 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                              <span>✓</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">International Perspective</h4>
                              <p className="text-gray-700">Harvard-educated with global business understanding</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="bg-blue-800 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                              <span>✓</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">Strategic Approach</h4>
                              <p className="text-gray-700">Business-focused solutions to legal challenges</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="bg-blue-800 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                              <span>✓</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">Client Dedication</h4>
                              <p className="text-gray-700">Personalized attention to every case</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Practice Areas Tab */}
                  {activeTab === "practice" && (
                    <div>
                      <h2 className="text-2xl font-bold text-blue-800 mb-4">Practice Areas</h2>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition">
                          <div className="text-blue-800 text-3xl mb-2">⚖️</div>
                          <h3 className="text-lg font-semibold mb-2">Corporate Law and Governance</h3>
                          <p className="text-gray-700">Advising on company formation, corporate governance, and regulatory compliance.</p>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition">
                          <div className="text-blue-800 text-3xl mb-2">🏛️</div>
                          <h3 className="text-lg font-semibold mb-2">Commercial Litigation</h3>
                          <p className="text-gray-700">Representing clients in business disputes, contract conflicts, and shareholder disagreements.</p>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition">
                          <div className="text-blue-800 text-3xl mb-2">🤝</div>
                          <h3 className="text-lg font-semibold mb-2">Mergers and Acquisitions</h3>
                          <p className="text-gray-700">Guiding businesses through complex M&A transactions, due diligence, and negotiations.</p>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition">
                          <div className="text-blue-800 text-3xl mb-2">🌐</div>
                          <h3 className="text-lg font-semibold mb-2">International Business Transactions</h3>
                          <p className="text-gray-700">Facilitating cross-border deals and helping navigate international legal frameworks.</p>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition">
                          <div className="text-blue-800 text-3xl mb-2">🏦</div>
                          <h3 className="text-lg font-semibold mb-2">Banking and Finance</h3>
                          <p className="text-gray-700">Advising on financial regulations, lending transactions, and securities compliance.</p>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition">
                          <div className="text-blue-800 text-3xl mb-2">💼</div>
                          <h3 className="text-lg font-semibold mb-2">Foreign Investment</h3>
                          <p className="text-gray-700">Helping international investors navigate Nepal's legal and regulatory environment.</p>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition">
                          <div className="text-blue-800 text-3xl mb-2">✈️</div>
                          <h3 className="text-lg font-semibold mb-2">Immigration Law</h3>
                          <p className="text-gray-700">Assisting with visa applications, work permits, and residency matters.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Education Tab */}
                  {activeTab === "education" && (
                    <div>
                      <h2 className="text-2xl font-bold text-blue-800 mb-4">Education & Qualifications</h2>
                      <div className="space-y-6">
                        <div className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                          <div className="bg-blue-800 text-white p-4 md:w-1/4 flex items-center justify-center">
                            <span className="text-3xl">🎓</span>
                          </div>
                          <div className="p-4 md:w-3/4">
                            <h3 className="text-xl font-semibold">LLM in International Business Law</h3>
                            <p className="text-blue-800">Harvard Law School, United States</p>
                            <p className="text-gray-600">2005</p>
                            <p className="mt-2 text-gray-700">Specialized in international trade law, corporate governance, and cross-border transactions.</p>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                          <div className="bg-blue-800 text-white p-4 md:w-1/4 flex items-center justify-center">
                            <span className="text-3xl">🎓</span>
                          </div>
                          <div className="p-4 md:w-3/4">
                            <h3 className="text-xl font-semibold">Bachelor of Laws (LLB)</h3>
                            <p className="text-blue-800">Tribhuvan University, Nepal</p>
                            <p className="text-gray-600">2000</p>
                            <p className="mt-2 text-gray-700">Graduated with honors. Focused on constitutional law, corporate law, and civil procedure.</p>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h3 className="text-xl font-semibold text-blue-800 mb-3">Additional Certifications</h3>
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start">
                              <span className="text-blue-800 mr-2">•</span>
                              <span>Certificate in International Arbitration, London School of Arbitration (2010)</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-blue-800 mr-2">•</span>
                              <span>Diploma in Advanced Corporate Law, National Law Institute (2007)</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-blue-800 mr-2">•</span>
                              <span>Certified Mediator, Nepal Mediation Center (2012)</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Memberships Tab */}
                  {activeTab === "memberships" && (
                    <div>
                      <h2 className="text-2xl font-bold text-blue-800 mb-4">Memberships & Associations</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition">
                          <h3 className="text-lg font-semibold text-blue-800 mb-2">Nepal Bar Association</h3>
                          <p className="text-gray-700">Active member since 2000</p>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition">
                          <h3 className="text-lg font-semibold text-blue-800 mb-2">International Bar Association</h3>
                          <p className="text-gray-700">Member of the Corporate Law Committee</p>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition">
                          <h3 className="text-lg font-semibold text-blue-800 mb-2">American Bar Association</h3>
                          <p className="text-gray-700">International Associate</p>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition">
                          <h3 className="text-lg font-semibold text-blue-800 mb-2">Nepal Chamber of Commerce</h3>
                          <p className="text-gray-700">Legal Advisor</p>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition">
                          <h3 className="text-lg font-semibold text-blue-800 mb-2">Nepal-American Chamber of Commerce</h3>
                          <p className="text-gray-700">Executive Committee Member</p>
                        </div>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-xl font-semibold text-blue-800 mb-3">Publications & Speaking Engagements</h3>
                        <ul className="space-y-4 text-gray-700">
                          <li className="border-l-4 border-blue-800 pl-4 py-1">
                            <p className="font-medium">"Foreign Investment in Nepal: Legal Framework and Opportunities"</p>
                            <p className="text-sm text-gray-600">International Business Law Journal, 2018</p>
                          </li>
                          <li className="border-l-4 border-blue-800 pl-4 py-1">
                            <p className="font-medium">"Corporate Governance Standards in South Asia: A Comparative Study"</p>
                            <p className="text-sm text-gray-600">Asian Law Review, 2016</p>
                          </li>
                          <li className="border-l-4 border-blue-800 pl-4 py-1">
                            <p className="font-medium">Keynote Speaker: "Cross-Border Mergers & Acquisitions in Emerging Markets"</p>
                            <p className="text-sm text-gray-600">International Legal Summit, Singapore, 2019</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Testimonials Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Client Testimonials</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg relative">
                    <div className="text-blue-800 text-4xl absolute -top-3 left-2">"</div>
                    <p className="mt-4 text-gray-700 italic">Mr. Khadka's expertise in corporate law helped our company navigate a complex merger. His strategic approach saved us time and resources while ensuring full regulatory compliance.</p>
                    <div className="mt-4 flex items-center">
                      <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold">R</div>
                      <div className="ml-3">
                        <p className="font-medium">Rajiv Sharma</p>
                        <p className="text-sm text-gray-600">CEO, Nepal Tech Enterprises</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg relative">
                    <div className="text-blue-800 text-4xl absolute -top-3 left-2">"</div>
                    <p className="mt-4 text-gray-700 italic">When our international investment faced regulatory hurdles, Ramesh provided invaluable guidance. His understanding of both Nepali and international law was precisely what we needed.</p>
                    <div className="mt-4 flex items-center">
                      <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold">S</div>
                      <div className="ml-3">
                        <p className="font-medium">Sarah Johnson</p>
                        <p className="text-sm text-gray-600">Director, Global Investments Ltd.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Discuss Your Legal Matter?</h2>
          <p className="mb-6 max-w-2xl mx-auto">Schedule a confidential consultation with Attorney Ramesh Khadka to discuss your legal needs and how we can assist you.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#contact-form"
              className="bg-white text-blue-800 hover:bg-blue-100 px-6 py-3 rounded-lg font-medium transition duration-300"
            >
              Request Consultation
            </a>
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

export default AdvocatePage;