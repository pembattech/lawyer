import React, { useState, useEffect } from 'react';
import { FileBarChart, MessageSquare, Home, User, LogOut } from 'lucide-react'; // Assuming you are using lucide-react icons
import Sidebar from './client-sidebar';
import useAuthRedirect from './../hook/useAuthRedirect';



const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const fetchCaseSummaries = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        console.error("No token found");
        return [];
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/api/case-summaries/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch case summaries');
        }
        const data = await response.json();
        return data; // Return the case summaries data
    } catch (error) {
        console.error('Error fetching case summaries:', error);
        return [];
    }
};

const Dashboard = () => {
    useAuthRedirect();
    const [caseUpdates, setCaseUpdates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCaseSummaries = async () => {
            const summaries = await fetchCaseSummaries();
            setCaseUpdates(summaries);
            setLoading(false);
        };

        loadCaseSummaries();
    }, []); // The empty array ensures it runs once on component mount

    // Filter active cases only
    const activeCases = caseUpdates.filter(caseItem => caseItem.status === "active");

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex">
            {/* Sidebar Component */}
            <Sidebar />

            {/* Main Dashboard Content */}
            <div className="flex-1 p-8 space-y-6">
                {/* Case Summary for Active Cases */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <FileBarChart className="h-5 w-5 text-blue-600 mr-2" />
                        Case Summary
                    </h3>

                    {activeCases.length === 0 ? (
                        <p>No active cases available.</p>
                    ) : (
                        activeCases.map((caseItem) => (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" key={caseItem.id}>
                                <div className="border rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all">
                                    <p className="text-sm text-gray-500">Case Number</p>
                                    <p className="font-medium">{caseItem.case_number}</p>
                                </div>
                                <div className="border rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all">
                                    <p className="text-sm text-gray-500">Case Type</p>
                                    <p className="font-medium">{caseItem.case_type}</p>
                                </div>
                                <div className="border rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all">
                                    <p className="text-sm text-gray-500">Filed Date</p>
                                    <p className="font-medium">{formatDate(caseItem.filed_date)}</p>
                                </div>
                                <div className="border rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all">
                                    <p className="text-sm text-gray-500">Status</p>
                                    <p className="font-medium text-blue-600">{caseItem.status}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Recent Updates for Active Cases */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-4 sm:p-6 rounded-lg max-h-[300px] overflow-auto shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
                                Recent Updates
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {activeCases.slice(0, 2).map((caseItem) => (
                                <div
                                    key={caseItem.id}
                                    className="border-l-4 border-blue-500 pl-4 py-2 rounded-r-lg"
                                >
                                    {caseItem.updates.map((update) => (
                                        <div key={update.id} className="hover:bg-blue-50 transition-colors">
                                            <div className="flex flex-col sm:flex-row sm:justify-between">
                                                <h4 className="font-medium text-gray-900">{update.title}</h4>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{update.details}</p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                {formatDate(update.updated_at)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
