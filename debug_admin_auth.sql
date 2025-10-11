-- Debug admin authentication and RPC function issues
-- Run this in Supabase SQL Editor

-- 1. Check what user is currently authenticated
SELECT 'Current Authentication:' as check;
SELECT 
  auth.uid() as current_user_id,
  CASE 
    WHEN auth.uid() IS NULL THEN 'Not authenticated'
    ELSE 'Authenticated'
  END as auth_status;

-- 2. Check if current user has admin profile
SELECT 'Current User Profile:' as check;
SELECT id, full_name, role, created_at
FROM public.profiles 
WHERE id = auth.uid();

-- 3. Check all admin profiles in the system
SELECT 'All Admin Profiles:' as check;
SELECT id, full_name, role, created_at
FROM public.profiles 
WHERE role = 'admin';

-- 4. Test the admin check logic manually
SELECT 'Manual Admin Check:' as check;
SELECT 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) as is_current_user_admin;

-- 5. Test direct property access (bypassing RPC)
SELECT 'Direct Property Access:' as check;
SELECT COUNT(*) as total_properties
FROM public.properties;

-- 6. Test direct profile access (bypassing RPC)  
SELECT 'Direct Profile Access:' as check;
SELECT COUNT(*) as total_profiles
FROM public.profiles;

-- 7. Check RLS policies on properties table
SELECT 'RLS Policies on Properties:' as check;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'properties';

-- 8. Check RLS policies on profiles table
SELECT 'RLS Policies on Profiles:' as check;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'profiles';
