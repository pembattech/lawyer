import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [caseSummaries, setCaseSummaries] = useState([]);
    const [caseUpdates, setCaseUpdates] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [activeSection, setActiveSection] = useState('users');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({});
    const [editItem, setEditItem] = useState(null); // New state to track item for editing

    const token = localStorage.getItem('accessToken');
    const authHeader = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = () => {
        fetchUsers();
        fetchDocuments();
        fetchCaseSummaries();
        fetchCaseUpdates();
        fetchAppointments();
        fetchContacts();
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_BASE}/users/`, { headers: authHeader });
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users", err);
        }
    };

    const fetchDocuments = async () => {
        try {
            const res = await axios.get(`${API_BASE}/documents/`, { headers: authHeader });
            setDocuments(res.data);
        } catch (err) {
            console.error("Error fetching documents", err);
        }
    };

    const fetchCaseSummaries = async () => {
        try {
            const res = await axios.get(`${API_BASE}/case-summaries/`, { headers: authHeader });
            setCaseSummaries(res.data);
        } catch (err) {
            console.error("Error fetching case summaries", err);
        }
    };

    const fetchCaseUpdates = async () => {
        try {
            const res = await axios.get(`${API_BASE}/case-updates/`, { headers: authHeader });
            setCaseUpdates(res.data);
        } catch (err) {
            console.error("Error fetching case updates", err);
        }
    };

    const fetchAppointments = async () => {
        try {
            const res = await axios.get(`${API_BASE}/appointments/`, { headers: authHeader });
            setAppointments(res.data);
        } catch (err) {
            console.error("Error fetching appointments", err);
        }
    };

    const fetchContacts = async () => {
        try {
            const res = await axios.get(`${API_BASE}/contact-messages/`, { headers: authHeader });
            setContacts(res.data);
        } catch (err) {
            console.error("Error fetching contact messages", err);
        }
    };

    const deleteItem = async (url, id, updateStateFn) => {
        try {
            await axios.delete(`${API_BASE}${url}/${id}/`, { headers: authHeader });
            updateStateFn(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error(`Error deleting from ${url}`, err);
        }
    };

    const createItem = async (url, data, updateStateFn) => {
        try {
            const res = await axios.post(`${API_BASE}${url}/`, data, { headers: authHeader });
            updateStateFn(prev => [...prev, res.data]);
            setIsModalOpen(false); // Close modal after creation
        } catch (err) {
            console.error(`Error creating item in ${url}`, err);
        }
    };

    const editItemData = async (url, id, updateStateFn) => {
        try {
            const res = await axios.get(`${API_BASE}${url}/${id}/`, { headers: authHeader });
            setEditItem(res.data);
            setIsModalOpen(true);
        } catch (err) {
            console.error(`Error fetching item to edit`, err);
        }
    };

    const updateItem = async (url, id, data, updateStateFn) => {
        try {
            const res = await axios.put(`${API_BASE}${url}/${id}/`, data, { headers: authHeader });
            updateStateFn(prev => prev.map(item => (item.id === id ? res.data : item)));
            setIsModalOpen(false); // Close modal after update
        } catch (err) {
            console.error(`Error updating item in ${url}`, err);
        }
    };

    const handleSubmit = () => {
        const url = `/${activeSection}`;
        if (editItem) {
            updateItem(url, editItem.id, newItem, setNewItem);
        } else {
            createItem(url, newItem, setNewItem);
        }
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'users':
                return users.map(user => (
                    <div key={user.id} className="border-b py-2 flex justify-between">
                        <span>{user.email} - {user.role}</span>
                        <div>
                            <button onClick={() => editItemData('/users', user.id, setUsers)} className="text-blue-500 mr-2">Edit</button>
                            <button onClick={() => deleteItem('/users', user.id, setUsers)} className="text-red-500">Delete</button>
                        </div>
                    </div>
                ));
            case 'documents':
                return documents.map(doc => (
                    <div key={doc.id} className="border-b py-2 flex justify-between">
                        <span>{doc.file} - Uploaded by {doc.user}</span>
                        <div>
                            <button onClick={() => editItemData('/documents', doc.id, setDocuments)} className="text-blue-500 mr-2">Edit</button>
                            <button onClick={() => deleteItem('/documents', doc.id, setDocuments)} className="text-red-500">Delete</button>
                        </div>
                    </div>
                ));
            case 'caseSummaries':
                return caseSummaries.map(item => (
                    <div key={item.id} className="border-b py-2 flex justify-between">
                        <span>{item.title}</span>
                        <div>
                            <button onClick={() => editItemData('/case-summaries', item.id, setCaseSummaries)} className="text-blue-500 mr-2">Edit</button>
                            <button onClick={() => deleteItem('/case-summaries', item.id, setCaseSummaries)} className="text-red-500">Delete</button>
                        </div>
                    </div>
                ));
            case 'caseUpdates':
                return caseUpdates.map(item => (
                    <div key={item.id} className="border-b py-2 flex justify-between">
                        <span>{item.content}</span>
                        <div>
                            <button onClick={() => editItemData('/case-updates', item.id, setCaseUpdates)} className="text-blue-500 mr-2">Edit</button>
                            <button onClick={() => deleteItem('/case-updates', item.id, setCaseUpdates)} className="text-red-500">Delete</button>
                        </div>
                    </div>
                ));
            case 'appointments':
                return appointments.map(app => (
                    <div key={app.id} className="border-b py-2">
                        {app.name} - {app.date}
                    </div>
                ));
            case 'contacts':
                return contacts.map(contact => (
                    <div key={contact.id} className="border-b py-2">
                        {contact.name}: {contact.message}
                    </div>
                ));
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
                <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
                <button onClick={() => setActiveSection('users')} className="block w-full text-left hover:bg-gray-700 p-2">Users</button>
                <button onClick={() => setActiveSection('documents')} className="block w-full text-left hover:bg-gray-700 p-2">Documents</button>
                <button onClick={() => setActiveSection('caseSummaries')} className="block w-full text-left hover:bg-gray-700 p-2">Case Summaries</button>
                <button onClick={() => setActiveSection('caseUpdates')} className="block w-full text-left hover:bg-gray-700 p-2">Case Updates</button>
                <button onClick={() => setActiveSection('appointments')} className="block w-full text-left hover:bg-gray-700 p-2">Appointments</button>
                <button onClick={() => setActiveSection('contacts')} className="block w-full text-left hover:bg-gray-700 p-2">Contacts</button>
            </aside>
            <main className="flex-1 p-6">
                <div className="mb-4">
                    <button
                        onClick={() => {
                            setEditItem(null); // Reset edit item
                            setIsModalOpen(true);
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                        Add New {activeSection.slice(0, -1)} {/* Dynamically change section title */}
                    </button>
                </div>
                <div>
                    {renderSection()}
                </div>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-md w-1/3">
                            <h3 className="text-lg font-bold mb-4">{editItem ? 'Edit' : 'Create'} {activeSection.slice(0, -1)}</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={newItem.name || editItem?.name || ''}
                                        onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                        className="border p-2 w-full"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                >
                                    {editItem ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
