-- Add password field to users table for proper authentication
-- This migration adds password storage with proper hashing

-- Step 1: Add password column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Step 2: Add index for better performance on email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Step 3: Verify the changes
SELECT 'Password field added to users table!' as status;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
