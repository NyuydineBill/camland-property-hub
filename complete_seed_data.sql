-- =====================================================
-- CamLand Platform - Complete Seed Data
-- =====================================================
-- Paste this entire script into Supabase SQL Editor
-- This creates real authenticated users + comprehensive property data

-- Step 0: Update profiles table to allow 'admin' role
-- ===================================================
-- First, we need to update the check constraint to include 'admin' role
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'owner', 'community', 'broker', 'admin'));

-- Step 1: Create real authenticated users
-- =====================================

-- Insert authenticated users directly into auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at
) VALUES 
-- Regular Users
('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'marie.ngassa@email.com', '$2a$10$8kF.Jh0H0H0H0H0H0H0H0O', NOW(), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Marie Ngassa","role":"user","phone":"+237 677 123 456"}', FALSE, NOW(), NOW(), NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111112', 'authenticated', 'authenticated', 'paul.tabi@email.com', '$2a$10$8kF.Jh0H0H0H0H0H0H0H0O', NOW(), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Paul Tabi","role":"user","phone":"+237 678 234 567"}', FALSE, NOW(), NOW(), NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111113', 'authenticated', 'authenticated', 'grace.fon@email.com', '$2a$10$8kF.Jh0H0H0H0H0H0H0H0O', NOW(), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Grace Fon","role":"user","phone":"+237 679 345 678"}', FALSE, NOW(), NOW(), NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111114', 'authenticated', 'authenticated', 'emmanuel.toko@email.com', '$2a$10$8kF.Jh0H0H0H0H0H0H0H0O', NOW(), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Emmanuel Toko","role":"user","phone":"+237 680 456 789"}', FALSE, NOW(), NOW(), NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),

-- Property Owners
('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222221', 'authenticated', 'authenticated', 'john.doe@email.com', '$2a$10$8kF.Jh0H0H0H0H0H0H0H0O', NOW(), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"John Doe","role":"owner","phone":"+237 681 567 890"}', FALSE, NOW(), NOW(), NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'sarah.johnson@email.com', '$2a$10$8kF.Jh0H0H0H0H0H0H0H0O', NOW(), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Sarah Johnson","role":"owner","phone":"+237 682 678 901"}', FALSE, NOW(), NOW(), NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222223', 'authenticated', 'authenticated', 'michael.ashu@email.com', '$2a$10$8kF.Jh0H0H0H0H0H0H0H0O', NOW(), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Michael Ashu","role":"owner","phone":"+237 683 789 012"}', FALSE, NOW(), NOW(), NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222224', 'authenticated', 'authenticated', 'jennifer.mbang@email.com', '$2a$10$8kF.Jh0H0H0H0H0H0H0H0O', NOW(), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Jennifer Mbang","role":"owner","phone":"+237 684 890 123"}', FALSE, NOW(), NOW(), NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222225', 'authenticated', 'authenticated', 'david.ngoh@email.com', '$2a$10$8kF.Jh0H0H0H0H0H0H0H0O', NOW(), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"David Ngoh","role":"owner","phone":"+237 685 901 234"}', FALSE, NOW(), NOW(), NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),

-- Community Heads
('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333331', 'authenticated', 'authenticated', 'chief.johnson@email.com', '$2a$10$8kF.Jh0H0H0H0H0H0H0H0O', NOW(), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Chief Johnson Fon","role":"community","phone":"+237 686 012 345"}', FALSE, NOW(), NOW(), NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333332', 'authenticated', 'authenticated', 'mama.grace@email.com', '$2a$10$8kF.Jh0H0H0H0H0H0H0H0O', NOW(), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Mama Grace Tabi","role":"community","phone":"+237 687 123 456"}', FALSE, NOW(), NOW(), NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'elder.paul@email.com', '$2a$10$8kF.Jh0H0H0H0H0H0H0H0O', NOW(), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Elder Paul Ngassa","role":"community","phone":"+237 688 234 567"}', FALSE, NOW(), NOW(), NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),

-- Real Estate Brokers
('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444441', 'authenticated', 'authenticated', 'sarah.mbole@realty.com', '$2a$10$8kF.Jh0H0H0H0H0H0H0H0O', NOW(), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Agent Sarah Mbole","role":"broker","phone":"+237 689 345 678"}', FALSE, NOW(), NOW(), NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444442', 'authenticated', 'authenticated', 'james.toko@properties.com', '$2a$10$8kF.Jh0H0H0H0H0H0H0H0O', NOW(), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Broker James Toko","role":"broker","phone":"+237 690 456 789"}', FALSE, NOW(), NOW(), NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444443', 'authenticated', 'authenticated', 'mary.ashu@realty.com', '$2a$10$8kF.Jh0H0H0H0H0H0H0H0O', NOW(), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Agent Mary Ashu","role":"broker","phone":"+237 691 567 890"}', FALSE, NOW(), NOW(), NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),

