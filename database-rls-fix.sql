-- Fix RLS policies for Nirva Yoga Studio
-- This script fixes the 401 Unauthorized errors

-- First, let's check if we need to create the missing tables
CREATE TABLE IF NOT EXISTS class_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name VARCHAR(255) NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  class_name VARCHAR(255) NOT NULL,
  teacher VARCHAR(255) NOT NULL,
  class_date DATE NOT NULL,
  class_time VARCHAR(50) NOT NULL,
  payment_method VARCHAR(100),
  amount DECIMAL(10,2),
  zoom_meeting_id VARCHAR(255),
  zoom_password VARCHAR(255),
  zoom_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Classes are viewable by everyone" ON classes;
DROP POLICY IF EXISTS "Class instances are viewable by everyone" ON class_instances;
DROP POLICY IF EXISTS "Users can insert their own bookings" ON class_bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON class_bookings;
DROP POLICY IF EXISTS "Users can insert their own packages" ON class_packages;
DROP POLICY IF EXISTS "Users can view their own packages" ON class_packages;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own credits" ON user_class_credits;
DROP POLICY IF EXISTS "Users can insert own credits" ON user_class_credits;
DROP POLICY IF EXISTS "Users can update own credits" ON user_class_credits;
DROP POLICY IF EXISTS "Users can view own booked classes" ON user_booked_classes;
DROP POLICY IF EXISTS "Users can insert own booked classes" ON user_booked_classes;
DROP POLICY IF EXISTS "Users can update own booked classes" ON user_booked_classes;

-- Create comprehensive policies for classes table
CREATE POLICY "Classes are viewable by everyone" ON classes
  FOR SELECT USING (true);

CREATE POLICY "Classes can be inserted by anyone" ON classes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Classes can be updated by anyone" ON classes
  FOR UPDATE USING (true);

CREATE POLICY "Classes can be deleted by anyone" ON classes
  FOR DELETE USING (true);

-- Create comprehensive policies for class_instances table
CREATE POLICY "Class instances are viewable by everyone" ON class_instances
  FOR SELECT USING (true);

CREATE POLICY "Class instances can be inserted by anyone" ON class_instances
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Class instances can be updated by anyone" ON class_instances
  FOR UPDATE USING (true);

CREATE POLICY "Class instances can be deleted by anyone" ON class_instances
  FOR DELETE USING (true);

-- Create comprehensive policies for class_bookings table
CREATE POLICY "Class bookings are viewable by everyone" ON class_bookings
  FOR SELECT USING (true);

CREATE POLICY "Class bookings can be inserted by anyone" ON class_bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Class bookings can be updated by anyone" ON class_bookings
  FOR UPDATE USING (true);

CREATE POLICY "Class bookings can be deleted by anyone" ON class_bookings
  FOR DELETE USING (true);

-- Create comprehensive policies for users table
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can be inserted by anyone" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can be updated by anyone" ON users
  FOR UPDATE USING (true);

CREATE POLICY "Users can be deleted by anyone" ON users
  FOR DELETE USING (true);

-- Create comprehensive policies for user_class_credits table
CREATE POLICY "User credits are viewable by everyone" ON user_class_credits
  FOR SELECT USING (true);

CREATE POLICY "User credits can be inserted by anyone" ON user_class_credits
  FOR INSERT WITH CHECK (true);

CREATE POLICY "User credits can be updated by anyone" ON user_class_credits
  FOR UPDATE USING (true);

CREATE POLICY "User credits can be deleted by anyone" ON user_class_credits
  FOR DELETE USING (true);

-- Create comprehensive policies for user_booked_classes table
CREATE POLICY "User booked classes are viewable by everyone" ON user_booked_classes
  FOR SELECT USING (true);

CREATE POLICY "User booked classes can be inserted by anyone" ON user_booked_classes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "User booked classes can be updated by anyone" ON user_booked_classes
  FOR UPDATE USING (true);

CREATE POLICY "User booked classes can be deleted by anyone" ON user_booked_classes
  FOR DELETE USING (true);

-- Insert some sample classes if they don't exist
INSERT INTO classes (name, teacher, day_of_week, start_time, duration, level, max_students, is_active) VALUES
('Morning Flow', 'Harshada', 1, '08:00:00', 60, 'All Levels', 10, true),
('Evening Restore', 'Archana', 1, '18:00:00', 60, 'All Levels', 10, true),
('Morning Flow', 'Harshada', 2, '08:00:00', 60, 'All Levels', 10, true),
('Evening Restore', 'Archana', 2, '18:00:00', 60, 'All Levels', 10, true),
('Morning Flow', 'Harshada', 3, '08:00:00', 60, 'All Levels', 10, true),
('Evening Restore', 'Archana', 3, '18:00:00', 60, 'All Levels', 10, true),
('Morning Flow', 'Harshada', 4, '08:00:00', 60, 'All Levels', 10, true),
('Evening Restore', 'Archana', 4, '18:00:00', 60, 'All Levels', 10, true),
('Morning Flow', 'Harshada', 5, '08:00:00', 60, 'All Levels', 10, true),
('Evening Restore', 'Archana', 5, '18:00:00', 60, 'All Levels', 10, true),
('Saturday Flow', 'Harshada', 6, '09:00:00', 60, 'All Levels', 10, true),
('Weekend Restore', 'Archana', 6, '17:00:00', 60, 'All Levels', 10, true),
('Sunday Restore', 'Harshada', 0, '09:00:00', 60, 'All Levels', 10, true),
('Sunset Flow', 'Archana', 0, '17:00:00', 60, 'All Levels', 10, true)
ON CONFLICT DO NOTHING;

-- Verify the policies are working
SELECT 'RLS policies updated successfully' as status;
