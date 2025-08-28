# Key-to-Credit Web Application

Một ứng dụng web fullstack cho phép người dùng đăng ký/đăng nhập, nhập key để quy đổi thành credit, và sử dụng credit để generate token.

## 🚀 Tính Năng

- **Authentication System**: Đăng ký/đăng nhập với JWT tokens
- **Key Redemption**: Nhập key để quy đổi thành credits
- **Credit Management**: Theo dõi số dư credit của user
- **Token Generation**: Sử dụng credit để generate tokens
- **Transaction History**: Theo dõi lịch sử giao dịch và tokens
- **Responsive Design**: Giao diện thân thiện trên mọi thiết bị

## 🛠 Tech Stack

### Backend
- **Node.js** với Express.js
- **SQLite** database
- **JWT** authentication
- **bcrypt** password hashing
- **Rate limiting** và security middleware

### Frontend
- **React 18** với hooks
- **React Router** cho navigation
- **Tailwind CSS** cho styling
- **Axios** cho API calls
- **React Hot Toast** cho notifications
- **Lucide React** cho icons

## 📋 Cài Đặt

### Yêu Cầu Hệ Thống
- Node.js (v16 hoặc cao hơn)
- npm hoặc yarn
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd WebCurSor
```

### 2. Setup Backend

#### Cài đặt dependencies
```bash
cd backend
npm install
```

#### Tạo database
```bash
npm run init-db
```

#### Chạy backend server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Backend sẽ chạy trên port 5000: http://localhost:5000

### 3. Setup Frontend

#### Cài đặt dependencies
```bash
cd ../frontend
npm install
```

#### Chạy frontend
```bash
npm start
```

Frontend sẽ chạy trên port 3000: http://localhost:3000

## 🔧 Cấu Hình

### Backend Environment Variables (.env)
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_PATH=./database/app.db
NODE_ENV=development

# Key to credit conversion rates
KEY_CREDIT_RATE=100
# Example: 1 key = 100 credits

# Token generation cost
TOKEN_COST=10
# Example: generating 1 token costs 10 credits
```

### Key Format
Keys phải có format: `KEY-XXXXXXXXXX` (bắt đầu bằng "KEY-" theo sau là các ký tự alphanumeric)

Ví dụ key hợp lệ:
- `KEY-ABC123DEF456`
- `KEY-TESTKEY123`
- `KEY-1234567890AB`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký user mới
- `POST /api/auth/login` - Đăng nhập

### Keys & Credits
- `POST /api/keys/redeem` - Redeem key để nhận credit
- `GET /api/keys/balance` - Lấy số dư credit
- `GET /api/keys/transactions` - Lấy lịch sử giao dịch

### Tokens
- `POST /api/tokens/generate` - Generate token mới
- `GET /api/tokens/history` - Lấy lịch sử tokens
- `GET /api/tokens/cost` - Lấy thông tin cost

### Utility
- `GET /health` - Health check

## 🎯 Cách Sử Dụng

1. **Đăng ký tài khoản**: Truy cập http://localhost:3000 và tạo tài khoản mới
2. **Đăng nhập**: Sử dụng username/password để đăng nhập
3. **Redeem Key**: Nhập key có format `KEY-XXXXXXXXXX` để nhận credit
4. **Generate Token**: Sử dụng credit để generate token
5. **Theo dõi lịch sử**: Xem lại các giao dịch và tokens đã tạo

## 🔒 Bảo Mật

- JWT authentication với expiration
- Password hashing bằng bcrypt
- Rate limiting cho API endpoints
- CORS configuration
- Helmet.js security headers
- Input validation và sanitization

## 🗄 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  credits INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Used Keys Table
```sql
CREATE TABLE used_keys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key_value TEXT UNIQUE NOT NULL,
  user_id INTEGER,
  credits_awarded INTEGER,
  used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

### Generated Tokens Table
```sql
CREATE TABLE generated_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  token_value TEXT NOT NULL,
  credits_used INTEGER,
  generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  is_active BOOLEAN DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

### Credit Transactions Table
```sql
CREATE TABLE credit_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  transaction_type TEXT NOT NULL, -- 'key_redeem', 'token_generate', 'admin_adjust'
  amount INTEGER NOT NULL, -- positive for credit, negative for debit
  description TEXT,
  reference_id TEXT, -- key_value or token_id
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## 🚀 Deployment

### Backend Deployment
1. Upload code lên server
2. Cài đặt dependencies: `npm install --production`
3. Tạo database: `npm run init-db`
4. Setup environment variables trong production
5. Sử dụng PM2 để chạy: `pm2 start server.js`

### Frontend Deployment
1. Build production: `npm run build`
2. Upload thư mục `build/` lên web server
3. Configure nginx/apache để serve static files

### Environment Variables cho Production
```env
NODE_ENV=production
JWT_SECRET=very-secure-random-string-at-least-32-characters
DB_PATH=/path/to/production/database.db
PORT=5000
```

## 🐛 Troubleshooting

### Common Issues

1. **Database không tạo được**
   ```bash
   # Xóa và tạo lại database
   rm backend/database/app.db
   cd backend && npm run init-db
   ```

2. **Frontend không connect được backend**
   - Kiểm tra backend có đang chạy trên port 5000
   - Kiểm tra CORS configuration trong server.js

3. **JWT Token expired**
   - Logout và login lại
   - Token có thời hạn 24 giờ

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

Nếu gặp vấn đề, hãy tạo issue trong repository hoặc liên hệ developer.
