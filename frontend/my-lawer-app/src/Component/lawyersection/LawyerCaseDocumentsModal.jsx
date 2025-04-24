import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LawyerCaseDocumentsModal = ({ caseId, onClose }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newDocument, setNewDocument] = useState({
        documentType: '', // We will use documentType as the name of the document
        file: null,
    });
    const token = localStorage.getItem('accessToken');

    // Document type choices
    const documentTypes = [
        'Medical Records',
        'Employment Records',
        'Insurance Information',
        'Signed Affidavit',
        'Photo Evidence',
    ];

    // Fetch documents when the component mounts or caseId changes
    const fetchDocuments = async () => {
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/case-summary/${caseId}/documents/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Documents fetched:', res.data); // Log the successful response
            setDocuments(res.data);
            setError(null); // Clear any previous error
        } catch (err) {
            console.error('Error fetching documents:', err);
            // If the error is an Axios error, log the response to get more details
            if (err.response) {
                console.error('Response error:', err.response.data);
                setError(`Error: ${err.response.data.message || 'Failed to fetch documents.'}`);
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [caseId, token]);

    // Handle input field changes for new document creation
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDocument((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle file input change for new document creation
    const handleFileChange = (e) => {
        const { files } = e.target;
        setNewDocument((prev) => ({
            ...prev,
            file: files[0],
        }));
    };

    // Create a new document
    const handleCreateSubmit = async (e) => {
        e.preventDefault();

        // Using documentType as the name of the document
        const formData = new FormData();
        formData.append('name', newDocument.documentType); // Use documentType as the name
        formData.append('file', newDocument.file);
        formData.append('case_summary', caseId);
        formData.append('documentType', newDocument.documentType); // Append document type

        try {
            console.log('Creating document...');
            await axios.post(`http://127.0.0.1:8000/api/case-summary/${caseId}/documents/`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Document created successfully');
            fetchDocuments(); // Re-fetch documents after successful creation
            setNewDocument({ documentType: '', file: null }); // Reset form fields
            setError(null); // Clear any errors
        } catch (err) {
            console.error('Error creating document:', err);
            // If the error is an Axios error, log the response to get more details
            if (err.response) {
                console.error('Response error:', err.response.data);
                setError(`Error: ${err.response.data.message || 'Failed to create document.'}`);
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    // Delete a document
    const handleDelete = async (docId) => {
        try {
            console.log('Deleting document...');
            await axios.delete(`http://127.0.0.1:8000/api/case-summary/${caseId}/documents/${docId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log('Document deleted successfully');
            fetchDocuments(); // Re-fetch documents after deletion
        } catch (err) {
            console.error('Error deleting document:', err);
            // If the error is an Axios error, log the response to get more details
            if (err.response) {
                console.error('Response error:', err.response.data);
                setError(`Error: ${err.response.data.message || 'Failed to delete document.'}`);
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">Case Documents</h3>

                {loading && (
                    <div className="flex justify-center items-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && (
                    <ul className="space-y-2">
                        {documents.length === 0 ? (
                            <p>No documents found.</p>
                        ) : (
                            documents.map((doc) => (
                                <li key={doc.id} className="flex justify-between items-center border p-3 rounded">
                                    <div className="flex flex-col">
                                        <span className="truncate max-w-[200px]" title={doc.name}>
                                            {doc.name}
                                        </span>
                                        {doc.uploaded_at && (
                                            <span className="text-sm text-gray-500">
                                                Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <a
                                            href={doc.file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                                        >
                                            View
                                        </a>
                                        <button
                                            onClick={() => handleDelete(doc.id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                )}

                {/* Create Document Form */}
                <h4 className="text-lg font-semibold mt-6">Create New Document</h4>
                <form onSubmit={handleCreateSubmit} className="mb-4">
                    <select
                        name="documentType"
                        value={newDocument.documentType}
                        onChange={handleInputChange}
                        required
                        className="border p-2 mb-2 w-full"
                    >
                        <option value="">Select Document Type</option>
                        {documentTypes.map((type, index) => (
                            <option key={index} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    <input
                        type="file"
                        name="file"
                        onChange={handleFileChange}
                        required
                        className="border p-2 mb-2 w-full"
                    />
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                        Create Document
                    </button>
                </form>

                <button
                    onClick={onClose}
                    className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default LawyerCaseDocumentsModal;
