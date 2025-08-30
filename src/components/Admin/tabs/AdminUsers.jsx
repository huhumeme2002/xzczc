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
        alert('Không thể cập nhật requests: ' + (error.message || 'Lỗi không xác định'));
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

  const changePassword = async (u) => {
    const newPassword = prompt('Nhập mật khẩu mới:');
    if (newPassword) {
      try {
        await adminService.updateUser(u.id, { password: newPassword });
        alert('Đổi mật khẩu thành công!');
        await loadUsers();
      } catch (error) {
        alert('Không thể đổi mật khẩu: ' + (error.message || 'Lỗi không xác định'));
      }
    }
  };

  const adjustExpiryDate = async (u) => {
    const currentExpiry = u.expires_at ? new Date(u.expires_at) : null;

    // Create a modal-like prompt with options
    const options = [
      '1. Thêm/bớt ngày (vd: +30 hoặc -7)',
      '2. Nhập ngày cụ thể (YYYY-MM-DD)',
      '3. Xóa hạn sử dụng (không giới hạn)',
      '4. Hủy'
    ].join('\n');

    const choice = prompt(`Chọn tùy chọn cho ${u.username}:\n\n${options}`, '1');

    if (!choice || choice === '4') return;

    try {
      let newExpiryDate = null;

      switch (choice) {
        case '1':
          // Add/subtract days
          const daysChange = prompt('Nhập số ngày muốn thêm/bớt (vd: +30 hoặc -7):', '+30');
          if (!daysChange) return;

          const days = parseInt(daysChange);
          if (isNaN(days)) {
            alert('Số ngày không hợp lệ!');
            return;
          }

          if (currentExpiry) {
            const newDate = new Date(currentExpiry);
            newDate.setDate(newDate.getDate() + days);
            newExpiryDate = newDate.toISOString().split('T')[0];
          } else {
            // If no current expiry, add days from today
            const newDate = new Date();
            newDate.setDate(newDate.getDate() + days);
            newExpiryDate = newDate.toISOString().split('T')[0];
          }
          break;

        case '2':
          // Specific date
          const dateInput = prompt('Nhập ngày hết hạn (YYYY-MM-DD):', currentExpiry ? currentExpiry.toISOString().split('T')[0] : '');
          if (!dateInput) return;

          const date = new Date(dateInput);
          if (isNaN(date.getTime())) {
            alert('Định dạng ngày không hợp lệ. Vui lòng sử dụng định dạng YYYY-MM-DD');
            return;
          }
          newExpiryDate = dateInput;
          break;

        case '3':
          // Remove expiry (set to null)
          newExpiryDate = null;
          break;

        default:
          alert('Lựa chọn không hợp lệ!');
          return;
      }

      await adminService.updateUser(u.id, { expires_at: newExpiryDate });
      const action = newExpiryDate ? `đặt thành ${newExpiryDate}` : 'xóa hạn sử dụng';
      alert(`Cập nhật ngày hết hạn thành công! ${action}`);
      await loadUsers();
    } catch (error) {
      alert('Không thể cập nhật ngày hết hạn: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Quản lý người dùng</h3>
        <div className="flex items-center space-x-2">
          <input className="input-field" placeholder="Tìm kiếm theo tên hoặc email..." value={search} onChange={e=>setSearch(e.target.value)} />
          <button className="btn-primary" onClick={onSearch}>🔄 Tải lại</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requests</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hết hạn</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(u => (
              <tr key={u.id}>
                <td className="px-3 py-2">
                  <div className="text-sm font-medium text-gray-900">{u.username}</div>
                  <div className="text-sm text-gray-500">{u.email}</div>
                </td>
                <td className="px-3 py-2 text-sm">{u.requests}</td>
                <td className="px-3 py-2 text-sm">{u.role}</td>
                <td className="px-3 py-2 text-sm">{u.is_active ? 'Hoạt động' : 'Vô hiệu'}</td>
                <td className="px-3 py-2 text-sm">{u.expires_at ? new Date(u.expires_at).toLocaleDateString('vi-VN') : 'Không giới hạn'}</td>
                <td className="px-3 py-2 text-sm">{u.created_at ? new Date(u.created_at).toLocaleTimeString('vi-VN') + ' ' + new Date(u.created_at).toLocaleDateString('vi-VN') : '-'}</td>
                <td className="px-3 py-2 text-right space-x-2">
                  <button className="btn-secondary text-xs" onClick={()=>showUserDetails(u)}>Chi tiết</button>
                  <button className="btn-secondary text-xs" onClick={()=>adjustRequests(u)}>Requests</button>
                  <button className="btn-secondary text-xs" onClick={()=>changeRole(u)}>Vai trò</button>
                  <button className="btn-secondary text-xs" onClick={()=>changePassword(u)}>Đổi MK</button>
                  <button className="btn-secondary text-xs" onClick={()=>adjustExpiryDate(u)}>Hết hạn</button>
                  <button className={`${u.is_active ? 'btn-danger' : 'btn-primary'} text-xs`} onClick={()=>toggleActive(u)}>{u.is_active ? 'Vô hiệu' : 'Kích hoạt'}</button>
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


