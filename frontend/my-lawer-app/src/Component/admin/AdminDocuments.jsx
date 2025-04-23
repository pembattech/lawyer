// AdminDocuments.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDocuments = ({ caseSummaryId, onClose }) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get(`/api/case-summary/${caseSummaryId}/documents/`);
        setDocuments(res.data);
      } catch (err) {
        console.error('Error fetching documents:', err);
      }
    };
    fetchDocuments();
  }, [caseSummaryId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 max-w-xl w-full shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">Documents</h2>
        <ul className="space-y-2 mb-4 max-h-60 overflow-y-auto">
          {documents.length > 0 ? (
            documents.map(doc => (
              <li key={doc.id} className="border p-3 rounded">
                <p className="font-semibold">{doc.name}</p>
                <a
                  href={doc.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Document
                </a>
              </li>
            ))
          ) : (
            <p className="text-gray-600">No documents found.</p>
          )}
        </ul>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AdminDocuments;
