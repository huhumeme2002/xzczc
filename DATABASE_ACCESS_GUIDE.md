# 🚀 **HƯỚNG DẪN TRUY CẬP DATABASE CHO CLAUDECODE**

## 🎯 **Mục đích:**
Để ClaudeCode có thể truy cập và xem data trong database để code tiếp tục

---

## 📋 **THÔNG TIN DATABASE CỦA BẠN:**

### **1. Neon Database Details**
```
🌐 Provider: Neon PostgreSQL
🔗 URL: https://console.neon.tech
📍 Region: us-east-1 (N. Virginia)
🗄️ Database Name: neondb
👤 Username: neondb_owner
```

### **2. Connection String**
```bash
postgresql://neondb_owner:npg_67BPVAIWZEDg@ep-wispy-fog-adt9noug-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### **3. Current Data Structure**

#### **Users Table:**
```sql
-- Có 6 users trong database
SELECT id, username, email, requests, role, is_active,
       TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI') as created_at,
       CASE
         WHEN expires_at IS NULL THEN 'Không giới hạn'
         ELSE TO_CHAR(expires_at, 'DD/MM/YYYY HH24:MI')
       END as expiry_status
FROM users
ORDER BY created_at DESC;
```

**Current Users:**
1. **admin** - `admin@admin.com` - Role: admin - 850 requests
2. **user1** - `user1@example.com` - Role: user - 50 requests
3. **user2** - `user2@example.com` - Role: user - 50 requests
4. **vipuser** - `vip@example.com` - Role: user - 100 requests
5. **testuser** - `test@example.com` - Role: user - 100 requests
6. **khanhdx23** - `gosuzed48@gmail.com` - Role: admin - 350 requests

#### **Keys Table:**
```sql
-- Có khoảng 12-15 keys
SELECT id, key_value, requests, is_used,
       TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI') as created_at
FROM keys
ORDER BY created_at DESC;
```

#### **Request Transactions:**
```sql
-- Lịch sử giao dịch +/- requests
SELECT t.id, u.username, t.requests_amount, t.description,
       TO_CHAR(t.created_at, 'DD/MM/YYYY HH24:MI') as transaction_time
FROM request_transactions t
JOIN users u ON t.user_id = u.id
ORDER BY t.created_at DESC
LIMIT 20;
```

---

## 🔧 **CÁCH TRUY CẬP DATABASE:**

### **PHƯƠNG PHÁP 1: Neon Web Console (Dễ nhất)**
```
1. 🌐 Vào: https://console.neon.tech
2. 🔐 Login với tài khoản của bạn
3. 📁 Chọn project "WebCurSor"
4. 🖥️ Click "SQL Editor" ở sidebar bên trái
5. 💻 Viết và chạy SQL queries trực tiếp
```

### **PHƯƠNG PHÁP 2: Command Line (psql)**
```bash
# Windows: Download PostgreSQL từ postgresql.org
# Sau đó chạy:
psql "postgresql://neondb_owner:npg_67BPVAIWZEDg@ep-wispy-fog-adt9noug-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### **PHƯƠNG PHÁP 3: Database GUI Tools**
- **DBeaver**: Free, universal database tool
- **pgAdmin**: Official PostgreSQL GUI
- **TablePlus**: Modern database client

---

## 📊 **QUERIES CẦN CHẠY CHO CLAUDECODE:**

### **1. Xem tất cả Users:**
```sql
SELECT
  id,
  username,
  email,
  requests,
  role,
  is_active,
  TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI') as created_at,
  CASE
    WHEN expires_at IS NULL THEN 'Không giới hạn'
    ELSE TO_CHAR(expires_at, 'DD/MM/YYYY HH24:MI')
  END as expiry_status
FROM users
ORDER BY created_at DESC;
```

### **2. Xem tất cả Keys:**
```sql
SELECT
  id,
  key_value,
  requests,
  is_used,
  TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI') as created_at,
  CASE
    WHEN created_by IS NULL THEN 'System'
    ELSE (SELECT username FROM users WHERE id = keys.created_by)
  END as created_by_user
FROM keys
ORDER BY created_at DESC;
```

