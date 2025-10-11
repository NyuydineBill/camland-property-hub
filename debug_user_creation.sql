-- Debug User Creation Issues
-- Run this in your Supabase SQL Editor to diagnose the problem

-- 1. Check if the trigger exists and is working
SELECT 
  trigger_name,
  event_manipulation,
  action_statement,
  action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 2. Check the function exists
SELECT 
  routine_name,
  routine_definition
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- 3. Check profiles table constraints
SELECT 
  constraint_name,
  check_clause
FROM information_schema.check_constraints 
WHERE table_name = 'profiles';

-- 4. Check if there are any recent failed user creations
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  raw_user_meta_data
FROM auth.users 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- 5. Check if profiles were created for recent users
SELECT 
  u.id,
  u.email,
  u.created_at,
  p.id as profile_id,
  p.full_name,
  p.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.created_at > NOW() - INTERVAL '1 hour'
ORDER BY u.created_at DESC;

-- 6. Test the trigger manually (this will help identify the exact error)
-- First, let's see what happens when we try to create a test user
DO $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Create a test user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'test@example.com',
    '$2a$10$test',
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Test User","role":"user","phone":"+237 000 000 000"}',
    FALSE,
    NOW(),
    NOW()
  ) RETURNING id INTO test_user_id;
  
  -- Check if profile was created
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = test_user_id) THEN
    RAISE NOTICE 'SUCCESS: Profile created for test user %', test_user_id;
  ELSE
    RAISE NOTICE 'ERROR: Profile NOT created for test user %', test_user_id;
  END IF;
  
  -- Clean up test user
  DELETE FROM auth.users WHERE id = test_user_id;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'ERROR creating test user: %', SQLERRM;
END $$;