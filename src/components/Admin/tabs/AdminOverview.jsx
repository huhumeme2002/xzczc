import React, { useEffect, useState } from 'react';
import { adminService } from '../../../services/api';

const StatCard = ({ title, value, sub }) => (
  <div className="card dark:bg-gray-800 dark:border-gray-700">
    <div className="text-center py-5">
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      {sub ? <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sub}</p> : null}
    </div>
  </div>
);

const AdminOverview = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    total_requests: 0,
  });
  const [tokenUsage, setTokenUsage] = useState({ used: 0, total: 0 });
  const [keysRedeemed, setKeysRedeemed] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // Try to load dashboard data, but provide fallbacks if endpoints don't exist
        try {
          const dash = await adminService.getDashboard();
          setStats(dash?.stats || { total_users: 0, active_users: 0, total_requests: 0 });
        } catch (error) {
          console.error('Error loading dashboard stats:', error);
          setStats({ total_users: 0, active_users: 0, total_requests: 0 });
        }

        try {
          const allTokens = await adminService.getUploadedTokens({});
          const usedTokens = await adminService.getUploadedTokens({ status: 'used' });
          setTokenUsage({
            used: usedTokens?.pagination?.total || 0,
            total: allTokens?.pagination?.total || 0
          });
        } catch (error) {
          console.error('Error loading token stats:', error);
          setTokenUsage({ used: 0, total: 0 });
        }

        try {
          const keysRes = await adminService.getKeys({ status: 'used', page: 1, limit: 1 });
          setKeysRedeemed(keysRes?.pagination?.total || 0);
        } catch (error) {
          console.error('Error loading keys stats:', error);
          setKeysRedeemed(0);
        }

      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  const tokenPercent = tokenUsage.total > 0 ? Math.round((tokenUsage.used / tokenUsage.total) * 100) : 0;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Tổng Người Dùng" value={stats.total_users} />
        <StatCard title="Người Dùng Hoạt Động" value={stats.active_users} sub="30 ngày qua" />
        <StatCard title="Key Đã Đổi" value={keysRedeemed} />
        <StatCard title="Token Sử Dụng" value={`${tokenUsage.used} / ${tokenUsage.total}`} sub={`${tokenPercent}% đã sử dụng`} />
      </div>
    </div>
  );
};

export default AdminOverview;


