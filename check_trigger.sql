-- Check if the trigger exists and is working
-- Run this in your Supabase SQL Editor

-- Check if the trigger exists
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check the function exists
SELECT 
    routine_name,
    routine_definition
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- Check the profiles table constraint
SELECT 
    constraint_name,
    check_clause
FROM information_schema.check_constraints 
WHERE table_name = 'profiles' 
AND constraint_name LIKE '%role%';