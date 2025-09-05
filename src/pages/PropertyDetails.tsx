import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ContactModal from "@/components/property/ContactModal";
import { 
  MapPin, 
  Home, 
  Bath, 
  Bed, 
  Square, 
  Phone, 
  Mail, 
  Car, 
  Wifi, 
  Shield, 
  Zap, 
  Droplets,
  Trees,
  Waves,
  ArrowLeft,
  Heart,
  Share,
  MessageCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Property {
  id: string;
  title: string;
  description: string | null;
  city: string;
  region: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  price: number;
  currency: string;
  property_type: string;
  listing_type: string;
  status: string;
  verified: boolean | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqm: number | null;
  furnished: boolean | null;
  parking: boolean | null;
  garden: boolean | null;
  swimming_pool: boolean | null;
  security: boolean | null;
  internet: boolean | null;
  electricity: boolean | null;
  water: boolean | null;
  contact_phone: string | null;
  contact_email: string | null;
  featured: boolean | null;
  created_at: string;
  updated_at: string;
}

const PropertyDetails: React.FC = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast({
        title: "Error",
        description: "Failed to load property details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    setShowContact(true);
  };

  const handlePhoneCall = () => {
    if (property?.contact_phone) {
      window.open(`tel:${property.contact_phone}`);
    }
  };

  const handleEmail = () => {
    if (property?.contact_email) {
      window.open(`mailto:${property.contact_email}?subject=Inquiry about ${property.title}`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: `Check out this property: ${property?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Property link copied to clipboard!",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
        <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Link to="/properties">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
        </Link>
      </div>
    );
  }

  const amenities = [
    { icon: Car, label: "Parking", value: property.parking },
    { icon: Wifi, label: "Internet", value: property.internet },
    { icon: Shield, label: "Security", value: property.security },
    { icon: Zap, label: "Electricity", value: property.electricity },
    { icon: Droplets, label: "Water", value: property.water },
    { icon: Trees, label: "Garden", value: property.garden },
    { icon: Waves, label: "Swimming Pool", value: property.swimming_pool },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/properties">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Heart className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{property.title}</CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{property.address}, {property.city}, {property.region}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={property.status === 'available' ? 'default' : 'secondary'} className="capitalize">
                      {property.status}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {property.listing_type}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {property.property_type}
                    </Badge>
                    {property.verified && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {property.currency} {property.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {property.listing_type === 'rent' ? 'per month' : 'total price'}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Property Info */}
          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {property.bedrooms !== null && (
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{property.bedrooms}</span>
                    <span className="text-sm text-muted-foreground">Bedrooms</span>
                  </div>
                )}
                {property.bathrooms !== null && (
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{property.bathrooms}</span>
                    <span className="text-sm text-muted-foreground">Bathrooms</span>
                  </div>
                )}
                {property.area_sqm !== null && (
                  <div className="flex items-center gap-2">
                    <Square className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{property.area_sqm}</span>
                    <span className="text-sm text-muted-foreground">sqm</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium capitalize">{property.property_type}</span>
                </div>
              </div>

              {property.description && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities & Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenities.map(({ icon: Icon, label, value }) => (
                  <div 
                    key={label}
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      value ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{label}</span>
                    {value && <span className="text-xs">✓</span>}
                  </div>
                ))}
                {property.furnished && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 text-blue-700">
                    <Home className="h-4 w-4" />
                    <span className="text-sm font-medium">Furnished</span>
                    <span className="text-xs">✓</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Property Owner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showContact ? (
                <Button 
                  className="w-full bg-gradient-primary hover:opacity-90"
                  onClick={handleContact}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Show Contact Details
                </Button>
              ) : (
                <div className="space-y-3">
                  {property.contact_phone && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={handlePhoneCall}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {property.contact_phone}
                    </Button>
                  )}
                  {property.contact_email && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={handleEmail}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      {property.contact_email}
                    </Button>
                  )}
                  <ContactModal 
                    property={{
                      id: property.id,
                      title: property.title,
                      contact_phone: property.contact_phone,
                      contact_email: property.contact_email,
                      price: property.price,
                      currency: property.currency,
                    }}
                  >
                    <Button className="w-full bg-gradient-primary hover:opacity-90">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </ContactModal>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Property Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Property ID:</span>
                <span className="font-mono">{property.id.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Listed:</span>
                <span>{new Date(property.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated:</span>
                <span>{new Date(property.updated_at).toLocaleDateString()}</span>
              </div>
              {property.featured && (
                <Badge className="w-full justify-center bg-yellow-100 text-yellow-800 border-yellow-200">
                  Featured Property
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
