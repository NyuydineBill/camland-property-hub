-- Fix missing profile for the user
-- Run this in your Supabase SQL Editor

-- First, let's see what users exist in auth.users but not in profiles
SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data,
    u.email_confirmed_at,
    p.id as profile_exists
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'brandipearl123@gmail.com';

-- Now let's manually create the missing profile
INSERT INTO public.profiles (id, full_name, phone, role)
SELECT 
    u.id,
    u.raw_user_meta_data->>'full_name' as full_name,
    u.raw_user_meta_data->>'phone' as phone,
    COALESCE(u.raw_user_meta_data->>'role', 'user') as role
FROM auth.users u
WHERE u.email = 'brandipearl123@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = u.id
);

-- Also confirm the email while we're at it
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email = 'brandipearl123@gmail.com'
AND email_confirmed_at IS NULL;

-- Verify everything is now correct
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    p.full_name,
    p.phone,
    p.role,
    p.created_at as profile_created
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'brandipearl123@gmail.com';