-- Manual test data creation script
-- Run this ONLY after you have real users in your auth.users table
-- You can get real user IDs from: SELECT id FROM auth.users;

-- First, check what users exist
SELECT 'Existing users in auth.users:' as info;
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;

-- Then manually add properties for existing users
-- Replace the owner_id values with actual user IDs from your auth.users table

/*
-- Example: Add test properties for existing users
-- Uncomment and modify these INSERT statements with real user IDs

INSERT INTO public.properties (
  title, description, city, region, price, currency, 
  property_type, listing_type, status, owner_id, verified, created_at
) VALUES 
  (
    'Modern Villa in Douala',
    'Beautiful 4-bedroom villa with ocean view and modern amenities',
    'Douala', 'Littoral', 150000000, 'XAF', 'villa',
    'sale', 'available', 'YOUR_REAL_USER_ID_HERE', false, NOW() - INTERVAL '2 days'
  ),
  (
    'Commercial Building Downtown',
    'Prime commercial space in city center with high foot traffic',
    'Yaoundé', 'Centre', 300000000, 'XAF', 'commercial',
    'sale', 'available', 'YOUR_REAL_USER_ID_HERE', false, NOW() - INTERVAL '1 day'
  ),
  (
    'Luxury Apartment Complex',
    'New 3-bedroom apartments with swimming pool and gym',
    'Douala', 'Littoral', 75000000, 'XAF', 'apartment',
    'sale', 'available', 'YOUR_REAL_USER_ID_HERE', true, NOW() - INTERVAL '5 hours'
  );
*/

SELECT 'To add test properties, modify the INSERT statements above with real user IDs' as instruction;
