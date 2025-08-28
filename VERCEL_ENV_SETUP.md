# 🔧 Vercel Environment Variables Setup

## ⚠️ IMPORTANT: Set These Environment Variables in Vercel

You need to add these environment variables to your Vercel project:

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Select your project: **`api-functions`**
- Go to **Settings** → **Environment Variables**

### 2. Add These Variables

#### DATABASE_URL
```
postgresql://neondb_owner:npg_lEY8HNmnJPD1@ep-cold-pond-adcd7iz7-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

#### NEON_DATABASE_URL (backup)
```
postgresql://neondb_owner:npg_lEY8HNmnJPD1@ep-cold-pond-adcd7iz7-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

#### JWT_SECRET
```
aivannang-super-secret-jwt-key-2024-make-it-very-long-and-secure-for-production
```

### 3. Apply to All Environments
- Make sure to set these for: **Production**, **Preview**, and **Development**

### 4. Redeploy After Setting Variables
After adding the environment variables, redeploy your project:
```bash
cd api-functions
vercel --prod
```

## ✅ Your Database is Ready!

### 📊 Database Summary:
- **Connection**: ✅ Working with Neon PostgreSQL
- **Tables**: ✅ Initialized (users, keys, tokens, etc.)
- **Default Keys**: ✅ 6 keys ready for redemption
- **Admin User**: ✅ Created (username: admin, password: admin123456)

### 🔑 Available Redemption Keys:
- `KEY-DEMO2024` → 100 credits
- `KEY-TEST1234` → 50 credits  
- `KEY-SAMPLE99` → 75 credits
- `KEY-STARTER01` → 25 credits
- `KEY-WELCOME88` → 150 credits
- `KEY-BONUS777` → 200 credits

### 🚀 API Endpoints:
- **Backend URL**: `https://api-functions-i8xuva743-khanhs-projects-3f746af3.vercel.app`
- **Register**: `/api/auth/register` (saves to database)
- **Login**: `/api/auth/login` (checks database)
- **Redeem**: `/api/keys/redeem` (updates user credits)

### 📱 Management Commands:
```bash
cd database

# View statistics
node manage-db.js stats

# List users  
node manage-db.js list-users

# List keys
node manage-db.js list-keys

# Add new keys
node manage-db.js add-keys
```

---

**Once you set the environment variables in Vercel, your app will have full database functionality with persistent user data, credit tracking, and key redemption!**