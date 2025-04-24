import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { motion } from "framer-motion";

const AppointmentPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [lawyers, setLawyers] = useState([]);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferred_date: "",
    preferred_time: "",
    service_needed: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setIsLoaded(true);
    fetch("http://127.0.0.1:8000/api/lawyers/")
      .then((res) => res.json())
      .then((data) => setLawyers(data))
      .catch((err) => console.error("Failed to fetch lawyers", err));
  }, []);

  const handleLawyerSelect = (lawyer) => {
    setSelectedLawyer(lawyer);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[0-9+]{9,15}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number.";
    }
    if (!formData.service_needed) newErrors.service_needed = "Select a service.";
    if (!formData.preferred_date) newErrors.preferred_date = "Select a date.";
    if (!formData.preferred_time) newErrors.preferred_time = "Select a time.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      ...formData,
      lawyer: selectedLawyer.id,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/appointments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowPopup(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          preferred_date: "",
          preferred_time: "",
          service_needed: "",
          description: "",
        });
        setSelectedLawyer(null);
        setErrors({});
        setTimeout(() => setShowPopup(false), 3000);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <Header />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Choose a Lawyer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lawyers.map((lawyer) => (
              <motion.div
                key={lawyer.id}
                onClick={() => handleLawyerSelect(lawyer)}
                whileHover={{ scale: 1.02 }}
                className={`cursor-pointer border rounded-lg p-6 shadow-md transition-all ${
                  selectedLawyer?.id === lawyer.id
                    ? "border-blue-600"
                    : "border-gray-200"
                }`}
              >
                <h3 className="text-xl font-semibold text-center">
                  {lawyer.first_name} {lawyer.last_name}
                </h3>
                <p className="text-center text-sm text-gray-500">{lawyer.email}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {selectedLawyer && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-xl">
            <h2 className="text-2xl font-bold text-center mb-6">
              Book Appointment with {selectedLawyer.first_name} {selectedLawyer.last_name}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border px-4 py-2 rounded"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border px-4 py-2 rounded"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

              <input
                type="text"
                name="phone"
                placeholder="Your Phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border px-4 py-2 rounded"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

              <input
                type="date"
                name="preferred_date"
                value={formData.preferred_date}
                onChange={handleInputChange}
                className="w-full border px-4 py-2 rounded"
              />
              {errors.preferred_date && <p className="text-red-500 text-sm">{errors.preferred_date}</p>}

              <input
                type="time"
                name="preferred_time"
                value={formData.preferred_time}
                onChange={handleInputChange}
                className="w-full border px-4 py-2 rounded"
              />
              {errors.preferred_time && <p className="text-red-500 text-sm">{errors.preferred_time}</p>}

              <select
                name="service_needed"
                value={formData.service_needed}
                onChange={handleInputChange}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="">Select a Service</option>
                <option value="consultation">Consultation</option>
                <option value="contract review">Contract Review</option>
                <option value="legal advice">Legal Advice</option>
              </select>
              {errors.service_needed && <p className="text-red-500 text-sm">{errors.service_needed}</p>}

              <textarea
                name="description"
                placeholder="Additional Message"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full border px-4 py-2 rounded"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Book Appointment
              </button>
            </form>
          </div>
        </section>
      )}

      <Footer />

      {showPopup && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50">
          Appointment booked successfully!
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;
