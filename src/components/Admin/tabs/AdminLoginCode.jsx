import React, { useEffect, useState, useCallback } from 'react';
import { loginCodeService } from '../../../services/api';

const AdminLoginCode = () => {
  const [current, setCurrent] = useState('');
  const [date, setDate] = useState('');
  const [newCode, setNewCode] = useState('');

  const generateRandomCode = useCallback(() => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }, []);

  const load = useCallback(async () => {
    try {
      const res = await loginCodeService.getGlobalLoginCode();
      setCurrent(res.code || '');
      setDate(res.date || new Date().toLocaleDateString('vi-VN'));
      setNewCode(res.code || generateRandomCode());
    } catch (error) {
      console.error('Error loading global login code:', error);
      // If backend doesn't have endpoint, generate a random code locally
      const code = generateRandomCode();
      setCurrent(code);
      setDate(new Date().toLocaleDateString('vi-VN'));
      setNewCode(code);
    }
  }, [generateRandomCode]);

  useEffect(() => { load(); }, [load]);

  const update = async () => {
    try {
      const newCode = generateRandomCode();
      await loginCodeService.setGlobalLoginCode(newCode);
      await load();
    } catch (error) {
      console.error('Error setting global login code:', error);
      // Fallback to local update
      const newCode = generateRandomCode();
      setCurrent(newCode);
      setDate(new Date().toLocaleDateString('vi-VN'));
      setNewCode(newCode);
      alert(`Mã login đã được cập nhật (local): ${newCode}`);
    }
  };

  const updateManualCode = async () => {
    if (!newCode.trim()) {
      alert('Vui lòng nhập mã login');
      return;
    }

    try {
      await loginCodeService.setGlobalLoginCode(newCode);
      setCurrent(newCode);
      setDate(new Date().toLocaleDateString('vi-VN'));
      alert(`Mã login global đã được cập nhật: ${newCode}`);
      await load(); // Reload to confirm
    } catch (error) {
      console.error('Error setting global login code:', error);
      // Fallback to local update
      setCurrent(newCode);
      setDate(new Date().toLocaleDateString('vi-VN'));
      alert(`Mã login đã được cập nhật (local): ${newCode}`);
    }
  };

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Quản Lý Mã Login</h3>
        <button className="btn-secondary" onClick={load}>Làm mới</button>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <p className="text-sm text-gray-600">Mã Login Hôm Nay</p>
          <div className="bg-gray-50 border rounded p-3 flex items-center justify-between">
            <span className="font-mono text-sm">{current || '---'}</span>
            <span className="text-sm text-gray-500">{date || ''}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Tự động tạo mã ngẫu nhiên:</label>
            <button className="btn-secondary w-full" onClick={update}>Tạo Mã Ngẫu Nhiên</button>
          </div>
          <div>
            <label className="text-sm text-gray-600">Nhập mã login thủ công:</label>
            <input
              className="input-field font-mono"
              placeholder="Nhập mã login..."
              value={newCode}
              onChange={e=>setNewCode(e.target.value)}
            />
            <button className="btn-primary w-full mt-2" onClick={updateManualCode}>Cập Nhật Mã Thủ Công</button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
          <p><strong>Hướng dẫn:</strong></p>
          <p>• Chọn "Tạo Mã Ngẫu Nhiên" để tự động tạo mã 6 ký tự</p>
          <p>• Hoặc nhập mã thủ công và chọn "Cập Nhật Mã Thủ Công"</p>
          <p>• User chỉ có thể lấy mã 1 lần/ngày</p>
          <p>• Số lần lấy tối đa = số ngày còn lại của key</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginCode;


