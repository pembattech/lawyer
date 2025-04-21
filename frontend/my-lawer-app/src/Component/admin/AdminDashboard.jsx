import React from 'react';
import { Link, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './AdminSidebar';

const AdminLayout = () => {
    const location = useLocation();

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-4 bg-gray-100 min-h-screen">
            <p>Welcome to the Admin Dashboard</p>
            </main>
        </div>
    );
};

export default AdminLayout;
