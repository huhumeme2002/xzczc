import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Key, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import AdminOverview from './tabs/AdminOverview';
import AdminTokens from './tabs/AdminTokens';
import AdminUsers from './tabs/AdminUsers';
import AdminNotifications from './tabs/AdminNotifications';
import AdminLoginCode from './tabs/AdminLoginCode';
import AdminSecurity from './tabs/AdminSecurity';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen">
        <div className="card dark:bg-gray-800 dark:border-gray-700 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Truy cập bị từ chối</h2>
          <p className="text-gray-600 dark:text-gray-300">Bạn không có quyền truy cập vào trang admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Quản lý hệ thống, users và analytics
        </p>
      </div>

      {activeTab === 'overview' && <AdminOverview />}

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', name: 'Tổng quan', icon: TrendingUp },
            { id: 'tokens', name: 'Quản lý Token', icon: Key },
            { id: 'users', name: 'Quản lý User', icon: Users },
            { id: 'notifications', name: 'Thông báo', icon: TrendingUp },
            { id: 'login', name: 'Mã Login', icon: TrendingUp },
            { id: 'security', name: 'Bảo mật', icon: Shield }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'tokens' && <AdminTokens />}
      {activeTab === 'users' && <AdminUsers />}
      {activeTab === 'notifications' && <AdminNotifications />}
      {activeTab === 'login' && <AdminLoginCode />}
      {activeTab === 'security' && <AdminSecurity />}
    </div>
  );
};

export default AdminDashboard;
