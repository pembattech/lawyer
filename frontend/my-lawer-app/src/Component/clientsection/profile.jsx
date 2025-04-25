import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, CreditCard } from 'react-feather'; // Assuming you're using react-feather icons
import Sidebar from './client-sidebar';

const Profile = () => {
  const [user, setUser] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");


        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await fetch("http://127.0.0.1:8000/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          // Handle the error case
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <div className="flex">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Dashboard Content */}
      <div className="flex-1 p-8 space-y-6">
        <div className="space-y-6">
          {/* Profile Information Section */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-6 mb-4 sm:mb-0 sm:mr-6">
                <User className="h-12 w-12 text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-blue-600 mt-1">Client since {new Date(user.date_joined).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 text-blue-600 mr-2" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{user.first_name + ' ' + user.last_name}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">{user.dob}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg space-y-1 md:col-span-2">
                  <p className="text-sm text-gray-500">Home Address</p>
                  <p className="font-medium">{user.address}</p>
                </div>
              </div>
              <div className="mt-4">
                <button className="text-blue-600 text-sm hover:text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors flex items-center inline-flex">
                  <User className="h-4 w-4 mr-1" />
                  Edit Personal Information
                </button>
              </div>
            </div>

            {/* Account Settings */}
            <div className="border-t mt-6 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                Account Settings
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 p-4 rounded-lg">
                  <div>
                    <h4 className="font-medium">Password & Security</h4>
                    <p className="text-sm text-gray-600">Last updated April 2, 2025</p>
                  </div>
                  <button className="mt-2 sm:mt-0 text-blue-600 text-sm hover:text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    Change Password
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 p-4 rounded-lg">
                  <div>
                    <h4 className="font-medium">Notification Preferences</h4>
                    <p className="text-sm text-gray-600">Email & SMS enabled</p>
                  </div>
                  <button className="mt-2 sm:mt-0 text-blue-600 text-sm hover:text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors flex items-center">
                    <Bell className="h-4 w-4 mr-1" />
                    Manage Notifications
                  </button>
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="border-t mt-6 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
                Billing Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-2">Payment Method</h4>
                <div className="flex items-center">
                  <div className="bg-white p-2 rounded border border-gray-200 mr-3">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-gray-600">Expires 08/26</p>
                  </div>
                </div>
              </div>
              <div>
                <button className="text-blue-600 text-sm hover:text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors flex items-center inline-flex">
                  <CreditCard className="h-4 w-4 mr-1" />
                  Update Payment Method
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
