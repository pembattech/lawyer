import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Sidebar from './AdminSidebar';
import AdminCaseUpdates from './AdminCaseUpdates';
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

const AdminCaseSummary = () => {
    useAuthRedirect();

    const [caseSummaries, setCaseSummaries] = useState([]);
    const [formData, setFormData] = useState({
        case_number: '',
        case_type: '',
        filed_date: '',
        status: 'active',
        user_id: '',
    });
    const [editingId, setEditingId] = useState(null);
    const [selectedCaseId, setSelectedCaseId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchCaseSummaries();
    }, []);

    const fetchCaseSummaries = async () => {
        try {
            const response = await axios.get('/api/case-summaries/');
            setCaseSummaries(response.data);
        } catch (error) {
            console.error('Error fetching case summaries:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            case_number: formData.case_number,
            case_type: formData.case_type,
            filed_date: formData.filed_date,
            status: formData.status,
            user_id: formData.user_id,
        };

        const method = editingId ? 'put' : 'post';
        const url = editingId ? `/api/case-summaries/${editingId}/` : '/api/case-summaries/';

        try {
            const response = await axios[method](url, payload);
            if (editingId) {
                setCaseSummaries(prev => prev.map(cs => (cs.id === editingId ? response.data : cs)));
            } else {
                setCaseSummaries(prev => [...prev, response.data]);
            }
            resetForm();
        } catch (error) {
            console.error('Error submitting case summary:', error);
        }
    };

    const handleEdit = (id) => {
        const caseSummary = caseSummaries.find(cs => cs.id === id);
        if (caseSummary) {
            console.log(caseSummary);
            setEditingId(id);
            setFormData({
                case_number: caseSummary.case_number,
                case_type: caseSummary.case_type,
                filed_date: caseSummary.filed_date,
                status: caseSummary.status,
                user_id: caseSummary.user.id,
            });
            setShowModal(true);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this case?')) {
            try {
                await axios.delete(`/api/case-summaries/${id}/`);
                setCaseSummaries(prev => prev.filter(cs => cs.id !== id));
                if (selectedCaseId === id) setSelectedCaseId(null);
            } catch (error) {
                console.error('Error deleting case:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            case_number: '',
            case_type: '',
            filed_date: '',
            status: 'active',
        });
        setEditingId(null);
        setShowModal(false);
    };

    const toggleCaseUpdates = (id) => {
        setSelectedCaseId(prevSelected => (prevSelected === id ? null : id));
    };

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-4 bg-gray-100 min-h-screen">
                <div className="p-4">
                    <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Case Summaries</h1>

                    {/* <button
                        onClick={() => setShowModal(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200 mb-6"
                    >
                        Create Case Summary
                    </button> */}

                    {showModal && (
                        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4 mb-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="case_number"
                                    value={formData.case_number}
                                    onChange={handleChange}
                                    readOnly
                                    placeholder="Case Number"
                                    required
                                    className="border rounded p-2 w-full"
                                />
                                <input
                                    type="text"
                                    name="case_type"
                                    value={formData.case_type}
                                    onChange={handleChange}
                                    placeholder="Case Type"
                                    required
                                    className="border rounded p-2 w-full"
                                />
                                <input
                                    type="date"
                                    name="filed_date"
                                    value={formData.filed_date}
                                    onChange={handleChange}
                                    required
                                    className="border rounded p-2 w-full"
                                />
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                    className="border rounded p-2 w-full"
                                >
                                    <option value="active">Active</option>
                                    <option value="closed">Closed</option>
                                    <option value="settled">Settled</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition duration-200"
                                >
                                    {editingId ? 'Update' : 'Create'} Case Summary
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
                        <div className="space-y-4 max-h-[465px] overflow-y-auto pr-2">
                            <h2 className="text-xl font-semibold mb-4">Case Summaries</h2>
                            <ul>
                                {caseSummaries.map(caseSummary => (
                                    <li
                                        key={caseSummary.id}
                                        className={`cursor-pointer bg-gray-100 hover:bg-gray-200 p-4 mt-4 mb-4 rounded flex items-center justify-between ${
                                            selectedCaseId === caseSummary.id ? 'ring-2 ring-indigo-500' : ''
                                        }`}
                                        onClick={() => toggleCaseUpdates(caseSummary.id)}
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {caseSummary.case_number} - {caseSummary.case_type}
                                            </p>
                                            <p className="text-sm text-gray-600">Status: {caseSummary.status}</p>
                                        </div>
                                        <div className="space-x-2">
                                            <button
                                                onClick={() => handleEdit(caseSummary.id)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(caseSummary.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            <h2 className="text-xl font-semibold mb-4">Case Updates</h2>
                            {selectedCaseId ? (
                                <AdminCaseUpdates caseSummaryId={selectedCaseId} />
                            ) : (
                                <p className="text-gray-500">Click on a case to view updates.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminCaseSummary;
