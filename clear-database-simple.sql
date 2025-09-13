-- ==============================================
-- SIMPLE DATABASE CLEAR SCRIPT
-- ==============================================
-- Quick script to clear all data
-- Run this in your Supabase SQL Editor
-- ==============================================

-- Clear all data (in correct order)
DELETE FROM user_booked_classes;
DELETE FROM password_reset_tokens;
DELETE FROM class_instances;
DELETE FROM classes;
DELETE FROM users;

-- Verify tables are empty
SELECT 'user_booked_classes' as table_name, COUNT(*) as count FROM user_booked_classes
UNION ALL
SELECT 'password_reset_tokens' as table_name, COUNT(*) as count FROM password_reset_tokens
UNION ALL
SELECT 'class_instances' as table_name, COUNT(*) as count FROM class_instances
UNION ALL
SELECT 'classes' as table_name, COUNT(*) as count FROM classes
UNION ALL
SELECT 'users' as table_name, COUNT(*) as count FROM users;

SELECT '🎉 Database cleared successfully!' as status;
