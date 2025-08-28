-- Full Database Setup cho Key System với Expiry
-- Chạy trên Neon Console

-- 1. Tạo bảng users (nếu chưa có)
CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(50) UNIQUE NOT NULL,
  "email" VARCHAR(100) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "role" VARCHAR(20) DEFAULT 'user',
  "requests" INTEGER DEFAULT 0,
  "expiry_time" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  "is_expired" BOOLEAN DEFAULT FALSE,
  "is_active" BOOLEAN DEFAULT true,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "last_login" TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- 2. Tạo bảng predefined_keys
CREATE TABLE IF NOT EXISTS "predefined_keys" (
  "id" SERIAL PRIMARY KEY,
  "key_value" VARCHAR(255) UNIQUE NOT NULL,
  "credits_value" INTEGER NOT NULL,
  "expiry_hours" INTEGER DEFAULT NULL,
  "is_used" BOOLEAN DEFAULT FALSE,
  "used_by" INTEGER REFERENCES "users"("id") ON DELETE SET NULL,
  "used_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tạo bảng transactions  
CREATE TABLE IF NOT EXISTS "transactions" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER REFERENCES "users"("id") ON DELETE CASCADE,
  "transaction_type" VARCHAR(50) NOT NULL,
  "amount" INTEGER NOT NULL,
  "description" TEXT,
  "reference_id" VARCHAR(255),
  "key_created_by" INTEGER REFERENCES "users"("id") ON DELETE SET NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tạo bảng key_creations để theo dõi
CREATE TABLE IF NOT EXISTS "key_creations" (
  "id" SERIAL PRIMARY KEY,
  "key_value" VARCHAR(255) NOT NULL,
  "request_amount" INTEGER NOT NULL,
  "expiry_hours" INTEGER DEFAULT NULL,
  "created_by" INTEGER REFERENCES "users"("id") ON DELETE SET NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "is_used" BOOLEAN DEFAULT FALSE,
  "used_by" INTEGER REFERENCES "users"("id") ON DELETE SET NULL,
  "used_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- 5. Tạo bảng generated_tokens
CREATE TABLE IF NOT EXISTS "generated_tokens" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER REFERENCES "users"("id") ON DELETE CASCADE,
  "token_value" VARCHAR(255) NOT NULL,
  "credits_used" INTEGER NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tạo bảng key_attempts (rate limiting)
CREATE TABLE IF NOT EXISTS "key_attempts" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER REFERENCES "users"("id") ON DELETE CASCADE,
  "ip_address" VARCHAR(45),
  "attempt_count" INTEGER DEFAULT 1,
  "blocked_until" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tạo indexes
CREATE INDEX IF NOT EXISTS "idx_users_username" ON "users"("username");
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users"("email");
CREATE INDEX IF NOT EXISTS "idx_users_expiry_time" ON "users"("expiry_time");
CREATE INDEX IF NOT EXISTS "idx_predefined_keys_key_value" ON "predefined_keys"("key_value");
CREATE INDEX IF NOT EXISTS "idx_predefined_keys_is_used" ON "predefined_keys"("is_used");
CREATE INDEX IF NOT EXISTS "idx_transactions_user_id" ON "transactions"("user_id");
CREATE INDEX IF NOT EXISTS "idx_key_creations_created_by" ON "key_creations"("created_by");
CREATE INDEX IF NOT EXISTS "idx_key_creations_used_by" ON "key_creations"("used_by");
CREATE INDEX IF NOT EXISTS "idx_generated_tokens_user_id" ON "generated_tokens"("user_id");
CREATE INDEX IF NOT EXISTS "idx_key_attempts_user_id" ON "key_attempts"("user_id");

-- 8. Tạo function check expired users
CREATE OR REPLACE FUNCTION check_expired_users()
RETURNS void AS $$
BEGIN
  UPDATE "users" 
  SET "is_expired" = TRUE, "requests" = 0
  WHERE "expiry_time" IS NOT NULL 
    AND "expiry_time" < NOW() 
    AND "is_expired" = FALSE;
END;
$$ LANGUAGE plpgsql;

-- 9. Insert sample keys nếu cần
INSERT INTO "predefined_keys" ("key_value", "credits_value", "expiry_hours") 
VALUES 
  ('KEY-1DAY-TEST', 50, 24),
  ('KEY-WEEK-TEST', 200, 168),
  ('KEY-MONTH-TEST', 1000, 720)
ON CONFLICT ("key_value") DO NOTHING;

-- 10. Kiểm tra tất cả bảng đã tạo
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;