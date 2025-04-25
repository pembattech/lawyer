import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Sidebar from './AdminSidebar';

import useAuthRedirect from './../hook/useAuthRedirect';


axios.defaults.baseURL = 'http://127.0.0.1:8000';

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

const AdminAppointment = () => {
    useAuthRedirect();

    const [appointments, setAppointments] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        date: '',
        time: '',
        message: '',
    });
    const [editingId, setEditingId] = useState(null);
    const [detailId, setDetailId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('/api/appointments/');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const convertTo12Hour = (time24) => {
        if (!time24) return '';
        const [hour, minute] = time24.split(':');
        let hourNum = parseInt(hour);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        hourNum = hourNum % 12 || 12;
        return `${hourNum}:${minute} ${ampm}`;
    };

    const convertTo24Hour = (time12) => {
        if (!time12) return '';
        const [time, ampm] = time12.split(' ');
        let [hour, minute] = time.split(':');
        hour = parseInt(hour);
        if (ampm === 'PM' && hour !== 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
        return `${hour}:${minute}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const convertedTime = formData.time ? convertTo12Hour(formData.time) : '';
        const payload = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            service: formData.service,
            date: formData.date,
            time: convertedTime,
            message: formData.message,
        };

        const method = editingId ? 'put' : 'post';
        const url = editingId ? `/api/appointments/${editingId}/` : '/api/appointments/';

        try {
            const response = await axios[method](url, payload);
            if (editingId) {
                setAppointments(prev => prev.map(a => (a.id === editingId ? response.data : a)));
            } else {
                setAppointments(prev => [...prev, response.data]);
            }
            resetForm();
        } catch (error) {
            console.error('Error submitting appointment:', error);
        }
    };

    const handleEdit = (id) => {
        const appointment = appointments.find(a => a.id === id);
        if (appointment) {
            setEditingId(id);
            setFormData({
                name: appointment.name || '',
                email: appointment.email || '',
                phone: appointment.phone || '',
                service: appointment.service_needed || '',
                date: appointment.preferred_date || '',
                time: convertTo24Hour(appointment.preferred_time) || '',
                message: appointment.description || '',
            });
            setShowModal(true);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            try {
                await axios.delete(`/api/appointments/${id}/`);
                setAppointments(prev => prev.filter(a => a.id !== id));
            } catch (error) {
                console.error('Error deleting appointment:', error);
            }
        }
    };

    const handleViewDetails = (id) => {
        setDetailId(detailId === id ? null : id);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            service: '',
            date: '',
            time: '',
            message: '',
        });
        setEditingId(null);
        setShowModal(false);
    };

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-4 bg-gray-100 min-h-screen">
                <div className="p-4">
                    <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Appointment</h1>

                    {/* <button
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200 mb-6"
                    >
                        Create Appointment
                    </button> */}

                    {/* Modal for creating/editing appointment */}
                    {showModal && (
                        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4 mb-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                    required
                                    className="border rounded p-2 w-full"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    required
                                    className="border rounded p-2 w-full"
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Phone"
                                    required
                                    className="border rounded p-2 w-full"
                                />
                                <input
                                    type="text"
                                    name="service"
                                    value={formData.service}
                                    onChange={handleChange}
                                    placeholder="Service Needed"
                                    required
                                    className="border rounded p-2 w-full"
                                />
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="border rounded p-2 w-full"
                                />
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                    className="border rounded p-2 w-full"
                                />
                            </div>

                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Description"
                                className="border rounded p-2 w-full"
                            />

                            <div className="flex justify-between">
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition duration-200"
                                >
                                    {editingId ? 'Update' : 'Create'} Appointment
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column - Appointment list */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold mb-4">Appointments</h2>
                            <ul>
                                {appointments.map(appointment => (
                                    <li
                                        key={appointment.id}
                                        className="bg-gray-100 hover:bg-gray-200 p-4 mt-4 mb-4 rounded flex items-center justify-between"
                                    >
                                        <div className="flex-1" onClick={() => handleViewDetails(appointment.id)}>
                                            <p
                                                className="font-medium cursor-pointer"
                                            >
                                                {appointment.name}
                                            </p>
                                            <p className="text-sm text-gray-600">{appointment.service_needed}</p>
                                        </div>
                                        <div className="space-x-2">
                                            <button
                                                onClick={() => handleEdit(appointment.id)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(appointment.id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right Column - Detailed information */}
                        <div className="bg-white p-6 shadow-lg rounded">
                            {detailId ? (
                                <>
                                    <h3 className="text-xl font-semibold mb-4">Appointment Details</h3>
                                    <div>
                                        <p><strong>Name:</strong> {appointments.find(a => a.id === detailId).name}</p>
                                        <p><strong>Email:</strong> {appointments.find(a => a.id === detailId).email}</p>
                                        <p><strong>Phone:</strong> {appointments.find(a => a.id === detailId).phone}</p>
                                        <p><strong>Service:</strong> {appointments.find(a => a.id === detailId).service_needed}</p>
                                        <p><strong>Date:</strong> {appointments.find(a => a.id === detailId).preferred_date}</p>
                                        <p><strong>Time:</strong> {appointments.find(a => a.id === detailId).preferred_time}</p>
                                        <p><strong>Message:</strong> {appointments.find(a => a.id === detailId).description}</p>
                                    </div>
                                    <button
                                        onClick={() => setDetailId(null)}
                                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200 mt-4"
                                    >
                                        Close
                                    </button>
                                </>
                            ) : (
                                <p className="text-gray-600">Select an appointment to view details.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminAppointment;
