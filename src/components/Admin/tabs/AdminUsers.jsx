import React, { useEffect, useState, useCallback } from 'react';
import { adminService } from '../../../services/api';

const AdminUsers = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const loadUsers = useCallback(async () => {
    const res = await adminService.getUsers({ search, page, limit });
    setUsers(res.users || []);
    setTotalPages(res.pagination?.totalPages || 1);
  }, [search, page, limit]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const onSearch = async () => { setPage(1); await loadUsers(); };

  const toggleActive = async (u) => {
    await adminService.updateUser(u.id, { is_active: !u.is_active });
    await loadUsers();
  };

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Quản lý người dùng</h3>
        <div className="flex items-center space-x-2">
          <input className="input-field" placeholder="Tìm kiếm theo tên hoặc email..." value={search} onChange={e=>setSearch(e.target.value)} />
          <button className="btn-secondary" onClick={onSearch}>Tải lại</button>
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
                <td className="px-3 py-2 text-sm">{u.created_at ? new Date(u.created_at).toLocaleTimeString('vi-VN') + ' ' + new Date(u.created_at).toLocaleDateString('vi-VN') : '-'}</td>
                <td className="px-3 py-2 text-right space-x-2">
                  <button className="btn-secondary text-xs">Chi tiết</button>
                  <button className="btn-secondary text-xs">Requests</button>
                  <button className="btn-secondary text-xs">Vai trò</button>
                  <button className="btn-secondary text-xs">Đổi MK</button>
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


