-- Manual fix for the admin user that was created
-- Run this in your Supabase SQL Editor

-- First, check if the profile exists
SELECT * FROM public.profiles WHERE id = '264e5ccd-a107-40a2-a363-b1e248905e97';

-- If no profile exists, create one manually
INSERT INTO public.profiles (id, full_name, phone, role, created_at, updated_at)
VALUES (
  '264e5ccd-a107-40a2-a363-b1e248905e97',
  'CamLand admin',
  '+237672384572',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Verify the profile was created
SELECT * FROM public.profiles WHERE id = '264e5ccd-a107-40a2-a363-b1e248905e97';
