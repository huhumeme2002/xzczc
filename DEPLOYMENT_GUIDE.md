# Hướng dẫn Deploy lên Vercel với Database Neon

## Bước 1: Chuẩn bị Database Neon

1. Đăng ký/đăng nhập [Neon Console](https://console.neon.tech/)
2. Tạo project mới
3. Copy connection string (dạng: `postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require`)

## Bước 2: Deploy Backend lên Vercel

1. Trong thư mục `backend/`, chạy:
   ```bash
   vercel
   ```

2. Thiết lập environment variables trên Vercel Dashboard:
   - `DATABASE_URL`: Connection string từ Neon
   - `JWT_SECRET`: Một chuỗi bí mật dài (có thể generate online)
   - `NODE_ENV`: `production`
   - `CORS_ORIGINS`: URL của frontend (ví dụ: `https://webcursor-frontend.vercel.app`)

3. Copy URL của backend (ví dụ: `https://webcursor-backend.vercel.app`)

## Bước 3: Deploy Frontend lên Vercel

1. Cập nhật `frontend/src/services/api.js` với URL backend đúng (đã làm rồi)

2. Trong thư mục `frontend/`, chạy:
   ```bash
   npm run build
   vercel
   ```

3. Thiết lập environment variables trên Vercel Dashboard:
   - `REACT_APP_API_URL`: URL của backend + `/api` (ví dụ: `https://webcursor-backend.vercel.app/api`)
   - `NODE_ENV`: `production`

## Bước 4: Cập nhật CORS

1. Sau khi có URL frontend, cập nhật `CORS_ORIGINS` ở backend:
   - Vào Vercel Dashboard → Backend project → Settings → Environment Variables
   - Cập nhật `CORS_ORIGINS` với URL frontend thật

## Bước 5: Kiểm tra kết nối

1. Truy cập URL frontend
2. Test đăng ký/đăng nhập
3. Kiểm tra logs trên Vercel Dashboard nếu có lỗi

## Lỗi thường gặp:

### CORS Error
- Đảm bảo URL frontend đã được thêm vào `CORS_ORIGINS`
- Kiểm tra không có space thừa trong biến môi trường

### Database Connection Error
- Kiểm tra `DATABASE_URL` đúng format
- Đảm bảo database Neon đang hoạt động

### API Not Found
- Kiểm tra `REACT_APP_API_URL` có `/api` ở cuối
- Đảm bảo backend đã deploy thành công

## Commands hữu ích:

```bash
# Test backend local
cd backend && npm run dev

# Test frontend local  
cd frontend && npm start

# Build frontend
cd frontend && npm run build

# Deploy cả 2
vercel --prod
```
