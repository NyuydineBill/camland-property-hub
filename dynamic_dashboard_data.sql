-- Dynamic Dashboard Data Population
-- Run this in your Supabase SQL Editor to populate realistic data for all dashboards

-- First, let's ensure the broker has a profile
-- The broker email is: zleanstudyapp@gmail.com

-- Check if broker profile exists, if not create it
INSERT INTO public.profiles (id, full_name, phone, role)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', 'Broker User'),
  COALESCE(u.raw_user_meta_data->>'phone', '+237 000 000 000'),
  COALESCE(u.raw_user_meta_data->>'role', 'broker')
FROM auth.users u
WHERE u.email = 'zleanstudyapp@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role;

-- Insert some properties for the broker (owned by the broker)
INSERT INTO public.properties (
  title,
  description,
  price,
  currency,
  property_type,
  listing_type,
  status,
  city,
  region,
  latitude,
  longitude,
  bedrooms,
  bathrooms,
  area_sqm,
  owner_id
) VALUES 
-- Get the broker's ID and insert properties owned by them
(
  'Luxury Villa in Douala',
  'Beautiful 4-bedroom villa with modern amenities, perfect for executives. Features include swimming pool, garden, and security.',
  25000000,
  'XAF',
  'house',
  'sale',
  'available',
  'Douala',
  'Littoral',
  4.0511,
  9.7679,
  4,
  3,
  450,
  (SELECT id FROM auth.users WHERE email = 'zleanstudyapp@gmail.com')
),
(
  'Commercial Office Space Yaoundé',
  'Prime commercial office space in the heart of Yaoundé business district. Ideal for corporate headquarters.',
  180000,
  'XAF',
  'commercial',
  'rent',
  'available',
  'Yaoundé',
  'Centre',
  3.8480,
  11.5021,
  NULL,
  2,
  300,
  (SELECT id FROM auth.users WHERE email = 'zleanstudyapp@gmail.com')
),
(
  'Family Home in Bamenda',
  'Cozy 3-bedroom family home in quiet neighborhood. Perfect for growing families with good schools nearby.',
  15000000,
  'XAF',
  'house',
  'sale',
  'pending',
  'Bamenda',
  'North West',
  5.9631,
  10.1591,
  3,
  2,
  250,
  (SELECT id FROM auth.users WHERE email = 'zleanstudyapp@gmail.com')
),
(
  'Student Accommodation Buea',
  'Modern student accommodation near University of Buea. Fully furnished with high-speed internet.',
  80000,
  'XAF',
  'apartment',
  'rent',
  'available',
  'Buea',
  'South West',
  4.1560,
  9.2615,
  2,
  1,
  120,
  (SELECT id FROM auth.users WHERE email = 'zleanstudyapp@gmail.com')
),
(
  'Beachside Resort Limbe',
  'Exclusive beachside resort property with ocean views. Perfect for tourism investment.',
  45000000,
  'XAF',
  'commercial',
  'sale',
  'available',
  'Limbe',
  'South West',
  4.0186,
  9.2104,
  NULL,
  NULL,
  800,
  (SELECT id FROM auth.users WHERE email = 'zleanstudyapp@gmail.com')
),
(
  'Agricultural Land Maroua',
  'Fertile agricultural land suitable for farming and livestock. Great investment opportunity.',
  8000000,
  'XAF',
  'land',
  'sale',
  'available',
  'Maroua',
  'Extreme North',
  10.5913,
  14.3160,
  NULL,
  NULL,
  5000,
  (SELECT id FROM auth.users WHERE email = 'zleanstudyapp@gmail.com')
);

-- Insert some property images for these properties
INSERT INTO public.property_images (property_id, image_url, is_primary)
SELECT 
  p.id,
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&crop=center',
  true
FROM public.properties p 
WHERE p.owner_id = (SELECT id FROM auth.users WHERE email = 'zleanstudyapp@gmail.com')
AND p.title = 'Luxury Villa in Douala';

INSERT INTO public.property_images (property_id, image_url, is_primary)
SELECT 
  p.id,
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center',
  true
FROM public.properties p 
WHERE p.owner_id = (SELECT id FROM auth.users WHERE email = 'zleanstudyapp@gmail.com')
AND p.title = 'Commercial Office Space Yaoundé';

INSERT INTO public.property_images (property_id, image_url, is_primary)
SELECT 
  p.id,
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop&crop=center',
  true
FROM public.properties p 
WHERE p.owner_id = (SELECT id FROM auth.users WHERE email = 'zleanstudyapp@gmail.com')
AND p.title = 'Family Home in Bamenda';

-- Add some favorites for other users (to populate user dashboards)
-- First, let's create a few more users if they don't exist
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at
) VALUES 
(
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'john.owner@email.com',
  '$2a$10$8kF.Jh0H0H0H0H0H0H0H0O',
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"John Doe","role":"owner","phone":"+237 677 123 456"}',
  FALSE,
  NOW(),
  NOW()
),
(
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'marie.user@email.com',
  '$2a$10$8kF.Jh0H0H0H0H0H0H0H0O',
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Marie Ngassa","role":"user","phone":"+237 681 234 567"}',
  FALSE,
  NOW(),
  NOW()
),
(
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'chief.community@email.com',
  '$2a$10$8kF.Jh0H0H0H0H0H0H0H0O',
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Chief Johnson","role":"community","phone":"+237 692 345 678"}',
  FALSE,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Create profiles for these users
INSERT INTO public.profiles (id, full_name, phone, role)
SELECT 
  u.id,
  u.raw_user_meta_data->>'full_name',
  u.raw_user_meta_data->>'phone',
  u.raw_user_meta_data->>'role'
FROM auth.users u
WHERE u.email IN ('john.owner@email.com', 'marie.user@email.com', 'chief.community@email.com')
ON CONFLICT (id) DO NOTHING;

-- Add some properties for the owner
INSERT INTO public.properties (
  title,
  description,
  price,
  currency,
  property_type,
  listing_type,
  status,
  city,
  region,
  latitude,
  longitude,
  bedrooms,
  bathrooms,
  area_sqm,
  owner_id
) VALUES 
(
  'Owner Villa in Douala',
  'My personal villa that I want to list for sale',
  35000000,
  'XAF',
  'house',
  'sale',
  'available',
  'Douala',
  'Littoral',
  4.0611,
  9.7779,
  5,
  4,
  500,
  (SELECT id FROM auth.users WHERE email = 'john.owner@email.com')
),
(
  'Rental Apartment Yaoundé',
  'Investment property for rental income',
  120000,
  'XAF',
  'apartment',
  'rent',
  'available',
  'Yaoundé',
  'Centre',
  3.8580,
  11.5121,
  2,
  1,
  80,
  (SELECT id FROM auth.users WHERE email = 'john.owner@email.com')
);

-- Add some favorites for the regular user
INSERT INTO public.favorites (user_id, property_id)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'marie.user@email.com'),
  p.id
FROM public.properties p 
WHERE p.title IN ('Luxury Villa in Douala', 'Family Home in Bamenda')
ON CONFLICT (user_id, property_id) DO NOTHING;

-- Verify the data was inserted correctly
SELECT 
  'Broker Properties' as data_type,
  COUNT(*) as count
FROM public.properties p
WHERE p.owner_id = (SELECT id FROM auth.users WHERE email = 'zleanstudyapp@gmail.com')

UNION ALL

SELECT 
  'Total Properties' as data_type,
  COUNT(*) as count
FROM public.properties

UNION ALL

SELECT 
  'Total Users' as data_type,
  COUNT(*) as count
FROM public.profiles

UNION ALL

SELECT 
  'Property Images' as data_type,
  COUNT(*) as count
FROM public.property_images;