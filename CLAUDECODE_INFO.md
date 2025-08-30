# 📋 **THÔNG TIN DATABASE CHO CLAUDECODE**

## 🔗 **Database Connection:**
```
postgresql://neondb_owner:npg_67BPVAIWZEDg@ep-wispy-fog-adt9noug-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## 👥 **Current Users (6 total):**
1. **admin** - admin@admin.com - Role: admin - Requests: 850
2. **user1** - user1@example.com - Role: user - Requests: 50
3. **user2** - user2@example.com - Role: user - Requests: 50
4. **vipuser** - vip@example.com - Role: user - Requests: 100
5. **testuser** - test@example.com - Role: user - Requests: 100
6. **khanhdx23** - gosuzed48@gmail.com - Role: admin - Requests: 350

## 🗝️ **Keys Format:**
- VIP-XXXX-XXXX (premium keys)
- KEY-XXXXXXXXXX (regular keys)
- Total: 12-15 keys available

## 📊 **API Endpoints Working:**
- ✅ `/api/auth/login` - JWT authentication
- ✅ `/api/auth/register` - User registration
- ✅ `/api/admin/users` - User management
- ✅ `/api/admin/keys` - Key management
- ✅ `/api/redeem-key` - Key redemption (+requests)
- ✅ `/api/get-token` - Token generation (-50 requests)
- ✅ `/api/user/profile` - User profile data
- ✅ `/api/user-transactions` - Transaction history

## 🎨 **Frontend Features:**
- React 18 with Hooks
- Admin Dashboard (user/key management)
- User Dashboard (redeem tokens)
- Real-time refresh functionality
- JWT Authentication
- Responsive design
- Tailwind CSS styling

## 🗄️ **Database Schema:**
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  password_hash TEXT,
  requests INTEGER DEFAULT 0,
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NULL
);

-- Keys table
CREATE TABLE keys (
  id SERIAL PRIMARY KEY,
  key_value VARCHAR(255) UNIQUE,
  requests INTEGER DEFAULT 0,
  is_used BOOLEAN DEFAULT false,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Request transactions
CREATE TABLE request_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  requests_amount INTEGER,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 **Production URLs:**
- Frontend: https://xzczc-tt7n.vercel.app
- Backend: https://api-functions-q81r2sspq-khanhs-projects-3f746af3.vercel.app

## 🛠️ **Tech Stack:**
- **Frontend**: React 18, Tailwind CSS, Axios, JWT
- **Backend**: Node.js, Vercel Serverless, PostgreSQL
- **Database**: Neon PostgreSQL (Cloud)
- **Deployment**: Vercel (Frontend + Backend)

---

## 💡 **Quick Database Queries:**

```sql
-- View all users
SELECT username, email, requests, role, is_active FROM users ORDER BY created_at DESC;

-- View all keys
SELECT key_value, requests, is_used FROM keys ORDER BY created_at DESC;

-- View recent transactions
SELECT u.username, t.requests_amount, t.description, t.created_at
FROM request_transactions t
JOIN users u ON t.user_id = u.id
ORDER BY t.created_at DESC LIMIT 10;
```

**🎯 Copy thông tin này để share với ClaudeCode!**
