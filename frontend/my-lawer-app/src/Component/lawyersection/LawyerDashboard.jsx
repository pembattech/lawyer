import React, { useState, useEffect } from 'react';
import LawyerCases from './LawyerCases';

const LawyerDashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) return (window.location.href = '/login');

            try {
                const response = await fetch('http://127.0.0.1:8000/api/user/', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error('Failed to fetch user');

                const data = await response.json();
                setUser(data);

                if (data.role !== 'lawyer') {
                    window.location.href = `/${data.role}dashboard`;
                }
            } catch (error) {
                console.error('Auth error:', error);
                window.location.href = '/login';
            }
        };

        fetchUser();
    }, []);

    if (!user) return <div className="text-center mt-10 text-lg">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Lawyer Dashboard</h1>
            <p className="mb-6 text-gray-600">Welcome, {user.first_name} {user.last_name}!</p>

            <div className="bg-white shadow rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-3">Your Cases</h2>
                <LawyerCases lawyerId={user.id} />
            </div>

        </div>
    );
};

export default LawyerDashboard;
