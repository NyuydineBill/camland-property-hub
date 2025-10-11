-- Emergency User Creation Fix
-- This disables the problematic trigger and provides a manual solution

-- 1. Disable the problematic trigger temporarily
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Create a simpler, more robust function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Simple profile creation with minimal validation
  BEGIN
    INSERT INTO public.profiles (id, full_name, phone, role)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      'user' -- Default to user role to avoid constraint issues
    );
  EXCEPTION
    WHEN OTHERS THEN
      -- If profile creation fails, just log it and continue
      RAISE WARNING 'Profile creation failed for user %: %', NEW.id, SQLERRM;
  END;
  
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
  'user'
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 5. Update existing profiles to have correct roles if they have role data
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

-- 6. Verify the fix
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