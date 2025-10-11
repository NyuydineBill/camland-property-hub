-- Query to check current database state for debugging admin dashboard

-- Check all profiles
SELECT 'PROFILES:' as section;
SELECT id, full_name, phone, role, verified, created_at 
FROM public.profiles 
ORDER BY created_at DESC;

-- Check all properties
SELECT 'PROPERTIES:' as section;
SELECT id, title, city, region, price, property_type, verified, owner_id, created_at
FROM public.properties 
ORDER BY created_at DESC;

-- Check pending verifications
SELECT 'PENDING VERIFICATIONS:' as section;
SELECT COUNT(*) as pending_count 
FROM public.properties 
WHERE verified = false;

-- Check user role breakdown
SELECT 'USER ROLES:' as section;
SELECT role, COUNT(*) as count 
FROM public.profiles 
GROUP BY role;

-- Check if admin profile exists
SELECT 'ADMIN PROFILE:' as section;
SELECT * FROM public.profiles 
WHERE role = 'admin' OR id = '264e5ccd-a107-40a2-a363-b1e248905e97';
