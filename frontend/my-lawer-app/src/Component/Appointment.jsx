import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Set base URL
axios.defaults.baseURL = 'http://127.0.0.1:8000';

// Add Authorization header from localStorage to all requests
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

const Appointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service_needed: '',
        preferred_date: '',
        preferred_time: '',
        description: '',
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        axios.get('/api/book/')
            .then(response => setAppointments(response.data))
            .catch(error => console.error('Error fetching appointments:', error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = editingId ? 'put' : 'post';
        const url = editingId ? `/api/book/${editingId}/` : '/api/book/';

        axios[method](url, formData)
            .then(response => {
                setAppointments(prev => {
                    return editingId
                        ? prev.map(a => (a.id === editingId ? response.data : a))
                        : [...prev, response.data];
                });
                setEditingId(null);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    service_needed: '',
                    preferred_date: '',
                    preferred_time: '',
                    description: '',
                });
            })
            .catch(error => console.error('Error submitting appointment:', error));
    };

    const handleEdit = (id) => {
        setEditingId(id);
        const appointment = appointments.find(a => a.id === id);
        if (appointment) {
            setFormData({ ...appointment });
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            axios.delete(`/api/book/${id}/`)
                .then(() => {
                    setAppointments(prev => prev.filter(a => a.id !== id));
                })
                .catch(error => console.error('Error deleting appointment:', error));
        }
    };

    return (
        <div>
            <h1>Appointment Booking</h1>

            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
                <input type="text" name="service" value={formData.service_needed} onChange={handleChange} placeholder="Service Needed" required />
                <input type="date" name="date" value={formData.preferred_date} onChange={handleChange} required />
                <input type="time" name="time" value={formData.preferred_time} onChange={handleChange} required />
                <textarea name="message" value={formData.description} onChange={handleChange} placeholder="Description" />
                <button type="submit">{editingId ? 'Update' : 'Create'} Appointment</button>
            </form>

            <h2>Appointments</h2>
            <ul>
                {appointments.map(appointment => (
                    <li key={appointment.id}>
                        <p>{appointment.name} - {appointment.service_needed}</p>
                        <button onClick={() => handleEdit(appointment.id)}>Edit</button>
                        <button onClick={() => handleDelete(appointment.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Appointment;
