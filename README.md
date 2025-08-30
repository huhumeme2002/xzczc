# 🚀 Key-to-Credit System - Production Ready

Hệ thống quản lý Key-to-Credit hoàn chỉnh với Admin Panel và Analytics Dashboard.

## 📁 Repository Structure

### 1. 🎨 **Frontend Repository**
**GitHub:** `https://github.com/huhumeme2002/xzczc`

#### **Tính năng chính:**
- ✅ **User Dashboard**: Hiển thị requests, redeem key, lấy token, lịch sử giao dịch
- ✅ **Admin Dashboard**: Quản lý users, keys, tokens, analytics
- ✅ **Authentication**: Login/Register với JWT
- ✅ **Responsive Design**: Hoạt động tốt trên mọi thiết bị
- ✅ **Real-time Updates**: Refresh data tự động và manual

#### **Công nghệ sử dụng:**
- **React 18** với Hooks
- **React Router** cho navigation
- **Tailwind CSS** cho styling
- **Axios** cho API calls
- **React Hot Toast** cho notifications
- **Lucide React** cho icons

#### **Cấu trúc thư mục:**
```
new-frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Admin/
│   │   │   ├── AdminDashboard.js
│   │   │   └── tabs/
│   │   │       ├── AdminUsers.jsx      # Quản lý users
│   │   │       ├── AdminTokens.jsx     # Quản lý keys & tokens
│   │   │       ├── AdminOverview.jsx   # Analytics dashboard
│   │   │       ├── AdminLoginCode.jsx  # Quản lý login code
│   │   │       └── AdminNotifications.jsx # Gửi thông báo
│   │   ├── Auth/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── ProtectedRoute.js
│   │   ├── Dashboard/
│   │   │   └── CursorProDashboard.js   # Dashboard chính
│   │   └── Layout/
│   │       ├── CursorProLayout.js
│   │       └── Header.js
│   ├── contexts/
│   │   └── AuthContext.js              # Quản lý authentication state
│   ├── services/
│   │   └── api.js                      # API service layer
│   └── config/
│       └── api.js                      # API configuration
├── package.json
├── tailwind.config.js
└── vercel.json
```

#### **Features nổi bật:**
- 🔄 **Auto/Manual Refresh**: Tự động cập nhật data khi load trang + nút refresh
- 👥 **User Management**: Bật/tắt user, đổi role, điều chỉnh requests, quản lý expiry date
- 🎫 **Key Management**: Tạo keys, upload Excel, quản lý tokens
- 📊 **Analytics**: Thống kê hệ thống, biểu đồ usage trends
- 🎯 **Token System**: Lấy token (-50 requests), hiển thị token + nút copy
- 📱 **Responsive**: Hoạt động hoàn hảo trên mobile/desktop
- 🛡️ **Security**: JWT authentication, protected routes

#### **Deployment:**
- **Platform**: Vercel
- **Domain**: `https://xzczc-tt7n.vercel.app`
- **Build Command**: `npm run build`
- **Node Version**: 18.x

---

### 2. ⚙️ **Backend API Repository**
**GitHub:** `https://github.com/huhumeme2002/backend`

#### **Tính năng chính:**
- ✅ **RESTful API**: Đầy đủ endpoints cho frontend
- ✅ **CORS Configured**: Hoạt động với frontend domain
- ✅ **JWT Authentication**: Bảo mật API với token
- ✅ **Database Integration**: PostgreSQL với connection pooling
- ✅ **Admin Middleware**: Bảo vệ admin-only endpoints
- ✅ **Error Handling**: Comprehensive error responses

#### **Công nghệ sử dụng:**
- **Node.js** với Vercel Serverless Functions
- **PostgreSQL** database
- **JWT** authentication
- **bcryptjs** password hashing
- **Connection Pooling** cho database

#### **API Endpoints:**

##### **Authentication:**
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký

##### **User Management:**
- `GET /api/admin/users` - Danh sách users (Admin)
- `PUT /api/admin/users/:id` - Cập nhật user (Admin)
- `GET /api/user/profile` - Thông tin user hiện tại
- `GET /api/user-transactions` - Lịch sử giao dịch

##### **Key & Token System:**
- `GET /api/admin/keys` - Danh sách keys (Admin)
- `POST /api/admin/keys` - Tạo key mới (Admin)
- `POST /api/redeem-key` - Đổi key lấy requests
- `POST /api/get-token` - Lấy token (-50 requests)
- `POST /api/admin/upload-tokens` - Upload Excel tokens

##### **Admin Features:**
- `GET /api/admin/analytics` - Thống kê hệ thống
- `POST /api/admin/notifications` - Gửi thông báo
- `GET /api/global-login-code` - Lấy mã login chung
- `POST /api/global-login-code` - Cập nhật mã login

