import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Settings } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const CursorProLayout = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Calculate time left (mock for now)
  const calculateTimeLeft = () => {
    if (user?.expiresAt) {
      const expiry = new Date(user.expiresAt);
      const now = new Date();
      const diff = expiry - now;
      
      if (diff <= 0) return "Đã hết hạn";
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${days} ngày ${hours} giờ ${minutes} phút`;
    }
    // Default to very far future like the old interface
    return "9999999 ngày 22 giờ 38 phút";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Only show on authenticated pages */}
      {isAuthenticated && (
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <Link to="/dashboard">
                  <h1 className="text-2xl font-bold text-gray-900">Cursor Pro Thinking</h1>
                </Link>
                <p className="text-sm text-gray-600">
                  ⏰ Còn lại: <span className="font-medium text-primary-600">{calculateTimeLeft()}</span>
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Chào mừng trở lại, <strong>{user?.username}</strong>
                </span>
                <div className="flex items-center space-x-2">
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin"
                      className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Quản trị</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4ade80',
            },
          },
          error: {
            duration: 4000,
            theme: {
              primary: '#ef4444',
            },
          },
        }}
      />
    </div>
  );
};

export default CursorProLayout;
