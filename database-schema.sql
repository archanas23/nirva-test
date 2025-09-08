-- Classes table - stores the recurring class templates
CREATE TABLE IF NOT EXISTS classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  teacher VARCHAR(255) NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 1 = Monday, etc.
  start_time TIME NOT NULL, -- "09:00:00" format
  duration INTEGER NOT NULL, -- minutes
  level VARCHAR(100) NOT NULL,
  max_students INTEGER NOT NULL DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Class instances table - stores specific instances of classes on specific dates
CREATE TABLE IF NOT EXISTS class_instances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  class_date DATE NOT NULL, -- "2025-09-07" format
  zoom_meeting_id VARCHAR(255),
  zoom_password VARCHAR(255),
  zoom_link TEXT,
  is_cancelled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(class_id, class_date) -- One instance per class per date
);

-- Users table for authentication and profile data
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User class credits table - stores remaining class credits
CREATE TABLE IF NOT EXISTS user_class_credits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  single_classes INTEGER NOT NULL DEFAULT 0,
  five_pack_classes INTEGER NOT NULL DEFAULT 0,
  ten_pack_classes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id) -- One record per user
);

-- User booked classes table - stores booked classes with Zoom data
CREATE TABLE IF NOT EXISTS user_booked_classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_name VARCHAR(255) NOT NULL,
  teacher VARCHAR(255) NOT NULL,
  class_date DATE NOT NULL,
  class_time VARCHAR(50) NOT NULL,
  zoom_meeting_id VARCHAR(255),
  zoom_password VARCHAR(255),
  zoom_link TEXT,
  booked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_cancelled BOOLEAN NOT NULL DEFAULT false,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, class_name, class_date, class_time) -- Prevent duplicate bookings
);

-- Update the existing class_bookings table to reference class_instances
ALTER TABLE class_bookings 
ADD COLUMN IF NOT EXISTS class_instance_id UUID REFERENCES class_instances(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_classes_day_of_week ON classes(day_of_week);
CREATE INDEX IF NOT EXISTS idx_classes_start_time ON classes(start_time);
CREATE INDEX IF NOT EXISTS idx_class_instances_date ON class_instances(class_date);
CREATE INDEX IF NOT EXISTS idx_class_instances_class_id ON class_instances(class_id);
CREATE INDEX IF NOT EXISTS idx_class_bookings_instance_id ON class_bookings(class_instance_id);

-- Enable Row Level Security (RLS)
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_class_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_booked_classes ENABLE ROW LEVEL SECURITY;

-- Create policies for classes table (read-only for everyone)
CREATE POLICY "Classes are viewable by everyone" ON classes
  FOR SELECT USING (true);

-- Create policies for class_instances table (read-only for everyone)
CREATE POLICY "Class instances are viewable by everyone" ON class_instances
  FOR SELECT USING (true);

-- Create policies for class_bookings table (users can insert their own bookings)
CREATE POLICY "Users can insert their own bookings" ON class_bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own bookings" ON class_bookings
  FOR SELECT USING (true);

-- Create policies for class_packages table (users can insert their own packages)
CREATE POLICY "Users can insert their own packages" ON class_packages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own packages" ON class_packages
  FOR SELECT USING (true);

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Create policies for user_class_credits table
CREATE POLICY "Users can view own credits" ON user_class_credits
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own credits" ON user_class_credits
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own credits" ON user_class_credits
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Create policies for user_booked_classes table
CREATE POLICY "Users can view own booked classes" ON user_booked_classes
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own booked classes" ON user_booked_classes
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own booked classes" ON user_booked_classes
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own booked classes" ON user_booked_classes
  FOR DELETE USING (auth.uid()::text = user_id::text);
