-- AiVanNang Database Schema
-- Run this script in your Neon PostgreSQL console

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    credits INTEGER DEFAULT 0,
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Keys table for managing redemption keys
CREATE TABLE IF NOT EXISTS keys (
    id SERIAL PRIMARY KEY,
    key_code VARCHAR(100) UNIQUE NOT NULL,
    credits_value INTEGER NOT NULL,
    is_used BOOLEAN DEFAULT false,
    used_by_user_id INTEGER REFERENCES users(id),
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Key redemptions history
CREATE TABLE IF NOT EXISTS key_redemptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    key_id INTEGER REFERENCES keys(id) NOT NULL,
    credits_awarded INTEGER NOT NULL,
    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tokens table for generated tokens
CREATE TABLE IF NOT EXISTS tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    token_value TEXT NOT NULL,
    credits_cost INTEGER DEFAULT 10,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- User credits history
CREATE TABLE IF NOT EXISTS credit_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- 'earned', 'spent', 'adjusted'
    amount INTEGER NOT NULL, -- positive for earned, negative for spent
    description TEXT,
    reference_id INTEGER, -- reference to key_redemptions.id or tokens.id
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin activities log
CREATE TABLE IF NOT EXISTS admin_activities (
    id SERIAL PRIMARY KEY,
    admin_user_id INTEGER REFERENCES users(id) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    target_user_id INTEGER REFERENCES users(id),
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some default keys
INSERT INTO keys (key_code, credits_value, expires_at) VALUES
('KEY-DEMO2024', 100, '2025-12-31 23:59:59'),
('KEY-TEST1234', 50, '2025-12-31 23:59:59'),
('KEY-SAMPLE99', 75, '2025-12-31 23:59:59'),
('KEY-STARTER01', 25, '2025-12-31 23:59:59'),
('KEY-WELCOME88', 150, '2025-12-31 23:59:59'),
('KEY-BONUS777', 200, '2025-12-31 23:59:59')
ON CONFLICT (key_code) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_keys_code ON keys(key_code);
CREATE INDEX IF NOT EXISTS idx_key_redemptions_user ON key_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_tokens_user ON tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON credit_transactions(user_id);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();