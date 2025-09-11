-- Add missing user_booked_classes table and policies
-- This script only adds what's missing without dropping existing tables

-- Create user_booked_classes table if it doesn't exist
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

-- Enable RLS on user_booked_classes if not already enabled
ALTER TABLE user_booked_classes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "User booked classes are viewable by everyone" ON user_booked_classes;
DROP POLICY IF EXISTS "User booked classes can be inserted by anyone" ON user_booked_classes;
DROP POLICY IF EXISTS "User booked classes can be updated by anyone" ON user_booked_classes;
DROP POLICY IF EXISTS "User booked classes can be deleted by anyone" ON user_booked_classes;

-- Create comprehensive policies for user_booked_classes table
CREATE POLICY "User booked classes are viewable by everyone" ON user_booked_classes
  FOR SELECT USING (true);

CREATE POLICY "User booked classes can be inserted by anyone" ON user_booked_classes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "User booked classes can be updated by anyone" ON user_booked_classes
  FOR UPDATE USING (true);

CREATE POLICY "User booked classes can be deleted by anyone" ON user_booked_classes
  FOR DELETE USING (true);

-- Verify the table exists and has data
SELECT 'user_booked_classes table setup completed!' as status;
SELECT COUNT(*) as existing_bookings FROM user_booked_classes;
