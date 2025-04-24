import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LawyerCaseDocumentsModal from './LawyerCaseDocumentsModal';


const LawyerCaseUpdate = ({ caseId }) => {
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formUpdate, setFormUpdate] = useState({ title: '', details: '', case_summary: caseId });
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [error, setError] = useState(null);
    const [selectedUpdate, setSelectedUpdate] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDocModal, setShowDocModal] = useState(false);


    const token = localStorage.getItem('accessToken');

    const fetchUpdates = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/case-summary/${caseId}/updates/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUpdates(res.data);
        } catch {
            setError('Failed to fetch case updates.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (caseId) fetchUpdates();
    }, [caseId]);

    const openNewUpdateModal = () => {
        setFormUpdate({ title: '', details: '', case_summary: caseId });
        setEditMode(false);
        setShowFormModal(true);
    };

    const handleCreateOrUpdate = async () => {
        if (!formUpdate.title || !formUpdate.details) {
            setError('Please fill in both title and details.');
            return;
        }

        try {
            if (editMode && selectedId) {
                await axios.put(`/api/case-updates/${selectedId}/`, formUpdate, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            } else {
                await axios.post('/api/case-updates/', { ...formUpdate, case_summary: caseId }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            }

            fetchUpdates();
            setFormUpdate({ title: '', details: '', case_summary: caseId });
            setShowFormModal(false);
            setEditMode(false);
            setSelectedId(null);
        } catch {
            setError('Failed to save case update.');
        }
    };

    const handleEditClick = (update) => {
        setFormUpdate({ title: update.title, details: update.details, case_summary: caseId });
        setSelectedId(update.id);
        setEditMode(true);
        setShowFormModal(true);
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this update?");
        if (!confirm) return;

        try {
            await axios.delete(`/api/case-updates/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUpdates();
        } catch {
            alert("Failed to delete the update.");
        }
    };

    return (
        <div className="p-4 border-l bg-gray-50 min-h-screen">
            <h2 className="text-xl font-bold mb-4">Case Updates</h2>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <button
                onClick={openNewUpdateModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-6"
            >
                Add Update
            </button>

            <button
                onClick={() => setShowDocModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded mb-6 ml-2"
            >
                Open Documents
            </button>

            {loading ? (
                <p>Loading...</p>
            ) : updates.length > 0 ? (
                <ul className="space-y-3">
                    {updates.map((update) => (
                        <li
                            key={update.id}
                            className="bg-white p-4 rounded shadow hover:bg-gray-100 transition"
                        >
                            <h4 className="font-bold">{update.title}</h4>
                            <p className="text-sm text-gray-600">{update.details.substring(0, 100)}...</p>
                            <small className="text-gray-500 block mb-2">
                                {new Date(update.updated_at).toLocaleString()}
                            </small>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedUpdate(update)}
                                    className="bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300"
                                >
                                    View
                                </button>
                                <button
                                    onClick={() => handleEditClick(update)}
                                    className="bg-yellow-400 text-sm px-3 py-1 rounded hover:bg-yellow-500"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(update.id)}
                                    className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No updates found.</p>
            )}

            {/* Form Modal */}
            {showFormModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <h3 className="text-xl font-semibold mb-4">{editMode ? "Edit" : "Add"} Update</h3>
                        <input
                            type="text"
                            value={formUpdate.title}
                            onChange={(e) => setFormUpdate({ ...formUpdate, title: e.target.value })}
                            placeholder="Title"
                            className="w-full border p-2 mb-2"
                        />
                        <textarea
                            value={formUpdate.details}
                            onChange={(e) => setFormUpdate({ ...formUpdate, details: e.target.value })}
                            placeholder="Details"
                            className="w-full border p-2 mb-2"
                            rows={4}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowFormModal(false);
                                    setEditMode(false);
                                    setFormUpdate({ title: '', details: '', case_summary: caseId });
                                }}
                                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateOrUpdate}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                            >
                                {editMode ? "Update" : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {selectedUpdate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <h4 className="text-xl font-semibold">{selectedUpdate.title}</h4>
                        <p className="mt-4">{selectedUpdate.details}</p>
                        <p className="mt-4 text-sm text-gray-500">
                            Last updated: {new Date(selectedUpdate.updated_at).toLocaleString()}
                        </p>
                        <button
                            onClick={() => setSelectedUpdate(null)}
                            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {showDocModal && (
                <LawyerCaseDocumentsModal
                    caseId={caseId}
                    onClose={() => setShowDocModal(false)}
                />
            )}

        </div>
    );
};

export default LawyerCaseUpdate;
