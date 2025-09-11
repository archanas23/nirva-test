-- Complete Security Database Migration for Nirva Yoga Studio
-- Run this in your Supabase SQL Editor to implement all security features

-- 1. Add password_hash field to users table (if not already exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'password_hash') THEN
        ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
    END IF;
END $$;

-- 2. Create index on email for faster lookups (if not already exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes 
                   WHERE tablename = 'users' AND indexname = 'idx_users_email') THEN
        CREATE INDEX idx_users_email ON users(email);
    END IF;
END $$;

-- 3. Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used BOOLEAN DEFAULT FALSE
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- 5. Add Row Level Security (RLS)
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for security
-- Policy: Allow inserting tokens for any email (for password reset)
CREATE POLICY "Allow insert password reset tokens" ON password_reset_tokens
  FOR INSERT WITH CHECK (true);

-- Policy: Allow reading tokens for the same email
CREATE POLICY "Allow read own password reset tokens" ON password_reset_tokens
  FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Policy: Allow updating tokens (for marking as used)
CREATE POLICY "Allow update own password reset tokens" ON password_reset_tokens
  FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Policy: Allow deleting expired tokens (cleanup)
CREATE POLICY "Allow delete expired tokens" ON password_reset_tokens
  FOR DELETE USING (expires_at < NOW());

-- 7. Create function to clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
    DELETE FROM password_reset_tokens WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 8. Create a scheduled job to clean up expired tokens (optional)
-- This would need to be set up in Supabase dashboard or via cron
-- For now, we'll clean up manually
SELECT cleanup_expired_tokens();

-- 9. Verify the setup
SELECT 
    'Users table has password_hash column' as check_name,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'password_hash'
    ) THEN 'PASS' ELSE 'FAIL' END as status
UNION ALL
SELECT 
    'Password reset tokens table exists' as check_name,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'password_reset_tokens'
    ) THEN 'PASS' ELSE 'FAIL' END as status
UNION ALL
SELECT 
    'Email index exists' as check_name,
    CASE WHEN EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'users' AND indexname = 'idx_users_email'
    ) THEN 'PASS' ELSE 'FAIL' END as status;

-- 10. Show current table structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('users', 'password_reset_tokens')
ORDER BY table_name, ordinal_position;
