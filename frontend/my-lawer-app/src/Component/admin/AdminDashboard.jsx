import React from 'react';
import Sidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-6 bg-gray-100">
                <Outlet /> {/* Nested routes will render here */}
            </main>
        </div>
    );
};

export default AdminLayout;
