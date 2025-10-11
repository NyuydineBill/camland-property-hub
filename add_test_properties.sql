-- Add test properties for admin verification testing
-- Run this in Supabase SQL Editor to create properties for admin to review

-- First, get the admin user ID to use as property owner
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get admin user ID
    SELECT id INTO admin_user_id FROM public.profiles WHERE role = 'admin' LIMIT 1;
    
    IF admin_user_id IS NOT NULL THEN
        -- Add unverified properties for admin to review
        INSERT INTO public.properties (
            title, description, city, region, price, currency, 
            property_type, listing_type, status, owner_id, verified, created_at
        ) VALUES 
        (
            'Test Villa for Admin Review',
            'Beautiful test property awaiting admin verification',
            'Douala', 'Littoral', 100000000, 'XAF', 'villa',
            'sale', 'pending', admin_user_id, false, NOW() - INTERVAL '1 hour'
        ),
        (
            'Commercial Space - Pending Review',
            'Commercial property waiting for admin approval',
            'Yaoundé', 'Centre', 200000000, 'XAF', 'commercial',
            'sale', 'pending', admin_user_id, false, NOW() - INTERVAL '2 hours'
        ),
        (
            'Apartment Complex - Review Needed',
            'New apartment complex requiring verification',
            'Bamenda', 'North West', 75000000, 'XAF', 'apartment',
            'sale', 'pending', admin_user_id, false, NOW() - INTERVAL '30 minutes'
        );
        
        RAISE NOTICE 'Added 3 test properties for admin review';
    ELSE
        RAISE NOTICE 'No admin user found - cannot create test properties';
    END IF;
END $$;

-- Verify the properties were created
SELECT 'Test Properties Created:' as info;
SELECT id, title, verified, status, created_at 
FROM public.properties 
WHERE verified = false 
ORDER BY created_at DESC;
