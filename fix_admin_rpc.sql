-- Fixed admin RPC functions - run this to update them
-- This version has better error handling and debugging

-- 1. Drop and recreate the admin profile function with debugging
CREATE OR REPLACE FUNCTION public.get_all_profiles_admin()
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  phone TEXT,
  role TEXT,
  created_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if current user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ) THEN
    -- For debugging: still return data but log the issue
    RAISE WARNING 'User % is not admin or not found. Current user: %', auth.uid(), auth.uid();
    -- Return empty result
    RETURN;
  END IF;
  
  -- Return all profiles if user is admin
  RETURN QUERY
  SELECT p.id, p.full_name, p.phone, p.role, p.created_at
  FROM public.profiles p
  ORDER BY p.created_at DESC;
END;
$$;

-- 2. Drop and recreate the admin properties function with debugging
CREATE OR REPLACE FUNCTION public.get_all_properties_admin()
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  city TEXT,
  region TEXT,
  price NUMERIC,
  currency TEXT,
  property_type TEXT,
  listing_type TEXT,
  status TEXT,
  verified BOOLEAN,
  owner_id UUID,
  created_at TIMESTAMPTZ,
  owner_name TEXT,
  owner_phone TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if current user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ) THEN
    -- For debugging: log the issue
    RAISE WARNING 'User % is not admin or not found for properties access', auth.uid();
    -- Return empty result
    RETURN;
  END IF;
  
  -- Return all properties if user is admin
  RETURN QUERY
  SELECT 
    prop.id, prop.title, prop.description, prop.city, prop.region, 
    prop.price, prop.currency, prop.property_type, prop.listing_type, 
    prop.status, prop.verified, prop.owner_id, prop.created_at,
    prof.full_name as owner_name, prof.phone as owner_phone
  FROM public.properties prop
  LEFT JOIN public.profiles prof ON prop.owner_id = prof.id
  ORDER BY prop.created_at DESC;
END;
$$;

-- 3. Test the functions immediately
SELECT 'Testing updated RPC functions:' as test;

SELECT 'Profiles function test:' as test;
SELECT COUNT(*) as profile_count FROM public.get_all_profiles_admin();

SELECT 'Properties function test:' as test;  
SELECT COUNT(*) as property_count FROM public.get_all_properties_admin();

-- 4. Create a simple admin bypass function for emergency access
CREATE OR REPLACE FUNCTION public.get_all_data_emergency()
RETURNS TABLE (
  data_type TEXT,
  count BIGINT
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 'profiles' as data_type, COUNT(*) as count FROM public.profiles
  UNION ALL
  SELECT 'properties' as data_type, COUNT(*) as count FROM public.properties
  UNION ALL
  SELECT 'unverified_properties' as data_type, COUNT(*) as count FROM public.properties WHERE verified = false;
$$;
