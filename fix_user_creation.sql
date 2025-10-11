-- Fix User Creation Issues
-- Run this in your Supabase SQL Editor to fix common user creation problems

-- 1. First, let's drop and recreate the trigger with better error handling
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Create an improved function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile with proper error handling
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(
      CASE 
        WHEN NEW.raw_user_meta_data->>'role' IN ('user', 'owner', 'community', 'broker', 'admin') 
        THEN NEW.raw_user_meta_data->>'role'
        ELSE 'user'
      END,
      'user'
    )
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Fix any existing users without profiles
INSERT INTO public.profiles (id, full_name, phone, role)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', 'User'),
  COALESCE(u.raw_user_meta_data->>'phone', ''),
  COALESCE(
    CASE 
      WHEN u.raw_user_meta_data->>'role' IN ('user', 'owner', 'community', 'broker', 'admin') 
      THEN u.raw_user_meta_data->>'role'
      ELSE 'user'
    END,
    'user'
  )
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 5. Verify the fix worked
SELECT 
  'Users without profiles' as issue,
  COUNT(*) as count
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL

UNION ALL

SELECT 
  'Total users' as issue,
  COUNT(*) as count
FROM auth.users

UNION ALL

SELECT 
  'Total profiles' as issue,
  COUNT(*) as count
FROM public.profiles;