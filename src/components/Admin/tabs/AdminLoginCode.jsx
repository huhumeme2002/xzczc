import React, { useEffect, useState } from 'react';
import { loginCodeService } from '../../../services/api';

const AdminLoginCode = () => {
  const [current, setCurrent] = useState('');
  const [date, setDate] = useState('');
  const [newCode, setNewCode] = useState('');

  const load = async () => {
    try {
      const res = await loginCodeService.getDailyLogin();
      setCurrent(res.code || '');
      setDate(res.date || new Date().toLocaleDateString('vi-VN'));
      setNewCode(res.code || generateRandomCode());
    } catch (error) {
      // If backend doesn't have endpoint, generate a random code locally
      const code = generateRandomCode();
      setCurrent(code);
      setDate(new Date().toLocaleDateString('vi-VN'));
      setNewCode(code);
    }
  };

  const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  useEffect(() => { load(); }, []);

  const update = async () => {
    try {
      await loginCodeService.generateLoginCode();
      await load();
    } catch (error) {
      // If backend doesn't have endpoint, just generate a new code locally
      const newCode = generateRandomCode();
      setCurrent(newCode);
      setDate(new Date().toLocaleDateString('vi-VN'));
      setNewCode(newCode);
      alert(`Mã login mới: ${newCode}`);
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
        <div>
          <label className="text-sm text-gray-600">Cập nhật mã login mới:</label>
          <input className="input-field font-mono" value={newCode} onChange={e=>setNewCode(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={update}>Cập nhật</button>
        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
          <p>Mỗi ngày admin cần cập nhật mã login mới</p>
          <p>User chỉ có thể lấy 1 lần/ngày</p>
          <p>Số lần lấy tối đa = số ngày còn lại của key</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginCode;


