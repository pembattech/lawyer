import React, { useEffect, useState } from 'react';
import Sidebar from './AdminSidebar';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('accessToken');

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
      console.error('Failed to fetch users:', error);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/update-role/${userId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  if (loading) return <p className="text-center mt-12 text-lg text-gray-500">Loading users...</p>;

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4 bg-gray-100 min-h-screen">
        <div className="rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Manage Users</h2>
            <p className="text-sm text-gray-500 text-center mt-1">Update roles for clients and lawyers</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-base text-gray-700">
              <thead className="bg-gray-200 text-sm uppercase text-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Role</th>
                </tr>
              </thead>
              <tbody class="text-gray-900">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-all">
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.first_name} {user.last_name}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="lawyer">Lawyer</option>
                        <option value="client">Client</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center px-6 py-6 text-gray-400">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
    </main>
    </div >
  );
};

export default AdminUserList;
