# Key Credit System - Frontend

Một ứng dụng React hiện đại cho hệ thống quy đổi key thành credit và tạo token.

## 🌟 Tính năng

- **🔐 Authentication**: Đăng ký/đăng nhập với JWT tokens
- **🎫 Key Redemption**: Nhập key để quy đổi thành credits
- **💳 Token Generation**: Sử dụng credits để tạo tokens
- **📊 Dashboard**: Hiển thị thống kê và quản lý tài khoản
- **📱 Responsive Design**: Tương thích trên mọi thiết bị
- **🎨 Modern UI**: Thiết kế hiện đại với Tailwind CSS

## 🛠 Tech Stack

- **React 18** - UI Library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP Client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## 📋 Cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd new-frontend
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình môi trường
```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:
```env
REACT_APP_API_URL=https://your-api-url.vercel.app
```

### 4. Chạy ứng dụng
```bash
npm start
```

Ứng dụng sẽ chạy tại http://localhost:3000

## 🚀 Deployment

### Vercel (Recommended)
1. Push code lên GitHub
2. Connect repository với Vercel
3. Set environment variables:
   - `REACT_APP_API_URL`: URL của API backend

### Build Production
```bash
npm run build
```

## 📡 API Integration

Ứng dụng kết nối với các API endpoints sau:

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký

### Keys & Credits
- `POST /api/keys/redeem` - Redeem key
- `GET /api/keys/balance` - Lấy số dư

### Tokens
- `POST /api/generate-token` - Tạo token
- `POST /api/redeem-token` - Redeem token

## 📱 Responsive Design

Ứng dụng được thiết kế responsive cho:
- 📱 Mobile (320px+)
- 📺 Tablet (768px+)
- 🖥 Desktop (1024px+)

## 🔒 Security Features

- JWT authentication
- Protected routes
- Input validation
- XSS protection
- CSRF protection

## 🎯 User Flow

1. **Đăng ký/Đăng nhập** → Tạo tài khoản hoặc đăng nhập
2. **Dashboard** → Xem tổng quan tài khoản
3. **Redeem Key** → Nhập key để nhận credits
4. **Generate Token** → Sử dụng credits tạo token
5. **History** → Xem lịch sử giao dịch

## 🏗 Project Structure

```
src/
├── components/           # React components
│   ├── Auth/            # Authentication components
│   ├── Dashboard/       # Dashboard components
│   ├── KeyRedeem/       # Key redemption components
│   ├── Layout/          # Layout components
│   └── Tokens/          # Token generation components
├── contexts/            # React contexts
├── services/            # API services
├── config/              # Configuration files
└── styles/              # CSS files
```

## 🔧 Configuration

### Environment Variables
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_NAME`: Application name
- `REACT_APP_VERSION`: Application version

### API Configuration
File `src/config/api.js` chứa cấu hình API endpoints.

## 🎨 UI Components

### Reusable Classes
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style  
- `.btn-danger` - Danger button style
- `.input-field` - Input field style
- `.card` - Card container style
- `.badge` - Badge styles

## 📊 State Management

- **AuthContext**: Quản lý authentication state
- **Local Storage**: Lưu trữ tokens và user data
- **Component State**: Quản lý UI state

## 🔍 Debugging

### Development Tools
- React Developer Tools
- Network tab để debug API calls
- Console logs cho error tracking

### Common Issues
1. **CORS Error**: Kiểm tra API server CORS config
2. **401 Unauthorized**: Token expired, cần login lại
3. **Network Error**: Kiểm tra API URL và connection

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

---

**Phiên bản**: 1.0.0  
**Ngày cập nhật**: $(date)
