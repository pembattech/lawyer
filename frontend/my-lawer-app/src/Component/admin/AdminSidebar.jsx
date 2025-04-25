import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from "./../../api";

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-gray-800 text-white flex flex-col justify-between min-h-screen">
            <nav className="p-6 space-y-4">
                <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
                <Link to="/admin/case" className="block hover:bg-gray-700 p-2 rounded">Case Updates</Link>
                <Link to="/admin/appointment" className="block hover:bg-gray-700 p-2 rounded">Appointments</Link>
                <Link to="/admin/contact-message" className="block hover:bg-gray-700 p-2 rounded">Contacts</Link>
            </nav>
            <div className="p-6">
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded text-white transition"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
