import React from 'react';
import { FileBarChart, MessageSquare, Home, User, LogOut } from 'lucide-react'; // Import necessary icons

const Sidebar = () => {
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        window.location.href = '/login'; // Redirect to login page after logout
    };

    return (
        <div className="w-64 bg-gray-800 text-white h-screen p-6 space-y-8">
            <div className="flex items-center space-x-4 mb-10">
                <Home className="text-white h-6 w-6" />
                <h2 className="text-2xl font-bold">Dashboard</h2>
            </div>
            <ul className="space-y-6">
                <li>
                    <a href="/cdashboard" className="flex items-center text-white hover:text-blue-500">
                        <FileBarChart className="h-5 w-5 mr-3" />
                        Dashboard
                    </a>
                </li>
                <li>
                    <a href="/clientdashboard/my-cases" className="flex items-center text-white hover:text-blue-500">
                        <MessageSquare className="h-5 w-5 mr-3" />
                        My Cases
                    </a>
                </li>
                <li>
                    <a href="/clientdashboard/profile" className="flex items-center text-white hover:text-blue-500">
                        <User className="h-5 w-5 mr-3" />
                        Profile
                    </a>
                </li>
            </ul>
            <button
                onClick={handleLogout}
                className="absolute bottom-6 left-24 transform -translate-x-1/2 text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
            >
                <LogOut className="h-5 w-5 mr-2 inline" />
                Logout
            </button>
        </div>
    );
};

export default Sidebar;
