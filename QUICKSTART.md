# 🚀 Quick Start Guide

## Bước 1: Setup Backend

```bash
cd backend
npm install
npm run init-db
npm start
```

Backend sẽ chạy trên: http://localhost:5000

## Bước 2: Setup Frontend

Mở terminal mới:

```bash
cd frontend
npm install
npm start
```

Frontend sẽ chạy trên: http://localhost:3000

## Bước 3: Test Hệ Thống

Mở terminal mới:

```bash
# Test backend API
node test-full.js
```

## Bước 4: Sử Dụng

1. **Truy cập**: http://localhost:3000
2. **Đăng ký**: Tạo tài khoản mới
3. **Nhập Key**: Sử dụng format `KEY-XXXXXXXXXX` (ví dụ: `KEY-TEST123456`)
4. **Generate Token**: Sử dụng credits để tạo token

## ✅ Key Examples để Test:

- `KEY-ABC123DEF456`
- `KEY-TESTKEY123`
- `KEY-SAMPLE999`
- `KEY-DEMO12345678`

## 🔧 Configuration

Mặc định:
- 1 key = 100 credits
- 1 token = 10 credits

Có thể thay đổi trong `backend/.env`

## 🎯 API Endpoints

- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập  
- `POST /api/keys/redeem` - Đổi key thành credit
- `POST /api/tokens/generate` - Tạo token từ credit

## 🐛 Troubleshooting

**Backend không start:**
```bash
cd backend
rm database/app.db
npm run init-db
npm start
```

**Frontend lỗi dependencies:**
```bash
cd frontend  
rm -rf node_modules package-lock.json
npm install
npm start
```

**Port bị chiếm:**
- Backend: Thay đổi PORT trong `.env`
- Frontend: Sử dụng port khác khi được hỏi
