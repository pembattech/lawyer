import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDocuments from './AdminDocuments';


const AdminCaseUpdates = ({ caseSummaryId }) => {
  const [showDocuments, setShowDocuments] = useState(false);
  const [updates, setUpdates] = useState([]);
  const [form, setForm] = useState({ title: '', details: '' });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch case updates when caseSummaryId changes
  useEffect(() => {
    fetchUpdates();
  }, [caseSummaryId]);

  const fetchUpdates = async () => {
    try {
      const res = await axios.get(`/api/case-summary/${caseSummaryId}/updates/`);
      setUpdates(res.data);
    } catch (err) {
      console.error('Error fetching updates:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        case_summary: caseSummaryId,  // Pass the case_summary ID here
      };

      if (editId) {
        const res = await axios.put(
          `/api/case-summary/${caseSummaryId}/updates/${editId}/`,
          payload
        );
        setUpdates(updates.map(update => update.id === editId ? res.data : update));
      } else {
        const res = await axios.post(
          `/api/case-summary/${caseSummaryId}/updates/`,
          payload
        );
        setUpdates([...updates, res.data]);
      }
      resetForm();
    } catch (err) {
      console.error('Error saving update:', err);
    }
  };

  const handleEdit = (update) => {
    setForm({ title: update.title, details: update.details });
    setEditId(update.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/case-summary/${caseSummaryId}/updates/${id}/`);
      setUpdates(updates.filter(update => update.id !== id));
    } catch (err) {
      console.error('Error deleting update:', err);
    }
  };

  const resetForm = () => {
    setForm({ title: '', details: '' });
    setEditId(null);
    setShowModal(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow max-h-[418px] overflow-y-auto">

      <button
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
      >
        + Add Update
      </button>

      <button
        className="mb-4 ml-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        onClick={() => setShowDocuments(true)}
      >
        📄 View Documents
      </button>

      {showDocuments && (
        <AdminDocuments
          caseSummaryId={caseSummaryId}
          onClose={() => setShowDocuments(false)}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <h3 className="text-xl font-bold mb-4">{editId ? 'Edit Update' : 'Add Update'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                className="w-full border px-3 py-2 rounded"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Details"
                className="w-full border px-3 py-2 rounded"
                rows={4}
                value={form.details}
                onChange={e => setForm({ ...form, details: e.target.value })}
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update List */}
      <ul className="space-y-4">
        {updates.map(update => (
          <li key={update.id} className="border p-4 rounded shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">{update.title}</h3>
                <p className="text-sm text-gray-600">{new Date(update.updated_at).toLocaleString()}</p>
                <p className="mt-2">{update.details}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(update)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(update.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCaseUpdates;
