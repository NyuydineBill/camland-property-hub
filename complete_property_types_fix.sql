-- Complete fix for property types enum and test data
-- Run this entire script in your Supabase SQL Editor

-- Step 1: Add all missing property types to the enum
DO $$
BEGIN
    -- Add each enum value if it doesn't already exist
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'hotel' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'property_type')) THEN
        ALTER TYPE public.property_type ADD VALUE 'hotel';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'guest_house' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'property_type')) THEN
        ALTER TYPE public.property_type ADD VALUE 'guest_house';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'restaurant' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'property_type')) THEN
        ALTER TYPE public.property_type ADD VALUE 'restaurant';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'shop' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'property_type')) THEN
        ALTER TYPE public.property_type ADD VALUE 'shop';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'house' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'property_type')) THEN
        ALTER TYPE public.property_type ADD VALUE 'house';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'commercial_building' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'property_type')) THEN
        ALTER TYPE public.property_type ADD VALUE 'commercial_building';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'warehouse' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'property_type')) THEN
        ALTER TYPE public.property_type ADD VALUE 'warehouse';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'retail' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'property_type')) THEN
        ALTER TYPE public.property_type ADD VALUE 'retail';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'studio' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'property_type')) THEN
        ALTER TYPE public.property_type ADD VALUE 'studio';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'penthouse' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'property_type')) THEN
        ALTER TYPE public.property_type ADD VALUE 'penthouse';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'duplex' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'property_type')) THEN
        ALTER TYPE public.property_type ADD VALUE 'duplex';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'townhouse' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'property_type')) THEN
        ALTER TYPE public.property_type ADD VALUE 'townhouse';
    END IF;
END $$;

-- Step 2: Add some test properties with different types to verify everything works
-- First get the user ID for billleynyuy@gmail.com
DO $$
DECLARE
    user_id UUID;
BEGIN
    -- Get the user ID (replace with actual user ID if needed)
    SELECT id INTO user_id FROM auth.users WHERE email = 'billleynyuy@gmail.com' LIMIT 1;
    
    -- If user doesn't exist, create a placeholder UUID (you can replace this)
    IF user_id IS NULL THEN
        user_id := 'f3d83a7b-b983-4ab5-bae4-f180272812b2'::UUID;
    END IF;
    
    -- Insert test properties with different types
    INSERT INTO public.properties (
        owner_id, title, description, property_type, listing_type, status,
        price, currency, address, city, region, latitude, longitude,
        contact_phone, contact_email, verified
    ) VALUES 
    -- Restaurant
    (
        user_id,
        'Local Restaurant - Great Location',
        'Established restaurant with full kitchen and dining area. Perfect for food business.',
        'restaurant',
        'sale',
        'available',
        45000000.00,
        'XAF',
        'Main Street, Commercial District',
        'Douala',
        'Littoral',
        4.0611,
        9.7679,
        '+237 677 123 456',
        'billleynyuy@gmail.com',
        true
    ),
    -- Hotel
    (
        user_id,
        'Boutique Hotel - City Center',
        'Small boutique hotel with 12 rooms. Excellent for hospitality business.',
        'hotel',
        'sale',
        'available',
        150000000.00,
        'XAF',
        'Hotel Street, Downtown',
        'Yaoundé',
        'Centre',
        3.8680,
        11.5221,
        '+237 677 123 456',
        'billleynyuy@gmail.com',
        true
    ),
    -- Shop
    (
        user_id,
        'Retail Shop - High Foot Traffic',
        'Well-located retail space perfect for various businesses.',
        'shop',
        'rent',
        'available',
        250000.00,
        'XAF',
        'Market Street, Commercial Zone',
        'Bamenda',
        'North West',
        5.9497,
        10.1553,
        '+237 677 123 456',
        'billleynyuy@gmail.com',
        true
    ),
    -- Guest House
    (
        user_id,
        'Cozy Guest House - Tourist Area',
        'Charming guest house with 6 rooms. Great for tourism business.',
        'guest_house',
        'sale',
        'available',
        75000000.00,
        'XAF',
        'Tourist Road, Beach Area',
        'Limbe',
        'South West',
        4.0256,
        9.2045,
        '+237 677 123 456',
        'billleynyuy@gmail.com',
        false
    );
END $$;

-- Step 3: Verify the enum values and new properties
-- Show all available property types
SELECT 'Available Property Types:' as info;
SELECT enumlabel as property_type 
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'property_type')
ORDER BY enumlabel;

-- Show all properties with their types
SELECT 'All Properties:' as info;
SELECT title, property_type, listing_type, city, price
FROM public.properties 
ORDER BY created_at DESC;
