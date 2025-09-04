import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
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

interface Property {
  id: string;
  type: 'private' | 'state' | 'rent' | 'sale' | 'hotel' | 'eatery' | 'conflict';
  title: string;
  location: string;
  coordinates: [number, number];
  price?: string;
  status: string;
  publicInfo: {
    bedrooms?: number;
    bathrooms?: number;
    size?: string;
    yearBuilt?: string;
  };
}

const mockProperties: Property[] = [
  {
    id: "NWMZBda1GRA0023",
    type: "private",
    title: "Family Residence",
    location: "Bamenda, NW Region",
    coordinates: [6.1926, 10.1578],
    status: "Private Property",
    publicInfo: {
      bedrooms: 4,
      bathrooms: 3,
      size: "200 sqm",
      yearBuilt: "2018"
    }
  },
  {
    id: "NWMZBda1GRA0024", 
    type: "sale",
    title: "Modern Villa",
    location: "Limbe, SW Region", 
    coordinates: [4.0156, 9.2145],
    price: "45,000,000 FCFA",
    status: "For Sale",
    publicInfo: {
      bedrooms: 5,
      bathrooms: 4,
      size: "350 sqm",
      yearBuilt: "2020"
    }
  },
  {
    id: "NWMZBda1GRA0025",
    type: "hotel",
    title: "Mountain View Hotel",
    location: "Buea, SW Region",
    coordinates: [4.1563, 9.2924],
    price: "15,000 FCFA/night",
    status: "Hotel",
    publicInfo: {
      size: "50 rooms"
    }
  },
  {
    id: "NWMZBda1GRA0026",
    type: "rent",
    title: "City Center Apartment",
    location: "Douala, Littoral Region",
    coordinates: [4.0483, 9.7043],
    price: "250,000 FCFA/month",
    status: "For Rent",
    publicInfo: {
      bedrooms: 2,
      bathrooms: 2,
      size: "85 sqm"
    }
  }
];

const propertyColors = {
  private: '#22C55E',
  state: '#16A34A', 
  rent: '#EAB308',
  sale: '#3B82F6',
  hotel: '#8B5CF6',
  eatery: '#F97316',
  conflict: '#EF4444',
};

const createCustomIcon = (type: Property['type']) => {
  const color = propertyColors[type];
  const iconHtml = type === 'private' || type === 'sale' || type === 'rent' 
    ? '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>'
    : type === 'hotel' 
    ? '<path d="M10 22v-6.57"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M14 15.43V22"/><path d="M15 16a5 5 0 0 0-6 0"/><path d="M16 11h.01"/><path d="M16 7h.01"/><path d="M8 11h.01"/><path d="M8 7h.01"/><rect x="4" y="2" width="16" height="20" rx="2"/>'
    : '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>';

  return divIcon({
    html: `
      <div style="
        width: 30px; 
        height: 30px; 
        border-radius: 50%; 
        background-color: ${color}; 
        border: 3px solid white; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          ${iconHtml}
        </svg>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

const PublicPropertyMap = () => {
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProperties = mockProperties.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            center={[3.8480, 12.3547] as [number, number]}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredProperties.map((property) => (
              <Marker
                key={property.id}
                position={property.coordinates}
                icon={createCustomIcon(property.type)}
                eventHandlers={{
                  click: () => setSelectedProperty(property),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">{property.title}</h3>
                    <p className="text-sm text-muted-foreground">{property.location}</p>
                    {property.price && (
                      <p className="text-sm font-medium text-primary mt-1">{property.price}</p>
                    )}
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
                  <p className="text-sm text-muted-foreground">{selectedProperty.location}</p>
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
                      borderColor: propertyColors[selectedProperty.type],
                      color: propertyColors[selectedProperty.type]
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

                  {selectedProperty.publicInfo && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {selectedProperty.publicInfo.bedrooms && (
                        <div>
                          <span className="text-muted-foreground">Bedrooms:</span>
                          <span className="ml-1 font-medium">{selectedProperty.publicInfo.bedrooms}</span>
                        </div>
                      )}
                      {selectedProperty.publicInfo.bathrooms && (
                        <div>
                          <span className="text-muted-foreground">Bathrooms:</span>
                          <span className="ml-1 font-medium">{selectedProperty.publicInfo.bathrooms}</span>
                        </div>
                      )}
                      {selectedProperty.publicInfo.size && (
                        <div>
                          <span className="text-muted-foreground">Size:</span>
                          <span className="ml-1 font-medium">{selectedProperty.publicInfo.size}</span>
                        </div>
                      )}
                      {selectedProperty.publicInfo.yearBuilt && (
                        <div>
                          <span className="text-muted-foreground">Built:</span>
                          <span className="ml-1 font-medium">{selectedProperty.publicInfo.yearBuilt}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedProperty.price && (
                    <div>
                      <p className="font-medium">Price:</p>
                      <p className="text-lg font-semibold text-primary">{selectedProperty.price}</p>
                    </div>
                  )}
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
                  style={{ backgroundColor: propertyColors[property.type] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{property.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{property.location}</p>
                </div>
                {property.price && (
                  <p className="text-xs font-medium text-primary">{property.price}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPropertyMap;