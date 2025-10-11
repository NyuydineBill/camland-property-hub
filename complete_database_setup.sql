-- Complete database setup for CamLand Property Hub
-- Run this entire script in your Supabase SQL Editor

-- 1. Ensure profiles table exists with all necessary columns
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user',
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ensure properties table has all necessary columns
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

-- 3. Create or replace the trigger function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role, verified, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'User'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    false,
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

-- 4. Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Enable RLS on both tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- 6. Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- 7. Create comprehensive RLS policies for profiles
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

-- 8. Create RLS policies for properties
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

-- 9. Create your admin profile (update with actual user ID)
INSERT INTO public.profiles (id, full_name, phone, role, verified, created_at, updated_at)
VALUES (
  '264e5ccd-a107-40a2-a363-b1e248905e97',
  'CamLand Admin',
  '+237672384572',
  'admin',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  verified = EXCLUDED.verified,
  updated_at = NOW();

-- 10. Add some sample properties for testing (optional)
INSERT INTO public.properties (
  title, description, city, region, price, currency, property_type, 
  listing_type, status, owner_id, verified, created_at
) VALUES 
(
  'Modern Villa in Douala',
  'Beautiful 4-bedroom villa with ocean view',
  'Douala', 'Littoral', 150000000, 'XAF', 'villa',
  'sale', 'available', '264e5ccd-a107-40a2-a363-b1e248905e97', false, NOW()
),
(
  'Commercial Building Downtown',
  'Prime commercial space in city center',
  'Yaoundé', 'Centre', 300000000, 'XAF', 'commercial',
  'sale', 'available', '264e5ccd-a107-40a2-a363-b1e248905e97', false, NOW()
)
ON CONFLICT DO NOTHING;

-- 11. Verify the setup
SELECT 'Profiles table:' as info, COUNT(*) as count FROM public.profiles
UNION ALL
SELECT 'Properties table:', COUNT(*) FROM public.properties
UNION ALL
SELECT 'Pending verifications:', COUNT(*) FROM public.properties WHERE verified = false;

-- Success message
SELECT 'Database setup completed successfully!' as status;
