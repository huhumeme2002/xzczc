import React, { useEffect, useState, useCallback } from 'react';
import { adminService } from '../../../services/api';

const AdminUsers = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const loadUsers = useCallback(async () => {
    try {
      const res = await adminService.getUsers({ search, page, limit });
      setUsers(res.users || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
      setTotalPages(1);
      alert('Không thể tải danh sách người dùng: ' + (error.message || 'Lỗi không xác định'));
    }
  }, [search, page, limit]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const onSearch = async () => { setPage(1); await loadUsers(); };

  const toggleActive = async (u) => {
    try {
      await adminService.updateUser(u.id, { is_active: !u.is_active });
      alert('Cập nhật trạng thái thành công!');
      await loadUsers();
    } catch (error) {
      alert('Không thể cập nhật trạng thái user: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const showUserDetails = (u) => {
    alert(`Chi tiết user:\nUsername: ${u.username}\nEmail: ${u.email}\nRole: ${u.role}\nRequests: ${u.requests}\nTrạng thái: ${u.is_active ? 'Hoạt động' : 'Vô hiệu'}\nNgày tạo: ${u.created_at}`);
  };

  const adjustRequests = async (u) => {
    const adjustment = prompt('Nhập số requests muốn thêm/bớt (vd: 100 hoặc -50):', '0');
    if (adjustment !== null && !isNaN(adjustment) && adjustment !== '0') {
      try {
        await adminService.adjustUserRequests(u.id, Number(adjustment), `Admin adjusted ${adjustment} requests`);
        alert('Cập nhật requests thành công!');
        await loadUsers();
      } catch (error) {
        console.error('Adjust requests error:', error);
        alert('Không thể cập nhật requests: ' + (error.response?.data?.error || error.message || 'Lỗi không xác định'));
      }
    }
  };

  const changeRole = async (u) => {
    const newRole = prompt('Nhập vai trò mới (user/admin):', u.role);
    if (newRole && (newRole === 'user' || newRole === 'admin')) {
      try {
        await adminService.updateUser(u.id, { role: newRole });
        alert('Cập nhật vai trò thành công!');
        await loadUsers();
      } catch (error) {
        alert('Không thể cập nhật vai trò: ' + (error.message || 'Lỗi không xác định'));
      }
    }
  };


  const adjustExpiryDate = async (u) => {
    const expiryDays = prompt('Nhập số ngày gia hạn (vd: 30 cho 30 ngày):', '30');
    
    if (expiryDays !== null && !isNaN(expiryDays) && Number(expiryDays) > 0) {
      try {
        // Calculate new expiry time
        const newExpiryTime = new Date();
        newExpiryTime.setDate(newExpiryTime.getDate() + Number(expiryDays));
        
        await adminService.updateUser(u.id, { 
          expiry_time: newExpiryTime.toISOString(),
          is_expired: false
        });
        alert(`Đã gia hạn ${expiryDays} ngày cho ${u.username}!`);
        await loadUsers();
      } catch (error) {
        console.error('Adjust expiry error:', error);
        alert('Không thể gia hạn: ' + (error.response?.data?.error || error.message || 'Lỗi không xác định'));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Quản lý Users</h3>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Tìm kiếm username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
          />
          <button onClick={onSearch} className="btn-primary">Tìm</button>
        </div>
      </div>

      <div className="card">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requests</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.requests}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${u.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {u.is_active ? 'Hoạt động' : 'Vô hiệu'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button onClick={() => showUserDetails(u)} className="text-blue-600 hover:text-blue-900">Chi tiết</button>
                  <button onClick={() => adjustRequests(u)} className="text-green-600 hover:text-green-900">Requests</button>
                  <button onClick={() => adjustExpiryDate(u)} className="text-orange-600 hover:text-orange-900">Hết hạn</button>
                  <button onClick={() => changeRole(u)} className="text-purple-600 hover:text-purple-900">Role</button>
                  <button onClick={() => toggleActive(u)} className={u.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}>
                    {u.is_active ? 'Vô hiệu' : 'Kích hoạt'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end items-center space-x-2 p-3">
        <button className="btn-secondary" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Trước</button>
        <span className="text-sm text-gray-600">Trang {page} / {totalPages}</span>
        <button className="btn-secondary" disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Sau</button>
      </div>
    </div>
  );
};

export default AdminUsers;
