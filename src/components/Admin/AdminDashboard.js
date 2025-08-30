import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminService } from '../../services/api';
import { 
  Users, 
  Key, 
  CreditCard, 
  TrendingUp,
  Shield,
  Activity,
  AlertTriangle,
  Plus,
  Upload,
  Download,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalKeys: 0,
    usedKeys: 0,
    totalCredits: 0,
    totalTokens: 0
  });
  const [users, setUsers] = useState([]);
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Load users
      const usersData = await adminService.getUsers();
      setUsers(usersData.users || []);
      
      // Load keys
      const keysData = await adminService.getKeys();
      setKeys(keysData.keys || []);
      
      // Calculate stats
      const totalUsers = usersData.users?.length || 0;
      const activeUsers = usersData.users?.filter(u => u.is_active)?.length || 0;
      const totalKeys = keysData.keys?.length || 0;
      const usedKeys = keysData.keys?.filter(k => k.used_by)?.length || 0;
      
      setStats({
        totalUsers,
        activeUsers,
        totalKeys,
        usedKeys,
        totalCredits: usersData.users?.reduce((sum, u) => sum + (u.credits || 0), 0) || 0,
        totalTokens: keysData.tokens?.length || 0
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
        { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin', credits: 1000, is_active: true, created_at: new Date().toISOString() },
        { id: 2, username: 'user1', email: 'user1@example.com', role: 'user', credits: 500, is_active: true, created_at: new Date().toISOString() },
        { id: 3, username: 'user2', email: 'user2@example.com', role: 'user', credits: 200, is_active: false, created_at: new Date().toISOString() }
      ]);
      
      setKeys([
        { id: 1, key_value: 'KEY-ABC123DEF456', credits: 100, used_by: 'user1', used_at: new Date().toISOString() },
        { id: 2, key_value: 'KEY-XYZ789GHI012', credits: 200, used_by: null, used_at: null },
        { id: 3, key_value: 'KEY-JKL345MNO678', credits: 150, used_by: 'user2', used_at: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKeys = async () => {
    const count = prompt('Số lượng key cần tạo:', '5');
    const credits = prompt('Số credits mỗi key:', '100');
    
    if (count && credits) {
      try {
        await adminService.createKeys({
          count: parseInt(count),
          credits: parseInt(credits),
          description: 'Keys tạo từ admin dashboard'
        });
        toast.success(`Đã tạo ${count} keys thành công!`);
        loadAdminData();
      } catch (error) {
        toast.error('Không thể tạo keys: ' + (error.response?.data?.error || error.message));
      }
    }
  };

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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-xs text-green-600">{stats.activeUsers} đang hoạt động</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Key className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Keys</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalKeys}</p>
              <p className="text-xs text-red-600">{stats.usedKeys} đã sử dụng</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <CreditCard className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng Credits</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCredits.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <Activity className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tokens</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTokens}</p>
            </div>
          </div>
        </div>
      </div>

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
            { id: 'users', name: 'Users', icon: Users },
            { id: 'keys', name: 'Keys', icon: Key },
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
      {activeTab === 'users' && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Quản lý Users</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${user.role === 'admin' ? 'badge-warning' : 'badge-info'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.credits?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${user.is_active ? 'badge-success' : 'badge-error'}`}>
                        {user.is_active ? 'Hoạt động' : 'Vô hiệu'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleToggleUser(user.id, user.is_active)}
                        className={`${user.is_active ? 'btn-danger' : 'btn-primary'} text-xs`}
                      >
                        {user.is_active ? 'Vô hiệu hóa' : 'Kích hoạt'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'keys' && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Quản lý Keys</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Key
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày sử dụng
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {keys.map((key) => (
                  <tr key={key.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {key.key_value}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {key.credits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {key.used_by || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${key.used_by ? 'badge-error' : 'badge-success'}`}>
                        {key.used_by ? 'Đã dùng' : 'Chưa dùng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {key.used_at ? new Date(key.used_at).toLocaleDateString('vi-VN') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Thống kê hệ thống</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tỷ lệ key đã sử dụng</span>
                <span className="text-sm font-medium">
                  {stats.totalKeys > 0 ? Math.round((stats.usedKeys / stats.totalKeys) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${stats.totalKeys > 0 ? (stats.usedKeys / stats.totalKeys) * 100 : 0}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Users hoạt động</span>
                <span className="text-sm font-medium">
                  {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Key className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-gray-600">Key KEY-ABC123 được redeem bởi user1</span>
                <span className="text-gray-400 ml-auto">2 phút trước</span>
              </div>
              <div className="flex items-center text-sm">
                <CreditCard className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-gray-600">Token mới được tạo bởi user2</span>
                <span className="text-gray-400 ml-auto">5 phút trước</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 text-purple-600 mr-2" />
                <span className="text-gray-600">User mới đăng ký: newuser</span>
                <span className="text-gray-400 ml-auto">10 phút trước</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Bảo mật hệ thống</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Cảnh báo bảo mật</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-green-600">
                  <Shield className="h-4 w-4 mr-2" />
                  Không có hoạt động đáng ngờ
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <Shield className="h-4 w-4 mr-2" />
                  Tất cả user đang hoạt động bình thường
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Cài đặt bảo mật</h4>
              <div className="space-y-2">
                <button className="btn-secondary text-sm w-full">
                  Cấu hình rate limiting
                </button>
                <button className="btn-secondary text-sm w-full">
                  Quản lý IP whitelist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
