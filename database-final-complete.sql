  -- Final Complete Database Setup for Nirva Yoga Studio
  -- This script creates all tables and fixes the booking persistence and Zoom details issues

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

  -- Step 7: Update the unique constraint to use class_instance_id (optional)
  -- Note: This step is optional and can be skipped if you want to keep the original constraint
  -- ALTER TABLE user_booked_classes 
  -- DROP CONSTRAINT IF EXISTS user_booked_classes_user_id_class_name_class_date_class_time_key;
  -- ALTER TABLE user_booked_classes 
  -- ADD CONSTRAINT user_booked_classes_unique_booking 
  -- UNIQUE (user_id, class_instance_id);

  -- Step 7: Verify the setup
  SELECT 'user_booked_classes table setup completed!' as status;
  SELECT COUNT(*) as total_bookings FROM user_booked_classes;
  SELECT COUNT(*) as linked_bookings FROM user_booked_classes WHERE class_instance_id IS NOT NULL;
  SELECT COUNT(*) as total_class_instances FROM class_instances;

  -- Step 8: Add password field to users table for proper authentication
  ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

  -- Step 9: Add index for better performance on email lookups
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

  -- Step 10: Verify the password field was added
  SELECT 'Password field added to users table!' as status;
  SELECT column_name, data_type, is_nullable 
  FROM information_schema.columns 
  WHERE table_name = 'users' 
  ORDER BY ordinal_position;
