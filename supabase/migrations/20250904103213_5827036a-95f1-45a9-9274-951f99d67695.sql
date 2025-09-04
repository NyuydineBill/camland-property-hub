-- Create enum types for better data consistency
CREATE TYPE public.property_type AS ENUM ('apartment', 'house', 'villa', 'land', 'commercial', 'office');
CREATE TYPE public.property_status AS ENUM ('available', 'rented', 'sold', 'pending');
CREATE TYPE public.listing_type AS ENUM ('rent', 'sale');

-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  property_type public.property_type NOT NULL,
  listing_type public.listing_type NOT NULL,
  status public.property_status NOT NULL DEFAULT 'available',
  price DECIMAL(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'XAF',
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqm DECIMAL(10,2),
  furnished BOOLEAN DEFAULT FALSE,
  parking BOOLEAN DEFAULT FALSE,
  garden BOOLEAN DEFAULT FALSE,
  swimming_pool BOOLEAN DEFAULT FALSE,
  security BOOLEAN DEFAULT FALSE,
  internet BOOLEAN DEFAULT FALSE,
  electricity BOOLEAN DEFAULT TRUE,
  water BOOLEAN DEFAULT TRUE,
  contact_phone TEXT,
  contact_email TEXT,
  views_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create property images table
CREATE TABLE public.property_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create favorites table for users to bookmark properties
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Create property reviews table
CREATE TABLE public.property_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(property_id, reviewer_id)
);

-- Create inquiries table for property contact requests
CREATE TABLE public.property_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  inquirer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  inquirer_name TEXT NOT NULL,
  inquirer_email TEXT NOT NULL,
  inquirer_phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_inquiries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for properties
CREATE POLICY "Properties are viewable by everyone" 
ON public.properties FOR SELECT 
USING (true);

CREATE POLICY "Property owners can insert their own properties" 
ON public.properties FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Property owners can update their own properties" 
ON public.properties FOR UPDATE 
USING (auth.uid() = owner_id);

CREATE POLICY "Property owners can delete their own properties" 
ON public.properties FOR DELETE 
USING (auth.uid() = owner_id);

-- Create RLS policies for property images
CREATE POLICY "Property images are viewable by everyone" 
ON public.property_images FOR SELECT 
USING (true);

CREATE POLICY "Property owners can manage their property images" 
ON public.property_images FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE id = property_images.property_id 
    AND owner_id = auth.uid()
  )
);

-- Create RLS policies for favorites
CREATE POLICY "Users can view their own favorites" 
ON public.favorites FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites" 
ON public.favorites FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for property reviews
CREATE POLICY "Reviews are viewable by everyone" 
ON public.property_reviews FOR SELECT 
USING (true);

CREATE POLICY "Users can create reviews" 
ON public.property_reviews FOR INSERT 
WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own reviews" 
ON public.property_reviews FOR UPDATE 
USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete their own reviews" 
ON public.property_reviews FOR DELETE 
USING (auth.uid() = reviewer_id);

-- Create RLS policies for property inquiries
CREATE POLICY "Property owners can view inquiries for their properties" 
ON public.property_inquiries FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE id = property_inquiries.property_id 
    AND owner_id = auth.uid()
  )
);

CREATE POLICY "Users can view their own inquiries" 
ON public.property_inquiries FOR SELECT 
USING (auth.uid() = inquirer_id);

CREATE POLICY "Anyone can create inquiries" 
ON public.property_inquiries FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Property owners can update inquiries for their properties" 
ON public.property_inquiries FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE id = property_inquiries.property_id 
    AND owner_id = auth.uid()
  )
);

-- Create indexes for better performance
CREATE INDEX idx_properties_owner_id ON public.properties(owner_id);
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_property_type ON public.properties(property_type);
CREATE INDEX idx_properties_listing_type ON public.properties(listing_type);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_price ON public.properties(price);
CREATE INDEX idx_properties_location ON public.properties(latitude, longitude);
CREATE INDEX idx_properties_created_at ON public.properties(created_at);
CREATE INDEX idx_property_images_property_id ON public.property_images(property_id);
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_property_id ON public.favorites(property_id);
CREATE INDEX idx_property_reviews_property_id ON public.property_reviews(property_id);
CREATE INDEX idx_property_inquiries_property_id ON public.property_inquiries(property_id);

-- Create trigger for automatic timestamp updates on properties
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for automatic timestamp updates on property reviews
CREATE TRIGGER update_property_reviews_updated_at
  BEFORE UPDATE ON public.property_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for automatic timestamp updates on property inquiries
CREATE TRIGGER update_property_inquiries_updated_at
  BEFORE UPDATE ON public.property_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets for property images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true);

-- Create storage policies for property images
CREATE POLICY "Property images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own property images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'property-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own property images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'property-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);