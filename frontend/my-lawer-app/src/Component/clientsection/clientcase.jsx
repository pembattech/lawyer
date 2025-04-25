import React, { useEffect, useState } from "react";
import CaseDocumentsModal from "./CaseDocumentModal";
import Sidebar from './client-sidebar';
import useAuthRedirect from './../hook/useAuthRedirect';

// Modal Component for Viewing Case Updates
const CaseUpdatesModal = ({ caseId, closeModal, openDocumentsModal }) => {
    const [caseUpdates, setCaseUpdates] = useState([]);
    const [selectedUpdate, setSelectedUpdate] = useState(null);


    useEffect(() => {
        useAuthRedirect();

        const fetchCaseUpdates = async () => {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                console.error("Access token not found");
                navigate('/login'); // Navigate to login
                return;
            }

            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/case-summary/${caseId}/updates/`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch case updates");
                }

                const data = await response.json();
                setCaseUpdates(data);
            } catch (error) {
                console.error("Error fetching case updates:", error);
            }
        };

        fetchCaseUpdates();
    }, [caseId]);

    const handleUpdateClick = (update) => {
        setSelectedUpdate(update);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-1/2">
                <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full"
                >
                    X
                </button>
                <h3 className="text-xl font-semibold mb-4">Case Updates</h3>
                <div className="grid grid-cols-2 gap-6">
                    <div className="overflow-y-scroll h-96">
                        {caseUpdates.length === 0 ? (
                            <p>No updates available for this case.</p>
                        ) : (
                            <ul>
                                {caseUpdates.map((update) => (
                                    <li
                                        key={update.id}
                                        className="border-b py-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleUpdateClick(update)}
                                    >
                                        <h4 className="font-semibold">{update.title}</h4>
                                        <p>{update.details}</p>
                                        <p className="text-sm text-gray-500">
                                            Updated at: {new Date(update.updated_at).toLocaleString()}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="overflow-y-scroll h-96">
                        {selectedUpdate && (
                            <div className="p-4 border border-gray-300 rounded-lg">
                                <h4 className="text-xl font-semibold">Update Details</h4>
                                <p className="text-lg mt-2">
                                    <strong>Title:</strong> {selectedUpdate.title}
                                </p>
                                <p className="mt-2">
                                    <strong>Details:</strong> {selectedUpdate.details}
                                </p>
                                <p className="mt-2 text-sm text-gray-500">
                                    <strong>Updated at:</strong>{" "}
                                    {new Date(selectedUpdate.updated_at).toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <button
                    onClick={openDocumentsModal}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-700"
                >
                    View Documents
                </button>
            </div>
        </div>
    );
};

// Main Component to List All Cases
const MyCases = () => {
    const [cases, setCases] = useState([]);
    const [selectedCaseId, setSelectedCaseId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDocumentsModal, setShowDocumentsModal] = useState(false);

    useEffect(() => {
        const fetchUserCases = async () => {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                console.error("Access token not found");
                return;
            }

            try {
                const response = await fetch("http://127.0.0.1:8000/api/case-summaries/", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch cases");
                }

                const data = await response.json();
                setCases(data);
            } catch (error) {
                console.error("Error fetching cases:", error);
            }
        };

        fetchUserCases();
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case "open":
                return "bg-green-500 text-white";
            case "closed":
                return "bg-red-500 text-white";
            case "pending":
                return "bg-yellow-500 text-white";
            default:
                return "bg-gray-500 text-white";
        }
    };

    const openModal = (caseId) => {
        setSelectedCaseId(caseId);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedCaseId(null);
    };

    const openDocumentsModal = () => {
        setShowDocumentsModal(true);
    };

    const closeDocumentsModal = () => {
        setShowDocumentsModal(false);
    };

    return (
        <div className="flex">
            {/* Sidebar Component */}
            <Sidebar />

            {/* Main Dashboard Content */}
            <div className="flex-1 p-8 space-y-6">
                <div className="max-w-4xl mx-auto p-4">
                    <h2 className="text-2xl font-bold mb-4">My Case Summaries</h2>
                    {cases.length === 0 ? (
                        <p className="text-gray-600">No cases found.</p>
                    ) : (
                        <div className="space-y-4 max-h-[510px] overflow-auto">
                            {cases.map((item) => (
                                <div
                                    key={item.id}
                                    className="border p-4 rounded-lg shadow hover:shadow-md transition"
                                >
                                    <p className="text-lg font-semibold text-blue-700">
                                        Case Number: {item.case_number}
                                    </p>
                                    <p>Type: <span className="text-gray-700">{item.case_type}</span></p>
                                    <p>
                                        Status:{" "}
                                        <span
                                            className={`px-3 py-1 rounded-full ${getStatusClass(item.status)}`}
                                        >
                                            {item.status}
                                        </span>
                                    </p>
                                    <p>Filed Date: <span className="text-gray-700">{item.filed_date}</span></p>
                                    {item.lawyer && (
                                        <p>
                                            Assigned Lawyer:{" "}
                                            <span className="text-gray-700">
                                                {item.lawyer.first_name} {item.lawyer.last_name}
                                            </span>
                                        </p>
                                    )}
                                    <button
                                        onClick={() => openModal(item.id)}
                                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-700"
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {showModal && (
                        <CaseUpdatesModal
                            caseId={selectedCaseId}
                            closeModal={closeModal}
                            openDocumentsModal={openDocumentsModal}
                        />
                    )}
                    {showDocumentsModal && (
                        <CaseDocumentsModal caseId={selectedCaseId} closeModal={closeDocumentsModal} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyCases;
