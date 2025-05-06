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

const AdminContactMessage = () => {
    useAuthRedirect();

    const [messages, setMessages] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [editingId, setEditingId] = useState(null);
    const [detailId, setDetailId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get('/api/contact-messages/');
            const sortedMessages = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setMessages(sortedMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
        };

        const method = editingId ? 'put' : 'post';
        const url = editingId ? `/api/contact-messages/${editingId}/` : '/api/contact-messages/';

        try {
            const response = await axios[method](url, payload);
            if (editingId) {
                setMessages(prev => prev.map(m => (m.id === editingId ? response.data : m)));
            } else {
                setMessages(prev => [...prev, response.data]);
            }
            resetForm();
        } catch (error) {
            console.error('Error submitting contact message:', error);
        }
    };

    const handleEdit = (id) => {
        const message = messages.find(m => m.id === id);
        if (message) {
            setEditingId(id);
            setFormData({
                name: message.name || '',
                email: message.email || '',
                phone: message.phone || '',
                message: message.message || '',
            });
            setShowModal(true);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await axios.delete(`/api/contact-messages/${id}/`);
                setMessages(prev => prev.filter(m => m.id !== id));
            } catch (error) {
                console.error('Error deleting message:', error);
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
                    <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Contact Messages</h1>

                    {/* <button
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200 mb-6"
                    >
                        Create Contact Message
                    </button> */}

                    {/* Modal for creating/editing contact message */}
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
                                    className="border rounded p-2 w-full"
                                />
                            </div>

                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Message"
                                className="border rounded p-2 w-full"
                                required
                            />

                            <div className="flex justify-between">
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition duration-200"
                                >
                                    {editingId ? 'Update' : 'Create'} Message
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[80vh]">
                        {/* Left Column - Contact message list */}
                        <div className="space-y-4 overflow-y-auto pr-2">
                            <h2 className="text-xl font-semibold mb-4">Messages</h2>
                            <ul>
                                {messages.map(message => (
                                    <li
                                        key={message.id}
                                        className="bg-gray-100 hover:bg-gray-200 p-4 mt-4 mb-4 rounded flex items-center justify-between"
                                    >
                                        <div className="flex-1" onClick={() => handleViewDetails(message.id)}>
                                            <p
                                                className="font-medium cursor-pointer"
                                            >
                                                {message.name}
                                            </p>
                                            <p className="text-sm text-gray-600">Phone: {message.phone}</p>
                                        </div>
                                        <div className="space-x-2">
                                            <button
                                                onClick={() => handleEdit(message.id)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(message.id)}
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
                        <div className="bg-white p-6 shadow-lg rounded overflow-y-auto">
                            {detailId ? (
                                <>
                                    <h3 className="text-xl font-semibold mb-4">Message Details</h3>
                                    <div>
                                        <p><strong>Name:</strong> {messages.find(m => m.id === detailId).name}</p>
                                        <p><strong>Email:</strong> {messages.find(m => m.id === detailId).email}</p>
                                        <p><strong>Phone:</strong> {messages.find(m => m.id === detailId).phone}</p>
                                        <p><strong>Message:</strong> {messages.find(m => m.id === detailId).message}</p>
                                    </div>
                                    <button
                                        onClick={() => setDetailId(null)}
                                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200 mt-4"
                                    >
                                        Close
                                    </button>
                                </>
                            ) : (
                                <p className="text-gray-600">Select a message to view details.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminContactMessage;
