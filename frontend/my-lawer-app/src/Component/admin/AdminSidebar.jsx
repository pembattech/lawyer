import React from 'react';
import { Link, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import Appointment from './AdminAppointment';
// import Document from './Document';
// import User from './User';
// import CaseSummary from './CaseSummary';
// import CaseUpdate from './CaseUpdate';
// import Contact from './Contact';

const Sidebar = () => {
    return (
        <aside className="w-64 bg-gray-800 text-white p-4 space-y-4 min-h-screen">
            <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
            {/* <Link to="/admin/user" className="block hover:bg-gray-700 p-2 rounded">Users</Link>
            <Link to="/admin/document" className="block hover:bg-gray-700 p-2 rounded">Documents</Link>
            <Link to="/admin/case-summary" className="block hover:bg-gray-700 p-2 rounded">Case Summaries</Link>
            <Link to="/admin/case-update" className="block hover:bg-gray-700 p-2 rounded">Case Updates</Link> */}
            <Link to="/admin/appointment" className="block hover:bg-gray-700 p-2 rounded">Appointments</Link>
            {/* <Link to="/admin/contact" className="block hover:bg-gray-700 p-2 rounded">Contacts</Link> */}
        </aside>
    );
};

export default Sidebar;
