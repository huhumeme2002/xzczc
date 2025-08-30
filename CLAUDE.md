# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (new-frontend/)
```bash
cd new-frontend
npm install
npm start          # Start development server
npm run build      # Build for production
npm test           # Run React tests
```

### Backend (api-functions/)
```bash
cd api-functions
npm install
vercel dev         # Start local development server
vercel --prod      # Deploy to production

# Database testing/debugging
node check-schema.js       # Check database schema
node inspect-db-all.js     # Inspect all database tables
node test-db-local.js      # Test database connection
node fix-admin-password.js # Reset admin password
```

## Architecture

This is a full-stack key-to-credit management system with React frontend and Node.js serverless backend.

### High-Level Structure
- **Frontend**: React 18 app with Tailwind CSS, deployed on Vercel
- **Backend**: Node.js serverless functions on Vercel with PostgreSQL database
- **Database**: Neon PostgreSQL with 3 main tables: users, keys, request_transactions

### Key Components

#### Frontend (new-frontend/)
- **AuthContext**: Global authentication state management using React Context
- **Protected Routes**: Route protection based on user roles (admin/user)
- **Component Architecture**: 
  - Admin dashboard with tabbed interface for user/key/analytics management
  - User dashboard for token generation and transaction history
  - Reusable layout components with header navigation

#### Backend (api-functions/)
- **Serverless Functions**: Each API endpoint is a separate Vercel function
- **Admin Middleware**: JWT-based authentication with role checking for admin endpoints
- **Database Layer**: PostgreSQL connection pooling with prepared statements
- **API Routing**: Complex Vercel rewrites mapping REST paths to function files

### Database Schema
- **users**: Authentication, credits (requests), roles, expiration dates
- **keys**: Redeemable keys that add credits to user accounts
- **request_transactions**: Audit trail of all credit changes

### Security Model
- JWT authentication with role-based access control
- Admin-only endpoints protected by middleware
- CORS configured for specific frontend domain
- Password hashing with bcryptjs

### API Patterns
- RESTful design with consistent error handling
- Admin endpoints prefixed with `/api/admin/`
- Authentication required for most endpoints
- JSON request/response format throughout

### File Naming Conventions
- API functions use kebab-case: `admin-users.js`, `login-db.js`
- React components use PascalCase: `AdminDashboard.js`, `CursorProLayout.js`
- Database scripts use kebab-case: `check-schema.js`, `test-db-local.js`