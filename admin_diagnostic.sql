-- Admin Dashboard Diagnostic - Check what admin can see
-- Run this in Supabase SQL Editor while logged in as admin

-- 1. Check current authenticated user
SELECT 'Current User:' as check, auth.uid() as user_id;

-- 2. Check admin profile exists
SELECT 'Admin Profile:' as check;
SELECT id, full_name, role FROM public.profiles WHERE role = 'admin';

-- 3. Check all properties
SELECT 'All Properties:' as check;
SELECT id, title, verified, status, owner_id, created_at FROM public.properties ORDER BY created_at DESC;

-- 4. Check unverified properties (what should show in admin dashboard)
SELECT 'Unverified Properties:' as check;
SELECT id, title, verified, status, owner_id FROM public.properties WHERE verified = false;

-- 5. Test admin RPC functions
SELECT 'Admin RPC - Profiles:' as check;
SELECT * FROM public.get_all_profiles_admin() LIMIT 5;

SELECT 'Admin RPC - Properties:' as check;
SELECT * FROM public.get_all_properties_admin() LIMIT 5;

-- 6. Summary
SELECT 'Summary:' as check;
SELECT 
  COUNT(*) as total_properties,
  COUNT(*) FILTER (WHERE verified = false) as unverified_properties,
  COUNT(*) FILTER (WHERE verified = true) as verified_properties
FROM public.properties;
