# 🛡️ Admin Panel & Analytics Dashboard

Hệ thống đã được nâng cấp với **Admin Panel** và **Analytics Dashboard** hoàn chỉnh để quản lý và theo dõi toàn bộ hệ thống.

## 🚀 Tính Năng Admin Mới

### 1. 🔐 Admin Authentication
- **Role-based Access Control**: Phân quyền user/admin
- **Admin Middleware**: Bảo vệ các endpoint admin
- **Secure Admin Routes**: Chỉ admin mới truy cập được

### 2. 👥 User Management
- **Xem danh sách users** với phân trang
- **Tìm kiếm users** theo username/email
- **Bật/tắt trạng thái** user (active/inactive)
- **Thay đổi role** user (user ↔ admin)
- **Điều chỉnh credits** cho user
- **Xem chi tiết user** với transaction history

### 3. 📊 Analytics Dashboard
- **System Overview**:
  - Tổng số users đăng ký
  - Users hoạt động (30 ngày qua)
  - Tổng keys đã redeem
  - Tổng tokens đã generate
  - Tổng credits trong hệ thống

- **Charts & Visualizations**:
  - Biểu đồ daily key redemptions (7 ngày)
  - Biểu đồ popular keys (top sử dụng)
  - Top users by credits
  - Recent activity feed

- **Detailed Analytics**:
  - Key usage trends theo thời gian
  - Token generation statistics
  - User activity patterns
  - Credit flow tracking

## 🎯 Cách Sử Dụng Admin Panel

### Bước 1: Tạo Admin User
```bash
cd backend
npm run create-admin
```

**Admin Credentials mặc định:**
- Username: `admin`
- Password: `admin123456`
- ⚠️ **Quan trọng**: Đổi password sau lần đăng nhập đầu tiên!

### Bước 2: Truy Cập Admin Panel
1. Đăng nhập với admin account
2. Nhấn **"Admin Panel"** ở header (chỉ hiện với admin)
3. Hoặc truy cập trực tiếp: http://localhost:3000/admin

### Bước 3: Quản Lý System
- **Dashboard**: Xem tổng quan và analytics
- **User Management**: Quản lý users
- **System Settings**: Điều chỉnh system parameters

## 🔧 Admin API Endpoints

### User Management
```bash
GET    /api/admin/users                    # Danh sách users
GET    /api/admin/users/:userId            # Chi tiết user
GET    /api/admin/users/search/:query      # Tìm kiếm users
PUT    /api/admin/users/:userId/status     # Bật/tắt user
PUT    /api/admin/users/:userId/role       # Thay đổi role
POST   /api/admin/users/:userId/credits    # Điều chỉnh credits
```

### Analytics
```bash
GET    /api/analytics/stats                # System statistics
GET    /api/analytics/daily-stats          # Daily usage stats
GET    /api/analytics/popular-keys         # Popular keys
GET    /api/analytics/top-users            # Top users
GET    /api/analytics/recent-activity      # Recent activities
GET    /api/analytics/report               # Comprehensive report
GET    /api/analytics/key-trends           # Key usage trends
GET    /api/analytics/token-stats          # Token statistics
```

## 📈 Analytics Features

### 1. Real-time System Stats
```javascript
{
  "totalUsers": 156,
  "activeUsers": 47,
  "totalKeysRedeemed": 1245,
  "totalTokensGenerated": 892,
  "totalCreditsInSystem": 45670
}
```

### 2. Daily Activity Tracking
- Biểu đồ line chart theo dõi key redemptions hàng ngày
- Có thể xem từ 1-365 ngày
- Fill missing dates với giá trị 0

### 3. Popular Keys Analysis
```javascript
{
  "key_value": "KEY-POPULAR123",
  "usage_count": 45,
  "total_credits_awarded": 4500,
  "last_used": "2025-08-25T10:30:00Z"
}
```

### 4. User Activity Monitoring
- Top users theo credits
- Số lượng keys redeemed per user
- Tokens generated per user
- User registration trends

### 5. Financial Tracking
- Total credits issued
- Credits consumed (tokens)
- Credit balance per user
- Admin credit adjustments

## 🛠️ Database Schema Updates

### Users Table - New Fields
```sql
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';
ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT 1;
ALTER TABLE users ADD COLUMN last_login DATETIME;
```

### New Analytics Functions
- `getSystemStats()` - System overview
- `getDailyStats(days)` - Daily activity
- `getPopularKeys(limit)` - Popular keys
- `getTopUsers(limit)` - Top users
- `getRecentActivity(limit)` - Recent activities

## 🔒 Security Features

### Admin-Only Access
```javascript
// Middleware kiểm tra admin role
const requireAdmin = async (req, res, next) => {
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  // ...continue
};
```

### Rate Limiting
- Admin endpoints có rate limiting riêng
- Protect against abuse
- Monitor admin actions

### Audit Trail
- Tất cả admin actions được log
- Credit adjustments tracked
- User status changes recorded

## 🎨 Frontend Features

### Admin Dashboard UI
- **Responsive Design**: Hoạt động tốt trên mọi thiết bị
- **Interactive Charts**: Sử dụng Recharts library
- **Real-time Data**: Auto-refresh statistics
- **Beautiful Icons**: Lucide React icons
- **Professional Layout**: Tailwind CSS styling

### User Experience
- **Role-based Navigation**: Admin link chỉ hiện với admin
- **Access Control**: Non-admin users không thể truy cập
- **Loading States**: Professional loading indicators
- **Error Handling**: Graceful error messages
- **Responsive Tables**: Mobile-friendly data display

## 🚀 Deployment Considerations

### Environment Variables
```bash
# Production admin settings
ADMIN_DEFAULT_PASSWORD=secure-random-password
ENABLE_ADMIN_PANEL=true
ANALYTICS_CACHE_TTL=300
```

### Security Checklist
- [ ] Change default admin password
- [ ] Enable HTTPS in production
- [ ] Set proper CORS origins
- [ ] Configure rate limiting
- [ ] Enable audit logging
- [ ] Regular security updates

## 🔍 Monitoring & Maintenance

### System Health
- Monitor user activity patterns
- Track key redemption rates
- Watch for unusual patterns
- Regular database maintenance

### Performance
- Analytics queries optimized với indexes
- Caching for frequently accessed data
- Pagination for large datasets
- Efficient chart data loading

## 🎉 What's Next?

Với Admin Panel và Analytics Dashboard hoàn chỉnh, bạn có thể:

1. **Monitor System Performance**: Theo dõi usage patterns
2. **Manage Users Effectively**: Quản lý user lifecycle
3. **Make Data-Driven Decisions**: Dựa trên analytics data
4. **Scale System**: Hiểu được usage để scale properly
5. **Detect Issues Early**: Monitor cho unusual activity

## 💡 Feature Suggestions

Bạn có muốn tôi thêm những tính năng nào khác không?

- **📧 Email Notifications**: Gửi email khi có admin actions
- **🔔 Real-time Alerts**: WebSocket notifications
- **📄 Export Data**: Export analytics reports
- **🎨 Customizable Dashboard**: User-configurable widgets
- **🔐 2FA for Admin**: Two-factor authentication
- **📱 Mobile Admin App**: React Native version
- **🤖 Automated Actions**: Rule-based system actions
- **🔍 Advanced Search**: Full-text search capabilities

---

**🎊 Chúc mừng!** Bạn đã có một hệ thống quản lý hoàn chỉnh với Admin Panel và Analytics Dashboard cấp enterprise! 🚀
