# 🚀 Hướng dẫn Setup Environment Variables trên Vercel

## Bước 1: Tạo Database trên Neon Console

1. **Truy cập:** https://console.neon.tech/
2. **Đăng ký/Đăng nhập** (free account)
3. **Tạo project mới:** Click "Create Project"
4. **Copy Connection String** (dạng như này):
   ```
   postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

## Bước 2: Setup Environment Variables cho Backend

1. **Truy cập:** https://vercel.com/dashboard
2. **Chọn project:** `backend` 
3. **Vào Settings:** Click tab "Settings"
4. **Environment Variables:** Scroll down tìm "Environment Variables"
5. **Add các biến sau:**

### Biến 1: DATABASE_URL
- **Key:** `DATABASE_URL`
- **Value:** Connection string từ Neon (bước 1)
- **Environment:** Production, Preview, Development (chọn tất cả)

### Biến 2: JWT_SECRET  
- **Key:** `JWT_SECRET`
- **Value:** `aivannang_jwt_secret_key_2024_super_long_and_secure_random_string`
- **Environment:** Production, Preview, Development

### Biến 3: NODE_ENV
- **Key:** `NODE_ENV` 
- **Value:** `production`
- **Environment:** Production

### Biến 4: CORS_ORIGINS
- **Key:** `CORS_ORIGINS`
- **Value:** `https://aivannang-8by4k10tw-khanhs-projects-3f746af3.vercel.app,https://aivannang.vn,https://www.aivannang.vn`
- **Environment:** Production, Preview, Development

## Bước 3: Redeploy Backend

Sau khi add xong environment variables:

1. **Quay lại project backend**
2. **Click "Deployments" tab**  
3. **Click "Redeploy" trên deployment mới nhất**

## Bước 4: Test

Sau khi redeploy xong (~1-2 phút), test:
- Truy cập: https://backend-77kvwkd2j-khanhs-projects-3f746af3.vercel.app/health
- Nên thấy: `{"status":"OK","timestamp":"...","environment":"production"}`

## ⚠️ Lưu ý:
- **Không share** DATABASE_URL và JWT_SECRET với ai
- **Environment Variables** sẽ có hiệu lực sau khi redeploy
- Nếu vẫn lỗi, check logs: `vercel logs <deployment-url>`
