-- Add missing property types to the enum
-- This migration adds support for all property types used in the application

-- First, add the missing enum values one by one
ALTER TYPE public.property_type ADD VALUE IF NOT EXISTS 'hotel';
ALTER TYPE public.property_type ADD VALUE IF NOT EXISTS 'guest_house';
ALTER TYPE public.property_type ADD VALUE IF NOT EXISTS 'restaurant';
ALTER TYPE public.property_type ADD VALUE IF NOT EXISTS 'shop';
ALTER TYPE public.property_type ADD VALUE IF NOT EXISTS 'residential_house';
ALTER TYPE public.property_type ADD VALUE IF NOT EXISTS 'commercial_building';
ALTER TYPE public.property_type ADD VALUE IF NOT EXISTS 'warehouse';
ALTER TYPE public.property_type ADD VALUE IF NOT EXISTS 'retail';
ALTER TYPE public.property_type ADD VALUE IF NOT EXISTS 'studio';
ALTER TYPE public.property_type ADD VALUE IF NOT EXISTS 'penthouse';
ALTER TYPE public.property_type ADD VALUE IF NOT EXISTS 'duplex';
ALTER TYPE public.property_type ADD VALUE IF NOT EXISTS 'townhouse';
