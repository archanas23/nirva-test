-- Add Missing Security Features to Existing Nirva Yoga Database
-- Run this AFTER your existing database setup
-- This only adds the missing security features without affecting existing tables

-- 1. Create password_reset_tokens table (the only missing piece)
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used BOOLEAN DEFAULT FALSE
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- 3. Add Row Level Security (RLS)
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for security
CREATE POLICY "Allow insert password reset tokens" ON password_reset_tokens
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read own password reset tokens" ON password_reset_tokens
  FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Allow update own password reset tokens" ON password_reset_tokens
  FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Allow delete expired tokens" ON password_reset_tokens
  FOR DELETE USING (expires_at < NOW());

-- 5. Create function to clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
    DELETE FROM password_reset_tokens WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 6. Clean up any existing expired tokens
SELECT cleanup_expired_tokens();

-- 7. Verify the security setup
SELECT 
    'Password reset tokens table exists' as check_name,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'password_reset_tokens'
    ) THEN 'PASS' ELSE 'FAIL' END as status
UNION ALL
SELECT 
    'Users table has password_hash column' as check_name,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'password_hash'
    ) THEN 'PASS' ELSE 'FAIL' END as status
UNION ALL
SELECT 
    'User booked classes table exists' as check_name,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'user_booked_classes'
    ) THEN 'PASS' ELSE 'FAIL' END as status;

-- 8. Show current table structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('users', 'user_booked_classes', 'password_reset_tokens')
ORDER BY table_name, ordinal_position;
