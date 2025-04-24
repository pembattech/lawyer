import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LawyerCases = ({ lawyerId }) => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCase, setNewCase] = useState({
        case_number: '',
        case_type: '',
        filed_date: '',
        status: 'active',
        lawyer_id: lawyerId,
    });
    const [editingCase, setEditingCase] = useState(null);  // To track which case is being edited

    // Fetch cases function
    const fetchCases = async () => {
        setLoading(true);  // Start loading
        try {
            const token = localStorage.getItem('accessToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(
                `http://127.0.0.1:8000/api/case-summaries/?lawyer_id=${lawyerId}`,
                config
            );
            setCases(response.data);
        } catch (err) {
            setError('Failed to fetch case summaries.');
        } finally {
            setLoading(false); // End loading
        }
    };

    useEffect(() => {
        if (lawyerId) {
            fetchCases();
        }
    }, [lawyerId]);

    // Handle case creation
    const handleCreateCase = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };

            await axios.post('http://127.0.0.1:8000/api/case-summaries/', newCase, config);
            setNewCase({ case_number: '', case_type: '', filed_date: '', status: 'active', lawyer_id: lawyerId });
            fetchCases();  // Re-fetch the cases
        } catch (err) {
            setError('Failed to create case summary.');
            console.error(err);  // Log error details for debugging
        }
    };

    // Handle case update (editing)
    const handleUpdateCase = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };

            console.log(editingCase)

            await axios.put(`http://127.0.0.1:8000/api/case-summaries/${editingCase.id}/`, editingCase, config);
            setEditingCase(null);  // Reset editing case
            setNewCase({ case_number: '', case_type: '', filed_date: '', status: 'active', lawyer_id: lawyerId });
            fetchCases();  // Re-fetch the cases
        } catch (err) {
            setError('Failed to update case summary.');
            console.error(err);  // Log error details for debugging
        }
    };

    // Handle case deletion
    const handleDeleteCase = async (caseId) => {
        if (window.confirm("Are you sure you want to delete this case?")) {
            try {
                const token = localStorage.getItem('accessToken');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                await axios.delete(`http://127.0.0.1:8000/api/case-summaries/${caseId}/`, config);
                fetchCases();  // Re-fetch the cases after deletion
            } catch (err) {
                setError('Failed to delete case summary.');
                console.error(err);  // Log error details for debugging
            }
        }
    };

    // Handle form change for new case or editing case
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (editingCase) {
            setEditingCase((prev) => ({
                ...prev,
                [name]: value,
            }));
        } else {
            setNewCase((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Handle editing a case
    const handleEditCase = (caseData) => {
        setEditingCase(caseData);
        setNewCase({
            case_number: caseData.case_number,
            case_type: caseData.case_type,
            filed_date: caseData.filed_date,
            status: caseData.status,
            lawyer_id: lawyerId,
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Cases for Lawyer ID: {lawyerId}</h2>

            {/* Create or Edit Case Form */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold">{editingCase ? 'Edit Case' : 'Create New Case'}</h3>
                <input
                    type="text"
                    name="case_number"
                    placeholder="Case Number"
                    value={editingCase ? editingCase.case_number : newCase.case_number}
                    onChange={handleChange}
                    className="border p-2 mb-2 w-full"
                />
                <input
                    type="text"
                    name="case_type"
                    placeholder="Case Type"
                    value={editingCase ? editingCase.case_type : newCase.case_type}
                    onChange={handleChange}
                    className="border p-2 mb-2 w-full"
                />
                <input
                    type="date"
                    name="filed_date"
                    placeholder="Filed Date"
                    value={editingCase ? editingCase.filed_date : newCase.filed_date}
                    onChange={handleChange}
                    className="border p-2 mb-2 w-full"
                />
                <select
                    name="status"
                    value={editingCase ? editingCase.status : newCase.status}
                    onChange={handleChange}
                    className="border p-2 mb-2 w-full"
                >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="settled">Settled</option>
                    <option value="pending">Pending</option>
                </select>
                <button
                    onClick={editingCase ? handleUpdateCase : handleCreateCase}
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    {editingCase ? 'Update Case' : 'Create Case'}
                </button>
            </div>

            {/* Case Listings */}
            {cases.length === 0 ? (
                <p>No cases found for this lawyer.</p>
            ) : (
                <ul className="space-y-3">
                    {cases.map((item) => (
                        <li key={item.id} className="border p-3 rounded shadow">
                            <p><strong>Case Number:</strong> {item.case_number}</p>
                            <p><strong>Type:</strong> {item.case_type}</p>
                            <p><strong>Status:</strong> {item.status}</p>
                            <p><strong>Filed Date:</strong> {item.filed_date}</p>
                            <button 
                                onClick={() => handleEditCase(item)} 
                                className="bg-yellow-500 text-white p-2 rounded mt-2"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => handleDeleteCase(item.id)} 
                                className="bg-red-500 text-white p-2 rounded mt-2 ml-2"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LawyerCases;