##### **Utility:**
- `GET /health` - Health check
- `GET /api/test-cors` - Test CORS functionality

#### **Cấu trúc thư mục:**
```
api-functions/
├── api/
│   ├── admin-users.js          # User management APIs
│   ├── admin-keys.js           # Key management APIs
│   ├── admin-analytics.js      # Analytics APIs
│   ├── admin-notifications.js  # Notification APIs
│   ├── user-profile.js         # User profile API
│   ├── login-db.js            # Authentication API
│   ├── register-db.js         # Registration API
│   ├── redeem-key.js          # Key redemption API
│   ├── get-token.js           # Token generation API
│   ├── global-login-code.js   # Global login code API
│   ├── test-cors.js           # CORS test endpoint
│   └── ... (other endpoints)
├── package.json
└── vercel.json                 # Vercel routing configuration
```

#### **Database Schema:**
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  requests INTEGER DEFAULT 0,
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NULL
);

-- Keys table
CREATE TABLE keys (
  id SERIAL PRIMARY KEY,
  key_value VARCHAR(255) UNIQUE NOT NULL,
  requests INTEGER DEFAULT 0,
  is_used BOOLEAN DEFAULT false,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Request transactions table
CREATE TABLE request_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  requests_amount INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **Security Features:**
- 🔐 **JWT Authentication** với expiration
- 🛡️ **CORS Protection** với specific origins
- 👑 **Admin Middleware** cho protected endpoints
- 🔒 **Input Validation** và sanitization
- 🚫 **Rate Limiting** cho API endpoints

#### **Deployment:**
- **Platform**: Vercel Serverless Functions
- **Domain**: `https://api-functions-q81r2sspq-khanhs-projects-3f746af3.vercel.app`
- **Database**: Neon PostgreSQL
- **Environment Variables**:
  - `DATABASE_URL`: PostgreSQL connection string
  - `JWT_SECRET`: JWT signing secret

---

## 🔗 **Links & Deployment Status**

### **Production URLs:**
- **Frontend**: https://xzczc-tt7n.vercel.app
- **Backend API**: https://api-functions-q81r2sspq-khanhs-projects-3f746af3.vercel.app

### **GitHub Repositories:**
- **Frontend**: https://github.com/huhumeme2002/xzczc
- **Backend**: https://github.com/huhumeme2002/backend

### **Demo Accounts:**
- **Admin**: `admin` / `admin123`
- **User**: `user1` / `123456`

---

## 🚀 **Quick Start**

### **1. Frontend Setup:**
```bash
cd new-frontend
npm install
npm start
# Frontend chạy trên http://localhost:3000
```

### **2. Backend Setup:**
```bash
cd api-functions
npm install
# Deploy lên Vercel hoặc chạy locally với Vercel CLI
```

### **3. Database:**
- Sử dụng Neon PostgreSQL
- Import schema từ files SQL trong repository

---

## 📊 **System Features Summary**

| Feature | Frontend | Backend | Status |
|---------|----------|---------|--------|
| User Authentication | ✅ | ✅ | Hoạt động |
| Admin Dashboard | ✅ | ✅ | Hoạt động |
| Key Management | ✅ | ✅ | Hoạt động |
| Token System | ✅ | ✅ | Hoạt động |
| Analytics | ✅ | ✅ | Hoạt động |
| Real-time Updates | ✅ | ✅ | Hoạt động |
| CORS Protection | ✅ | ✅ | Hoạt động |
| Mobile Responsive | ✅ | N/A | Hoạt động |
| Error Handling | ✅ | ✅ | Hoạt động |

---

## 🎯 **Architecture Overview**

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│   Frontend      │◄────────────────►│   Backend API   │
│   React App     │                  │   Vercel Func   │
│   (Vercel)      │                  │                 │
└─────────────────┘                  └─────────────────┘
         │                                   │
         └───────────────────────────────────┼─────────────────┐
                                             │                 │
                                   ┌─────────▼─────────┐       │
                                   │   PostgreSQL     │       │
                                   │   (Neon Cloud)   │       │
                                   └─────────────────┘       │
                                                             │
                                               User Database │
                                               Key Management│
                                               Transaction Logs │
                                               ┌───────────────┘
                                               │
                                               └─ JWT Tokens
                                               └─ Admin Sessions
                                               └─ API Keys
```

---

## 📞 **Support & Documentation**

- **Frontend Issues**: Check React DevTools console
- **API Issues**: Check Vercel function logs
- **Database Issues**: Check Neon dashboard
- **CORS Issues**: Test with `/api/test-cors` endpoint

---

**🎉 Hệ thống đã sẵn sàng production với đầy đủ tính năng!**
