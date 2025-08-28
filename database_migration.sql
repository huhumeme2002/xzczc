-- Migration: Thêm tính năng expiry time và theo dõi key creation
-- Chạy các lệnh này trên Neon database

-- 1. Thêm expiry_time cho users
ALTER TABLE "users" 
ADD COLUMN "expiry_time" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN "is_expired" BOOLEAN DEFAULT FALSE;

-- 2. Tạo bảng key_creations để theo dõi key đã tạo
CREATE TABLE "key_creations" (
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

-- 3. Tạo index cho performance
CREATE INDEX "idx_key_creations_created_by" ON "key_creations"("created_by");
CREATE INDEX "idx_key_creations_used_by" ON "key_creations"("used_by");
CREATE INDEX "idx_key_creations_key_value" ON "key_creations"("key_value");
CREATE INDEX "idx_users_expiry_time" ON "users"("expiry_time");

-- 4. Tạo function để check expired users
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

-- 5. Tạo scheduled job để chạy check_expired_users mỗi phút (nếu có pg_cron)
-- SELECT cron.schedule('check-expired-users', '* * * * *', 'SELECT check_expired_users();');

-- 6. Thêm expiry_hours cho predefined_keys
ALTER TABLE "predefined_keys"
ADD COLUMN "expiry_hours" INTEGER DEFAULT NULL;

-- 7. Thêm column để theo dõi ai tạo key cho ai
ALTER TABLE "transactions"
ADD COLUMN "key_created_by" INTEGER REFERENCES "users"("id") ON DELETE SET NULL;