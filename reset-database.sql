-- ==============================================
-- NIRVA YOGA DATABASE RESET SCRIPT
-- ==============================================
-- This script will clear all data and reset the database
-- Run this in your Supabase SQL Editor
-- ==============================================

-- Step 1: Disable foreign key checks temporarily
SET session_replication_role = replica;

-- Step 2: Clear all existing data (in correct order to avoid foreign key issues)
DELETE FROM user_booked_classes;
DELETE FROM password_reset_tokens;
DELETE FROM class_instances;
DELETE FROM classes;
DELETE FROM users;

-- Step 3: Reset sequences (if any)
-- Note: Supabase handles this automatically, but included for completeness

-- Step 4: Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- Step 5: Verify tables are empty
SELECT 'user_booked_classes' as table_name, COUNT(*) as count FROM user_booked_classes
UNION ALL
SELECT 'password_reset_tokens' as table_name, COUNT(*) as count FROM password_reset_tokens
UNION ALL
SELECT 'class_instances' as table_name, COUNT(*) as count FROM class_instances
UNION ALL
SELECT 'classes' as table_name, COUNT(*) as count FROM classes
UNION ALL
SELECT 'users' as table_name, COUNT(*) as count FROM users;

-- Step 6: Success message
SELECT '🎉 Database cleared successfully! All tables are now empty.' as status;

-- ==============================================
-- OPTIONAL: Add some sample data for testing
-- ==============================================

-- Uncomment the following section if you want to add sample data:

/*
-- Add sample users
INSERT INTO users (id, email, name, password_hash, classPacks) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@nirvayoga.com', 'Admin User', '$2b$10$example', '{"singleClasses": 10, "fivePack": 2, "tenPack": 1}'),
('550e8400-e29b-41d4-a716-446655440002', 'student1@example.com', 'John Smith', '$2b$10$example', '{"singleClasses": 5, "fivePack": 1, "tenPack": 0}'),
('550e8400-e29b-41d4-a716-446655440003', 'student2@example.com', 'Sarah Johnson', '$2b$10$example', '{"singleClasses": 3, "fivePack": 0, "tenPack": 1}');

-- Add sample classes
INSERT INTO classes (id, name, teacher, day_of_week, start_time, duration, level, max_students) VALUES
('class-001', 'Morning Flow', 'Harshada', 1, '08:00', 60, 'All Levels', 10),
('class-002', 'Evening Restore', 'Archana', 1, '18:00', 60, 'All Levels', 10),
('class-003', 'Sunset Flow', 'Archana', 0, '17:00', 60, 'All Levels', 10),
('class-004', 'Sunday Restore', 'Harshada', 0, '09:00', 60, 'All Levels', 10),
('class-005', 'Twists – Parivrtta Flow', 'Archana', 6, '18:30', 60, 'Intermediate', 8);

-- Add sample class instances (for next week)
INSERT INTO class_instances (id, class_id, class_date, is_cancelled) VALUES
('instance-001', 'class-001', '2025-01-27', false),
('instance-002', 'class-002', '2025-01-27', false),
('instance-003', 'class-001', '2025-01-28', false),
('instance-004', 'class-002', '2025-01-28', false),
('instance-005', 'class-003', '2025-01-26', false),
('instance-006', 'class-004', '2025-01-26', false),
('instance-007', 'class-005', '2025-01-25', false);

SELECT '🎉 Sample data added successfully!' as status;
*/