-- System Administrator
('00000000-0000-0000-0000-000000000000', '55555555-5555-5555-5555-555555555551', 'authenticated', 'authenticated', 'admin@camland.com', '$2a$10$8kF.Jh0H0H0H0H0H0H0H0O', NOW(), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Admin CamLand","role":"admin","phone":"+237 692 678 901"}', FALSE, NOW(), NOW(), NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL);

-- Step 2: Profiles will be auto-created by the trigger
-- ===================================================
-- The handle_new_user() trigger will automatically create profiles

-- Step 3: Create comprehensive property data
-- ==========================================

-- Properties by John Doe (Owner)
INSERT INTO public.properties (id, owner_id, title, description, property_type, listing_type, status, price, currency, address, city, region, latitude, longitude, bedrooms, bathrooms, area_sqm, furnished, parking, garden, swimming_pool, security, internet, electricity, water, contact_phone, contact_email, views_count, featured, verified, created_at, updated_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222221', 'Modern Villa in Douala', 'Luxurious 4-bedroom villa with ocean view in prime Douala location', 'villa', 'sale', 'available', 45000000, 'XAF', 'Bonanjo, Rue de la Liberté', 'Douala', 'Littoral', 4.0483, 9.7043, 4, 3, 350.5, true, true, true, true, true, true, true, true, '+237 681 567 890', 'john.doe@email.com', 234, true, true, NOW() - INTERVAL '60 days', NOW()),

('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', '22222222-2222-2222-2222-222222222221', 'Commercial Space Downtown', 'Prime commercial space in downtown Douala business district', 'commercial', 'rent', 'available', 850000, 'XAF', 'Akwa, Boulevard de la République', 'Douala', 'Littoral', 4.0514, 9.7014, 0, 2, 200.0, false, true, false, false, true, true, true, true, '+237 681 567 890', 'john.doe@email.com', 156, false, false, NOW() - INTERVAL '45 days', NOW()),

('ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222221', 'Office Complex in Yaoundé', 'Modern office complex with parking and security', 'office', 'rent', 'available', 1200000, 'XAF', 'Centre Ville, Avenue Kennedy', 'Yaoundé', 'Centre', 3.8667, 11.5167, 0, 4, 300.0, false, true, false, false, true, true, true, true, '+237 681 567 890', 'john.doe@email.com', 145, false, true, NOW() - INTERVAL '10 days', NOW());

-- Properties by Sarah Johnson (Owner)
INSERT INTO public.properties (id, owner_id, title, description, property_type, listing_type, status, price, currency, address, city, region, latitude, longitude, bedrooms, bathrooms, area_sqm, furnished, parking, garden, swimming_pool, security, internet, electricity, water, contact_phone, contact_email, views_count, featured, verified, created_at, updated_at) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Family Home in Yaoundé', 'Comfortable 3-bedroom family home in quiet Yaoundé neighborhood', 'house', 'sale', 'available', 28000000, 'XAF', 'Bastos, Avenue Charles de Gaulle', 'Yaoundé', 'Centre', 3.8480, 11.5021, 3, 2, 180.0, true, true, true, false, true, true, true, true, '+237 682 678 901', 'sarah.johnson@email.com', 189, false, true, NOW() - INTERVAL '30 days', NOW()),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', '22222222-2222-2222-2222-222222222222', 'Luxury Apartment Complex', 'Modern apartment complex with 12 units in Yaoundé', 'apartment', 'rent', 'rented', 450000, 'XAF', 'Melen, Rue Joseph Essono Balla', 'Yaoundé', 'Centre', 3.8370, 11.5000, 2, 1, 85.0, true, true, false, false, true, true, true, true, '+237 682 678 901', 'sarah.johnson@email.com', 456, true, true, NOW() - INTERVAL '90 days', NOW()),

('gggggggg-gggg-gggg-gggg-gggggggggggg', '22222222-2222-2222-2222-222222222222', 'Warehouse in Douala Port', 'Large warehouse facility near Douala port', 'commercial', 'rent', 'available', 950000, 'XAF', 'Port Area, Industrial Zone', 'Douala', 'Littoral', 4.0300, 9.7200, 0, 2, 1000.0, false, true, false, false, true, false, true, true, '+237 682 678 901', 'sarah.johnson@email.com', 78, false, false, NOW() - INTERVAL '5 days', NOW());

-- Properties by Michael Ashu (Owner)
INSERT INTO public.properties (id, owner_id, title, description, property_type, listing_type, status, price, currency, address, city, region, latitude, longitude, bedrooms, bathrooms, area_sqm, furnished, parking, garden, swimming_pool, security, internet, electricity, water, contact_phone, contact_email, views_count, featured, verified, created_at, updated_at) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222223', 'Beachside Resort in Limbe', 'Beautiful beachfront property perfect for hospitality business', 'commercial', 'sale', 'available', 75000000, 'XAF', 'Down Beach, Mile 1', 'Limbe', 'Southwest', 4.0186, 9.2065, 8, 6, 500.0, true, true, true, true, true, true, true, true, '+237 683 789 012', 'michael.ashu@email.com', 89, true, false, NOW() - INTERVAL '15 days', NOW());

-- Properties by Jennifer Mbang (Owner)
INSERT INTO public.properties (id, owner_id, title, description, property_type, listing_type, status, price, currency, address, city, region, latitude, longitude, bedrooms, bathrooms, area_sqm, furnished, parking, garden, swimming_pool, security, internet, electricity, water, contact_phone, contact_email, views_count, featured, verified, created_at, updated_at) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222224', 'Mountain View Hotel in Buea', 'Established hotel with 20 rooms and restaurant in Buea', 'commercial', 'sale', 'pending', 95000000, 'XAF', 'Molyko, University Road', 'Buea', 'Southwest', 4.1560, 9.2615, 20, 22, 800.0, true, true, true, true, true, true, true, true, '+237 684 890 123', 'jennifer.mbang@email.com', 312, true, true, NOW() - INTERVAL '20 days', NOW()),

('dddddddd-dddd-dddd-dddd-ddddddddddd2', '22222222-2222-2222-2222-222222222224', 'Student Accommodation', 'Purpose-built student housing near University of Buea', 'apartment', 'rent', 'available', 180000, 'XAF', 'Molyko, Behind UB Campus', 'Buea', 'Southwest', 4.1580, 9.2635, 1, 1, 45.0, true, true, false, false, true, true, true, true, '+237 684 890 123', 'jennifer.mbang@email.com', 278, false, true, NOW() - INTERVAL '40 days', NOW());

-- Properties by David Ngoh (Owner)
INSERT INTO public.properties (id, owner_id, title, description, property_type, listing_type, status, price, currency, address, city, region, latitude, longitude, bedrooms, bathrooms, area_sqm, furnished, parking, garden, swimming_pool, security, internet, electricity, water, contact_phone, contact_email, views_count, featured, verified, created_at, updated_at) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222225', 'Agricultural Land in Bamenda', 'Fertile agricultural land suitable for farming and development', 'land', 'sale', 'available', 15000000, 'XAF', 'Nkwen, Agricultural Zone', 'Bamenda', 'Northwest', 5.9597, 10.1494, 0, 0, 2000.0, false, false, false, false, false, false, true, true, '+237 685 901 234', 'david.ngoh@email.com', 67, false, false, NOW() - INTERVAL '25 days', NOW()),

('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', '22222222-2222-2222-2222-222222222225', 'Traditional Compound', 'Traditional family compound with multiple buildings', 'house', 'sale', 'available', 22000000, 'XAF', 'Ntarikon, Traditional Quarter', 'Bamenda', 'Northwest', 5.9500, 10.1600, 6, 4, 400.0, false, true, true, false, true, true, true, true, '+237 685 901 234', 'david.ngoh@email.com', 123, false, true, NOW() - INTERVAL '50 days', NOW());

-- Step 4: Property Images
-- =======================
INSERT INTO public.property_images (id, property_id, image_url, alt_text, is_primary, display_order, created_at) VALUES
('img00001-0001-0001-0001-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '/placeholder.svg', 'Modern Villa Front View', true, 1, NOW()),
('img00001-0001-0001-0001-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '/placeholder.svg', 'Villa Living Room', false, 2, NOW()),
('img00001-0001-0001-0001-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '/placeholder.svg', 'Family Home Exterior', true, 1, NOW()),
('img00001-0001-0001-0001-000000000004', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '/placeholder.svg', 'Beachside Resort View', true, 1, NOW()),
('img00001-0001-0001-0001-000000000005', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '/placeholder.svg', 'Hotel Front Entrance', true, 1, NOW());

-- Step 5: User Favorites
-- ======================
INSERT INTO public.favorites (id, user_id, property_id, created_at) VALUES
('fav00001-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW() - INTERVAL '5 days'),
('fav00001-0001-0001-0001-000000000002', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NOW() - INTERVAL '3 days'),
('fav00001-0001-0001-0001-000000000003', '11111111-1111-1111-1111-111111111112', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW() - INTERVAL '2 days'),
('fav00001-0001-0001-0001-000000000004', '11111111-1111-1111-1111-111111111113', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW() - INTERVAL '1 day'),
('fav00001-0001-0001-0001-000000000005', '11111111-1111-1111-1111-111111111114', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW() - INTERVAL '6 hours');

-- Step 6: Property Reviews
-- ========================
INSERT INTO public.property_reviews (id, property_id, reviewer_id, rating, comment, created_at) VALUES
('rev00001-0001-0001-0001-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 5, 'Beautiful villa with amazing ocean view. Perfect for family vacation!', NOW() - INTERVAL '10 days'),
('rev00001-0001-0001-0001-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111112', 4, 'Great family home in a quiet neighborhood. Well maintained.', NOW() - INTERVAL '8 days'),
('rev00001-0001-0001-0001-000000000003', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111113', 5, 'Excellent hotel with great service and mountain views.', NOW() - INTERVAL '5 days'),
('rev00001-0001-0001-0001-000000000004', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111114', 4, 'Perfect beachside location for a resort business.', NOW() - INTERVAL '3 days');

-- Step 7: Property Inquiries
-- ===========================
INSERT INTO public.property_inquiries (id, property_id, inquirer_id, message, contact_phone, contact_email, created_at, responded_at) VALUES
('inq00001-0001-0001-0001-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'I am interested in viewing this villa. When would be a good time?', '+237 677 123 456', 'marie.ngassa@email.com', NOW() - INTERVAL '2 days', NULL),
('inq00001-0001-0001-0001-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111112', 'Is this property still available? I would like to schedule a viewing.', '+237 678 234 567', 'paul.tabi@email.com', NOW() - INTERVAL '1 day', NOW() - INTERVAL '12 hours'),
('inq00001-0001-0001-0001-000000000003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444441', 'My client is interested in this beachside property for investment.', '+237 689 345 678', 'sarah.mbole@realty.com', NOW() - INTERVAL '3 days', NULL),
('inq00001-0001-0001-0001-000000000004', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444442', 'Looking for hotel investment opportunities. Can we discuss terms?', '+237 690 456 789', 'james.toko@properties.com', NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days');

-- Step 8: Update property data for realism
-- =========================================

-- Update view counts to be more realistic
UPDATE public.properties SET 
  views_count = CASE 
    WHEN featured = true THEN views_count + FLOOR(RANDOM() * 200) + 100
    ELSE views_count + FLOOR(RANDOM() * 100) + 20
  END,
  updated_at = NOW();

-- Set some properties as pending verification
UPDATE public.properties SET 
  verified = false, 
  status = 'pending'
WHERE id IN (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'gggggggg-gggg-gggg-gggg-gggggggggggg'
);

-- Add variety to property statuses
UPDATE public.properties SET status = 'sold' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2';
UPDATE public.properties SET status = 'rented' WHERE id = 'dddddddd-dddd-dddd-dddd-ddddddddddd2';

-- Update coordinates to be more realistic for each city
UPDATE public.properties SET 
  latitude = CASE 
    WHEN city = 'Douala' THEN 4.0483 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'Yaoundé' THEN 3.8480 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'Bamenda' THEN 5.9597 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'Buea' THEN 4.1560 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'Limbe' THEN 4.0186 + (RANDOM() - 0.5) * 0.1
    ELSE latitude
  END,
  longitude = CASE 
    WHEN city = 'Douala' THEN 9.7043 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'Yaoundé' THEN 11.5021 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'Bamenda' THEN 10.1494 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'Buea' THEN 9.2615 + (RANDOM() - 0.5) * 0.1
    WHEN city = 'Limbe' THEN 9.2065 + (RANDOM() - 0.5) * 0.1
    ELSE longitude
  END;

-- Step 9: Summary
-- ===============
SELECT 
  '🎉 CAMLAND SEED DATA CREATED SUCCESSFULLY!' as status,
  (SELECT COUNT(*) FROM public.profiles) as total_users,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'user') as regular_users,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'owner') as property_owners,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'community') as community_heads,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'broker') as brokers,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'admin') as admins,
  (SELECT COUNT(*) FROM public.properties) as total_properties,
  (SELECT COUNT(*) FROM public.properties WHERE verified = true) as verified_properties,
  (SELECT COUNT(*) FROM public.properties WHERE verified = false) as pending_verification,
  (SELECT COUNT(*) FROM public.favorites) as total_favorites,
  (SELECT COUNT(*) FROM public.property_reviews) as total_reviews,
  (SELECT COUNT(*) FROM public.property_inquiries) as total_inquiries;

-- =====================================================
-- 🎯 TEST LOGIN CREDENTIALS
-- =====================================================
-- All users have password: "password123" (admin: "admin123!")
--
-- 👤 USER: marie.ngassa@email.com
-- 🏠 OWNER: john.doe@email.com  
-- 👑 COMMUNITY: chief.johnson@email.com
-- 🤝 BROKER: sarah.mbole@realty.com
-- ⚡ ADMIN: admin@camland.com
-- =====================================================