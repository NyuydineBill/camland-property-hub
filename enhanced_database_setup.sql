-- Enhanced database setup with admin RPC functions for CamLand Property Hub
-- Run this entire script in your Supabase SQL Editor

-- 1. Ensure profiles table exists with all necessary columns
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ensure properties table has all necessary columns
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'properties' AND column_name = 'verified') THEN
    ALTER TABLE public.properties ADD COLUMN verified BOOLEAN DEFAULT false;
  END IF;
END $$;

-- 3. Create admin RPC functions that bypass RLS for admin users
CREATE OR REPLACE FUNCTION public.get_all_profiles_admin()
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  phone TEXT,
  role TEXT,
  created_at TIMESTAMPTZ
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT p.id, p.full_name, p.phone, p.role, p.created_at
  FROM public.profiles p
  WHERE EXISTS (
    SELECT 1 FROM public.profiles admin_check 
    WHERE admin_check.id = auth.uid() AND admin_check.role = 'admin'
  )
  ORDER BY p.created_at DESC;
$$;

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
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    prop.id, prop.title, prop.description, prop.city, prop.region, 
    prop.price, prop.currency, prop.property_type, prop.listing_type, 
    prop.status, prop.verified, prop.owner_id, prop.created_at,
    prof.full_name as owner_name, prof.phone as owner_phone
  FROM public.properties prop
  LEFT JOIN public.profiles prof ON prop.owner_id = prof.id
  WHERE EXISTS (
    SELECT 1 FROM public.profiles admin_check 
    WHERE admin_check.id = auth.uid() AND admin_check.role = 'admin'
  )
  ORDER BY prop.created_at DESC;
$$;

-- 4. Create or replace the trigger function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'User'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    NOW(),
    NOW()
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error and continue
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Enable RLS on both tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- 7. Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- 8. Create comprehensive RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 9. Create RLS policies for properties
DROP POLICY IF EXISTS "Anyone can view available properties" ON public.properties;
DROP POLICY IF EXISTS "Owners can manage their properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can manage all properties" ON public.properties;

CREATE POLICY "Anyone can view available properties" ON public.properties
  FOR SELECT USING (status = 'available' OR verified = true);

CREATE POLICY "Owners can manage their properties" ON public.properties
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Admins can manage all properties" ON public.properties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 10. Create your admin profile (update with actual user ID)
INSERT INTO public.profiles (id, full_name, phone, role, created_at, updated_at)
VALUES (
  '264e5ccd-a107-40a2-a363-b1e248905e97',
  'CamLand Admin',
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

-- 11. Add some sample users for testing (optional)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES 
(
  gen_random_uuid(),
  'john.doe@example.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "John Doe", "phone": "+237677123456", "role": "user"}'::jsonb
),
(
  gen_random_uuid(),
  'sarah.broker@example.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "Sarah Johnson", "phone": "+237677654321", "role": "broker"}'::jsonb
)
ON CONFLICT (email) DO NOTHING;

-- 12. Add some sample properties for testing (optional)
DO $$
DECLARE
    sample_user_id UUID;
BEGIN
    -- Get a user ID for property owner
    SELECT id INTO sample_user_id FROM public.profiles WHERE role != 'admin' LIMIT 1;
    
    IF sample_user_id IS NOT NULL THEN
        INSERT INTO public.properties (
          title, description, city, region, price, currency, property_type, 
          listing_type, status, owner_id, verified, created_at
        ) VALUES 
        (
          'Modern Villa in Douala',
          'Beautiful 4-bedroom villa with ocean view',
          'Douala', 'Littoral', 150000000, 'XAF', 'villa',
          'sale', 'available', sample_user_id, false, NOW()
        ),
        (
          'Commercial Building Downtown',
          'Prime commercial space in city center',
          'Yaoundé', 'Centre', 300000000, 'XAF', 'commercial',
          'sale', 'available', sample_user_id, false, NOW()
        ),
        (
          'Residential Plot in Bamenda',
          '500 sqm residential land in quiet neighborhood',
          'Bamenda', 'North West', 25000000, 'XAF', 'land',
          'sale', 'available', sample_user_id, true, NOW()
        )
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- 13. Verify the setup
SELECT 'Profiles table:' as info, COUNT(*) as count FROM public.profiles
UNION ALL
SELECT 'Properties table:', COUNT(*) FROM public.properties
UNION ALL
SELECT 'Pending verifications:', COUNT(*) FROM public.properties WHERE verified = false
UNION ALL
SELECT 'Admin users:', COUNT(*) FROM public.profiles WHERE role = 'admin';

-- Success message
SELECT 'Enhanced database setup completed successfully!' as status;
