-- Add password reset tokens table for secure password reset functionality
-- Run this in your Supabase SQL Editor

-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used BOOLEAN DEFAULT FALSE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Add RLS policy for security
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Only allow inserting tokens for any email (for password reset)
CREATE POLICY "Allow insert password reset tokens" ON password_reset_tokens
  FOR INSERT WITH CHECK (true);

-- Policy: Only allow reading tokens for the same email
CREATE POLICY "Allow read own password reset tokens" ON password_reset_tokens
  FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Policy: Allow updating tokens (for marking as used)
CREATE POLICY "Allow update own password reset tokens" ON password_reset_tokens
  FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Policy: Allow deleting expired tokens (cleanup)
CREATE POLICY "Allow delete expired tokens" ON password_reset_tokens
  FOR DELETE USING (expires_at < NOW());

-- Clean up expired tokens (run this periodically)
DELETE FROM password_reset_tokens WHERE expires_at < NOW();
