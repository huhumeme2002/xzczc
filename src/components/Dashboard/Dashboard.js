import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  Key, 
  Coins, 
  TrendingUp, 
  Clock, 
  Activity,
  Plus,
  ArrowRight
} from 'lucide-react';
import { utilityService } from '../../services/api';


const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCredits: user?.credits || 0,
    keysRedeemed: 0,
    tokensGenerated: 0,
    lastActivity: null
  });
  const [systemStatus, setSystemStatus] = useState({
    api: 'checking',
    database: 'checking'
  });

  useEffect(() => {
    checkSystemStatus();
    // Simulate loading stats - in real app you'd fetch from API
    loadUserStats();
  }, []);

  const checkSystemStatus = async () => {
    try {
      await utilityService.healthCheck();
      setSystemStatus(prev => ({ ...prev, api: 'healthy' }));
    } catch (error) {
      setSystemStatus(prev => ({ ...prev, api: 'error' }));
    }

    try {
      await utilityService.testConnection();
      setSystemStatus(prev => ({ ...prev, database: 'healthy' }));
    } catch (error) {
      setSystemStatus(prev => ({ ...prev, database: 'error' }));
    }
  };

  const loadUserStats = () => {
    // Simulate API call - replace with real API
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        keysRedeemed: Math.floor(Math.random() * 10),
        tokensGenerated: Math.floor(Math.random() * 50),
        lastActivity: new Date().toISOString()
      }));
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'healthy':
        return 'Hoạt động tốt';
      case 'error':
        return 'Lỗi kết nối';
      default:
        return 'Đang kiểm tra...';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Chào mừng trở lại, {user?.username}!
        </h1>
        <p className="mt-2 text-gray-600">
          Quản lý credits và tokens của bạn một cách dễ dàng
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Coins className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng Credits</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalCredits.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Key className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Keys Đã Redeem</p>
              <p className="text-2xl font-bold text-gray-900">{stats.keysRedeemed}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <CreditCard className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tokens Đã Tạo</p>
              <p className="text-2xl font-bold text-gray-900">{stats.tokensGenerated}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <Activity className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hoạt động cuối</p>
              <p className="text-sm font-bold text-gray-900">
                {stats.lastActivity 
                  ? new Date(stats.lastActivity).toLocaleDateString('vi-VN')
                  : 'Chưa có'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Thao tác nhanh</h3>
          </div>
          <div className="space-y-4">
            <Link
              to="/redeem"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
            >
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-primary-100 text-primary-600 group-hover:bg-primary-200">
                  <Key className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Redeem Key</p>
                  <p className="text-sm text-gray-600">Chuyển đổi key thành credits</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600" />
            </Link>

            <Link
              to="/tokens"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
            >
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-100 text-green-600 group-hover:bg-green-200">
                  <Plus className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Tạo Token</p>
                  <p className="text-sm text-gray-600">Sử dụng credits để tạo token</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600" />
            </Link>

            <Link
              to="/history"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
            >
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Lịch sử giao dịch</p>
                  <p className="text-sm text-gray-600">Xem chi tiết hoạt động</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600" />
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Trạng thái hệ thống</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Activity className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">API Server</p>
                  <p className="text-sm text-gray-600">Trạng thái kết nối API</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(systemStatus.api)}`}>
                {getStatusText(systemStatus.api)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Database</p>
                  <p className="text-sm text-gray-600">Trạng thái cơ sở dữ liệu</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(systemStatus.database)}`}>
                {getStatusText(systemStatus.database)}
              </span>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Cập nhật lần cuối: {new Date().toLocaleTimeString('vi-VN')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
        </div>
        <div className="text-center py-8">
          <Activity className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có hoạt động</h3>
          <p className="mt-1 text-sm text-gray-500">
            Hoạt động của bạn sẽ hiển thị ở đây
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
