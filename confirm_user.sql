-- Manually confirm the user email
-- Run this in your Supabase SQL Editor

UPDATE auth.users 
SET email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email = 'brandipearl123@gmail.com';

-- Verify the update
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'brandipearl123@gmail.com';