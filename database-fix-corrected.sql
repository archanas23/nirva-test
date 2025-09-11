-- Fix RLS policies for Nirva Yoga Studio
-- This script creates the correct tables and fixes the 401 Unauthorized errors

-- Create classes table (the main table for class templates)
CREATE TABLE IF NOT EXISTS classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  teacher VARCHAR(255) NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  duration VARCHAR(50) NOT NULL,
  level VARCHAR(100) NOT NULL,
  max_students INTEGER NOT NULL DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create class_instances table (individual class sessions)
CREATE TABLE IF NOT EXISTS class_instances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  class_name VARCHAR(255) NOT NULL,
  teacher VARCHAR(255) NOT NULL,
  class_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration VARCHAR(50) NOT NULL,
  level VARCHAR(100) NOT NULL,
  max_students INTEGER NOT NULL DEFAULT 10,
  zoom_meeting_id VARCHAR(255),
  zoom_password VARCHAR(255),
  zoom_link TEXT,
  is_cancelled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_instances ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Classes are viewable by everyone" ON classes;
DROP POLICY IF EXISTS "Classes can be inserted by anyone" ON classes;
DROP POLICY IF EXISTS "Classes can be updated by anyone" ON classes;
DROP POLICY IF EXISTS "Classes can be deleted by anyone" ON classes;
DROP POLICY IF EXISTS "Class instances are viewable by everyone" ON class_instances;
DROP POLICY IF EXISTS "Class instances can be inserted by anyone" ON class_instances;
DROP POLICY IF EXISTS "Class instances can be updated by anyone" ON class_instances;
DROP POLICY IF EXISTS "Class instances can be deleted by anyone" ON class_instances;

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

-- Insert sample classes if they don't exist
INSERT INTO classes (name, teacher, day_of_week, start_time, duration, level, max_students, is_active) VALUES
('Morning Flow', 'Harshada', 1, '08:00:00', '60 min', 'All Levels', 10, true),
('Evening Restore', 'Archana', 1, '18:00:00', '60 min', 'All Levels', 10, true),
('Morning Flow', 'Harshada', 2, '08:00:00', '60 min', 'All Levels', 10, true),
('Evening Restore', 'Archana', 2, '18:00:00', '60 min', 'All Levels', 10, true),
('Morning Flow', 'Harshada', 3, '08:00:00', '60 min', 'All Levels', 10, true),
('Evening Restore', 'Archana', 3, '18:00:00', '60 min', 'All Levels', 10, true),
('Morning Flow', 'Harshada', 4, '08:00:00', '60 min', 'All Levels', 10, true),
('Evening Restore', 'Archana', 4, '18:00:00', '60 min', 'All Levels', 10, true),
('Morning Flow', 'Harshada', 5, '08:00:00', '60 min', 'All Levels', 10, true),
('Evening Restore', 'Archana', 5, '18:00:00', '60 min', 'All Levels', 10, true),
('Saturday Flow', 'Harshada', 6, '09:00:00', '60 min', 'All Levels', 10, true),
('Weekend Restore', 'Archana', 6, '17:00:00', '60 min', 'All Levels', 10, true),
('Sunday Restore', 'Harshada', 0, '09:00:00', '60 min', 'All Levels', 10, true),
('Sunset Flow', 'Archana', 0, '17:00:00', '60 min', 'All Levels', 10, true)
ON CONFLICT DO NOTHING;

-- Verify the tables and data
SELECT 'Classes table created successfully' as status;
SELECT COUNT(*) as class_count FROM classes;
SELECT 'Class instances table created successfully' as status;
SELECT COUNT(*) as instance_count FROM class_instances;
