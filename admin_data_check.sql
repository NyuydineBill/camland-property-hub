-- Extended diagnostic to check AdminDashboard data flow
-- Run this in Supabase SQL Editor while logged in as admin

-- 1. Check if admin RPC functions return the unverified properties
SELECT 'Admin RPC Properties (should show 3 unverified):' as check;
SELECT id, title, verified, owner_name, owner_phone 
FROM public.get_all_properties_admin() 
WHERE verified = false;

-- 2. Check the exact structure that AdminDashboard expects
SELECT 'Property Structure Check:' as check;
SELECT 
  id, title, description, city, region, price, currency,
  property_type, listing_type, status, verified, owner_id, created_at,
  owner_name, owner_phone
FROM public.get_all_properties_admin() 
WHERE verified = false
LIMIT 3;

-- 3. Check if profiles are properly linked to properties
SELECT 'Property-Profile Linking:' as check;
SELECT 
  p.id, 
  p.title, 
  p.verified,
  p.owner_id,
  pr.full_name as owner_name,
  pr.phone as owner_phone
FROM public.properties p
LEFT JOIN public.profiles pr ON p.owner_id = pr.id
WHERE p.verified = false;

-- 4. Verify admin permissions
SELECT 'Admin Permission Check:' as check;
SELECT 
  'Current user can see profiles:' as test,
  COUNT(*) as profile_count
FROM public.get_all_profiles_admin()
UNION ALL
SELECT 
  'Current user can see properties:' as test,
  COUNT(*) as property_count  
FROM public.get_all_properties_admin();
