import React, { useState } from 'react';
import { notificationService } from '../../../services/api';

const AdminNotifications = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('info');
  const [recipient, setRecipient] = useState('all');
  const [loading, setLoading] = useState(false);

  const sendNotification = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Vui lòng nhập tiêu đề và nội dung thông báo');
      return;
    }

    setLoading(true);
    try {
      await notificationService.sendNotification({
        title,
        content,
        type,
        recipient
      });

      alert('Thông báo đã được gửi thành công!');

      // Reset form
      setTitle('');
      setContent('');
      setType('info');
      setRecipient('all');
    } catch (error) {
      alert('Có lỗi xảy ra khi gửi thông báo: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900">Quản Lý Thông Báo</h3>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <label className="text-sm text-gray-600">Tiêu đề</label>
          <input
            className="input-field"
            placeholder="Nhập tiêu đề thông báo..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Nội dung</label>
          <textarea
            className="input-field"
            rows={4}
            placeholder="Nhập nội dung thông báo..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Loại thông báo</label>
            <select
              className="input-field"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="info">Thông tin</option>
              <option value="warning">Cảnh báo</option>
              <option value="urgent">Khẩn</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Người nhận</label>
            <select
              className="input-field"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            >
              <option value="all">Tất cả người dùng</option>
              <option value="admin">Chỉ Admin</option>
            </select>
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={sendNotification}
          disabled={loading}
        >
          {loading ? 'Đang gửi...' : 'Gửi Thông Báo'}
        </button>
        <div className="pt-4">
          <h4 className="text-sm font-medium text-gray-900">Thông báo gần đây</h4>
          <p className="text-sm text-gray-500 mt-2">Chưa có thông báo nào</p>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;


