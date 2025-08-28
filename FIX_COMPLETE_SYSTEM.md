# HƯỚNG DẪN KIỂM TRA HỆ THỐNG - 27/08/2025

## 🔍 KIỂM TRA WEBSITE

### 1. Website Frontend
- **URL chính**: https://aivannang.com
- **API Backend**: https://api-functions-blue.vercel.app

### 2. Đăng nhập Admin
```
URL: https://aivannang.com/login
Username: admin
Password: admin123
```

### 3. Các Users Test (mật khẩu: 123456)
- user1 (50 requests)
- user2 (100 requests)  
- user3 (200 requests)
- vipuser (500 requests)
- testuser (10 requests)

## ✅ CHỨC NĂNG ĐÃ HOẠT ĐỘNG

### Dashboard User
- ✅ Hiển thị số người dùng: 6 users
- ✅ Hiển thị requests của user
- ✅ Đổi key lấy requests

### Admin Dashboard
- ✅ Xem danh sách users (6 users)
- ✅ Xem danh sách keys (12 keys available)
- ✅ Tạo key mới
- ✅ Upload file Excel tokens

## 🛠️ TEST TRỰC TIẾP API

### Test 1: Kiểm tra users
```bash
curl https://api-functions-blue.vercel.app/api/check-all-users
```
Kết quả: Hiển thị 6 users

### Test 2: Login
```bash
curl -X POST https://api-functions-blue.vercel.app/api/login-db \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Test 3: Lấy danh sách keys (dùng token từ login)
```bash
curl https://api-functions-blue.vercel.app/api/admin-keys \
  -H "Authorization: Bearer [TOKEN]"
```

### Test 4: Đổi key
```bash
curl -X POST https://api-functions-blue.vercel.app/api/redeem-key \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"key":"VIP-XXX-XXX"}'
```

## 📝 CÁC VẤN ĐỀ ĐÃ SỬA

1. **JWT Secret thống nhất**: `unified-aivannang-secret-2024`
2. **Database schema**: Sử dụng column `requests` (không phải credits)
3. **API URL**: https://api-functions-blue.vercel.app
4. **Tạo users test**: 6 users trong database
5. **Keys**: 12 keys available để test

## 🚀 NẾU CẦN RESET

### Reset toàn bộ users:
```sql
-- Chỉ giữ lại admin
DELETE FROM users WHERE role != 'admin';
```

### Tạo lại users test:
```bash
curl -X POST https://api-functions-blue.vercel.app/api/create-test-users
```

### Tạo keys mới:
Login admin > Admin Dashboard > Keys > Create New Keys

---
**Status**: ✅ HỆ THỐNG HOẠT ĐỘNG BÌNH THƯỜNG
**Total Users**: 6
**Total Keys Available**: 11 (1 đã dùng để test)
**API Status**: ✅ ONLINE