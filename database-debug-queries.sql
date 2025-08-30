-- Debug queries để check database schema và data
-- Chạy những queries này trong psql để kiểm tra vấn đề

-- 1. Kiểm tra tables có tồn tại không
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'keys', 'request_transactions');

-- 2. Kiểm tra cấu trúc table users
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- 3. Kiểm tra cấu trúc table keys  
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'keys' 
ORDER BY ordinal_position;

-- 4. Kiểm tra cấu trúc table request_transactions
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'request_transactions' 
ORDER BY ordinal_position;

-- 5. Kiểm tra có user nào trong database không
SELECT id, username, requests FROM users LIMIT 5;

-- 6. Kiểm tra có key nào available không  
SELECT id, key_value, requests, is_used, expires_at 
FROM keys 
WHERE is_used = false 
LIMIT 5;

-- 7. Kiểm tra lịch sử transactions
SELECT user_id, requests_amount, description, created_at 
FROM request_transactions 
ORDER BY created_at DESC 
LIMIT 5;

-- 8. Create tables nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    requests INTEGER DEFAULT 0,
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE TABLE IF NOT EXISTS keys (
    id SERIAL PRIMARY KEY,
    key_value VARCHAR(255) UNIQUE NOT NULL,
    requests INTEGER NOT NULL DEFAULT 100,
    expires_at TIMESTAMP,
    is_used BOOLEAN DEFAULT false,
    used_by INTEGER REFERENCES users(id),
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS request_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    requests_amount INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Insert test data nếu cần
INSERT INTO keys (key_value, requests) 
VALUES ('KEY-TEST123456', 100)
ON CONFLICT (key_value) DO NOTHING;

-- 10. Check permissions
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasinserts,
    hasupdates,
    hasdeletes
FROM pg_tables 
WHERE tablename IN ('users', 'keys', 'request_transactions');
