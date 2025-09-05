-- Run this SQL script in your Supabase SQL Editor to fix property type enum
-- This will add all missing property types needed by the application

-- Add missing property types to the enum (IF NOT EXISTS prevents errors if already added)
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
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'residential_house' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'property_type')) THEN
        ALTER TYPE public.property_type ADD VALUE 'residential_house';
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

-- Verify the enum values were added
SELECT enumlabel as property_type 
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'property_type')
ORDER BY enumlabel;
