-- ==============================================
-- PART 4: ADD CLASS DETAILS TO INSTANCES TABLE
-- ==============================================

-- Step 19: Add class details columns to class_instances table for easier querying
-- This allows storing class information directly in instances instead of requiring joins
ALTER TABLE class_instances 
ADD COLUMN IF NOT EXISTS class_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS teacher VARCHAR(255),
ADD COLUMN IF NOT EXISTS start_time TIME,
ADD COLUMN IF NOT EXISTS duration INTEGER,
ADD COLUMN IF NOT EXISTS level VARCHAR(100),
ADD COLUMN IF NOT EXISTS max_students INTEGER DEFAULT 10;

-- Step 20: Update existing records with data from the classes table
UPDATE class_instances 
SET 
  class_name = c.name,
  teacher = c.teacher,
  start_time = c.start_time,
  duration = c.duration,
  level = c.level,
  max_students = c.max_students
FROM classes c
WHERE class_instances.class_id = c.id
AND class_instances.class_name IS NULL;

-- Step 21: Add indexes for better performance on class details
CREATE INDEX IF NOT EXISTS idx_class_instances_class_name ON class_instances(class_name);
CREATE INDEX IF NOT EXISTS idx_class_instances_teacher ON class_instances(teacher);
CREATE INDEX IF NOT EXISTS idx_class_instances_start_time ON class_instances(start_time);

-- Step 22: Verify class details were added successfully
SELECT 'Class details added to instances table!' as status;
SELECT COUNT(*) as total_instances FROM class_instances;
SELECT COUNT(*) as instances_with_details FROM class_instances WHERE class_name IS NOT NULL;
