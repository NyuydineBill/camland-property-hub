-- Comprehensive property and activity seed data for CamLand Platform
-- This script creates realistic property data tied to existing authenticated users

-- First, let's get the user IDs from profiles (these will be created by the auth script)
-- We'll use a more flexible approach that works with existing users

-- Insert diverse properties using owner emails to find user IDs
DO $$
DECLARE
  john_doe_id UUID;
  sarah_johnson_id UUID;
  michael_ashu_id UUID;
  jennifer_mbang_id UUID;
  david_ngoh_id UUID;
  marie_ngassa_id UUID;
  paul_tabi_id UUID;
  grace_fon_id UUID;
  emmanuel_toko_id UUID;
  chief_johnson_id UUID;
  mama_grace_id UUID;
  elder_paul_id UUID;
  sarah_mbole_id UUID;
  james_toko_id UUID;
  mary_ashu_id UUID;
BEGIN
  -- Get user IDs from profiles table (created by auth system)
  SELECT id INTO john_doe_id FROM public.profiles WHERE full_name = 'John Doe' LIMIT 1;
  SELECT id INTO sarah_johnson_id FROM public.profiles WHERE full_name = 'Sarah Johnson' LIMIT 1;
  SELECT id INTO michael_ashu_id FROM public.profiles WHERE full_name = 'Michael Ashu' LIMIT 1;
  SELECT id INTO jennifer_mbang_id FROM public.profiles WHERE full_name = 'Jennifer Mbang' LIMIT 1;
  SELECT id INTO david_ngoh_id FROM public.profiles WHERE full_name = 'David Ngoh' LIMIT 1;
  SELECT id INTO marie_ngassa_id FROM public.profiles WHERE full_name = 'Marie Ngassa' LIMIT 1;
  SELECT id INTO paul_tabi_id FROM public.profiles WHERE full_name = 'Paul Tabi' LIMIT 1;
  SELECT id INTO grace_fon_id FROM public.profiles WHERE full_name = 'Grace Fon' LIMIT 1;
  SELECT id INTO emmanuel_toko_id FROM public.profiles WHERE full_name = 'Emmanuel Toko' LIMIT 1;
  SELECT id INTO chief_johnson_id FROM public.profiles WHERE full_name = 'Chief Johnson Fon' LIMIT 1;
  SELECT id INTO mama_grace_id FROM public.profiles WHERE full_name = 'Mama Grace Tabi' LIMIT 1;
  SELECT id INTO elder_paul_id FROM public.profiles WHERE full_name = 'Elder Paul Ngassa' LIMIT 1;
  SELECT id INTO sarah_mbole_id FROM public.profiles WHERE full_name = 'Agent Sarah Mbole' LIMIT 1;
  SELECT id INTO james_toko_id FROM public.profiles WHERE full_name = 'Broker James Toko' LIMIT 1;
  SELECT id INTO mary_ashu_id FROM public.profiles WHERE full_name = 'Agent Mary Ashu' LIMIT 1;

  -- Only proceed if we found the users
  IF john_doe_id IS NOT NULL THEN
    
    -- Insert properties for John Doe (Owner)
    INSERT INTO public.properties (id, owner_id, title, description, property_type, listing_type, status, price, currency, address, city, region, latitude, longitude, bedrooms, bathrooms, area_sqm, furnished, parking, garden, swimming_pool, security, internet, electricity, water, contact_phone, contact_email, views_count, featured, verified, created_at, updated_at) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', john_doe_id, 'Modern Villa in Douala', 'Luxurious 4-bedroom villa with ocean view in prime Douala location', 'villa', 'sale', 'available', 45000000, 'XAF', 'Bonanjo, Rue de la Liberté', 'Douala', 'Littoral', 4.0483, 9.7043, 4, 3, 350.5, true, true, true, true, true, true, true, true, '+237 681 567 890', 'john.doe@email.com', 234, true, true, NOW() - INTERVAL '60 days', NOW()),

    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', john_doe_id, 'Commercial Space Downtown', 'Prime commercial space in downtown Douala business district', 'commercial', 'rent', 'available', 850000, 'XAF', 'Akwa, Boulevard de la République', 'Douala', 'Littoral', 4.0514, 9.7014, 0, 2, 200.0, false, true, false, false, true, true, true, true, '+237 681 567 890', 'john.doe@email.com', 156, false, false, NOW() - INTERVAL '45 days', NOW()),

    ('ffffffff-ffff-ffff-ffff-ffffffffffff', john_doe_id, 'Office Complex in Yaoundé', 'Modern office complex with parking and security', 'office', 'rent', 'available', 1200000, 'XAF', 'Centre Ville, Avenue Kennedy', 'Yaoundé', 'Centre', 3.8667, 11.5167, 0, 4, 300.0, false, true, false, false, true, true, true, true, '+237 681 567 890', 'john.doe@email.com', 145, false, true, NOW() - INTERVAL '10 days', NOW());

  END IF;

  -- Insert properties for Sarah Johnson (Owner)
  IF sarah_johnson_id IS NOT NULL THEN
    INSERT INTO public.properties (id, owner_id, title, description, property_type, listing_type, status, price, currency, address, city, region, latitude, longitude, bedrooms, bathrooms, area_sqm, furnished, parking, garden, swimming_pool, security, internet, electricity, water, contact_phone, contact_email, views_count, featured, verified, created_at, updated_at) VALUES
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', sarah_johnson_id, 'Family Home in Yaoundé', 'Comfortable 3-bedroom family home in quiet Yaoundé neighborhood', 'house', 'sale', 'available', 28000000, 'XAF', 'Bastos, Avenue Charles de Gaulle', 'Yaoundé', 'Centre', 3.8480, 11.5021, 3, 2, 180.0, true, true, true, false, true, true, true, true, '+237 682 678 901', 'sarah.johnson@email.com', 189, false, true, NOW() - INTERVAL '30 days', NOW()),

    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', sarah_johnson_id, 'Luxury Apartment Complex', 'Modern apartment complex with 12 units in Yaoundé', 'apartment', 'rent', 'rented', 450000, 'XAF', 'Melen, Rue Joseph Essono Balla', 'Yaoundé', 'Centre', 3.8370, 11.5000, 2, 1, 85.0, true, true, false, false, true, true, true, true, '+237 682 678 901', 'sarah.johnson@email.com', 456, true, true, NOW() - INTERVAL '90 days', NOW()),

    ('gggggggg-gggg-gggg-gggg-gggggggggggg', sarah_johnson_id, 'Warehouse in Douala Port', 'Large warehouse facility near Douala port', 'commercial', 'rent', 'available', 950000, 'XAF', 'Port Area, Industrial Zone', 'Douala', 'Littoral', 4.0300, 9.7200, 0, 2, 1000.0, false, true, false, false, true, false, true, true, '+237 682 678 901', 'sarah.johnson@email.com', 78, false, false, NOW() - INTERVAL '5 days', NOW());
  END IF;

  -- Insert properties for Michael Ashu (Owner)
  IF michael_ashu_id IS NOT NULL THEN
    INSERT INTO public.properties (id, owner_id, title, description, property_type, listing_type, status, price, currency, address, city, region, latitude, longitude, bedrooms, bathrooms, area_sqm, furnished, parking, garden, swimming_pool, security, internet, electricity, water, contact_phone, contact_email, views_count, featured, verified, created_at, updated_at) VALUES
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', michael_ashu_id, 'Beachside Resort in Limbe', 'Beautiful beachfront property perfect for hospitality business', 'commercial', 'sale', 'available', 75000000, 'XAF', 'Down Beach, Mile 1', 'Limbe', 'Southwest', 4.0186, 9.2065, 8, 6, 500.0, true, true, true, true, true, true, true, true, '+237 683 789 012', 'michael.ashu@email.com', 89, true, false, NOW() - INTERVAL '15 days', NOW());
  END IF;

  -- Insert properties for Jennifer Mbang (Owner)
  IF jennifer_mbang_id IS NOT NULL THEN
    INSERT INTO public.properties (id, owner_id, title, description, property_type, listing_type, status, price, currency, address, city, region, latitude, longitude, bedrooms, bathrooms, area_sqm, furnished, parking, garden, swimming_pool, security, internet, electricity, water, contact_phone, contact_email, views_count, featured, verified, created_at, updated_at) VALUES
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', jennifer_mbang_id, 'Mountain View Hotel in Buea', 'Established hotel with 20 rooms and restaurant in Buea', 'commercial', 'sale', 'pending', 95000000, 'XAF', 'Molyko, University Road', 'Buea', 'Southwest', 4.1560, 9.2615, 20, 22, 800.0, true, true, true, true, true, true, true, true, '+237 684 890 123', 'jennifer.mbang@email.com', 312, true, true, NOW() - INTERVAL '20 days', NOW()),

    ('dddddddd-dddd-dddd-dddd-ddddddddddd2', jennifer_mbang_id, 'Student Accommodation', 'Purpose-built student housing near University of Buea', 'apartment', 'rent', 'available', 180000, 'XAF', 'Molyko, Behind UB Campus', 'Buea', 'Southwest', 4.1580, 9.2635, 1, 1, 45.0, true, true, false, false, true, true, true, true, '+237 684 890 123', 'jennifer.mbang@email.com', 278, false, true, NOW() - INTERVAL '40 days', NOW());
  END IF;

  -- Insert properties for David Ngoh (Owner)
  IF david_ngoh_id IS NOT NULL THEN
    INSERT INTO public.properties (id, owner_id, title, description, property_type, listing_type, status, price, currency, address, city, region, latitude, longitude, bedrooms, bathrooms, area_sqm, furnished, parking, garden, swimming_pool, security, internet, electricity, water, contact_phone, contact_email, views_count, featured, verified, created_at, updated_at) VALUES
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', david_ngoh_id, 'Agricultural Land in Bamenda', 'Fertile agricultural land suitable for farming and development', 'land', 'sale', 'available', 15000000, 'XAF', 'Nkwen, Agricultural Zone', 'Bamenda', 'Northwest', 5.9597, 10.1494, 0, 0, 2000.0, false, false, false, false, false, false, true, true, '+237 685 901 234', 'david.ngoh@email.com', 67, false, false, NOW() - INTERVAL '25 days', NOW()),

    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', david_ngoh_id, 'Traditional Compound', 'Traditional family compound with multiple buildings', 'house', 'sale', 'available', 22000000, 'XAF', 'Ntarikon, Traditional Quarter', 'Bamenda', 'Northwest', 5.9500, 10.1600, 6, 4, 400.0, false, true, true, false, true, true, true, true, '+237 685 901 234', 'david.ngoh@email.com', 123, false, true, NOW() - INTERVAL '50 days', NOW());
  END IF;

  -- Insert property images for some properties
  INSERT INTO public.property_images (id, property_id, image_url, alt_text, is_primary, display_order, created_at) VALUES
  ('img00001-0001-0001-0001-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '/placeholder.svg', 'Modern Villa Front View', true, 1, NOW()),
  ('img00001-0001-0001-0001-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '/placeholder.svg', 'Villa Living Room', false, 2, NOW()),
  ('img00001-0001-0001-0001-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '/placeholder.svg', 'Family Home Exterior', true, 1, NOW()),
  ('img00001-0001-0001-0001-000000000004', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '/placeholder.svg', 'Beachside Resort View', true, 1, NOW()),
  ('img00001-0001-0001-0001-000000000005', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '/placeholder.svg', 'Hotel Front Entrance', true, 1, NOW());

  -- Insert favorites for users (if user IDs exist)
  IF marie_ngassa_id IS NOT NULL THEN
    INSERT INTO public.favorites (id, user_id, property_id, created_at) VALUES
    ('fav00001-0001-0001-0001-000000000001', marie_ngassa_id, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW() - INTERVAL '5 days'),
    ('fav00001-0001-0001-0001-000000000002', marie_ngassa_id, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NOW() - INTERVAL '3 days');
  END IF;

  IF paul_tabi_id IS NOT NULL THEN
    INSERT INTO public.favorites (id, user_id, property_id, created_at) VALUES
    ('fav00001-0001-0001-0001-000000000003', paul_tabi_id, 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW() - INTERVAL '2 days');
  END IF;

  IF grace_fon_id IS NOT NULL THEN
    INSERT INTO public.favorites (id, user_id, property_id, created_at) VALUES
    ('fav00001-0001-0001-0001-000000000004', grace_fon_id, 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW() - INTERVAL '1 day');
  END IF;

  IF emmanuel_toko_id IS NOT NULL THEN
    INSERT INTO public.favorites (id, user_id, property_id, created_at) VALUES
    ('fav00001-0001-0001-0001-000000000005', emmanuel_toko_id, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW() - INTERVAL '6 hours');
  END IF;

  -- Insert property reviews
  IF marie_ngassa_id IS NOT NULL THEN
    INSERT INTO public.property_reviews (id, property_id, reviewer_id, rating, comment, created_at) VALUES
    ('rev00001-0001-0001-0001-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', marie_ngassa_id, 5, 'Beautiful villa with amazing ocean view. Perfect for family vacation!', NOW() - INTERVAL '10 days');
  END IF;

  IF paul_tabi_id IS NOT NULL THEN
    INSERT INTO public.property_reviews (id, property_id, reviewer_id, rating, comment, created_at) VALUES
    ('rev00001-0001-0001-0001-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', paul_tabi_id, 4, 'Great family home in a quiet neighborhood. Well maintained.', NOW() - INTERVAL '8 days');
  END IF;

  IF grace_fon_id IS NOT NULL THEN
    INSERT INTO public.property_reviews (id, property_id, reviewer_id, rating, comment, created_at) VALUES
    ('rev00001-0001-0001-0001-000000000003', 'dddddddd-dddd-dddd-dddd-dddddddddddd', grace_fon_id, 5, 'Excellent hotel with great service and mountain views.', NOW() - INTERVAL '5 days');
  END IF;

  IF emmanuel_toko_id IS NOT NULL THEN
    INSERT INTO public.property_reviews (id, property_id, reviewer_id, rating, comment, created_at) VALUES
    ('rev00001-0001-0001-0001-000000000004', 'cccccccc-cccc-cccc-cccc-cccccccccccc', emmanuel_toko_id, 4, 'Perfect beachside location for a resort business.', NOW() - INTERVAL '3 days');
  END IF;

  -- Insert property inquiries
  IF marie_ngassa_id IS NOT NULL THEN
    INSERT INTO public.property_inquiries (id, property_id, inquirer_id, message, contact_phone, contact_email, created_at, responded_at) VALUES
    ('inq00001-0001-0001-0001-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', marie_ngassa_id, 'I am interested in viewing this villa. When would be a good time?', '+237 677 123 456', 'marie.ngassa@email.com', NOW() - INTERVAL '2 days', NULL);
  END IF;

  IF paul_tabi_id IS NOT NULL THEN
    INSERT INTO public.property_inquiries (id, property_id, inquirer_id, message, contact_phone, contact_email, created_at, responded_at) VALUES
    ('inq00001-0001-0001-0001-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', paul_tabi_id, 'Is this property still available? I would like to schedule a viewing.', '+237 678 234 567', 'paul.tabi@email.com', NOW() - INTERVAL '1 day', NOW() - INTERVAL '12 hours');
  END IF;

  IF sarah_mbole_id IS NOT NULL THEN
    INSERT INTO public.property_inquiries (id, property_id, inquirer_id, message, contact_phone, contact_email, created_at, responded_at) VALUES
    ('inq00001-0001-0001-0001-000000000003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', sarah_mbole_id, 'My client is interested in this beachside property for investment.', '+237 689 345 678', 'sarah.mbole@realty.com', NOW() - INTERVAL '3 days', NULL);
  END IF;

  IF james_toko_id IS NOT NULL THEN
    INSERT INTO public.property_inquiries (id, property_id, inquirer_id, message, contact_phone, contact_email, created_at, responded_at) VALUES
    ('inq00001-0001-0001-0001-000000000004', 'dddddddd-dddd-dddd-dddd-dddddddddddd', james_toko_id, 'Looking for hotel investment opportunities. Can we discuss terms?', '+237 690 456 789', 'james.toko@properties.com', NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days');
  END IF;

  -- Update view counts for properties to make them more realistic
  UPDATE public.properties SET 
    views_count = CASE 
      WHEN featured = true THEN views_count + FLOOR(RANDOM() * 200) + 100
      ELSE views_count + FLOOR(RANDOM() * 100) + 20
    END,
    updated_at = NOW()
  WHERE owner_id IN (john_doe_id, sarah_johnson_id, michael_ashu_id, jennifer_mbang_id, david_ngoh_id);

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

  -- Add some variety to property statuses for realistic dashboard data
  UPDATE public.properties SET status = 'sold' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2';
  UPDATE public.properties SET status = 'rented' WHERE id = 'dddddddd-dddd-dddd-dddd-ddddddddddd2';

  -- Update property coordinates to be more realistic for each city
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

  RAISE NOTICE 'Property seed data creation completed successfully!';

END $$;

-- Final data summary
SELECT 
  'PROPERTY SEED DATA SUMMARY' as summary,
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