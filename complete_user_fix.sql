-- Complete User Creation Fix
-- This addresses all common causes of user creation failures

-- 1. First, let's check what's causing the issue
SELECT 'Current trigger status' as check_type, 
       trigger_name, 
       event_manipulation,
       action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 2. Check profiles table constraints
SELECT 'Profiles constraints' as check_type,
       constraint_name,
       check_clause
FROM information_schema.check_constraints 
WHERE table_name = 'profiles';

-- 3. Check if there are any recent failed users
SELECT 'Recent users' as check_type,
       id,
       email,
       created_at,
       email_confirmed_at,
       raw_user_meta_data
FROM auth.users 
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- 4. Check profiles for recent users
SELECT 'Recent profiles' as check_type,
       u.id,
       u.email,
       u.created_at,
       p.id as profile_id,
       p.full_name,
       p.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.created_at > NOW() - INTERVAL '24 hours'
ORDER BY u.created_at DESC;

-- 5. Drop and recreate everything from scratch
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 6. Create a very simple, robust function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Simple profile creation with error handling
  BEGIN
    INSERT INTO public.profiles (id, full_name, phone, role)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      'user' -- Always default to 'user' to avoid constraint issues
    );
  EXCEPTION
    WHEN OTHERS THEN
      -- Log the error but don't fail the user creation
      RAISE WARNING 'Profile creation failed for user %: %', NEW.id, SQLERRM;
      -- Try to create a minimal profile
      BEGIN
        INSERT INTO public.profiles (id, full_name, phone, role)
        VALUES (NEW.id, 'User', '', 'user');
      EXCEPTION
        WHEN OTHERS THEN
          RAISE WARNING 'Even minimal profile creation failed for user %: %', NEW.id, SQLERRM;
      END;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Fix any existing users without profiles
INSERT INTO public.profiles (id, full_name, phone, role)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', 'User'),
  COALESCE(u.raw_user_meta_data->>'phone', ''),
  'user'
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 9. Update roles for existing users who have role data
UPDATE public.profiles 
SET role = CASE 
  WHEN EXISTS (
    SELECT 1 FROM auth.users u 
    WHERE u.id = profiles.id 
    AND u.raw_user_meta_data->>'role' IN ('user', 'owner', 'community', 'broker', 'admin')
  ) THEN (
    SELECT u.raw_user_meta_data->>'role' 
    FROM auth.users u 
    WHERE u.id = profiles.id 
    AND u.raw_user_meta_data->>'role' IN ('user', 'owner', 'community', 'broker', 'admin')
    LIMIT 1
  )
  ELSE role
END
WHERE EXISTS (
  SELECT 1 FROM auth.users u 
  WHERE u.id = profiles.id 
  AND u.raw_user_meta_data->>'role' IN ('user', 'owner', 'community', 'broker', 'admin')
);

-- 10. Final verification
SELECT 'Final verification' as check_type,
       'Users without profiles' as issue,
       COUNT(*) as count
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL

UNION ALL

SELECT 'Final verification' as check_type,
       'Total users' as issue,
       COUNT(*) as count
FROM auth.users

UNION ALL

SELECT 'Final verification' as check_type,
       'Total profiles' as issue,
       COUNT(*) as count
FROM public.profiles;