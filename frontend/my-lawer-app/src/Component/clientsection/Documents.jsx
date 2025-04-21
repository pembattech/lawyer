import React, { useState, useEffect } from "react";
import { FileText, X } from "react-feather";

const NAME_CHOICES = [
  { medical_records: 'Medical Records' },
  { employment_records: 'Employment Records' },
  { insurance_information: 'Insurance Information' },
  { signed_affidavit: 'Signed Affidavit' },
  { photo_evidence: 'Photo Evidence' },
];

const Documents = () => {
  const [documentRequests, setDocumentRequests] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [documentTypes, setDocumentTypes] = useState(NAME_CHOICES);
  const [uploading, setUploading] = useState(false);

  // Fetch document requests
  useEffect(() => {
    const fetchDocumentRequests = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/documents/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error fetching documents");

        const data = await response.json();
        setDocumentRequests(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchDocumentRequests();
  }, []);

  // Upload document function
  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    if (!selectedFile || !selectedDocumentType || !token) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("name", selectedDocumentType);

    try {
      setUploading(true);

      const response = await fetch("http://127.0.0.1:8000/api/documents/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const newDoc = await response.json();
      setDocumentRequests((prev) => [...prev, newDoc]);
      setSelectedFile(null);
      setSelectedDocumentType("");
      setShowUploadForm(false);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center mb-3 sm:mb-0">
          <FileText className="h-5 w-5 text-blue-600 mr-2" />
          Document Requests
        </h3>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-sm flex items-center"
        >
          <FileText className="h-4 w-4 mr-1" />
          Upload Document
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <form
          onSubmit={handleUpload}
          className="mb-6 border border-blue-200 bg-blue-50 p-4 rounded-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-700 font-medium">Select a document to upload</p>
            <button onClick={() => setShowUploadForm(false)} type="button">
              <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
            </button>
          </div>
          <select
            value={selectedDocumentType}
            onChange={(e) => setSelectedDocumentType(e.target.value)}
            className="block w-full text-sm mb-2"
          >
            <option value="">Select Document Type</option>
            {documentTypes.map((choice, index) => {
              const key = Object.keys(choice)[0];
              const name = choice[key];
              return (
                <option key={index} value={name}>
                  {name}
                </option>
              );
            })}
          </select>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="block w-full text-sm mb-2"
          />
          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Submit"}
          </button>
        </form>
      )}

      {/* Document Table */}
      <div className="overflow-x-auto bg-white rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {documentRequests.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                <td className="text-left px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.name}</td>
                <td className="text-left px-4 py-4 whitespace-nowrap text-sm">
                  <a
                    href={doc.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700 bg-gray-50 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    View
                  </a>
                  {/* <button className="text-gray-500 hover:text-gray-700 bg-gray-50 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors">View</button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Guidelines */}
      <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2 flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Document Guidelines
        </h4>
        <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
          <li>All documents should be in PDF format</li>
          <li>Personal information should be clearly visible</li>
          <li>Electronic signatures are accepted</li>
          <li>Maximum file size is 10MB per document</li>
        </ul>
      </div>
    </div>
  );
};

export default Documents;
