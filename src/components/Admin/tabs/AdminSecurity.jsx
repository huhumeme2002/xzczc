import React, { useEffect, useState } from 'react';
import { adminService } from '../../../services/api';

const AdminSecurity = () => {
  const [blocked, setBlocked] = useState([]);
  const load = async () => {
    const res = await adminService.getBlockedUsers();
    setBlocked(res.blockedUsers || []);
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Quản Lý User Bị Khóa</h3>
        <button className="btn-secondary" onClick={load}>Làm mới</button>
      </div>
      {blocked.length === 0 ? (
        <div className="card text-center">
          <div className="p-6 text-green-700">Không có user bị khóa. Tất cả user hiện tại đều có thể sử dụng hệ thống bình thường.</div>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sai</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khóa tới</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blocked.map(b => (
                  <tr key={b.user_id}>
                    <td className="px-3 py-2">
                      <div className="text-sm font-medium text-gray-900">{b.username}</div>
                      <div className="text-sm text-gray-500">{b.email}</div>
                    </td>
                    <td className="px-3 py-2 text-sm">{b.failed_count}</td>
                    <td className="px-3 py-2 text-sm">{b.blocked_until ? new Date(b.blocked_until).toLocaleString('vi-VN') : '-'}</td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <button className="btn-secondary text-xs" onClick={async ()=>{await adminService.resetUserAttempts(b.user_id); await load();}}>Reset</button>
                      <button className="btn-danger text-xs" onClick={async ()=>{await adminService.unblockUser(b.user_id); await load();}}>Gỡ khóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="card">
        <div className="p-4 text-sm text-gray-700">
          <p><strong>Thông tin về chức năng gỡ khóa</strong></p>
          <p>Reset: Reset số lần nhập sai và thời gian khóa, nhưng giữ lại record trong database</p>
          <p>Gỡ khóa: Xóa hoàn toàn record khóa, user có thể sử dụng ngay lập tức</p>
          <p>User bị khóa 5 phút sau 3 lần nhập sai key</p>
          <p>Hệ thống tự động gỡ khóa sau khi hết thời gian</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSecurity;