### **3. Xem lịch sử giao dịch gần đây:**
```sql
SELECT
  t.id,
  u.username,
  t.requests_amount,
  t.description,
  TO_CHAR(t.created_at, 'DD/MM/YYYY HH24:MI') as transaction_time
FROM request_transactions t
JOIN users u ON t.user_id = u.id
ORDER BY t.created_at DESC
LIMIT 50;
```

### **4. Thống kê hệ thống:**
```sql
-- Tổng quan
SELECT
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM users WHERE is_active = true) as active_users,
  (SELECT SUM(requests) FROM users) as total_requests_in_system,
  (SELECT COUNT(*) FROM keys) as total_keys,
  (SELECT COUNT(*) FROM keys WHERE is_used = false) as available_keys,
  (SELECT COUNT(*) FROM request_transactions) as total_transactions;

-- Hoạt động 24h qua
SELECT COUNT(*) as recent_transactions_24h
FROM request_transactions
WHERE created_at > NOW() - INTERVAL '24 hours';
```

---

## 💡 **THÔNG TIN CHO CLAUDECODE:**

### **Database Structure:**
```json
{
  "database": "neondb",
  "provider": "Neon PostgreSQL",
  "connection_string": "postgresql://neondb_owner:npg_67BPVAIWZEDg@ep-wispy-fog-adt9noug-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  "tables": {
    "users": {
      "count": 6,
      "sample_data": [
        {"id": 1, "username": "admin", "role": "admin", "requests": 850},
        {"id": 2, "username": "user1", "role": "user", "requests": 50}
      ]
    },
    "keys": {
      "count": "12-15",
      "sample_keys": ["VIP-xxx", "KEY-xxx", etc.]
    },
    "request_transactions": {
      "count": "50+",
      "types": ["key_redeem", "token_generate", "admin_adjust"]
    }
  }
}
```

### **API Endpoints Currently Working:**
- ✅ `/api/auth/login` - Đăng nhập
- ✅ `/api/auth/register` - Đăng ký
- ✅ `/api/admin/users` - Quản lý users
- ✅ `/api/admin/keys` - Quản lý keys
- ✅ `/api/redeem-key` - Đổi key
- ✅ `/api/get-token` - Lấy token
- ✅ `/api/user/profile` - Thông tin user
- ✅ `/api/user-transactions` - Lịch sử giao dịch

### **Frontend Features:**
- ✅ Admin Dashboard với user/key management
- ✅ User Dashboard với redeem/lấy token
- ✅ Real-time refresh functionality
- ✅ Responsive design
- ✅ JWT Authentication

---

## 🚀 **QUICK ACCESS:**

### **Truy cập nhanh:**
1. **Web Console**: https://console.neon.tech → SQL Editor
2. **Run query**: Copy các queries ở trên
3. **Export data**: Copy kết quả để share với ClaudeCode

### **Scripts để chạy:**
```bash
# Trong thư mục api-functions
node check-schema.js        # Check schema
node inspect-db-all.js      # Inspect all data
node test-db-local.js       # Test connection
```

---

## 📝 **INSTRUCTIONS FOR CLAUDECODE:**

```
Tôi có database PostgreSQL trên Neon với:
- 6 users (1 admin, 5 test users)
- 12-15 keys với format VIP-xxx, KEY-xxx
- 50+ transactions lịch sử +/- requests
- Tables: users, keys, request_transactions

Connection: postgresql://neondb_owner:npg_67BPVAIWZEDg@ep-wispy-fog-adt9noug-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

Current API endpoints: /api/auth/login, /api/admin/users, /api/redeem-key, etc.
Frontend: React + Admin Dashboard, User Dashboard with token system
```

**🎯 Bây giờ bạn có thể truy cập database và cung cấp thông tin chi tiết cho ClaudeCode!**
