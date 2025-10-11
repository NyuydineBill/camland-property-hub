-- Test data creation for AdminDashboard testing

-- Create some test profiles manually (since auth.users might be restricted)
INSERT INTO public.profiles (id, full_name, phone, role, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'John Smith', '+237677123456', 'user', NOW() - INTERVAL '2 days', NOW()),
  ('22222222-2222-2222-2222-222222222222', 'Sarah Johnson', '+237677654321', 'broker', NOW() - INTERVAL '1 day', NOW()),
  ('33333333-3333-3333-3333-333333333333', 'Mike Wilson', '+237677987654', 'user', NOW() - INTERVAL '3 hours', NOW()),
  ('44444444-4444-4444-4444-444444444444', 'Emma Davis', '+237677456789', 'community', NOW() - INTERVAL '5 hours', NOW()),
  ('55555555-5555-5555-5555-555555555555', 'Robert Brown', '+237677321654', 'user', NOW() - INTERVAL '1 hour', NOW())
ON CONFLICT (id) DO NOTHING;

-- Create some test properties
INSERT INTO public.properties (
  id, title, description, city, region, price, currency, 
  property_type, listing_type, status, owner_id, verified, created_at
) VALUES 
  (
    gen_random_uuid(),
    'Modern Villa in Douala',
    'Beautiful 4-bedroom villa with ocean view and modern amenities',
    'Douala', 'Littoral', 150000000, 'XAF', 'villa',
    'sale', 'available', '11111111-1111-1111-1111-111111111111', false, NOW() - INTERVAL '2 days'
  ),
  (
    gen_random_uuid(),
    'Commercial Building Downtown',
    'Prime commercial space in city center with high foot traffic',
    'Yaoundé', 'Centre', 300000000, 'XAF', 'commercial',
    'sale', 'available', '22222222-2222-2222-2222-222222222222', false, NOW() - INTERVAL '1 day'
  ),
  (
    gen_random_uuid(),
    'Luxury Apartment Complex',
    'New 3-bedroom apartments with swimming pool and gym',
    'Douala', 'Littoral', 75000000, 'XAF', 'apartment',
    'sale', 'available', '33333333-3333-3333-3333-333333333333', true, NOW() - INTERVAL '5 hours'
  ),
  (
    gen_random_uuid(),
    'Residential Plot in Bamenda',
    '500 sqm residential land in quiet neighborhood',
    'Bamenda', 'North West', 25000000, 'XAF', 'land',
    'sale', 'available', '44444444-4444-4444-4444-444444444444', false, NOW() - INTERVAL '3 hours'
  ),
  (
    gen_random_uuid(),
    'Office Space for Rent',
    'Modern office space in business district',
    'Yaoundé', 'Centre', 500000, 'XAF', 'office',
    'rent', 'available', '55555555-5555-5555-5555-555555555555', false, NOW() - INTERVAL '1 hour'
  )
ON CONFLICT DO NOTHING;

-- Verify test data was created
SELECT 'Test profiles created:' as info, COUNT(*) as count 
FROM public.profiles 
WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555'
)
UNION ALL
SELECT 'Test properties created:', COUNT(*) 
FROM public.properties 
WHERE owner_id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555'
)
UNION ALL
SELECT 'Pending verifications:', COUNT(*) 
FROM public.properties 
WHERE verified = false;

SELECT 'Test data creation completed!' as status;
