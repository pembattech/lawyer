import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LawyerCaseUpdate from './LawyerCaseUpdate';

const LawyerCases = ({ lawyerId }) => {
    const [selectedCaseId, setSelectedCaseId] = useState(null);
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clientError, setClientError] = useState('');
    const [newCase, setNewCase] = useState({
        case_number: '',
        case_type: '',
        filed_date: '',
        status: 'active',
        lawyer_id: lawyerId,
        user_id: '',
        client_email: '',
    });
    const [editingCase, setEditingCase] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const token = localStorage.getItem('accessToken');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };

    const fetchCases = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/case-summaries/?lawyer_id=${lawyerId}`,
                config
            );
            setCases(response.data);
        } catch (err) {
            setError('Failed to fetch case summaries.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (lawyerId) {
            fetchCases();
        }
    }, [lawyerId]);

    const handleClientCheck = async (email, isEditing = false) => {
        try {
            const res = await axios.get(
                `http://127.0.0.1:8000/api/user-by-email/?email=${email}`,
                config
            );
            if (res.data && res.data.id) {
                if (isEditing) {
                    setEditingCase(prev => ({ ...prev, user_id: res.data.id }));
                } else {
                    setNewCase(prev => ({ ...prev, user_id: res.data.id }));
                }
                setClientError('');
            } else {
                throw new Error();
            }
        } catch {
            setClientError('Client not found.');
            if (isEditing) {
                setEditingCase(prev => ({ ...prev, user_id: '' }));
            } else {
                setNewCase(prev => ({ ...prev, user_id: '' }));
            }
        }
    };

    const handleCreateCase = async () => {
        if (!newCase.user_id) {
            setClientError('Please enter a valid client email.');
            return;
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/case-summaries/', newCase, config);
            setNewCase({
                case_number: '',
                case_type: '',
                filed_date: '',
                status: 'active',
                lawyer_id: lawyerId,
                user_id: '',
                client_email: '',
            });
            fetchCases();
            setIsModalOpen(false);
        } catch (err) {
            setError('Failed to create case summary.');
        }
    };

    const handleEditCase = (item) => {
        setEditingCase({
            ...item,
            client_email: item.user.email,
            user_id: item.user.id,
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateCase = async () => {
        try {
            await axios.put(
                `http://127.0.0.1:8000/api/case-summaries/${editingCase.id}/`,
                editingCase,
                config
            );
            setEditingCase(null);
            setIsEditModalOpen(false);
            fetchCases();
        } catch (err) {
            setError('Failed to update case summary.');
        }
    };

    const handleDeleteCase = async (caseId) => {
        if (window.confirm("Are you sure you want to delete this case?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/case-summaries/${caseId}/`, config);
                fetchCases();
            } catch (err) {
                setError('Failed to delete case summary.');
            }
        }
    };

    const handleChange = (e, isEditing = false) => {
        const { name, value } = e.target;
        if (isEditing) {
            setEditingCase(prev => ({ ...prev, [name]: value }));
        } else {
            setNewCase(prev => ({ ...prev, [name]: value }));
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="flex h-screen overflow-hidden">
            <div className="p-4 w-1/2 overflow-y-auto">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white p-2 rounded mb-4"
                >
                    Create New Case
                </button>

                {cases.length === 0 ? (
                    <p>No cases found for this lawyer.</p>
                ) : (
                    <ul className="space-y-3 max-h-[360px] overflow-y-auto">
                        {cases.map((item) => (
                            <li key={item.id} className="border p-3 rounded shadow">
                                <p><strong>Case Number:</strong> {item.case_number}</p>
                                <p><strong>Type:</strong> {item.case_type}</p>
                                <p><strong>Status:</strong> {item.status}</p>
                                <p><strong>Filed Date:</strong> {item.filed_date}</p>
                                <p><strong>Client Name:</strong> {item.user.first_name} {item.user.last_name}</p>
                                <p><strong>Client Email:</strong> {item.user.email}</p>
                                <button onClick={() => handleEditCase(item)} className="bg-yellow-500 text-white p-2 rounded mt-2">Edit</button>
                                <button onClick={() => handleDeleteCase(item.id)} className="bg-red-500 text-white p-2 rounded mt-2 ml-2">Delete</button>
                                <button
                                    onClick={() => setSelectedCaseId(selectedCaseId === item.id ? null : item.id)}
                                    className={`${selectedCaseId === item.id ? 'bg-gray-600' : 'bg-green-500'} text-white p-2 rounded mt-2 ml-2`}
                                >
                                    {selectedCaseId === item.id ? 'Hide Updates' : 'View Updates'}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="p-4 max-h-[435px] w-1/2 overflow-y-auto">
                {selectedCaseId && <LawyerCaseUpdate caseId={selectedCaseId} />}
            </div>

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h3 className="text-xl font-semibold mb-4">Create New Case</h3>
                        <input type="text" name="case_number" placeholder="Case Number" value={newCase.case_number} onChange={handleChange} className="border p-2 mb-2 w-full" />
                        <input type="text" name="case_type" placeholder="Case Type" value={newCase.case_type} onChange={handleChange} className="border p-2 mb-2 w-full" />
                        <input type="date" name="filed_date" value={newCase.filed_date} onChange={handleChange} className="border p-2 mb-2 w-full" />
                        <select name="status" value={newCase.status} onChange={handleChange} className="border p-2 mb-2 w-full">
                            <option value="active">Active</option>
                            <option value="closed">Closed</option>
                            <option value="settled">Settled</option>
                            <option value="pending">Pending</option>
                        </select>

                        <input
                            type="email"
                            name="client_email"
                            placeholder="Enter Client Email"
                            value={newCase.client_email}
                            onChange={handleChange}
                            onBlur={() => handleClientCheck(newCase.client_email)}
                            onKeyDown={(e) => e.key === 'Enter' && handleClientCheck(newCase.client_email)}
                            className="border p-2 mb-2 w-full"
                        />
                        {clientError && <p className="text-red-600 text-sm mb-2">{clientError}</p>}

                        <div className="flex justify-between">
                            <button onClick={handleCreateCase} className="bg-blue-500 text-white p-2 rounded">Create Case</button>
                            <button onClick={() => setIsModalOpen(false)} className="bg-red-500 text-white p-2 rounded">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && editingCase && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h3 className="text-xl font-semibold mb-4">Edit Case</h3>
                        <input type="text" name="case_number" placeholder="Case Number" value={editingCase.case_number} onChange={(e) => handleChange(e, true)} className="border p-2 mb-2 w-full" />
                        <input type="text" name="case_type" placeholder="Case Type" value={editingCase.case_type} onChange={(e) => handleChange(e, true)} className="border p-2 mb-2 w-full" />
                        <input type="date" name="filed_date" value={editingCase.filed_date} onChange={(e) => handleChange(e, true)} className="border p-2 mb-2 w-full" />
                        <select name="status" value={editingCase.status} onChange={(e) => handleChange(e, true)} className="border p-2 mb-2 w-full">
                            <option value="active">Active</option>
                            <option value="closed">Closed</option>
                            <option value="settled">Settled</option>
                            <option value="pending">Pending</option>
                        </select>

                        <input
                            type="email"
                            name="client_email"
                            placeholder="Enter Client Email"
                            value={editingCase.client_email}
                            onChange={(e) => handleChange(e, true)}
                            onBlur={() => handleClientCheck(editingCase.client_email, true)}
                            onKeyDown={(e) => e.key === 'Enter' && handleClientCheck(editingCase.client_email, true)}
                            className="border p-2 mb-2 w-full"
                        />
                        {clientError && <p className="text-red-600 text-sm mb-2">{clientError}</p>}

                        <div className="flex justify-between">
                            <button onClick={handleUpdateCase} className="bg-green-600 text-white p-2 rounded">Update</button>
                            <button onClick={() => setIsEditModalOpen(false)} className="bg-red-500 text-white p-2 rounded">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LawyerCases;
