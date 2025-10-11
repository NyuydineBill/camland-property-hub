import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  X, 
  Heart, 
  Share2, 
  MapPin, 
  Home, 
  Bath, 
  Car, 
  Ruler, 
  Calendar,
  Shield,
  Phone,
  Mail,
  ExternalLink,
  Camera,
  Star,
  User,
  CheckCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Property {
  id: string;
  title: string;
  city: string;
  region: string | null;
  latitude: number | null;
  longitude: number | null;
  price: number;
  currency: string;
  property_type: string;
  listing_type: string;
  status: string;
  verified: boolean | null;
  contact_email?: string | null;
  description?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  parking_spaces?: number | null;
  area_sqm?: number | null;
  created_at?: string;
}

interface PropertyImage {
  id: string;
  image_url: string;
  is_primary: boolean;
}

interface PropertyDetailsSidebarProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  propertyColors: Record<string, string>;
  getPropertyType: (property: Property) => string;
}

const PropertyDetailsSidebar: React.FC<PropertyDetailsSidebarProps> = ({ 
  property, 
  isOpen, 
  onClose, 
  propertyColors, 
  getPropertyType 
}) => {
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (property && isOpen) {
      fetchPropertyImages();
      checkIfFavorited();
    }
  }, [property, isOpen]);

  const fetchPropertyImages = async () => {
    if (!property) return;
    
    try {
      const { data, error } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', property.id)
        .order('is_primary', { ascending: false });

      if (error) throw error;
      setImages(data || []);
      setCurrentImageIndex(0);
    } catch (error) {
      console.error('Error fetching property images:', error);
      setImages([]);
    }
  };

  const checkIfFavorited = async () => {
    if (!property || !user) return;
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('property_id', property.id)
        .eq('user_id', user.id)
        .single();

      setIsFavorited(!!data);
    } catch (error) {
      setIsFavorited(false);
    }
  };

  const toggleFavorite = async () => {
    if (!property || !user) return;
    
    setLoading(true);
    try {
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('property_id', property.id)
          .eq('user_id', user.id);
        setIsFavorited(false);
      } else {
        await supabase
          .from('favorites')
          .insert({ property_id: property.id, user_id: user.id });
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
    setLoading(false);
  };

  const shareProperty = () => {
    if (navigator.share && property) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: `${window.location.origin}/properties/${property.id}`
      });
    } else if (property) {
      navigator.clipboard.writeText(`${window.location.origin}/properties/${property.id}`);
    }
  };

  if (!property) return null;

  return (
    <div 
      className={`fixed top-0 right-0 h-full w-[420px] bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-border ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ 
        marginTop: '64px', 
        height: 'calc(100vh - 64px)',
        zIndex: 1000
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground truncate">{property.title}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {property.city}, {property.region}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Image Gallery */}
          <div className="relative">
            {images.length > 0 ? (
              <div className="relative h-64 bg-gray-100 dark:bg-gray-800">
                <img
                  src={images[currentImageIndex]?.image_url || '/placeholder.svg'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    onClick={shareProperty}
                  >
                    <Share2 className="h-3 w-3" />
                  </Button>
                  {user && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className={`h-8 w-8 p-0 ${
                        isFavorited 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-white/90 hover:bg-white'
                      }`}
                      onClick={toggleFavorite}
                      disabled={loading}
                    >
                      <Heart className={`h-3 w-3 ${isFavorited ? 'fill-current' : ''}`} />
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-64 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Camera className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">No images available</p>
                </div>
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="p-4 space-y-4">
            {/* Price and Status */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {property.currency} {property.price.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {property.listing_type === 'rent' ? 'per month' : 'total price'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline"
                  style={{ 
                    borderColor: propertyColors[getPropertyType(property)], 
                    color: propertyColors[getPropertyType(property)] 
                  }}
                >
                  {property.property_type}
                </Badge>
                {property.verified && (
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Property Features */}
            <div className="grid grid-cols-2 gap-4">
              {property.bedrooms && (
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{property.bedrooms} Bedrooms</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-2">
                  <Bath className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{property.bathrooms} Bathrooms</span>
                </div>
              )}
              {property.parking_spaces && (
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{property.parking_spaces} Parking</span>
                </div>
              )}
              {property.area_sqm && (
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{property.area_sqm} sqm</span>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {property.description}
                  </p>
                </div>
              </>
            )}

            <Separator />

            {/* Property Info */}
            <div className="space-y-2">
              <h3 className="font-semibold">Property Information</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property ID:</span>
                  <span className="font-mono text-xs">{property.id.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="outline" className="text-xs">
                    {property.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Listed:</span>
                  <span>{property.created_at ? new Date(property.created_at).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-background">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => window.open(`mailto:${property.contact_email}?subject=Inquiry about ${property.title}`)}
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </Button>
            <Button 
              className="flex-1 bg-gradient-primary hover:opacity-90"
              onClick={() => window.open(`/properties/${property.id}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Full Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsSidebar;