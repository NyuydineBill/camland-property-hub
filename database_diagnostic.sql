-- Database Diagnostic Script
-- Run this in your Supabase SQL Editor to see the current state of your database

-- 1. Check all tables in the public schema
SELECT 'Tables in public schema' as section,
       table_name,
       table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Check auth.users table structure and recent users
SELECT 'Auth users structure' as section,
       column_name,
       data_type,
       is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'auth'
ORDER BY ordinal_position;

-- 3. Recent users (last 24 hours)
SELECT 'Recent users' as section,
       id,
       email,
       created_at,
       email_confirmed_at,
       raw_user_meta_data
FROM auth.users 
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC
LIMIT 10;

-- 4. All users count
SELECT 'User count' as section,
       'Total users' as metric,
       COUNT(*) as count
FROM auth.users;

-- 5. Profiles table structure
SELECT 'Profiles table structure' as section,
       column_name,
       data_type,
       is_nullable,
       column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. All profiles
SELECT 'All profiles' as section,
       id,
       full_name,
       phone,
       role,
       created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 20;

-- 7. Profiles count by role
SELECT 'Profiles by role' as section,
       role,
       COUNT(*) as count
FROM public.profiles
GROUP BY role
ORDER BY count DESC;

-- 8. Users without profiles
SELECT 'Users without profiles' as section,
       u.id,
       u.email,
       u.created_at,
       u.raw_user_meta_data
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ORDER BY u.created_at DESC;

-- 9. Properties table structure
SELECT 'Properties table structure' as section,
       column_name,
       data_type,
       is_nullable
FROM information_schema.columns 
WHERE table_name = 'properties' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 10. Properties count and sample
SELECT 'Properties count' as section,
       'Total properties' as metric,
       COUNT(*) as count
FROM public.properties;

-- 11. Sample properties
SELECT 'Sample properties' as section,
       id,
       title,
       city,
       price,
       currency,
       property_type,
       listing_type,
       verified,
       owner_id,
       created_at
FROM public.properties
ORDER BY created_at DESC
LIMIT 10;

-- 12. Properties by type
SELECT 'Properties by type' as section,
       property_type,
       COUNT(*) as count
FROM public.properties
GROUP BY property_type
ORDER BY count DESC;

-- 13. Properties by verification status
SELECT 'Properties by verification' as section,
       CASE 
         WHEN verified IS TRUE THEN 'Verified'
         WHEN verified IS FALSE THEN 'Not Verified'
         ELSE 'Unknown'
       END as verification_status,
       COUNT(*) as count
FROM public.properties
GROUP BY verification_status
ORDER BY count DESC;

-- 14. Property images
SELECT 'Property images' as section,
       'Total images' as metric,
       COUNT(*) as count
FROM public.property_images;

-- 15. Favorites
SELECT 'Favorites' as section,
       'Total favorites' as metric,
       COUNT(*) as count
FROM public.favorites;

-- 16. Check triggers
SELECT 'Triggers' as section,
       trigger_name,
       event_manipulation,
       action_timing,
       action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY trigger_name;

-- 17. Check functions
SELECT 'Functions' as section,
       routine_name,
       routine_type,
       data_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- 18. Check constraints
SELECT 'Constraints' as section,
       table_name,
       constraint_name,
       constraint_type,
       check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public'
ORDER BY table_name, constraint_name;

-- 19. Recent activity (last 24 hours)
SELECT 'Recent activity' as section,
       'New users' as activity,
       COUNT(*) as count
FROM auth.users 
WHERE created_at > NOW() - INTERVAL '24 hours'

UNION ALL

SELECT 'Recent activity' as section,
       'New profiles' as activity,
       COUNT(*) as count
FROM public.profiles 
WHERE created_at > NOW() - INTERVAL '24 hours'

UNION ALL

SELECT 'Recent activity' as section,
       'New properties' as activity,
       COUNT(*) as count
FROM public.properties 
WHERE created_at > NOW() - INTERVAL '24 hours';

-- 20. Database size and stats
SELECT 'Database stats' as section,
       'Database size' as metric,
       pg_size_pretty(pg_database_size(current_database())) as size;