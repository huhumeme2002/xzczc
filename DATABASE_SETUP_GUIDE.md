# 🗄️ Database Management Guide

## Setup Your Neon PostgreSQL Database

### 1. Create Neon Database

1. **Go to**: https://neon.tech
2. **Sign up/Login** with your account
3. **Create a new project**
4. **Copy your connection string** (looks like: `postgresql://username:password@host/database?sslmode=require`)

### 2. Configure Environment Variables

#### For Local Development:
Create a `.env` file in your project root:
```env
DATABASE_URL=postgresql://your-username:your-password@your-host/your-database?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
```

#### For Vercel Deployment:
1. **Go to Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. **Add these variables**:
   - `DATABASE_URL` = Your Neon connection string
   - `JWT_SECRET` = Your JWT secret key
   - `NEON_DATABASE_URL` = Same as DATABASE_URL (backup)

### 3. Initialize Your Database

```bash
# Navigate to database directory
cd database

# Install dependencies
npm install pg bcryptjs dotenv

# Initialize database tables
node manage-db.js init

# Test connection
node manage-db.js test

# Check database stats
node manage-db.js stats
```

### 4. Database Management Commands

```bash
# Create an admin user
node manage-db.js create-admin

# Add new redemption keys
node manage-db.js add-keys

# List all users
node manage-db.js list-users

# List all keys
node manage-db.js list-keys

# Show help
node manage-db.js help
```

## Database Schema Overview

### Tables Created:

1. **users** - User accounts and authentication
2. **keys** - Redemption keys for credits
3. **key_redemptions** - History of key usage
4. **tokens** - Generated tokens by users
5. **credit_transactions** - Credit earning/spending history
6. **admin_activities** - Admin action logs

### Key Features:

- ✅ **User Authentication** with bcrypt password hashing
- ✅ **Credit System** with transaction history
- ✅ **Key Redemption** with expiration and single-use
- ✅ **Token Generation** with credit costs
- ✅ **Admin Management** with role-based access
- ✅ **Analytics** with usage statistics

## API Endpoints Updated

Your new database-connected API endpoints:

- `POST /api/auth/register` - Register with database storage
- `POST /api/auth/login` - Login with database verification
- `POST /api/keys/redeem` - Redeem keys with database tracking

## Deployment Steps

### 1. Update Vercel Configuration

Add database dependency to your `api-functions/package.json`:

```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.11.3"
  }
}
```

### 2. Deploy Updated API

```bash
cd api-functions
vercel --prod
```

### 3. Update Frontend API URL

Update your frontend to use the new database-connected endpoints:

```javascript
// In frontend/src/services/api.js
const API_BASE_URL = 'https://your-new-api-url.vercel.app/api'
```

## Monitoring & Maintenance

### Daily Tasks:
- Monitor user registrations: `node manage-db.js stats`
- Check system health: `node manage-db.js test`

### Weekly Tasks:
- Review key usage: `node manage-db.js list-keys`
- Check user activity: `node manage-db.js list-users`

### Monthly Tasks:
- Add new redemption keys: `node manage-db.js add-keys`
- Review database performance in Neon dashboard

## Security Best Practices

1. **Never commit** `.env` files to version control
2. **Use strong** JWT secrets (50+ random characters)
3. **Regularly rotate** database passwords
4. **Monitor** unusual database activity
5. **Backup** your database regularly (Neon provides automatic backups)

## Troubleshooting

### Connection Issues:
```bash
# Test connection
node manage-db.js test

# Check environment variables
echo $DATABASE_URL
```

### Performance Issues:
- Check Neon dashboard for query performance
- Review database connection pool settings
- Monitor concurrent connection limits

---

**Your database is now ready for production use with full user management, credit tracking, and analytics!**