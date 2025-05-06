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
        lawyer: '',
        name: '',
        email: '',
        phone: '',
        service_needed: '',
        preferred_date: '',
        preferred_time: '',
        description: '',
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
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = { ...formData };

        const method = editingId ? 'put' : 'post';
        const url = editingId
            ? `/api/appointments/${editingId}/`
            : '/api/appointments/';

        try {
            const response = await axios[method](url, payload);
            if (editingId) {
                setAppointments(prev =>
                    prev.map(a => (a.id === editingId ? response.data : a))
                );
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
                lawyer: appointment.lawyer || '',
                name: appointment.name || '',
                email: appointment.email || '',
                phone: appointment.phone || '',
                service_needed: appointment.service_needed || '',
                preferred_date: appointment.preferred_date || '',
                preferred_time: appointment.preferred_time || '',
                description: appointment.description || '',
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
            lawyer: '',
            name: '',
            email: '',
            phone: '',
            service_needed: '',
            preferred_date: '',
            preferred_time: '',
            description: '',

        });
        setEditingId(null);
        setShowModal(false);
    };

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-4 bg-gray-100 min-h-screen">
                <div className="p-4">
                    <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Appointments</h1>

                    {showModal && (
                        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4 mb-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="lawyer"
                                    value={formData.lawyer}
                                    onChange={handleChange}
                                    readOnly
                                    placeholder="Lawyer ID or Name"
                                    className="border rounded p-2 w-full"
                                />
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
                                    name="service_needed"
                                    value={formData.service_needed}
                                    onChange={handleChange}
                                    placeholder="Service Needed"
                                    required
                                    className="border rounded p-2 w-full"
                                />
                                <input
                                    type="date"
                                    name="preferred_date"
                                    value={formData.preferred_date}
                                    onChange={handleChange}
                                    required
                                    className="border rounded p-2 w-full"
                                />
                                <input
                                    type="time"
                                    name="preferred_time"
                                    value={formData.preferred_time}
                                    onChange={handleChange}
                                    required
                                    className="border rounded p-2 w-full"
                                />
                            </div>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Description"
                                className="border rounded p-2 w-full"
                            />

                            <div className="flex justify-between">
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
                                >
                                    {editingId ? 'Update' : 'Create'} Appointment
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Appointments</h2>
                            {appointments.map(appointment => (
                                <div
                                    key={appointment.id}
                                    className="bg-white p-4 rounded shadow mb-4 flex justify-between items-center"
                                >
                                    <div onClick={() => handleViewDetails(appointment.id)} className="cursor-pointer">
                                        <p className="font-bold">{appointment.name}</p>
                                        <p className="text-gray-600">{appointment.service_needed}</p>
                                    </div>
                                    <div className="space-x-2">
                                        <button onClick={() => handleEdit(appointment.id)} className="text-blue-500">Edit</button>
                                        <button onClick={() => handleDelete(appointment.id)} className="text-red-500">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white p-6 shadow rounded">
                            {detailId ? (
                                <>
                                    <h3 className="text-xl font-semibold mb-4">Appointment Details</h3>
                                    {appointments.filter(a => a.id === detailId).map(detail => (
                                        <div key={detail.id}>
                                            <p><strong>Appointment ID:</strong> {detail.id}</p>
                                            <p><strong>Lawyer:</strong> {detail.lawyer}</p>
                                            <p><strong>Name:</strong> {detail.name}</p>
                                            <p><strong>Email:</strong> {detail.email}</p>
                                            <p><strong>Phone:</strong> {detail.phone}</p>
                                            <p><strong>Service:</strong> {detail.service_needed}</p>
                                            <p><strong>Date:</strong> {detail.preferred_date}</p>
                                            <p><strong>Time:</strong> {detail.preferred_time}</p>
                                            <p><strong>Description:</strong> {detail.description}</p>
                                            <p><strong>Seen:</strong> {detail.isseen ? 'Yes' : 'No'}</p>
                                            <p><strong>Created At:</strong> {new Date(detail.created_at).toLocaleString()}</p>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setDetailId(null)}
                                        className="bg-gray-600 text-white px-4 py-2 rounded mt-4"
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
