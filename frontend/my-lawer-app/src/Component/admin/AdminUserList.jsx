import React, { useEffect, useState } from 'react';
import Sidebar from './AdminSidebar';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('accessToken');

  const lawyerTypes = [
    { value: 'criminal', label: 'Criminal Lawyer' },
    { value: 'estate_planning', label: 'Estate Planning Lawyer' },
    { value: 'tax', label: 'Tax Lawyer' },
    { value: 'personal_injury', label: 'Personal Injury Lawyer' },
    { value: 'corporate', label: 'Corporate Lawyer' },
    { value: 'business', label: 'Business Lawyer' },
    { value: 'intellectual_property', label: 'Intellectual Property Lawyer' },
    { value: 'family', label: 'Family Lawyer' },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/update-role/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch users. Please try again later.');
      console.error('Failed to fetch users:', error);
    }
  };

  const updateUserRole = async (userId, newRole, newLawyerType) => {
    // Skip update if there's no change
    const user = users.find(u => u.id === userId);
    if (user.role === newRole && user.lawyer_type === newLawyerType) return;

    try {
      await fetch(`http://127.0.0.1:8000/api/update-role/${userId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole, lawyer_type: newLawyerType }),
      });

      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, role: newRole, lawyer_type: newLawyerType } : user
        )
      );
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const updateLawyerType = async (userId, newLawyerType) => {
    // Check if lawyer type is already the same to avoid unnecessary updates
    const user = users.find(u => u.id === userId);
    if (user.lawyer_type === newLawyerType) return;

    try {
      await fetch(`http://127.0.0.1:8000/api/update-lawyer-type/${userId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ lawyer_type: newLawyerType }),
      });

      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, lawyer_type: newLawyerType } : user
        )
      );
    } catch (error) {
      console.error('Failed to update lawyer type:', error);
    }
  };

  if (error) return <p className="text-center text-red-500">{error}</p>;

  if (loading) return (
    <div className="text-center mt-12 text-lg text-gray-500">
      <div className="spinner"></div> {/* You can add a custom loading spinner here */}
      Loading users...
    </div>
  );

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4 bg-gray-100 min-h-screen">
        <div className="rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Manage Users</h2>
            <p className="text-sm text-gray-500 text-center mt-1">Update roles and lawyer types</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-base text-gray-700">
              <thead className="bg-gray-200 text-sm uppercase text-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-left">Lawyer Type</th>
                </tr>
              </thead>
              <tbody className="text-gray-900">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-all">
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.first_name} {user.last_name}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value, user.lawyer_type)}
                        className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="lawyer">Lawyer</option>
                        <option value="client">Client</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'lawyer' ? (
                        <select
                          value={user.lawyer_type || ''}
                          onChange={(e) => updateLawyerType(user.id, e.target.value)}
                          className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Select type</option>
                          {lawyerTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center px-6 py-6 text-gray-400">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminUserList;
