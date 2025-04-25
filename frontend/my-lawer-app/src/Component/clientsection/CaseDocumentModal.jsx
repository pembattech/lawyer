import React, { useEffect, useState, useRef } from "react";

const CaseDocumentsModal = ({ caseId, closeModal }) => {
  const [documents, setDocuments] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null); // to reset file input

  const NAME_CHOICES = [
    "Medical Records",
    "Employment Records",
    "Insurance Information",
    "Signed Affidavit",
    "Photo Evidence",
  ];

  const fetchCaseDocuments = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("Access token not found");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/case-summary/${caseId}/documents/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch case documents");
      }

      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching case documents:", error);
    }
  };

  useEffect(() => {
    fetchCaseDocuments();
  }, [caseId]);

  const handleUpload = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Access token not found");
      return;
    }

    const formData = new FormData();
    formData.append("name", selectedName);
    formData.append("file", file);
    formData.append("case_summary", caseId);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/case-summary/${caseId}/documents/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData);
      } else {
        setSelectedName("");
        setFile(null);
        setErrors({});
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset file input field
        }
        fetchCaseDocuments(); // Refresh list
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-1/2 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full"
        >
          X
        </button>
        <h3 className="text-xl font-semibold mb-4">Case Documents</h3>

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="mb-6 space-y-4">
          <div>
            <label className="block font-medium mb-1">Document Type</label>
            <select
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">-- Select Document Type --</option>
              {NAME_CHOICES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1">Upload File</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border px-3 py-2 rounded"
              required
            />
            {errors.file && <p className="text-red-500 text-sm">{errors.file[0]}</p>}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Upload Document
          </button>

          {errors.case_summary && (
            <p className="text-red-500 text-sm">{errors.case_summary[0]}</p>
          )}
        </form>

        {/* Documents List */}
        {documents.length === 0 ? (
          <p>No documents available for this case.</p>
        ) : (
          <ul>
            {documents.map((doc) => (
              <li key={doc.id} className="py-2 border-b">
                <a
                  href={doc.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {doc.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CaseDocumentsModal;
