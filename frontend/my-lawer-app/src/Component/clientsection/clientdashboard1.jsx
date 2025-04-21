import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { authService } from "../../api";
import {
  Bell,
  FileText,
  Calendar,
  MessageSquare,
  User,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Home,
  FileBarChart,
  Layout,
  Phone,
  Shield,
  CreditCard
} from 'lucide-react';


const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};



const Header = ({ toggleSidebar, isSidebarOpen, notifications, handleLogout }) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white shadow fixed w-full top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700 lg:hidden"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center mr-2">
                <Layout className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Client Portal</h1>
            </div>
          </div>
          <div className="flex items-center">
            <div className="relative mr-4">
              <button
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-20 border border-gray-200">
                  <div className="py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium">
                    Notifications
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div key={notification.id} className={`p-3 border-b ${!notification.read ? 'bg-blue-50' : ''}`}>
                          <p className={`text-sm ${!notification.read ? 'font-medium' : 'text-gray-600'}`}>{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>
                  <div className="py-2 px-4 bg-gray-50">
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium w-full text-center">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full h-8 w-8 flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              {/* Removed userName display from header */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const Sidebar = ({ active, setActivePage, isSidebarOpen, handleLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'updates', label: 'Case Updates', icon: FileBarChart },
    { id: 'documents', label: 'Documents', icon: FileText },
    // { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (!isSidebarOpen) return null;

  return (
    <aside className="fixed inset-y-0 left-0 bg-gradient-to-b from-blue-800 to-blue-900 text-white w-64 pt-16 transform transition-transform duration-300 lg:translate-x-0 z-0 shadow-lg">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => setActivePage(item.id)}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${active === item.id
                  ? 'bg-white/10 font-medium'
                  : 'hover:bg-white/5'
                  }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
                {active === item.id && (
                  <div className="w-1 h-5 bg-white rounded-full ml-auto"></div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-4 mt-8 absolute bottom-8 w-full">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

const Footer = () => (
  <footer className="bg-white py-4 mt-8 border-t border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-gray-600">© 2025 Johnson & Associates Law Firm. All rights reserved.</p>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</a>
          <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</a>
          <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Contact Us</a>
        </div>
      </div>
    </div>
  </footer>
);

// Page Components
const Dashboard = ({ caseUpdates, appointments }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <FileBarChart className="h-5 w-5 text-blue-600 mr-2" />
          Case Summary
        </h3>

        {caseUpdates.map(caseItem => (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <p className="font-medium">{caseItem.filed_date}</p>
            </div>
            <div className="border rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all">
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium text-blue-600">{caseItem.status}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
              Recent Updates
            </h3>
            <button className="text-blue-600 text-sm flex items-center hover:text-blue-800 transition-colors">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {caseUpdates.slice(0, 2).map(caseItem => (
              <div
                key={caseItem.id}
                className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/50 rounded-r-lg hover:bg-blue-50 transition-colors"
              >
                {caseItem.updates.map(update => {
                  return (
                    <div key={update.id}>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <h4 className="font-medium text-gray-900">{update.title}</h4>
                        <span
                          className={`text-xs px-2 py-1 rounded-full inline-flex mt-1 sm:mt-0 ${caseItem.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : caseItem.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                            }`}
                        >
                          {caseItem.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{update.details}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDate(update.updated_at)}
                      </p>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>



        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              Upcoming Appointments
            </h3>
            <button className="text-blue-600 text-sm flex items-center hover:text-blue-800 transition-colors">
              Schedule <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {appointments.slice(0, 2).map(appointment => (
              <div key={appointment.id} className="flex flex-col sm:flex-row border rounded-lg p-3 hover:border-blue-500 hover:shadow-md transition-all">
                <div className="bg-blue-100 rounded-full p-3 mb-3 sm:mb-0 sm:mr-4 self-start">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                  <p className="text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Layout className="h-5 w-5 text-blue-600 mr-2" />
          Case Timeline
        </h3>
        <div className="relative">
          <div className="absolute top-0 left-4 h-full w-0.5 bg-blue-200"></div>
          <div className="space-y-8 relative">
            <div className="flex">
              <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full h-8 w-8 flex items-center justify-center z-10">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div className="ml-4">
                <h4 className="text-md font-medium">Case Filed</h4>
                <p className="text-sm text-gray-600">Your case was officially filed with the court</p>
                <p className="text-xs text-gray-500 mt-1">January 15, 2025</p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full h-8 w-8 flex items-center justify-center z-10">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <div className="ml-4">
                <h4 className="text-md font-medium">Initial Consultation</h4>
                <p className="text-sm text-gray-600">Reviewed case details and strategy</p>
                <p className="text-xs text-gray-500 mt-1">February 3, 2025</p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center z-10">
                <Layout className="h-4 w-4 text-gray-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-md font-medium">Discovery Phase</h4>
                <p className="text-sm text-gray-600">Gathering evidence and testimonies</p>
                <p className="text-xs text-blue-600 mt-1">In Progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const CaseUpdates = ({ caseUpdates }) => (
  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
      <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
      Case Updates
    </h3>
    <div className="space-y-6">
      {caseUpdates.map(caseItem => (
        <div
          key={caseItem.id}
          className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50/50 rounded-r-lg hover:bg-blue-50 transition-colors"
        >
          {caseItem.updates.map(update => {
            const status = caseItem.status;

            return (
              <div key={update.id}>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <h4 className="font-medium text-gray-900">{update.title}</h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full inline-flex mt-1 sm:mt-0 ${status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{update.details}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {formatDate(update.updated_at)}
                </p>
              </div>
            );
          })}
        </div>
      ))}
    </div>

  </div>
);

const Documents = ({ documentRequests }) => (
  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
      <h3 className="text-lg font-medium text-gray-900 flex items-center mb-3 sm:mb-0">
        <FileText className="h-5 w-5 text-blue-600 mr-2" />
        Document Requests
      </h3>
      <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-sm flex items-center">
        <FileText className="h-4 w-4 mr-1" />
        Upload Document
      </button>
    </div>
    <div className="overflow-x-auto bg-white rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {documentRequests.map(doc => (
            <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.name}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 py-1 text-xs rounded-full ${doc.status === 'Submitted' ? 'bg-green-100 text-green-800' :
                  doc.status === 'Urgent' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                  {doc.status}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{doc.dueDate}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm">
                {doc.status !== 'Submitted' ? (
                  <button className="text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors">Upload</button>
                ) : (
                  <button className="text-gray-500 hover:text-gray-700 bg-gray-50 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors">View</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
      <h4 className="font-medium text-blue-800 mb-2 flex items-center">
        <FileText className="h-4 w-4 mr-2" />
        Document Guidelines
      </h4>
      <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
        <li>All documents should be in PDF format</li>
        <li>Personal information should be clearly visible</li>
        <li>Electronic signatures are accepted</li>
        <li>Maximum file size is 10MB per document</li>
      </ul>
    </div>
  </div>
);

const Appointments = ({ appointments }) => (
  <div>
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center mb-3 sm:mb-0">
          <Calendar className="h-5 w-5 text-blue-600 mr-2" />
          Office Visits & Appointments
        </h3>
        <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-sm flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          Request Appointment
        </button>
      </div>
      <div className="space-y-4">
        {appointments.map(appointment => (
          <div key={appointment.id} className="flex flex-col sm:flex-row sm:items-center p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
            <div className="bg-blue-100 rounded-full p-3 mb-3 sm:mb-0 sm:mr-4 self-start">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 mb-3 sm:mb-0">
              <h4 className="font-medium text-gray-900">{appointment.title}</h4>
              <p className="text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
            </div>
            <div className="flex space-x-2">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm transition-colors">
                Reschedule
              </button>
              <button className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-md text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <Layout className="h-5 w-5 text-blue-600 mr-2" />
        Office Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center">
            <Home className="h-4 w-4 text-blue-600 mr-2" />
            Main Office Location
          </h4>
          <p className="text-gray-600">123 Legal Avenue, Suite 500</p>
          <p className="text-gray-600">Los Angeles, CA 90001</p>
          <div className="mt-3">
            <button className="text-blue-600 text-sm hover:text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors flex items-center">
              <ChevronRight className="h-4 w-4 mr-1" />
              Get Directions
            </button>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center">
            <Calendar className="h-4 w-4 text-blue-600 mr-2" />
            Office Hours
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p className="text-gray-600">Monday - Friday:</p>
            <p className="text-gray-800 font-medium">9:00 AM - 5:30 PM</p>
            <p className="text-gray-600">Saturday:</p>
            <p className="text-gray-800 font-medium">10:00 AM - 2:00 PM</p>
            <p className="text-gray-600">Sunday:</p>
            <p className="text-gray-800 font-medium">Closed</p>
          </div>
        </div>
      </div>
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2 flex items-center">
          <Phone className="h-4 w-4 text-blue-600 mr-2" />
          Contact Information
        </h4>
        <div className="flex items-center space-x-3 text-gray-600">
          <Phone className="h-4 w-4" />
          <span>(555) 123-4567</span>
        </div>
      </div>
    </div>
  </div>
);

const Profile = ({ user, handleLogout }) => (
  <div className="space-y-6">
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-6 mb-4 sm:mb-0 sm:mr-6">
          <User className="h-12 w-12 text-white" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          {/* Removed name display in profile header */}
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-blue-600 mt-1">Client since {new Date(user.date_joined).toLocaleDateString()}</p>
        </div>

      </div>

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
            <p className="text-sm text-gray-500">Phone </p>
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
);


// Main App Component
const ClientPortal = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    clientSince: ""
  });

  useEffect(() => {
    const fetchUser = async () => {

      const token = localStorage.getItem("accessToken");


      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // 👈 Add token here
          },
        });

        if (!response.ok) {
          throw new Error("Unauthorized or error fetching user");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);


  const [caseUpdates, setCaseUpdates] = useState([]);
  useEffect(() => {
    const fetchCaseUpdates = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("No token found");
        return;
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
          throw new Error("Unauthorized or error fetching case updates");
        }

        const data = await response.json();
        setCaseUpdates(data);
      } catch (error) {
        console.error("Error fetching case updates:", error);
      }
    };

    fetchCaseUpdates();
  }, []);

  const appointments = [
    {
      id: 1,
      title: "Case Review Meeting",
      date: "April 20, 2025",
      time: "10:00 AM",
      location: "Main Office"
    },
    {
      id: 2,
      title: "Preparation for Deposition",
      date: "April 25, 2025",
      time: "2:30 PM",
      location: "Main Office"
    },
    {
      id: 3,
      title: "Settlement Discussion",
      date: "May 5, 2025",
      time: "11:00 AM",
      location: "Virtual Meeting"
    }
  ];

  const documentRequests = [
    {
      id: 1,
      name: "Medical Records",
      status: "Submitted",
      dueDate: "March 15, 2025"
    },
    {
      id: 2,
      name: "Employment Records",
      status: "Pending",
      dueDate: "April 15, 2025"
    },
    {
      id: 3,
      name: "Insurance Information",
      status: "Submitted",
      dueDate: "March 1, 2025"
    },
    {
      id: 4,
      name: "Signed Affidavit",
      status: "Urgent",
      dueDate: "April 20, 2025"
    },
    {
      id: 5,
      name: "Photo Evidence",
      status: "Pending",
      dueDate: "April 30, 2025"
    }
  ];

  const notifications = [
    {
      id: 1,
      message: "Your document 'Medical Records' has been reviewed.",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      message: "Upcoming appointment: Case Review Meeting on April 20.",
      time: "Yesterday",
      read: false
    },
    {
      id: 3,
      message: "New document request: Signed Affidavit.",
      time: "2 days ago",
      read: true
    }
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    // Handle logout logic here
    authService.logout();
    navigate('/login');
  };

  useEffect(() => {
    // This would normally fetch user data from backend
    // For demo purposes, we're using the sample data

    // Responsive sidebar behavior
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Initialize on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Render active page content
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard caseUpdates={caseUpdates} appointments={appointments} />;
      case 'updates':
        return <CaseUpdates caseUpdates={caseUpdates} />;
      case 'documents':
        return <Documents documentRequests={documentRequests} />;
      case 'appointments':
        return <Appointments appointments={appointments} />;
      case 'profile':
        return <Profile user={user} handleLogout={handleLogout} />;
      default:
        return <Dashboard caseUpdates={caseUpdates} appointments={appointments} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        notifications={notifications}
        handleLogout={handleLogout}
      />
      <Sidebar
        active={activePage}
        setActivePage={setActivePage}
        isSidebarOpen={isSidebarOpen}
        handleLogout={handleLogout}
      />
      <main className={`pt-20 px-4 sm:px-6 lg:px-8 transition-all ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <div className="max-w-4xl mx-auto pb-12">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-4 py-2">
            <Home className="h-4 w-4 mr-1" />
            <span>Client Portal</span>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-blue-600 font-medium capitalize">{activePage}</span>
          </div>

          {/* Page Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 capitalize">{activePage}</h2>
            <p className="text-gray-600">
              {activePage === 'dashboard' && 'Overview of your case activity and important updates'}
              {activePage === 'updates' && 'Latest developments and status updates on your case'}
              {activePage === 'documents' && 'Required and submitted documentation for your case'}
              {activePage === 'appointments' && 'Schedule and manage your appointments'}
              {activePage === 'profile' && 'Manage your personal information and account settings'}
            </p>
          </div>

          {/* Page Content */}
          {renderPage()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientPortal;