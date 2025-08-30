import React, { useEffect, useState, useCallback } from 'react';
import { adminService } from '../../../services/api';

const AdminTokens = () => {
  const [requestsPerKey, setRequestsPerKey] = useState(100);
  const [count, setCount] = useState(1);
  const [expiresInDays, setExpiresInDays] = useState('');
  const [description, setDescription] = useState('');
  const [excelFile, setExcelFile] = useState(null);
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [tokens, setTokens] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const loadTokens = useCallback(async () => {
    try {
      const params = { page, limit };
      if (status === 'available' || status === 'used' || status === 'expired') params.status = status;
      const res = await adminService.getUploadedTokens(params);
      setTokens(res.tokens || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error loading tokens:', error);
      setTokens([]);
      setTotalPages(1);
      alert('Không thể tải danh sách tokens: ' + (error.message || 'Lỗi không xác định'));
    }
  }, [status, page, limit]);

  useEffect(() => { loadTokens(); }, [loadTokens]);

  const handleCreateKeys = async () => {
    try {
      await adminService.createKeys({ requests: Number(requestsPerKey), count: Number(count), expiresInDays: expiresInDays ? Number(expiresInDays) : undefined, description });
      alert('Tạo keys thành công!');
      await loadTokens();
    } catch (error) {
      alert('Không thể tạo keys: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handleUpload = async () => {
    if (!excelFile) {
      alert('Vui lòng chọn file Excel');
      return;
    }
    try {
      const form = new FormData();
      form.append('excelFile', excelFile);
      await adminService.uploadTokens(form);
      alert('Upload tokens thành công!');
      setExcelFile(null);
      await loadTokens();
    } catch (error) {
      alert('Không thể upload tokens: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  return (
    <div className="space-y-8">
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Tạo Key Tùy Chỉnh</h3>
          <button onClick={handleCreateKeys} className="btn-primary">Tạo {count} key ({requestsPerKey} requests/key)</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
          <div>
            <label className="text-sm text-gray-600">Requests per key</label>
            <input className="input-field" type="number" value={requestsPerKey} onChange={e => setRequestsPerKey(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-600">Số lượng key</label>
            <input className="input-field" type="number" value={count} onChange={e => setCount(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-600">Hết hạn sau (ngày)</label>
            <input className="input-field" type="number" placeholder="Không giới hạn" value={expiresInDays} onChange={e => setExpiresInDays(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-600">Mô tả (tùy chọn)</label>
            <input className="input-field" placeholder="VD: Key cho khách hàng VIP" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Upload Token từ File Excel</h3>
        </div>
        <div className="p-4 space-y-3 text-sm text-gray-700">
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p>Định dạng file Excel đơn giản:</p>
            <p>• Chỉ cần Cột A: Token</p>
            <p>• Tự động: 50 requests mỗi token</p>
            <p>• Tự động: Không hết hạn</p>
            <p>Ví dụ: A1=abc123, A2=def456, A3=ghi789</p>
          </div>
          <div className="flex items-center space-x-3">
            <input type="file" onChange={e => setExcelFile(e.target.files?.[0])} />
            <button className="btn-primary" onClick={handleUpload}>Upload Tokens</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Danh sách Token</h3>
          <div className="space-x-2 text-sm">
            {['all','available','used','expired'].map(s => (
              <button key={s} onClick={()=>{setStatus(s);setPage(1);}} className={`btn-secondary ${status===s?'!bg-primary-100 !text-primary-700':''}`}>{s==='all'?'Tất cả':s==='available'?'Có sẵn':s==='used'?'Đã dùng':'Hết hạn'}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requests</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hết hạn</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tokens.map(t => (
                <tr key={t.id}>
                  <td className="px-3 py-2 font-mono text-sm">{t.token_value?.slice(0,2)+"..."}</td>
                  <td className="px-3 py-2 text-sm">{t.requests}</td>
                  <td className="px-3 py-2 text-sm">{t.is_used ? 'Đã dùng' : (t.is_expired ? 'Hết hạn' : 'Có sẵn')}</td>
                  <td className="px-3 py-2 text-sm">{t.expires_at ? new Date(t.expires_at).toLocaleDateString('vi-VN') : 'Không có'}</td>
                  <td className="px-3 py-2 text-sm">{t.used_by_username || '-'}</td>
                  <td className="px-3 py-2 text-sm">{t.created_at ? new Date(t.created_at).toLocaleTimeString('vi-VN') + ' ' + new Date(t.created_at).toLocaleDateString('vi-VN') : '-'}</td>
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
    </div>
  );
};

export default AdminTokens;


