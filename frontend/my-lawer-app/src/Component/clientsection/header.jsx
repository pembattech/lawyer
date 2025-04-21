import { useState } from 'react';
import { Bell, User, Menu, X, Layout } from 'lucide-react';

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
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
