import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  Home, 
  Building, 
  Hotel, 
  UtensilsCrossed,
  AlertTriangle,
  Filter,
  Search,
  Eye,
  Lock,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Fix Leaflet default icon issue
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqm: number | null;
  contact_email?: string | null;
}

const PublicPropertyMap = () => {
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapLayer, setMapLayer] = useState<'street' | 'satellite'>('street');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPropertyType = (property: Property): 'private' | 'state' | 'rent' | 'sale' | 'hotel' | 'eatery' | 'conflict' => {
    // First check listing type for rent/sale
    if (property.listing_type === 'rent') return 'rent';
    if (property.listing_type === 'sale') return 'sale';
    
    // Then check specific property types
    if (property.property_type === 'hotel') return 'hotel';
    if (property.property_type === 'commercial' || property.property_type === 'office') return 'eatery';
    if (property.property_type === 'land') return 'state';
    
    // Default to private for houses, apartments, villas
    return 'private';
  };

  const propertyColors = {
    private: '#22C55E',    // Green for private properties (houses, apartments, villas)
    state: '#8B5A2B',      // Brown for land/state properties
    rent: '#EAB308',       // Yellow for rental properties
    sale: '#3B82F6',       // Blue for properties for sale
    hotel: '#8B5CF6',      // Purple for hotels
    eatery: '#F97316',     // Orange for commercial/office spaces
    conflict: '#EF4444',   // Red for conflict zones
  };

  const createCustomIcon = (type: 'private' | 'state' | 'rent' | 'sale' | 'hotel' | 'eatery' | 'conflict') => {
    const color = propertyColors[type];
    
    // Different icons for different property types
    let iconPath = '';
    switch (type) {
      case 'private':
        iconPath = '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'; // House
        break;
      case 'state':
        iconPath = '<rect width="18" height="18" x="3" y="3" rx="2"/>'; // Land square
        break;
      case 'rent':
        iconPath = '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'; // Book/contract
        break;
      case 'sale':
        iconPath = '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.37 18.09"/>'; // Dollar sign circle
        break;
      case 'hotel':
        iconPath = '<path d="M2 20h20M7 20V9l3-3 3 3v11M7 14h3m3 0h3"/>'; // Building
        break;
      case 'eatery':
        iconPath = '<path d="M6 2v20M16 8V2M12 2v20"/>'; // Utensils/commercial
        break;
      default:
        iconPath = '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'; // Default house
    }
    
    const svgIcon = `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11" fill="${color}" stroke="white" stroke-width="2"/>
        <g transform="translate(6, 6) scale(0.5)" fill="white" stroke="white" stroke-width="1">
          ${iconPath}
        </g>
      </svg>
    `;

    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  };

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = () => {
    navigate('/auth');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Map Controls */}
      <div className="p-4 bg-card border-b border-border">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={mapLayer === 'street' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setMapLayer('street')}
            >
              Street
            </Button>
            <Button 
              variant={mapLayer === 'satellite' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setMapLayer('satellite')}
            >
              Satellite
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button 
              size="sm" 
              className="gap-2 bg-gradient-primary hover:opacity-90"
              onClick={() => navigate('/auth')}
            >
              <Eye className="h-4 w-4" />
              Sign In to View More
            </Button>
          </div>
        </div>

        {/* Property Legend */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          {Object.entries(propertyColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full border border-white"
                style={{ backgroundColor: color }}
              />
              <span className="capitalize text-muted-foreground">
                {type === 'private' ? 'Private' :
                 type === 'state' ? 'State' :
                 type === 'rent' ? 'For Rent' :
                 type === 'sale' ? 'For Sale' :
                 type === 'hotel' ? 'Hotels' :
                 type === 'eatery' ? 'Eateries' : 'Conflict Zone'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 relative">
        {/* Map Container */}
        <div className="absolute inset-0">
          <MapContainer
            center={[3.8480, 12.3547]}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
          >
            {mapLayer === 'street' ? (
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            ) : (
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              />
            )}
            {filteredProperties.map((property) => (
              <Marker
                key={property.id}
                position={[property.latitude!, property.longitude!]}
                icon={createCustomIcon(getPropertyType(property))}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">{property.title}</h3>
                    <p className="text-sm text-muted-foreground">{property.city}, {property.region}</p>
                    <p className="text-sm font-medium text-primary mt-1">
                      {property.currency} {property.price.toLocaleString()}
                    </p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs rounded-full" 
                            style={{ 
                              backgroundColor: propertyColors[getPropertyType(property)], 
                              color: 'white' 
                            }}>
                        {property.property_type} • {property.listing_type}
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      className="mt-2 w-full"
                      onClick={() => setSelectedProperty(property)}
                    >
                      View Details
                    </Button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Property Details Panel */}
        {selectedProperty && (
          <Card className="absolute top-4 left-4 w-80 z-[1000] shadow-elegant">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{selectedProperty.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedProperty.city}, {selectedProperty.region}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedProperty(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline"
                    style={{ 
                      borderColor: propertyColors[getPropertyType(selectedProperty)],
                      color: propertyColors[getPropertyType(selectedProperty)]
                    }}
                  >
                    {selectedProperty.status}
                  </Badge>
                </div>

                <div className="text-sm space-y-2">
                  <div>
                    <p className="font-medium">Property ID:</p>
                    <p className="text-muted-foreground font-mono text-xs">{selectedProperty.id}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {selectedProperty.bedrooms && (
                      <div>
                        <span className="text-muted-foreground">Bedrooms:</span>
                        <span className="ml-1 font-medium">{selectedProperty.bedrooms}</span>
                      </div>
                    )}
                    {selectedProperty.bathrooms && (
                      <div>
                        <span className="text-muted-foreground">Bathrooms:</span>
                        <span className="ml-1 font-medium">{selectedProperty.bathrooms}</span>
                      </div>
                    )}
                    {selectedProperty.area_sqm && (
                      <div>
                        <span className="text-muted-foreground">Size:</span>
                        <span className="ml-1 font-medium">{selectedProperty.area_sqm} sqm</span>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <span className="ml-1 font-medium capitalize">{selectedProperty.property_type}</span>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">Price:</p>
                    <p className="text-lg font-semibold text-primary">
                      {selectedProperty.currency} {selectedProperty.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 p-3 rounded-lg border border-dashed border-muted-foreground/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">Full Details Locked</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Sign in to view owner contact, detailed specs, photos, and more information.
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full gap-2 bg-gradient-primary hover:opacity-90"
                    onClick={handleViewDetails}
                  >
                    Sign In to View Details
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Properties List - Mobile */}
        <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-border p-4 md:hidden max-h-48 overflow-y-auto z-[1000]">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Properties ({filteredProperties.length})</h4>
            <Button size="sm" variant="outline" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          </div>
          <div className="space-y-2">
            {filteredProperties.slice(0, 3).map((property) => (
              <div 
                key={property.id}
                className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                onClick={() => setSelectedProperty(property)}
              >
                <div 
                  className="w-3 h-3 rounded-full border border-white flex-shrink-0"
                  style={{ backgroundColor: propertyColors[getPropertyType(property)] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{property.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{property.city}, {property.region}</p>
                </div>
                <p className="text-xs font-medium text-primary">
                  {property.currency} {property.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPropertyMap;