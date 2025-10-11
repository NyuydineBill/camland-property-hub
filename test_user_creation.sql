-- Test User Creation
-- Run this after applying the fix to test if user creation works

-- Test 1: Check if trigger is working
SELECT 'Trigger test' as test_type,
       trigger_name,
       event_manipulation,
       action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Test 2: Check function exists
SELECT 'Function test' as test_type,
       routine_name,
       routine_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- Test 3: Check profiles table structure
SELECT 'Table structure test' as test_type,
       column_name,
       data_type,
       is_nullable,
       column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test 4: Check constraint
SELECT 'Constraint test' as test_type,
       constraint_name,
       check_clause
FROM information_schema.check_constraints 
WHERE table_name = 'profiles';

-- Test 5: Count current users and profiles
SELECT 'Count test' as test_type,
       'Users' as table_name,
       COUNT(*) as count
FROM auth.users

UNION ALL

SELECT 'Count test' as test_type,
       'Profiles' as table_name,
       COUNT(*) as count
FROM public.profiles;

-- Test 6: Check for orphaned users (users without profiles)
SELECT 'Orphan test' as test_type,
       'Orphaned users' as issue,
       COUNT(*) as count
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;