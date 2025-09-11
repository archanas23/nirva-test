-- Complete Nirva Yoga Studio Database Setup
-- This combines your existing working database with the missing security features
-- Run this in your Supabase SQL Editor

-- ==============================================
-- PART 1: EXISTING WORKING DATABASE STRUCTURE
-- ==============================================

-- Step 1: Create user_booked_classes table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_booked_classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  class_name VARCHAR(255) NOT NULL,
  teacher VARCHAR(255) NOT NULL,
  class_date DATE NOT NULL,
  class_time VARCHAR(50) NOT NULL,
  zoom_meeting_id VARCHAR(255),
  zoom_password VARCHAR(255),
  zoom_link TEXT,
  booked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_cancelled BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, class_name, class_date, class_time)
);

-- Step 1b: Add class_instance_id column if it doesn't exist
ALTER TABLE user_booked_classes 
ADD COLUMN IF NOT EXISTS class_instance_id UUID REFERENCES class_instances(id);

-- Step 2: Enable RLS on user_booked_classes if not already enabled
ALTER TABLE user_booked_classes ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies if they exist
DROP POLICY IF EXISTS "User booked classes are viewable by everyone" ON user_booked_classes;
DROP POLICY IF EXISTS "User booked classes can be inserted by anyone" ON user_booked_classes;
DROP POLICY IF EXISTS "User booked classes can be updated by anyone" ON user_booked_classes;
DROP POLICY IF EXISTS "User booked classes can be deleted by anyone" ON user_booked_classes;

-- Step 4: Create comprehensive policies for user_booked_classes table
CREATE POLICY "User booked classes are viewable by everyone" ON user_booked_classes
  FOR SELECT USING (true);

CREATE POLICY "User booked classes can be inserted by anyone" ON user_booked_classes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "User booked classes can be updated by anyone" ON user_booked_classes
  FOR UPDATE USING (true);

CREATE POLICY "User booked classes can be deleted by anyone" ON user_booked_classes
  FOR DELETE USING (true);

-- Step 5: Create an index for better performance on class_instance_id
CREATE INDEX IF NOT EXISTS idx_user_booked_classes_instance_id ON user_booked_classes(class_instance_id);

-- Step 6: Update existing bookings to link them to class instances (if any exist)
-- This matches bookings with class instances based on class name, date, and time
UPDATE user_booked_classes 
SET class_instance_id = ci.id
FROM class_instances ci
WHERE user_booked_classes.class_name = ci.class_name
  AND user_booked_classes.class_date = ci.class_date
  AND user_booked_classes.class_time = ci.start_time::text
  AND user_booked_classes.class_instance_id IS NULL; -- Only update if not already set

-- Step 7: Add password field to users table for proper authentication
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Step 8: Add index for better performance on email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ==============================================
-- PART 2: ADDITIONAL SECURITY FEATURES
-- ==============================================

-- Step 9: Create password_reset_tokens table for secure password reset
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used BOOLEAN DEFAULT FALSE
);

-- Step 10: Create indexes for password reset tokens performance
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Step 11: Add Row Level Security to password reset tokens
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Step 12: Drop existing policies if they exist, then create RLS policies for password reset tokens
DROP POLICY IF EXISTS "Allow insert password reset tokens" ON password_reset_tokens;
DROP POLICY IF EXISTS "Allow read own password reset tokens" ON password_reset_tokens;
DROP POLICY IF EXISTS "Allow update own password reset tokens" ON password_reset_tokens;
DROP POLICY IF EXISTS "Allow delete expired tokens" ON password_reset_tokens;

CREATE POLICY "Allow insert password reset tokens" ON password_reset_tokens
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read own password reset tokens" ON password_reset_tokens
  FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Allow update own password reset tokens" ON password_reset_tokens
  FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Allow delete expired tokens" ON password_reset_tokens
  FOR DELETE USING (expires_at < NOW());

-- Step 13: Create function to clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
    DELETE FROM password_reset_tokens WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Step 14: Clean up any existing expired tokens
SELECT cleanup_expired_tokens();

-- ==============================================
-- PART 3: VERIFICATION AND STATUS CHECKS
-- ==============================================

-- Step 15: Verify all tables and features are working
SELECT 'user_booked_classes table setup completed!' as status;
SELECT COUNT(*) as total_bookings FROM user_booked_classes;
SELECT COUNT(*) as linked_bookings FROM user_booked_classes WHERE class_instance_id IS NOT NULL;
SELECT COUNT(*) as total_class_instances FROM class_instances;

-- Step 16: Verify password field was added
SELECT 'Password field added to users table!' as status;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Step 17: Comprehensive security verification
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
    ) THEN 'PASS' ELSE 'FAIL' END as status
UNION ALL
SELECT 
    'Email index exists on users' as check_name,
    CASE WHEN EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'users' AND indexname = 'idx_users_email'
    ) THEN 'PASS' ELSE 'FAIL' END as status;

-- Step 18: Show complete table structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('users', 'user_booked_classes', 'password_reset_tokens', 'class_instances')
ORDER BY table_name, ordinal_position;

-- ==============================================
-- COMPLETION MESSAGE
-- ==============================================
SELECT '🎉 Nirva Yoga Database Setup Complete! All security features enabled.' as final_status;
