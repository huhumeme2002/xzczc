import React from 'react';

const AdminNotifications = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900">Quản Lý Thông Báo</h3>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <label className="text-sm text-gray-600">Tiêu đề</label>
          <input className="input-field" placeholder="Nhập tiêu đề thông báo..." />
        </div>
        <div>
          <label className="text-sm text-gray-600">Nội dung</label>
          <textarea className="input-field" rows={4} placeholder="Nhập nội dung thông báo..." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Loại thông báo</label>
            <select className="input-field">
              <option>Thông tin</option>
              <option>Cảnh báo</option>
              <option>Khẩn</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Người nhận</label>
            <select className="input-field">
              <option>Tất cả người dùng</option>
              <option>Chỉ Admin</option>
            </select>
          </div>
        </div>
        <button className="btn-primary">Gửi Thông Báo</button>
        <div className="pt-4">
          <h4 className="text-sm font-medium text-gray-900">Thông báo gần đây</h4>
          <p className="text-sm text-gray-500 mt-2">Chưa có thông báo nào</p>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;


