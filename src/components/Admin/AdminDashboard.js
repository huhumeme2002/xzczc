import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminService } from '../../services/api';
import { Users, Key, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import AdminOverview from './tabs/AdminOverview';
import AdminTokens from './tabs/AdminTokens';
import AdminUsers from './tabs/AdminUsers';
import AdminNotifications from './tabs/AdminNotifications';
import AdminLoginCode from './tabs/AdminLoginCode';
import AdminSecurity from './tabs/AdminSecurity';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Load users (paginated)
      const usersRes = await adminService.getUsers();
      setUsers(usersRes.users || []);

      // Load keys
      const keysRes = await adminService.getKeys();
      setKeys(keysRes.keys || []);

      // Dashboard stats from manage-users GET
      const dashboard = await adminService.getDashboard();

      setStats({
        totalUsers: parseInt(dashboard?.stats?.total_users || 0),
        activeUsers: parseInt(dashboard?.stats?.active_users || 0),
        totalKeys: keysRes.keys?.length || 0,
        usedKeys: (keysRes.keys || []).filter(k => k.is_used).length || 0,
        totalRequests: parseInt(dashboard?.stats?.total_requests || 0),
        totalTokens: (dashboard?.topRequestUsers || []).reduce((s) => s, 0) // placeholder
      });
      
    } catch (error) {
      console.error('Failed to load admin data:', error);
      // Mock data for demo
      setStats({
        totalUsers: 15,
        activeUsers: 12,
        totalKeys: 50,
        usedKeys: 23,
        totalCredits: 15000,
        totalTokens: 127
      });
      
      setUsers([
        { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin', requests: 1000, is_active: true, created_at: new Date().toISOString() },
        { id: 2, username: 'user1', email: 'user1@example.com', role: 'user', requests: 500, is_active: true, created_at: new Date().toISOString() },
        { id: 3, username: 'user2', email: 'user2@example.com', role: 'user', requests: 200, is_active: false, created_at: new Date().toISOString() }
      ]);
      
      setKeys([
        { id: 1, key_value: 'KEY-ABC123DEF456', requests: 100, used_by: 'user1', used_at: new Date().toISOString() },
        { id: 2, key_value: 'KEY-XYZ789GHI012', requests: 200, used_by: null, used_at: null },
        { id: 3, key_value: 'KEY-JKL345MNO678', requests: 150, used_by: 'user2', used_at: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKeys = async () => {};

  const handleToggleUser = async (userId, currentStatus) => {
    try {
      await adminService.manageUsers({
        action: currentStatus ? 'deactivate' : 'activate',
        userId: userId
      });
      toast.success(`Đã ${currentStatus ? 'vô hiệu hóa' : 'kích hoạt'} user thành công!`);
      loadAdminData();
    } catch (error) {
      toast.error('Không thể cập nhật user: ' + (error.response?.data?.error || error.message));
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Truy cập bị từ chối</h2>
          <p className="text-gray-600">Bạn không có quyền truy cập vào trang admin.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Quản lý hệ thống, users và analytics
        </p>
      </div>

      {activeTab === 'overview' && <AdminOverview />}

      {/* Quick Actions */}
      <div className="card mb-8">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Thao tác nhanh</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={handleCreateKeys}
            className="btn-primary flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo Keys
          </button>
          <button className="btn-secondary flex items-center justify-center">
            <Upload className="w-4 h-4 mr-2" />
            Upload Tokens
          </button>
          <button className="btn-secondary flex items-center justify-center">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
          <button className="btn-secondary flex items-center justify-center">
            <Settings className="w-4 h-4 mr-2" />
            Cài đặt
          </button>
        </div>
      </div>

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
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <AdminOverview />}
      {activeTab === 'tokens' && <AdminTokens />}
      {activeTab === 'users' && <AdminUsers />}
      {activeTab === 'notifications' && <AdminNotifications />}
      {activeTab === 'login' && <AdminLoginCode />}
      {activeTab === 'security' && <AdminSecurity />}
    </div>
  );
};

export default AdminDashboard;
